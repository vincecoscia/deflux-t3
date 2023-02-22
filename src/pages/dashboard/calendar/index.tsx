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
import { useContext } from "react";
import { TradeContext } from "../../../context/TradeContext";

const Calendar: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const [tagsAndWinRate, setTagsAndWinRate] = useMemoizedState<any>([]);

  const { data: sessionData } = useSession();

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
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mb-24 lg:mb-3 mr-3 grid grid-cols-12 gap-3">
            <div className="lg:col-span-10 col-span-12 flex flex-col">
              <CalendarWidget trades={trades}/>
            </div>
            <div className="flex rounded-lg bg-gray-800 p-2 text-white lg:col-span-2 col-span-12">
              <Statistics />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Calendar;
