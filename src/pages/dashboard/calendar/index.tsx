import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import type { Trade, TradeAccount } from "@prisma/client";
import useMemoizedState from "../../../components/hooks/useMemoizedState";
import Statistics from "../../../components/widgets/Statistics";
import CalendarWidget from "../../../components/widgets/CalendarWidget";
import { useContext, useEffect, useState } from "react";
import { TradeContext } from "../../../context/TradeContext";
import { TradeAccountContext } from "../../../context/TradeAccountContext";
import Dropdown from "../../../components/shared/Dropdown";

const Calendar: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const { tradeAccounts, isLoadingGlobalTradeAccounts } =
    useContext(TradeAccountContext);
  const [tagsAndWinRate, setTagsAndWinRate] = useMemoizedState<any>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TradeAccount>();
  const [tradeAnalytics, setTradeAnalytics] = useState<any>([]);

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

  useEffect(() => {
    filterTradesByAccount(trades, selectedAccount, tradeAccounts);
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

  if (!trades || trades.length === 0) {
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
          <div className="mb-24 mr-3 grid grid-cols-12 gap-3 lg:mb-3">
            <div className="col-span-12 flex flex-col lg:col-span-10">
              <div className="lg:flex lg:justify-end">
                <Dropdown
                  options={tradeAccounts}
                  selected={selectedAccount}
                  setSelected={setSelectedAccount}
                />
              </div>
              <CalendarWidget trades={filteredTrades} />
            </div>
            <div className="col-span-12 flex rounded-lg bg-gray-800 p-2 text-white lg:col-span-2">
              <Statistics tradeAnalytics={tradeAnalytics} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
