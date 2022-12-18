import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import applyRateLimit from "src/server/request-limit-middleware";
import type { ExpandedTwitterUser } from "src/server/user-types";
import { z } from "zod";

const expectedQuery = z.object({
  userId: z.string(),
})

async function handler(req: NextApiRequest, res: NextApiResponse<ExpandedTwitterUser>) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  await applyRateLimit(req, res);

  const parseQueryResult = expectedQuery.safeParse(req.query);
  if (!parseQueryResult.success) {
    res.status(400).end();
    return;
  }

  const { userId } = parseQueryResult.data;

  try {
    const users = await fetchUserById(userId);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(502).end();
  }
}

export default handler;

export async function fetchUserById(id: string): Promise<ExpandedTwitterUser> {
  const params = new URLSearchParams({
    ['user.fields']: 'profile_image_url,verified,description,public_metrics,created_at',
  });

  const userResponse = await fetch(
  `https://api.twitter.com/2/users/${id}?${params}`, {
    headers: {
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  });

  const userResult = await userResponse.json();
  return userResult.data;
}
