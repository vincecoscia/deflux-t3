import { parse } from "papaparse";
import cuid from 'cuid';

const combineTradesThinkOrSwim = (trades) => {
  const combinedTrades = [];
  let tempTrades = {};
  for (let i = 0; i < trades.length; i++) {
    const trade = trades[i];
    if(!tempTrades[trade.symbol]){
        tempTrades[trade.symbol] = {
          id: trade.id,
          commission: trade.commission,
          dateTime: trade.dateTime,
          platform: trade.platform,
          return: trade.return,
          side: trade.side,
          userId: trade.userId,
          symbol: trade.symbol,
          percentClosed: trade.percentClosed,
          quantity: trade.quantity,
          price: trade.price,
        }
    }
    else if (trade.percentClosed === 0) {
        tempTrades[trade.symbol].percentClosed = trade.percentClosed
    }
    else {
        tempTrades[trade.symbol].percentClosed += trade.percentClosed
    }
    if(tempTrades[trade.symbol].percentClosed === 100){
        let temp = []
        temp.push(trade)
        temp.push(tempTrades[trade.symbol])
        let obj = {
            id: cuid(),
            userId: trade.userId,
            trade: temp
        }
        combinedTrades.push(obj)
        tempTrades[trade.symbol] = null
    }
  }
  return combinedTrades;
}

export const ThinkOrSwim = async (
  file,
  userId,
  addExecutions,
  addTrades
) => {
  let tempTrades = [];
  await parse(file, {
    beforeFirstChunk: (chunk) => {
      // Only parse after the row with 'Account Trade History' in it
      const start = chunk.indexOf("DATE");
      const end = chunk.indexOf("Futures Statements");

      return chunk.slice(start, end);
    },
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    chunk: (results) => {
      // Find all where TYPE === 'TRD'
      const trades = results.data.filter((row) => row.TYPE === "TRD");
      // clean trades
      const cleanedTrades = trades.map((trade) => {
        let commission = 0;
        // combine commissions and fees
        commission = trade["Commissions & Fees"] + trade["Misc Fees"];
        // deconstruct trade.DESCRIPTION and pull out symbol, side, price, and quantity
        const description = trade.DESCRIPTION.split(" ");
        const side = description[0] === "BOT" ? "BUY" : "SELL";
        // remove + from quantity
        const quantity = Number(description[1].replace("+", ""));
        // remove everything after the :
        const symbol = description[2].split(":")[0];
        // remove everything before the @ and convert to number
        const price = Number(description[3].split("@")[1]);

        const dateTime = new Date(trade.DATE + " " + trade.TIME);

        return {
          id: cuid(),
          symbol,
          quantity,
          price,
          commission,
          side,
          return: trade.AMOUNT,
          platform: "ThinkOrSwim",
          dateTime,
          userId: userId || "test",
        };
      });
      // push cleaned trades to tempTrades
      tempTrades.push(...cleanedTrades);
      console.log("TEMP TRADES", tempTrades);
    },
  })
  parse(file, {
    beforeFirstChunk: (chunk) => {
      // Only parse after the row with 'Time Placed' in it
      const start = chunk.indexOf("Notes");
      // End at the row with 'Account Trade History'
      const end = chunk.indexOf("Account Trade History");
      return chunk.slice(start, end);
    },
    dynamicTyping: true,
    skipEmptyLines: true,
    comments: true,
    header: true,
    chunk: (results) => {
      console.log('Results',results)
      // Filter out all rows where Pos Effect is "TO CLOSE" and Qty does start with a +
      const trades = results.data.filter(
        (row) => row[`Pos Effect`] === "TO CLOSE" && !row.Qty.startsWith("+")
      );
      console.log("TRADES", trades);
      // clean trades
      const cleanedTrades = trades.map((trade) => {
        // change the date format to match the other platform
        const dateTime = new Date(trade[`Time Placed`]);
        // remove the percent sign from the Qty and convert to number
        trade.Qty = Number(trade.Qty.replace("%", ""));

        return {
          symbol: trade.Symbol,
          percentClosed: trade.Qty,
          dateTime,
        };
      });
      console.log("CLEANED SECOND", cleanedTrades);
      // combine cleanedTrades with tempTrades based on symbol and dateTime
      const combinedTrades = tempTrades.map((trade) => {
        const matchingTrade = cleanedTrades.find(
          (row) =>
            row.symbol === trade.symbol &&
            row.dateTime.getTime() === trade.dateTime.getTime()
        );
        if (matchingTrade) {
          return {
            ...trade,
            percentClosed: matchingTrade.percentClosed,
          };
        }
        return {
          ...trade,
          percentClosed: 0,
        };
      });
      console.log("COMBINED", combinedTrades);
      // Combine any trades including and before a trade that is 100% closed
      const combinedTrades2 = combineTradesThinkOrSwim(combinedTrades);
      console.log("COMBINED2", combinedTrades2);
      // from combinedTrades2, assign a trade group id to each trade
      const addTradeGroupId = combinedTrades2.map((tradeGroup) => {
        return {
          ...tradeGroup,
          trade: tradeGroup.trade.map((trade) => {
            return {
              ...trade,
              tradeId: tradeGroup.id,
            };
          }),
        };
      });

      console.log("ADD TRADE GROUP ID", addTradeGroupId);
      // Pull out trade array from each trade group
      const tradesArray = addTradeGroupId.map((tradeGroup) => tradeGroup.trade);
      // flatten tradesArray
      const flattenedTrades = tradesArray.flat();
      console.log("FLATTENED TRADES", flattenedTrades);
      // Pull out id and userId from each trade group
      const tradeGroupForSubmit = addTradeGroupId.map((tradeGroup) => {
        return {
          id: tradeGroup.id,
          userId: tradeGroup.userId,
        };
      });
      console.log("TRADE GROUP IDS", tradeGroupForSubmit);
      // Submit trade groups to database
      addTrades(tradeGroupForSubmit);
      // Submit trades to database
      addExecutions(flattenedTrades);
    },
  })
};
