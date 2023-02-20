import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";
import { useContext, useEffect, useState } from "react";
import type { Trade, Execution } from "@prisma/client";
import TradeTable from "../../components/TradeTable";
import Chart from "../../components/widgets/Chart";
import useMemoizedState from "../../components/hooks/useMemoizedState";
import { getBalance } from "../../utils/globalFunctions";
import Statistics from "../../components/widgets/Statistics";
import Dropdown from "../../components/shared/Dropdown";
import { TradeContext } from "../../context/TradeContext";

const Dashboard: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const [filteredTrades, setFilteredTrades] = useMemoizedState<Trade[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");

  const { data: sessionData } = useSession();

  console.log('selectedPlatform', selectedPlatform)

  // Write a function for filtering trades by platform
  const filterTradesByPlatform = (trades, platform) => {
    if (platform === "All") {
      setFilteredTrades(trades);
    } else {
      const filteredTrades = trades.filter((trade) => trade.platform === platform);
      setFilteredTrades(filteredTrades);
    }
  };

  useEffect(() => {
    filterTradesByPlatform(trades, selectedPlatform);
    getBalance(trades, setBalance);
    getPlatforms(trades, setPlatforms);
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

  const getPlatforms = (trades, setPlatforms) => {
    const platforms = trades.map((trade) => trade.platform);
    // Add "All" to platforms array
    platforms.unshift("All");
    const uniquePlatforms = [...new Set(platforms)];
    setPlatforms(uniquePlatforms);
  };

  const accountReturnsPercentage =
    (accountReturns / (balance - accountReturns)) * 100 || 0;

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <h1 className="text-2xl text-white font-semibold">Please sign in to view your Dashboard</h1>
      </div>
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
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 mb-24 lg:mb-0">
            <div className="mb-3 grid gap-3 lg:grid-cols-12">
              <div className="flex flex-col lg:col-span-8">
                <div className="mb-3 flex justify-between flex-col-reverse gap-y-3 lg:flex-row lg:gap-y-0">
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
                  <Dropdown options={platforms} selected={selectedPlatform} setSelected={setSelectedPlatform}/>
                </div>
                <div className="col-span-2 flex rounded-lg bg-gray-800 p-2 text-white">
                  <Chart data={filteredTrades} />
                </div>
              </div>

              <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white lg:col-span-4">
                <Statistics data={filteredTrades} />
              </div>
            </div>
            <div className="text-sm">
              <TradeTable data={filteredTrades} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
