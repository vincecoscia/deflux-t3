import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import { useState, useEffect, useContext } from "react";
import type { Trade, Execution } from "@prisma/client";
import TradeTable from "../../../components/TradeTable";
import useMemoizedState from "../../../components/hooks/useMemoizedState";
import Statistics from "../../../components/widgets/Statistics";
import { getBalance } from "../../../utils/globalFunctions";
import { TradeContext } from "../../../context/TradeContext";

const Trades: NextPage = () => {
  const {trades} = useContext(TradeContext);
  // const [executions, setExecutions] = useState<Execution[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [platform, setPlatform] = useState<string>("All");
  const [tagsAndWinRate, setTagsAndWinRate] = useState<any>([]);
  useEffect(() => {
    getBalance(trades, setBalance);
  }, [trades]);

  const { data: sessionData } = useSession();

  // const { data: executionData } = trpc.executionRouter.getExecutions.useQuery(
  //   undefined,
  //   {
  //     onSuccess(executionData) {
  //       setExecutions(executionData);
  //     },
  //   }
  // );

  // TODO: Add a loading state

  // Get account returns by summing all trade.netProfit and subtracting all trade.commision
  const accountReturns = trades.reduce((acc, trade) => {
    return acc + trade.netProfit;
  }, 0);

  const accountReturnsPercentage =
  (accountReturns / (balance - accountReturns)) * 100 || 0;

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <h1 className="text-2xl text-white font-semibold">Please sign in to view your Dashboard</h1>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <h1 className="text-2xl text-white font-semibold">Looks like you don&apos;t have any trades yet!</h1>
        <p className="text-lg text-white">Head to the <Link href={'/dashboard/import'} className="text-primary underline font-semibold">Import Wizard</Link> to get started</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Deflux Dashboard</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 ">
            <div className="mb-24 lg:mb-3 grid gap-3 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-8 w-[95vw] lg:w-full">
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
                <div className="text-xs">
                  <TradeTable data={trades} />
                </div>
              </div>

              <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white lg:col-span-4">
                <Statistics />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Trades;
