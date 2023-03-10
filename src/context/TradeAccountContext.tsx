import { createContext, useState } from "react";
import type { TradeAccount } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface IGlobalContextProps {
  tradeAccounts: TradeAccount[];
  setTradeAccounts: (tradeAccounts: TradeAccount[]) => void;
  refetchGlobalTradeAccounts: () => void;
  isLoadingGlobalTradeAccounts: boolean;
}

export const TradeAccountContext = createContext<IGlobalContextProps>({
  tradeAccounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTradeAccounts: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetchGlobalTradeAccounts: () => {},
  isLoadingGlobalTradeAccounts: false,

});

export const TradeAccountProvider = ({ children }) => {
  const [tradeAccounts, setTradeAccounts] = useState<TradeAccount[]>([]);

  const { data: sessionData } = useSession();

  const { data: tradeAccountData, refetch: refetchGlobalTradeAccounts, isLoading: isLoadingGlobalTradeAccounts  } =
    trpc.tradeAccountRouter.getTradeAccounts.useQuery(undefined, {
      onSuccess(tradeAccountData) {
        if (tradeAccountData) {
          setTradeAccounts(tradeAccountData);
        } else {
          setTradeAccounts([]);
        }
      },
      onError(error) {
        // return a response if there is an error
        console.log(error);
      },
      enabled: sessionData ? true : false,
    });

  return (
    <TradeAccountContext.Provider value={{
      tradeAccounts,
      setTradeAccounts,
      refetchGlobalTradeAccounts,
      isLoadingGlobalTradeAccounts
    }}>
      {children}
    </TradeAccountContext.Provider>
  );
};
