import { parse } from "papaparse";
import cuid from 'cuid';
import { toast } from "react-toastify";
import { parse as dateParse } from "date-fns";

export const TradingView = async (
  file,
  userId,
  addExecutions,
  addTrades,
  previousTrades,
  previousExecutions
) => {
  await parse(file, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true,
    chunk: (results) => {
      console.log("IMPORT RESULTS", results);
      // Results are executions from TradingView
      // Format the data to match the execution schema
      const executions = results.data.map((execution) => {

        // if commission is not present, set it to 0
        if (!execution.Commission) {
          execution.Commission = 0;
        }

        // Turn commission into a number
        execution.Commission = Number(execution.Commission);

        // Convert QTY to a number, if it has a space in it, remove it
        if (execution.Qty.includes("Â")) {
          execution.Qty = Number(execution.Qty.split("Â")[0]);
        } else {
          execution.Qty = Number(execution.Qty);
        }



        return {
          id: cuid(),
          userId: userId,
          platform: "TradingView",
          symbol: execution.Symbol,
          quantity: execution.Qty,
          price: execution.Price,
          commission: Number(execution.Commission.toFixed(2)),
          dateTime: new Date(execution.Time),
          type: execution.Type,
          side: execution.Side,
        };
      }

      // Add the executions to the database

      );
      console.log("EXECUTIONS", executions);
    }
  });
};