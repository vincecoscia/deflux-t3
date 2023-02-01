import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useEffect, useState } from "react";
import type { Trade, Execution } from "@prisma/client";
import TradeTable from "../../components/TradeTable";
import Chart from "../../components/widgets/Chart";
import useMemoizedState from "../../components/hooks/useMemoizedState";
import { getBalance } from "../../utils/globalFunctions";
import Statistics from "../../components/widgets/Statistics";

const Dashboard: NextPage = () => {
  const [trades, setTrades] = useMemoizedState<Trade[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: sessionData } = useSession();

  const { data: tradeData } = trpc.tradeRouter.getTrades.useQuery(undefined, {
    onSuccess(tradeData) {
      // setTrades only if previous trades are not equal to new trades
      console.log("Updating trades");
      setTrades(tradeData);
    },
  });
  useEffect(() => {
    getBalance(trades, setBalance);
  }, [trades]);

  const { data: executionData, isLoading: executionLoading } =
    trpc.executionRouter.getExecutions.useQuery(undefined, {
      onSuccess(executionData) {
        setExecutions(executionData);
      },
    });

  // Get account returns by summing all trade.netProfit and subtracting all trade.commision
  const accountReturns = trades.reduce((acc, trade) => {
    return acc + trade.netProfit;
  }, 0);

  const accountReturnsPercentage =
    (accountReturns / (balance - accountReturns)) * 100 || 0;

  console.log(balance - accountReturns);
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
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 mb-24 lg:mb-0">
            <div className="mb-3 grid gap-3 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-8">
                <div className="mb-3 flex justify-between">
                  <div className="flex w-full gap-x-3">
                    <p className="w-full rounded-lg py-2 px-1 font-light dark:bg-gray-800 dark:text-white sm:w-auto sm:px-2 lg:text-base">
                      Account Balance:{" "}
                      <span className="font-semibold text-primary">
                        ${balance.toLocaleString()}
                      </span>
                    </p>
                    <p className="w-full rounded-lg py-2  px-1 font-light dark:bg-gray-800 dark:text-white sm:w-auto sm:px-2 lg:text-base">
                      Total Returns:{" "}
                      <span
                        className={
                          accountReturns >= 0
                            ? "whitespace-pre font-semibold text-green-500 sm:whitespace-normal"
                            : "whitespace-pre font-semibold text-red-500 sm:whitespace-normal"
                        }
                      >
                        ${accountReturns.toFixed(2)} (
                        {accountReturnsPercentage.toFixed(2)}%)
                      </span>
                    </p>
                  </div>
                  <button className="hidden w-20 rounded-lg bg-gray-800 p-2 text-white sm:flex">
                    All
                  </button>
                </div>
                <div className="col-span-2 flex rounded-lg bg-gray-800 p-2 text-white">
                  <Chart data={trades} />
                </div>
              </div>

              <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white lg:col-span-4">
                <Statistics data={trades} />
              </div>
            </div>
            <div className="text-sm">
              <TradeTable data={trades} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
