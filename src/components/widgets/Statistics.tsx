import { memo, FC, useEffect, useState } from "react";
import type { Trade } from "@prisma/client";

interface StatisticsProps {
  data: Trade[];
}

const Statistics: FC<StatisticsProps> = memo(function Statistics({data}) {
  console.log("STATISTICS DATA", data);
  const [winRate, setWinRate] = useState<number>(0);
  const [averageWin, setAverageWin] = useState<number>(0);
  const [averageLoss, setAverageLoss] = useState<number>(0);
  const [riskReward, setRiskReward] = useState<number>(0);

  useEffect(() => {
      setWinRate(data.filter((trade) => trade.winLoss === "WIN").length / data.length * 100 || 0)
      const avgWin = data.filter((trade) => trade.winLoss === "WIN").reduce((acc, trade) => {
        return acc + trade.netProfit;
      }, 0) / data.filter((trade) => trade.winLoss === "WIN").length || 0
      setAverageWin(avgWin)
      const avgLoss = data.filter((trade) => trade.winLoss === "LOSS").reduce((acc, trade) => {
        return acc + trade.netProfit;
      }, 0) / data.filter((trade) => trade.winLoss === "LOSS").length || 0
      setAverageLoss(avgLoss)
      setRiskReward(Math.abs(avgWin / avgLoss) || 0)
  }, [data])

  return (
    <div className="flex flex-col w-full h-full p-2">
      <h1 className="text-lg font-bold text-white mb-4">Statistics</h1>
      <div className="grid grid-cols-3 lg:grid-cols-4 justify-items-start ">
        <div className="mb-4">
        <p className="text-sm font-light text-white">Win Rate</p>
        <p className={`text-lg font-semibold`}>{winRate.toFixed(2)}%</p>
        </div>
        <div className="mb-4">
        <p className="text-sm font-light text-white">Average Win</p>
        <p className="text-lg font-semibold text-green-500">${averageWin.toFixed(2)}</p>
        </div>
        <div className="mb-4">
        <p className="text-sm font-light text-white">Average Loss</p>
        <p className="text-lg font-semibold text-red-500">${averageLoss.toFixed(2)}</p>
        </div>
        <div className="mb-4">
        <p className="text-sm font-light text-white">R-Multiple</p>
        <p className={`text-lg font-semibold ${riskReward >= 1 ? 'text-green-500' : 'text-red-600'}`}>{riskReward.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
});

export default Statistics;

