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
  const [tagsAndWinRate, setTagsAndWinRate] = useState<any>([]);

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
          <div className="container px-4 -mt-48 flex flex-col gap-y-4 items-center justify-center text-center">
            <h1 className="text-2xl text-white font-semibold">Please sign in to view your Dashboard</h1>
          </div>
        </div>
      );
    }
  
    if (!trades || trades.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
          <div className="container px-4 -mt-48 flex flex-col gap-y-4 items-center justify-center text-center">
            <h1 className="text-2xl text-white font-semibold mb-5">Looks like you don&apos;t have any trades yet!</h1>
            <Link href={'/dashboard/import'} className="p-2 rounded-lg bg-primary text-white w-full lg:w-fit mb-4">Import Wizard</Link>
            <p className="text-lg text-white">Head to the import wizard to get started</p>
          </div>
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
        Ello
      </main>
    </>
  );
};

export default Dashboard;
