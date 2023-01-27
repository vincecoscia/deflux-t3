import React from "react";
import { memo } from "react";

interface TradeTableProps {
  trades: any[];
}

const TradeTable: React.FC<TradeTableProps> = memo(function TradeTable({trades}) {
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

  return (
    <>

      <div className="flex w-full flex-row items-center rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white text-sm">
        {temp.map((item, index) => (
          <div key={index} className="flex-1">
            {item}
          </div>
        ))}
      </div>
      <div className="rounded-b-lg bg-gray-800 text-sm">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex w-full flex-row items-center border-b border-gray-700  bg-gray-800 px-2 py-3 last:rounded-b-lg last:border-0 hover:bg-primary hover:bg-opacity-10 dark:text-white"
          >
            <div className="flex-1 text-primary">{trade.symbol}</div>
            <div className="flex-1 font-light">{trade.dateOpened.toLocaleString()}</div>
            <div className="flex-1 font-light">{trade.dateClosed.toLocaleString()}</div>
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
              <div className={`rounded-full py-1 dark:text-gray-700 w-16 text-center ${trade.winLoss === 'WIN' ? 'bg-green-500' : 'bg-red-600'}`}>
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
