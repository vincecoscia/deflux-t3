import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { TradeProvider } from "../context/TradeContext";

import Navbar from "../components/Navbar";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TradeProvider >
        <Navbar/>
        <Component {...pageProps} />
      </TradeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
