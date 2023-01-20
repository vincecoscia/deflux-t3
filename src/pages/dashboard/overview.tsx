import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useState } from "react";
import type { Trade, Execution } from "@prisma/client";
import TradeTable from "../../components/TradeTable";

const Dashboard: NextPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { data: sessionData } = useSession();

  const { data: tradeData, isLoading } = trpc.tradeRouter.getTrades.useQuery(
    undefined,
    {
      onSuccess(tradeData) {
        setTrades(tradeData);
        console.log(tradeData)
      },
    }
  );

  if (!tradeData || isLoading) {
    return (
      <>
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </>
    );
  }

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
      <main className="flex h-[calc(100vh-84px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="m-4 w-full">
          {/* Map over trades */}
          <TradeTable trades={trades} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
