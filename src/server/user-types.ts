export type TwitterUser = {
  profile_image_url: string;
  id: string;
  name: string;
  username: string;
}

export type ExpandedTwitterUser = TwitterUser & {
    verified: boolean;
    description: string;
    public_metrics: {
      followers_count: number;
      following_count: number;
      tweet_count: number;
      listed_count: number;
    }
};
