import { createContext, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { Tag } from "@prisma/client";

interface IGlobalContextProps {
  tradeAnalytics: any[];
  tagAnalytics: any[];
  setTradeAnalytics: (tradeAnalytics: any[]) => void;
  setTagAnalytics: (tagAnalytics: any[]) => void;
  refetchTagAnalytics: () => void;
}

export const AnalyticsContext = createContext<IGlobalContextProps>({
  tradeAnalytics: [],
  tagAnalytics: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTradeAnalytics: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTagAnalytics: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetchTagAnalytics: () => {},
});

export const AnalyticsProvider = ({ children }) => {
  const [tradeAnalytics, setTradeAnalytics] = useState<any[]>([])
  const [tagAnalytics, setTagAnalytics] = useState<any[]>([])

  const { data: sessionData } = useSession();

  const { data: tradeAnalyticsData } = trpc.tradeRouter.getTradeAnalytics.useQuery(
    undefined,
    {
      onSuccess(tradeAnalyticsData) {
        setTradeAnalytics(tradeAnalyticsData);
      },
      onError(error) {
        // return a response if there is an error
        console.log(error);
      },
      enabled: sessionData ? true : false,
    }
  );

  const { data: tagAnalyticsData, refetch: refetchTagAnalytics } = trpc.tagRouter.getTagAnalytics.useQuery(
    undefined,
    {
      onSuccess(tagAnalyticsData) {
        setTagAnalytics(tagAnalyticsData);
      },
      onError(error) {
        // return a response if there is an error
        console.log(error);
      },
      enabled: sessionData ? true : false,
    }
  );

  console.log("Trade Analytics", tradeAnalytics)
  console.log("Tag Analytics", tagAnalytics)

  return (
    <AnalyticsContext.Provider value={{
      tradeAnalytics,
      tagAnalytics,
      setTradeAnalytics,
      setTagAnalytics,
      refetchTagAnalytics,
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
