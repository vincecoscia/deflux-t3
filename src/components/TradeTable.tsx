import React from "react";
import { memo } from "react";

interface TradeTableProps {
  trades: any[];
}

const TradeTable: React.FC<TradeTableProps> = memo(function TradeTable({trades}) {
  const [sortedTrades, setSortedTrades] = React.useState<any[]>(trades);

  console.log("sortedTrades", sortedTrades);

  console.log("props", trades);
  const temp = [
    "Symbol",
    "Entry Date",
    "Exit Date",
    "Entry Price",
    "Exit Price",
    "Net Profit",
    "Status",
  ];

  const dateOptions = {
    dateStyle: "short",
    timeStyle: "short",
  };

  // This needs fixing
  const sortTrades = (column: string) => {
    // Create a copy of the trades array
    const sortedTrades = [...trades];
    // Sort the trades by the column that was clicked
    sortedTrades.sort((a, b) => {
      if (column === "Symbol") {
        // Sort by alphabetical order if clicked once, sort by reverse alphabetical order if clicked twice
        if (sortedTrades[0].symbol === a.symbol) {
          return a.symbol.localeCompare(b.symbol);
        } else {
          return b.symbol.localeCompare(a.symbol);
        }
      }
      if (column === "Entry Date") {
        // Sort by date if clicked initally, sort by reverse date if clicked again and so on
        if (sortedTrades[0].dateOpened === a.dateOpened) {
          return a.dateOpened.getTime() - b.dateOpened.getTime();
        }
        return b.dateOpened.getTime() - a.dateOpened.getTime();

      }
      if (column === "Exit Date") {
        // Sort by date
        return a.dateClosed.getTime() - b.dateClosed.getTime();
      }
      if (column === "Entry Price") {
        // Sort by number
        return a.openPrice - b.openPrice;
      }
      if (column === "Exit Price") {
        // Sort by number
        return a.closePrice - b.closePrice;
      }
      if (column === "Net Profit") {
        // Sort by number
        return a.netProfit - b.netProfit;
      }
      if (column === "Status") {
        // Sort by alphabetical order
        return a.winLoss.localeCompare(b.winLoss);
      }
    });
    // Set the sorted trades to the state
    setSortedTrades(sortedTrades);
  };

  return (
    <>

      <div className="flex w-full flex-row items-center rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white">
        {temp.map((item, index) => (
          <div key={index} className="flex-1">
            <button onClick={() => sortTrades(item)}>
            {item}
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-b-lg bg-gray-800">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex w-full flex-row items-center border-b border-gray-700  bg-gray-800 px-2 py-3 last:rounded-b-lg last:border-0 hover:bg-primary hover:bg-opacity-10 dark:text-white"
          >
            <div className="flex-1 text-primary">{trade.symbol}</div>
            {/* format date to the minute */}
            <div className="flex-1 font-light">{trade.dateOpened.toLocaleString("en-US", dateOptions)}</div>
            <div className="flex-1 font-light">{trade.dateClosed.toLocaleString("en-US", dateOptions)}</div>
            <div className="flex-1 font-light">{trade.openPrice}</div>
            <div className="flex-1 font-light">{trade.closePrice}</div>
            <div
              className={
                trade.netProfit > 0
                  ? "flex-1 text-green-500"
                  : "flex-1 text-red-600"
              }
            >
              {trade.netProfit}
            </div>
            <div className="flex-1">
              <div className={`rounded-full py-1 dark:text-gray-700 w-16 text-center font-semibold ${trade.winLoss === 'WIN' ? 'bg-green-500' : 'bg-red-600'}`}>
                {trade.winLoss}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});

export default TradeTable;
