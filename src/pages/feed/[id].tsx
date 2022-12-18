import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import { useCallback } from "react";
import FeedTweet from "src/components/tweet";
import useFeed from "src/hooks/use-feed";
import useIntersectionObserver from "src/hooks/use-intersection-observer";
import type { TweetRes } from "src/server/tweet-types";
import { fetchTweets } from "../api/feed";
import { fetchUserById } from "../api/user";

export const NumFormatter = Intl.NumberFormat('en', { notation: 'compact' });

type FeedProps = {
  initialTweets: TweetRes;
  user: Awaited<ReturnType<typeof fetchUserById>>;
}

function UserFeed({ initialTweets, user }: FeedProps): JSX.Element {
  const { tweets, setSize, isLoading } = useFeed(initialTweets);

  const handleIntersection = useCallback(() => {
    if (!isLoading) {
      setSize((prevSize) => prevSize + 1) ;
    }
  }, [isLoading, setSize])

  const intersectionRefTweetIdx = tweets.length - 7;
  const intersectionRef = useIntersectionObserver<HTMLDivElement>(handleIntersection, intersectionRefTweetIdx);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1c0142] to-[#15162c] text-white">
      <div className="bg-slate-800 w-4/5 px-4 bg-opacity-90 pb-6">
        <aside className="flex flex-row pb-4 mb-4 border-b-[1px] border-b-slate-400 sticky top-0 pt-2 bg-slate-800 z-50">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <h2 className="text-xl text-slate-400">@{user.username}</h2>
            <p className="whitespace-pre-wrap py-4 text-slate-200">{user.description}</p>
            <div className="flex flex-row text-slate-400 font-semibold">
              <span className="text-white">
                {NumFormatter.format(user.public_metrics.tweet_count)}&nbsp;
              </span>
              <span>Tweets</span>
              &nbsp;|&nbsp;
              <span className="text-white">
                {NumFormatter.format(user.public_metrics.followers_count)}&nbsp;
              </span>
              <span>Followers</span>
              &nbsp;|&nbsp;
              <span className="text-white">
                {NumFormatter.format(user.public_metrics.following_count)}&nbsp;
              </span>
              <span>Following</span>
            </div>
          </div>
          <div className="grow flex flex-col ml-auto py-4">
          <div className="relative min-w-[10rem] min-h-[10rem] aspect-square ml-auto w-max grow">
            <Image
              src={user.profile_image_url.replace("_normal", "_400x400")}
              alt={user.name}
              className="object-contain rounded-full"
              fill
             />
          </div>
          </div>
        </aside>
        {tweets.map((tweet, idx) => (
          <FeedTweet
            key={tweet.id}
            tweet={tweet}
            user={user}
            ref={idx === intersectionRefTweetIdx ? intersectionRef : undefined}
          />
        ))}
      </div>
    </div>
  )
}

export default UserFeed;


type PageParams = {
  id: string;
}

export async function getServerSideProps({
  res,
  params,
}: GetServerSidePropsContext<PageParams>): Promise<GetServerSidePropsResult<FeedProps>> {
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=59');

  const { id } = params || {};

  if (!id) {
    return {
      redirect: {
        statusCode: 303,
        destination: '/'
      }
    }
  }

  try {
    const [initialTweets, user] = await Promise.all([
      fetchTweets({ userId: id, take: 20 }),
      fetchUserById(id)
    ]);

    return {
      props: {
        initialTweets,
        user,
      }
    }
  } catch (err) {
    console.error(err);

    return {
      notFound: true,
    }
  }
}
