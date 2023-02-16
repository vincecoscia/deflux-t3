import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import ImportWizard from "../../components/ImportWizard";
import SideNav from "../../components/SideNav";
import { ToastContainer } from "react-toastify";

const Import: NextPage = () => {
  const { data: sessionData } = useSession();
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

      {/* If not logged in, can't view page */}
      {!sessionData && (
        <main className="dark:bg-gray-900 h-[calc(100vh-59px)] flex justify-center items-center">
            <h1 className="text-white text-3xl">Must be logged in to view this page</h1>
        </main>
      )}
      {/* If logged in, show page */}
      {sessionData && (
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <ImportWizard />
      </main>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Import;
