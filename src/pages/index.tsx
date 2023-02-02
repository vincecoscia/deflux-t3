import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import localFont from "@next/font/local";

import { trpc } from "../utils/trpc";

const azonix = localFont({ src: "../styles/fonts/Azonix.woff2" });

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Deflux</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* If not logged in, view homepage */}
      <main className="flex flex-col h-[calc(100vh-84px)] items-center justify-center bg-gray-900">

      </main>
    </>
  );
};

export default Home;
