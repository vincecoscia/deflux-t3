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
        <div className="m-3 w-full overflow-y-scroll h-full">
          <div className="mb-3 grid grid-cols-12 gap-3 h-full">
            <div className="col-span-10 flex flex-col h-full">
              <div className="mb-3 flex justify-between">
                <p className="rounded-lg p-2 font-light dark:bg-gray-800 dark:text-white">
                  Total: {trades.length} (Trades) | Return: <span className={accountReturns >= 0 ? 'text-green-500' : 'text-red-500'}>${accountReturns.toFixed(2)}</span>
                </p>
                <button className="w-20 rounded-lg bg-gray-800 p-2 text-white">
                  All
                </button>
              </div>
              <div className="text-xs h-full">
                <CalendarWidget trades={trades}/>
              </div>
            </div>

            <div className="flex h-full rounded-lg bg-gray-800 p-2 text-white col-span-2">
              <Statistics data={trades} />
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
};

export default Calendar;
