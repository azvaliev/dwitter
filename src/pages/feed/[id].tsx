import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import useFeed from "src/hooks/use-feed";
import type { TweetRes } from "src/server/tweet-types";
import { fetchTweets } from "../api/feed";
import { fetchUserById } from "../api/user";

const NumFormatter = Intl.NumberFormat('en', { notation: 'compact' });

type FeedProps = {
  initialTweets: TweetRes;
  user: Awaited<ReturnType<typeof fetchUserById>>;
}

function UserFeed({ initialTweets, user }: FeedProps): JSX.Element {
  const { tweets } = useFeed(initialTweets);

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
              className="object-contain"
              fill
             />
          </div>
          </div>
        </aside>
        {tweets.map((tweet) => (
          <article
            key={tweet.id}
            className="flex flex-row whitespace-pre-wrap py-4 text-slate-100"
          >
            <div className="relative h-16 w-16">
              <Image
                src={user.profile_image_url.replace("_normal", "_200x200")}
                alt={user.name}
                className="object-contain"
                fill
               />
            </div>
            <div className="px-2">
              <div className="flex flex-row items-center gap-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <h4 className="text-sm text-slate-400 font-medium">@{user.username}</h4>
              </div>
              <p className="font-light whitespace-pre-wrap">
                {tweet.text}
              </p>
              <div className="flex flex-row gap-x-4 text-slate-400 pt-2 min-h-fit">
                <div className="flex flex-row items-center gap-x-1">
                  {NumFormatter.format(tweet.public_metrics.like_count)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="w-4 h-4"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  {NumFormatter.format(tweet.public_metrics.quote_count)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="9 10 4 15 9 20"></polyline>
                    <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                  </svg>
                </div>
                <div className="flex flex-row items-center gap-x-1">
                  {NumFormatter.format(tweet.public_metrics.retweet_count)}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </article>
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
