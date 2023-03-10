import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
// Contexts
import { TradeProvider } from "../context/TradeContext";
import { SideNavProvider } from "../context/SideNavContext";
import { AnalyticsProvider } from "../context/AnalyticsContext";
import { UserPreferenceProvider } from "../context/UserPreferencesContext";
import { TradeAccountProvider } from "../context/TradeAccountContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserPreferenceProvider>
      <SideNavProvider>
      <TradeAccountProvider>
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
      </TradeAccountProvider>
      </SideNavProvider>
      </UserPreferenceProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
