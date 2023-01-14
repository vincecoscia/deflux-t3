import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import localFont from "@next/font/local";

import { trpc } from "../utils/trpc";

const azonix = localFont({ src: "../styles/fonts/Azonix.woff2" });

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Deflux</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className={`${azonix.className} text-[hsl(280,100%,70%)]`}>
              Deflux
            </span>
          </h1>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => signOut() : () => signIn("google")}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>

          <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
// <p className="text-center text-2xl text-white">
//   {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//   {secretMessage && <span> - {secretMessage}</span>}
// </p>
// <button
//   className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//   onClick={sessionData ? () => signOut() : () => signIn()}
// >
//   {sessionData ? "Sign out" : "Sign in"}
// </button>
//     </div>
//   );
// };
