import type { GetStaticPropsResult} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { TwitterUser } from "src/server/user-types";
import { fetchUsers } from "./api/users";

import styles from 'src/styles/index.module.scss'

type HomePageProps = {
  users: Array<TwitterUser>;
}

function Home({ users }: HomePageProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Dwitter</title>
        <meta name="description" content="Simple Twitter feed UI of a single user" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-4xl font-bold pb-2">
          Dwitter
        </h1>
        <h2 className="text-xl font-medium text-slate-100 pb-6">
          Click any profile to view their feed
        </h2>
        <div className="grid grid-cols-3 bg-slate-800 rounded-md overflow-hidden">
          {
            users.map((user) => (
              <Link href={`/feed/${user.id}`} key={user.id}>
                <div className={styles.profile}>
                  <div className="relative w-20 h-20 mx-auto">
                    <Image
                      src={user.profile_image_url.replace("_normal", "_400x400")}
                      alt={user.name}
                      className="object-contain aspect-square rounded-full"
                      fill
                    />
                  </div>
                  <div className="text-center mt-2 select-none">
                    <h3 className="">{user.name}</h3>
                    <h4 className="">@{user.username}</h4>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </main>
    </>
  );
}

export default Home;

export async function getStaticProps(): Promise<GetStaticPropsResult<HomePageProps>> {
  const users = await fetchUsers();

  return {
    props: {
      users,
    },
    revalidate: 600,
  }
}
