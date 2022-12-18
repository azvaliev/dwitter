import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { env } from "../../env/server.mjs";
import applyRateLimit from "../../server/request-limit-middleware";

/**
 * Elon Mask
 * */
const defaultUserId = '44196397';

type RawTweet = {
  id: string;
  text: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  }
  created_at: string;
}

/**
 * An individual tweet
 * */
export type Tweet = Omit<RawTweet, 'created_at'> & {
  // Unix Timestamp
  created_at: number;
};

/**
 * Metadata about a tweet request, including pagination tokens
 * */
export type TweetReqMeta = {
  next_token: string;
  previous_token: string;
  result_count: number;
  newest_id: string;
  oldest_id: string;
}

type RawTweetRes = {
  data: RawTweet[];
  meta: TweetReqMeta;
}

/**
 * Return Type of /api/feed
 * */
export type TweetRes = {
  tweets: Tweet[];
  meta: TweetReqMeta;
}

const expectedQuery = z.object({
  userId: z.string().default(defaultUserId),
  cursor: z.string().nullish(),
  take: z.number({ coerce: true })
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await applyRateLimit(req, res);

  const parseQueryResult = expectedQuery.safeParse(req.query);
  if (!parseQueryResult.success) {
    res.status(400).end();
    return;
  }

  const { data: query } = parseQueryResult;

  try {
    const tweets = await getTweets(query);
    res.status(200).json(tweets);
  } catch {
    res.status(502).end();
  }
}

export {
  getTweets,
}

export default handler;

async function getTweets({
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
