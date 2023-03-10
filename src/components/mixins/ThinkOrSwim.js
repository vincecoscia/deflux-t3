import { parse } from "papaparse";
import cuid from 'cuid';
import { toast } from "react-toastify";

const combineTradesThinkOrSwim = (trades) => {
  const combinedTrades = [];
  let groups = [];
  let currentGroup = [];
  for (let i = 0; i < trades.length; i++) {
    currentGroup.push(trades[i]);

    if (trades[i].percentClosed === 100 || i === trades.length - 1) {
      groups.push(currentGroup);
      currentGroup = [];
    }
  }
  console.log("THE ACTUAL GROUPS",groups);
  // For each group, create a new trade object and push to combinedTrades
  groups.forEach((group) => {
    let temp = [];
    group.forEach((trade) => {
      temp.push(trade);
    });
    let obj = {
      id: cuid(),
      userId: group[0].userId,
      trade: temp,
    };
    combinedTrades.push(obj);
  });

  return combinedTrades;
}

export const ThinkOrSwim = async (
  file,
  userId,
  addExecutions,
  addTrades,
  previousTrades,
  previousExecutions,
  tradeAccounts,
  addTradeAccount,
  accountName
) => {
  let tempTrades = [];
  let identifier = "";
  let tradeAccount = {};
  await parse(file, {
    preview: 1,
    complete: (results) => {
      // Split the string after the word 'Account Statement for ' and before the word 'since'
      identifier = results.data[0][0].split("Account Statement for ")[1].split(" since")[0];
      console.log("I THINK I DID IT BITCH", identifier)

      // Look for identifier within tradeAccounts, if a tradeAccount with identifier exists, set tradeAccount to that tradeAccount. If it does not exist, create it
      const tempTradeAccount = tradeAccounts.find((account) => account.identifier === identifier);

      if (!tempTradeAccount) {
        tradeAccount = {
          id: cuid(),
          identifier: identifier,
          platform: "ThinkOrSwim",
          name: accountName ? accountName : "",
          balance: 0
        }
        addTradeAccount(tradeAccount)
      } else {
        tradeAccount = tempTradeAccount
      }
    },
  }
  );
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
      console.log('Initial Filter',trades)
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

        const balance = +trade.BALANCE.replace(/,/g, "");

        return {
          id: cuid(),
          symbol,
          quantity,
          price,
          commission,
          side,
          return: trade.AMOUNT,
          platform: "ThinkOrSwim",
          balance,
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
      // Turn the row Qty into a string, if null, set to 0

      // Find all rows where Qty === "100% or "-100%"
      const closedTrades = results.data.filter(
        (row) => row.Qty === "100%" || row.Qty === "-100%"
      );
      console.log("Filtered!!!", closedTrades)
      // clean trades
      const cleanedTrades = closedTrades.map((trade) => {
        // change the date format to match the other platform
        const dateTime = new Date(trade[`Time Placed`]);
        // remove the percent sign from the Qty and convert to number of absolute value
        trade.Qty = Math.abs(Number(trade.Qty.replace("%", "")));

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
            // match the date and time to the +/- 1 second
            row.dateTime.getTime() - 1000 <= trade.dateTime.getTime() &&
            row.dateTime.getTime() + 1000 >= trade.dateTime.getTime()
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
      // Assign OPEN or CLOSE to each trade based on the if return is not null or 0
      const addOpenClose = addTradeGroupId.map((tradeGroup) => {
        return {
          ...tradeGroup,
          trade: tradeGroup.trade.map((trade) => {
            return {
              ...trade,
              posEffect: trade.return === null ? "OPEN" : "CLOSE",
            };
          }),
        };
      });
      // Order trades by date and time (earliest should be first) in each trade group
      const orderTradesByDateTime = addOpenClose.map((tradeGroup) => {
        return {
          ...tradeGroup,
          trade: tradeGroup.trade.sort((a, b) => {
            return a.dateTime - b.dateTime;
          }),
        };
      });
      // Add symbol to each trade group object based on the first trade in the trade group
      const addSymbol = orderTradesByDateTime.map((tradeGroup) => {
        return {
          ...tradeGroup,
          symbol: tradeGroup.trade[0].symbol,
        };
      });
      console.log("ADD SYMBOL", addSymbol);

      // Add up returns for each trade group using the trades in the trade group
      const addGrossProfit = addSymbol.map((tradeGroup) => {
        const grossProfit = tradeGroup.trade.reduce((acc, trade) => {
          return acc + trade.return;
        }, 0);
        return {
          ...tradeGroup,
          grossProfit,
        };
      });
      console.log("ADD grossProfit", addGrossProfit);
      // Add up commissions for each trade group using the trades in the trade group
      const addTotalCommission = addGrossProfit.map((tradeGroup) => {
        const totalCommission = tradeGroup.trade.reduce((acc, trade) => {
          return acc + trade.commission;
        }, 0);
        return {
          ...tradeGroup,
          totalCommission,
        };
      });
      console.log("ADD totalCommission", addTotalCommission);
      // Calculate net profit for each trade group using gross profit and total commission
      const addNetProfit = addTotalCommission.map((tradeGroup) => {
        return {
          ...tradeGroup,
          netProfit: tradeGroup.grossProfit + tradeGroup.totalCommission,
        };
      });
      console.log("ADD netProfit", addNetProfit);
      // If returns are positive, set trade group to win, if negative, set to loss
      const addWinLoss = addNetProfit.map((tradeGroup) => {
        return {
          ...tradeGroup,
          winLoss: tradeGroup.netProfit > 0 ? "WIN" : "LOSS",
        };
      });
      console.log("ADD WIN LOSS", addWinLoss);
      // Add openPrice and closePrice to each trade group based on the first and last trade in the trade group
      const addOpenClosePrice = addWinLoss.map((tradeGroup) => {
        return {
          ...tradeGroup,
          openPrice: tradeGroup.trade[0].price,
          closePrice: tradeGroup.trade[tradeGroup.trade.length - 1].price,
          dateOpened: tradeGroup.trade[0].dateTime,
          dateClosed: tradeGroup.trade[tradeGroup.trade.length - 1].dateTime,
        };
      });
      console.log("ADD OPEN CLOSE PRICE", addOpenClosePrice);
      // Add balance to each trade group based on the final trade in the trade group
      const addBalance = addOpenClosePrice.map((tradeGroup) => {
        return {
          ...tradeGroup,
          balance: tradeGroup.trade[tradeGroup.trade.length - 1].balance,
        };
      });
      // Add side to each trade group based on the first trade in the trade group
      const addSide = addBalance.map((tradeGroup) => {
        // if the first trade in the trade group is BUY, set side to LONG, if SELL, set side to SHORT
        return {
          ...tradeGroup,
          side: tradeGroup.trade[0].side === "BUY" ? "LONG" : "SHORT",
        };
      });
      console.log("ADD SIDE", addSide);

      // Pull out trade array from each trade group
      const tradesArray = addSide.map((tradeGroup) => tradeGroup.trade);
      // flatten tradesArray
      const flattenedTrades = tradesArray.flat();
      console.log("FLATTENED TRADES", flattenedTrades);
      // Pull out id and userId from each trade group
      const tradeGroupForSubmit = addSide.map((tradeGroup) => {
        return {
          id: tradeGroup.id,
          balance: tradeGroup.balance,
          grossProfit: tradeGroup.grossProfit,
          netProfit: tradeGroup.netProfit,
          totalCommission: tradeGroup.totalCommission,
          winLoss: tradeGroup.winLoss,
          symbol: tradeGroup.symbol,
          openPrice: tradeGroup.openPrice,
          closePrice: tradeGroup.closePrice,
          dateOpened: tradeGroup.dateOpened,
          dateClosed: tradeGroup.dateClosed,
          userId: tradeGroup.userId,
          side: tradeGroup.side,
          accountId: tradeAccount.id,
          platform: 'ThinkOrSwim',
        };
      });
      console.log("TRADE GROUP IDS", tradeGroupForSubmit);
      console.log("PREVIOUS TRADES", previousTrades);
      console.log("PREVIOUS EXECUTIONS", previousExecutions);
      // Filter out trades that have already been submitted by comparing dateOpened and dateClosed to previousTrades
      const filteredTrades = tradeGroupForSubmit.filter((trade) => {
        return (
          !previousTrades.some(
            (prevTrade) =>
              prevTrade.dateOpened.toLocaleString() === trade.dateOpened.toLocaleString() &&
              prevTrade.dateClosed.toLocaleString() === trade.dateClosed.toLocaleString()
          )
        );
      });
      console.log("FILTERED TRADES", filteredTrades);
      // Filter out executions that have already been submitted by comparing dateTime to previousExecutions
      const filteredExecutions = flattenedTrades.filter((trade) => {
        return !previousExecutions.some(
          (prevExec) => prevExec.dateTime.toLocaleString() === trade.dateTime.toLocaleString()
        );
      });
      console.log("FILTERED EXECUTIONS", filteredExecutions);
      // Submit trades to database
      addTrades(filteredTrades);
      // Submit executions to database
      addExecutions(filteredExecutions);
      // if error, return toast.error
      if(tradeGroupForSubmit.length === 0) {
        toast.error('No trades found')
      }
    },
  });
};
