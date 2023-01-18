import { type NextPage } from "next";
import Head from "next/head";
import SideNav from "../../components/SideNav";

const Dashboard: NextPage = () => {

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
      </main>

    </>
  );
};

export default Dashboard;