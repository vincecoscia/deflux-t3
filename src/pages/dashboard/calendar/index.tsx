import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import type { Trade } from "@prisma/client";
import useMemoizedState from "../../../components/hooks/useMemoizedState";
import Statistics from "../../../components/widgets/Statistics";
import CalendarWidget from "../../../components/widgets/CalendarWidget";

const Calendar: NextPage = () => {
  const [trades, setTrades] = useMemoizedState<Trade[]>([]);

  const { data: tradeData } = trpc.tradeRouter.getTrades.useQuery(
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
      <main className="flex h-[calc(100vh-84px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mb-24 lg:mb-3 mr-3 grid grid-cols-12 gap-3">
            <div className="lg:col-span-10 col-span-12 flex flex-col">
              <CalendarWidget trades={trades}/>
            </div>
            <div className="flex rounded-lg bg-gray-800 p-2 text-white lg:col-span-2 col-span-12">
              <Statistics data={trades} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
