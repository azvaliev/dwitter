import { forwardRef } from "react";
import type { Tweet } from "src/server/tweet-types";
import Image from 'next/image';
import type { ExpandedTwitterUser } from "src/server/user-types";
import { NumFormatter } from "src/pages/feed/[id]";

type TweetProps = {
  tweet: Tweet;
  user: ExpandedTwitterUser;
}

// eslint-disable-next-line react/display-name
const FeedTweet = forwardRef<HTMLDivElement, TweetProps>(
  function ({ tweet, user }, intersectionRef) {
    return (
      <article
        className="flex flex-row whitespace-pre-wrap py-4 text-slate-100"
        ref={intersectionRef}
      >
        <div className="relative min-h-[4rem] min-w-[4rem] max-h-[4rem] rounded-full">
          <Image
            src={user.profile_image_url.replace("_normal", "_200x200")}
            alt={user.name}
            className="object-contain rounded-full"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
    )
  }
);

export default FeedTweet;
