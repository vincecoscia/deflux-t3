import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { TradeProvider } from "../context/TradeContext";

import Navbar from "../components/Navbar";

import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import { SideNavProvider } from "../context/SideNavContext";
import { AnalyticsProvider } from "../context/AnalyticsContext";
import { UserPreferenceProvider } from "../context/UserPreferencesContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserPreferenceProvider>
      <SideNavProvider>
      <TradeProvider >
      <AnalyticsProvider>
        <Navbar/>
        <Component {...pageProps} />
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
      </AnalyticsProvider>
      </TradeProvider>
      </SideNavProvider>
      </UserPreferenceProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
