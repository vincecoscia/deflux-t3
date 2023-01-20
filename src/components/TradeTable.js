import React from "react";

const TradeTable = ({ trades }) => {
  console.log("props", trades);
  let temp = [
    "Symbol",
    "Entry Date",
    "Exit Date",
    "Entry Price",
    "Exit Price",
    "Profit/Loss",
    "Status",
  ];

  return (
    <>
      <div className="flex w-full flex-row items-center rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white">
        {temp.map((item, index) => (
          <div key={index} className="flex-1">
            {item}
          </div>
        ))}
      </div>
      <div className="rounded-b-lg bg-gray-800">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex w-full flex-row items-center border-b border-gray-700  bg-gray-800 px-2 py-4 last:rounded-b-lg last:border-0 hover:bg-primary hover:bg-opacity-10 dark:text-white"
          >
            <div className="flex-1 text-primary">{trade.symbol}</div>
            <div className="flex-1">{trade.dateOpened.toLocaleString()}</div>
            <div className="flex-1">{trade.dateClosed.toLocaleString()}</div>
            <div className="flex-1">{trade.openPrice}</div>
            <div className="flex-1">{trade.closePrice}</div>
            <div
              className={
                trade.netProfit > 0
                  ? "flex-1 text-green-500"
                  : "flex-1 text-red-500"
              }
            >
              {trade.netProfit}
            </div>
            <div className="flex-1">
              <div className={`rounded-full py-1 dark:text-gray-700 w-16 text-center ${trade.winLoss === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`}>
                {trade.winLoss}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TradeTable;
