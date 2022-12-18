import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";
import applyRateLimit from "src/server/request-limit-middleware";
import type { TwitterUser } from "src/server/user-types";
import { z } from "zod";

const defaultUsers = ["t3dotgg", "ThePrimeagen", "dan_abramov", "leeerob", "housecor", "DavidKPiano"];

const expectedQuery = z.object({
  usernames: z.array(z.string()).default(defaultUsers),
});

async function handler(req: NextApiRequest, res: NextApiResponse<FetchUsersResult>) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  await applyRateLimit(req, res);

  const { usernames } = expectedQuery.parse(req.query);

  const users = await fetchUsers(usernames);
  res.status(200).json(users);
}

export default handler;

type FetchUsersResult = Array<TwitterUser>;

export async function fetchUsers(usernames = defaultUsers): Promise<FetchUsersResult> {
  const params = new URLSearchParams({
    usernames: usernames.join(','),
    ['user.fields']: 'profile_image_url',
  });

  const usersResponse = await fetch(
  `https://api.twitter.com/2/users/by?${params}`, {
    headers: {
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  });

  const usersResult = await usersResponse.json();
  return usersResult.data;
}
