import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useState } from "react";
import type { Trade } from "@prisma/client";
import TradingViewWidget from "../../components/TradingViewWidget";

const Dashboard: NextPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const { data: sessionData } = useSession();

  const { data: tradeData, isLoading } = trpc.tradeRouter.getTrades.useQuery(
    undefined,
    {
      onSuccess(tradeData) {
        setTrades(tradeData);
      },
    }
  );

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
        <div className="w-full">
          <TradingViewWidget/>
          <h1 className="text-3xl dark:text-white">Overview</h1>
          {/* Map over trades */}
          {trades.map((trade) => (
            <div className="flex gap-3 dark:text-white" key={trade.id}>
              <h1>{trade.symbol}</h1>
              <h1>{trade.quantity}</h1>
              <h1>{trade.price}</h1>
              <h1>{trade.commission}</h1>
              <h1>{trade.side}</h1>
              <h1>{trade.return}</h1>
              <h1>{trade.dateTime.toLocaleString()}</h1>
              <h1>{trade.platform}</h1>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;
