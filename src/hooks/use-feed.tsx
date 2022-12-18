import useSWRInfinite from 'swr/infinite';
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import type { Tweet, TweetRes } from 'src/server/tweet-types';

const fetcher = (
  ...args: Parameters<typeof fetch>
) => fetch(...args).then(res => res.json())

function useFeed(initialTweets: TweetRes) {
  const router = useRouter();

  const getKey = useCallback((pageIndex: number, previousPageData: TweetRes) => {
    // reached the end
    if (previousPageData && !previousPageData?.meta?.next_token) return null

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `/api/feed?userId=${router.query.id}&take=20`


    // add the cursor to the API endpoint
    return `/api/feed?userId=${router.query.id}&cursor=${previousPageData.meta.next_token}&take=20`
  }, [router.query?.id]);

  const { data, isLoading, size, setSize } = useSWRInfinite<TweetRes>(getKey, fetcher, {
    fallbackData: [initialTweets],
  });

  const flattenedTweets = useMemo<Tweet[]>(() => {
    return data?.flatMap<Tweet>((tweetRes) => tweetRes.tweets) || [];
  }, [data]);

  return {
    isLoading,
    size,
    setSize,
    tweets: flattenedTweets,
  }
}

export default useFeed;
