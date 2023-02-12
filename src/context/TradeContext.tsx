import { createContext, useState } from "react";
import type { Trade } from "@prisma/client";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface IGlobalContextProps {
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
}

export const TradeContext = createContext<IGlobalContextProps>({
  trades: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTrades: () => {},
});

export const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  const { data: sessionData } = useSession();

  console.log('FROM PROVIDER', trades)
// Only call the query if there is a session
  const {data: tradeData } = trpc.tradeRouter.getTrades.useQuery(
      undefined,
      {
        onSuccess(tradeData) {
          console.log('GETTING INITIAL TRADES', tradeData)
          setTrades(tradeData);
        },
        onError(error) {
          // return a response if there is an error
          console.log(error);
        },
      }
    );


  return (
    <TradeContext.Provider value={{
      trades,
      setTrades,
    }}>
      {children}
    </TradeContext.Provider>
  );
};
