import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useEffect, useState } from "react";
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
      },
    }
  );
  useEffect(() => {
    getBalance();
  }, [trades]);

  const getBalance = () => {
    // Get account balance by grabbing the last trades balance
    const lastTrade = trades[trades.length - 1];
    if (lastTrade) {
      setBalance(lastTrade.balance);
    }
  };

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

  const accountReturnsPercentage = (accountReturns / (balance - accountReturns)) * 100 || 0;

  console.log(balance - accountReturns)
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
          <div className="mb-3 grid lg:grid-cols-12 gap-3">
            <div className="lg:col-span-8 flex flex-col">
              <div className="mb-3 flex justify-between">
                <div className="flex gap-x-3">
                <p className="rounded-lg lg:p-2 p-1 text-xs lg:text-base font-light dark:bg-gray-800 dark:text-white">
                  Account Balance: <span className='text-primary font-semibold'>${balance.toLocaleString()}</span>
                </p>
                <p className="rounded-lg lg:p-2 p-1 text-xs lg:text-base font-light dark:bg-gray-800 dark:text-white">
                  Total Returns: <span className={accountReturns >= 0 ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>${accountReturns.toFixed(2)} ({accountReturnsPercentage.toFixed(2)}%)</span>
                </p>
              </div>
                <button className="w-20 rounded-lg bg-gray-800 p-2 text-white">
                  All
                </button>
              </div>
              <div className="col-span-2 flex rounded-lg bg-gray-800 p-2 text-white">
                <Chart data={trades}/>
              </div>
            </div>

            <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white lg:col-span-4">
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
