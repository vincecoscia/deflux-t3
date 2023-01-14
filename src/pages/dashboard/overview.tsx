import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import localFont from "@next/font/local";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Deflux Dashboard</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white">
        <SideNav/>
      </main>
    </>
  );
};

export default Dashboard;
