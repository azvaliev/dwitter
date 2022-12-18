import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { env } from "src/env/server.mjs";
import applyRateLimit from "src/server/request-limit-middleware";
import type { RawTweetRes, TweetRes } from "src/server/tweet-types.js";

/**
 * Elon Mask
 * */
const defaultUserId = '44196397';

const expectedQuery = z.object({
  userId: z.string().default(defaultUserId),
  cursor: z.string().nullish(),
  take: z.number({ coerce: true })
});

async function handler(req: NextApiRequest, res: NextApiResponse<TweetRes>) {
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

  const { data: query } = parseQueryResult;

  try {
    const tweets = await fetchTweets(query);
    res.status(200).json(tweets);
  } catch (err) {
    console.error(err)
    res.status(502).end();
  }
}

export {
  fetchTweets,
}

export default handler;

async function fetchTweets({
  userId,
  cursor,
  take
}: ReturnType<typeof expectedQuery.parse>): Promise<TweetRes> {
  const params = new URLSearchParams({
    exclude: 'retweets,replies',
    'tweet.fields': 'text,attachments,created_at,public_metrics',
    max_results: take.toString(),
  });

  if (cursor) {
    params.set('pagination_token', cursor);
  }

  const tweetResponse = await fetch(
  `https://api.twitter.com/2/users/${userId}/tweets?${params}`, {
    headers: {
      'Authorization': `Bearer ${env.TWITTER_BEARER_TOKEN}`
    }
  })

  const { meta, data: rawTweets } = await tweetResponse.json() as RawTweetRes;

  const parsedTweets: TweetRes = {
    tweets: rawTweets.map((rawTweet) => ({
      ...rawTweet,
      created_at: new Date(rawTweet.created_at).getTime(),
    })),
    meta,
  };

  return parsedTweets;
}
