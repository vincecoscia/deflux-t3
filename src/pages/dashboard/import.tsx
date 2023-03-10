import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import ImportWizard from "../../components/ImportWizard";
import SideNav from "../../components/SideNav";



const Import: NextPage = () => {
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
        <ImportWizard user={sessionData.user} />
      </main>
    </>
  );
};

export default Import;
