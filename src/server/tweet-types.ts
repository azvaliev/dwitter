export type RawTweet = {
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

export type RawTweetRes = {
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

