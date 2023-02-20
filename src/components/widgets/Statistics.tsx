import { memo, FC, useEffect, useState } from "react";
import type { Trade } from "@prisma/client";

interface StatisticsProps {
  data: Trade[];
  // tagWinRate comes as an array of objects with a tag and winRate property
}

const Statistics: FC<StatisticsProps> = memo(function Statistics({ data }) {
  console.log("STATISTICS DATA", data);
  const [winRate, setWinRate] = useState<number>(0);
  const [averageWin, setAverageWin] = useState<number>(0);
  const [averageLoss, setAverageLoss] = useState<number>(0);
  const [riskReward, setRiskReward] = useState<number>(0);
  // const [winningTags, setWinningTags] = useState<any>([]);
  // const [losingTags, setLosingTags] = useState<any>([]);

  useEffect(() => {
    setWinRate(
      (data.filter((trade) => trade.winLoss === "WIN").length / data.length) *
        100 || 0
    );
    const avgWin =
      data
        .filter((trade) => trade.winLoss === "WIN")
        .reduce((acc, trade) => {
          return acc + trade.netProfit;
        }, 0) / data.filter((trade) => trade.winLoss === "WIN").length || 0;
    setAverageWin(avgWin);
    const avgLoss =
      data
        .filter((trade) => trade.winLoss === "LOSS")
        .reduce((acc, trade) => {
          return acc + trade.netProfit;
        }, 0) / data.filter((trade) => trade.winLoss === "LOSS").length || 0;
    setAverageLoss(avgLoss);
    setRiskReward(Math.abs(avgWin / avgLoss) || 0);
    // setWinningTagsFunc()
    // setLosingTagsFunc()
  }, [data]);

  // const setWinningTagsFunc = () => {
  //   // get top 3 tags with highest win rate. tagWinRate is an array of objects with a tag and winRate property
  //   console.log("tagWinRate STAT PAGE", tagWinRate)
  //   const top3Tags = tagWinRate.sort((a, b) => b.winRate - a.winRate).slice(0, 3);
  //   setWinningTags(top3Tags);
  // };

  // const setLosingTagsFunc = () => {
  //   // get top 3 tags with lowest win rate. tagWinRate is an array of objects with a tag and winRate property
  //   const bottom3Tags = tagWinRate.sort((a, b) => a.winRate - b.winRate).slice(0, 3);
  //   setLosingTags(bottom3Tags);
  // };

  // console.log("WINNING TAGS", winningTags)

  return (
    <div className="flex h-full w-full flex-col p-2">
      <h1 className="mb-4 text-lg font-bold text-white">Statistics</h1>
      <div className="flex justify-between">
        <div>
          <div className="mb-4">
            <p className="text-sm font-light text-white">Win Rate</p>
            <p className={`text-lg font-semibold`}>{winRate.toFixed(2)}%</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-light text-white">Average Win</p>
            <p className="text-lg font-semibold text-green-500">
              ${averageWin.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-light text-white">Average Loss</p>
            <p className="text-lg font-semibold text-red-500">
              ${averageLoss.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-light text-white">R-Multiple</p>
            <p
              className={`text-lg font-semibold ${
                riskReward >= 1 ? "text-green-500" : "text-red-600"
              }`}
            >
              {riskReward.toFixed(2)}
            </p>
          </div>
        </div>
        {/* <div>
          <div className="mb-4">
            <p className="text-sm font-light text-white">Best Tags & Win Rate</p>
            {winningTags.map((winners) => {
              
               return (
                <div key={winners.tag.id} className="flex">
                  <p className="text-lg font-semibold">{winners.tag.name}: <span className="text-green-500">{(winners.winRate * 100).toFixed(2)}%</span></p>
                  
                </div>
                )
            }
            )}
            </div>
            <div className="mb-4">
              <p className="text-sm font-light text-white">Worst Tags & Win Rate</p>
              {losingTags.map((losers) => {
                return (
                  <div key={losers.tag.id} className="flex">
                    <p className="text-lg font-semibold">{losers.tag.name}: <span className="text-red-600">{(losers.winRate * 100).toFixed(2)}%</span></p>
                    </div>
                )
              })}
              </div>
          </div> */}
        </div>
      </div>
  );
});

export default Statistics;
