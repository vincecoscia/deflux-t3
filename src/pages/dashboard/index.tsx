import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useState } from "react";
import type { Trade, Execution } from "@prisma/client";
import TradeTable from "../../components/TradeTable";
import Chart from "../../components/overview/Chart";
import useMemoizedState from "../../components/hooks/useMemoizedState";

const Dashboard: NextPage = () => {
  const [trades, setTrades] = useMemoizedState<Trade[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const { data: sessionData } = useSession();

  const { data: tradeData, isLoading } = trpc.tradeRouter.getTrades.useQuery(
    undefined,
    {
      onSuccess(tradeData) {
        // setTrades only if previous trades are not equal to new trades
          console.log("Updating trades");
          setTrades(tradeData);
          console.log("Updated trades");
      },
    }
  );

  const { data: executionData, isLoading: executionLoading } =
    trpc.executionRouter.getExecutions.useQuery(undefined, {
      onSuccess(executionData) {
        setExecutions(executionData);
      },
    });

    // TODO: Add a loading state

  // Get account returns by summing all trade.netProfit and subtracting all trade.commision
  const accountReturns = trades.reduce((acc, trade) => {
    return acc + trade.netProfit;
  }, 0);

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
      <main className="flex h-[calc(100vh-84px)] bg-white dark:bg-gray-900 over">
        <SideNav />
        <div className="m-3 w-full overflow-y-scroll">
          <div className="mb-3 grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col">
              <div className="mb-3 flex justify-between">
                <p className="rounded-lg p-2 font-light dark:bg-gray-800 dark:text-white">
                  Total: {trades.length} (Trades) | Return: <span className={accountReturns >= 0 ? 'text-green-500' : 'text-red-500'}>${accountReturns.toFixed(2)}</span>
                </p>
                <button className="w-20 rounded-lg bg-gray-800 p-2 text-white">
                  All
                </button>
              </div>
              <div className="col-span-2 flex rounded-lg bg-gray-800 p-2 text-white">
                <Chart/>
              </div>
            </div>

            <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white">
              Test
            </div>
          </div>
          <div className="text-sm">
          <TradeTable data={trades} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
