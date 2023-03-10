import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import { useState, useEffect, useContext } from "react";
import type { Trade, Execution, TradeAccount } from "@prisma/client";
import TradeTable from "../../../components/TradeTable";
import useMemoizedState from "../../../components/hooks/useMemoizedState";
import Statistics from "../../../components/widgets/Statistics";
import { getBalance } from "../../../utils/globalFunctions";
import { TradeContext } from "../../../context/TradeContext";
import Dropdown from "../../../components/shared/Dropdown";
import { TradeAccountContext } from "../../../context/TradeAccountContext";

const Trades: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const { tradeAccounts, isLoadingGlobalTradeAccounts } =
    useContext(TradeAccountContext);
  // const [executions, setExecutions] = useState<Execution[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [platform, setPlatform] = useState<string>("All");
  const [tagsAndWinRate, setTagsAndWinRate] = useState<any>([]);
  const [selectedAccount, setSelectedAccount] = useState<TradeAccount>();
  const [tradeAnalytics, setTradeAnalytics] = useState<any>([]);
  const [filteredTrades, setFilteredTrades] = useMemoizedState<Trade[]>([]);

  const filterTradesByAccount = (trades, selectedAccount, tradeAccounts) => {
    // if no selected account, filter trades by first account
    if (tradeAccounts.length === 0) return;

    console.log("TRADE ACOUNT OPTIONS", tradeAccounts);

    if (!selectedAccount) {
      const filteredTrades = trades.filter(
        (trade) => trade.accountId === tradeAccounts[0].id
      );
      setFilteredTrades(filteredTrades);
      setSelectedAccount(tradeAccounts[0]);
    } else {
      const filteredTrades = trades.filter(
        (trade) => trade.accountId === selectedAccount.id
      );
      setFilteredTrades(filteredTrades);
    }
  };

  const { data: sessionData } = useSession();

  const {
    data: tradeAnalyticsData,
    isLoading: tradeAnalyticsLoading,
    refetch: refetchAnalytics,
  } = trpc.tradeRouter.getTradeAnalytics.useQuery(
    { accountId: selectedAccount?.id },
    {
      onSuccess(tradeAnalyticsData) {
        setTradeAnalytics(tradeAnalyticsData);
      },
    }
  );

  // TODO: Add a loading state

  // Get account returns by summing all trade.netProfit and subtracting all trade.commision
  const accountReturns = trades.reduce((acc, trade) => {
    return acc + trade.netProfit;
  }, 0);

  const accountReturnsPercentage =
    (accountReturns / (balance - accountReturns)) * 100 || 0;

  useEffect(() => {
    filterTradesByAccount(trades, selectedAccount, tradeAccounts);
    getBalance(trades, setBalance);
  }, [trades, selectedAccount, tradeAccounts]);

  if (!sessionData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900">
        <div className="container -mt-48 flex flex-col items-center justify-center gap-y-4 px-4 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Please sign in to view your Dashboard
          </h1>
        </div>
      </div>
    );
  }

  if (
    !trades ||
    trades.length === 0 ||
    !tradeAccounts ||
    tradeAccounts.length === 0
  ) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900">
        <div className="container -mt-48 flex flex-col items-center justify-center gap-y-4 px-4 text-center">
          <h1 className="mb-5 text-2xl font-semibold text-white">
            Looks like you don&apos;t have any trades yet!
          </h1>
          <Link
            href={"/dashboard/import"}
            className="mb-4 w-full rounded-lg bg-primary p-2 text-white lg:w-fit"
          >
            Import Wizard
          </Link>
          <p className="text-lg text-white">
            Head to the import wizard to get started
          </p>
        </div>
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
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 ">
            <div className="mb-24 grid gap-3 lg:mb-3 lg:grid-cols-12">
              <div className="flex w-[95vw] flex-col lg:col-span-8 lg:w-full">
                <div className="mb-3 flex flex-col-reverse justify-between gap-y-3 lg:flex-row lg:gap-y-0">
                  <div className="flex w-full gap-x-3">
                    <p className="w-full rounded-lg py-2 px-1 font-light dark:bg-gray-800 dark:text-white sm:w-auto sm:px-2 lg:text-base">
                      Account Balance:{" "}
                      <span className="font-semibold text-primary">
                        ${balance?.toFixed(2).toLocaleString()}
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
                  <Dropdown
                    options={tradeAccounts}
                    selected={selectedAccount}
                    setSelected={setSelectedAccount}
                  />
                </div>
                <div className="text-xs">
                  <TradeTable data={trades} />
                </div>
              </div>

              <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white lg:col-span-4">
                <Statistics tradeAnalytics={tradeAnalytics} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Trades;
