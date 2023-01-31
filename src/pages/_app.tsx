import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "../utils/trpc";
import { useState } from "react";

import Navbar from "../components/Navbar";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Navbar/>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
