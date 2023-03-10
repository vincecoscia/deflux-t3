import { useContext, useRef, useState } from "react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { ThinkOrSwim } from "./mixins/ThinkOrSwim";
import { TradingView } from "./mixins/TradingView";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TradeContext } from "../context/TradeContext";
import type { Trade, Execution, TradeAccount } from "@prisma/client";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { TradeAccountContext } from "../context/TradeAccountContext";

const ImportTrades = ({ user }) => {
  const [file, setFile] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [fileRef, setFileRef] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [previousTrades, setPreviousTrades] = useState<Trade[]>([]);
  const [previousExecutions, setPreviousExecutions] = useState<Execution[]>([]);
  const { trades, setTrades } = useContext(TradeContext);
  const { tradeAccounts, setTradeAccounts, refetchGlobalTradeAccounts } =
    useContext(TradeAccountContext);

    
  // Add many Executions
  const { mutate: addExecutions } =
    trpc.executionRouter.addExecutions.useMutation({
      onSuccess: (data) => {
        refetch();
        refetchGlobalTradeAccounts();
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // Add many Trades
  const { mutate: addTrades } = trpc.tradeRouter.addTrades.useMutation({
    onSuccess: (data) => {
      console.log(data);
      // create toast
      toast.success(data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
    onError: (error) => {
      console.log(error);
      // create toast
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
  });

  // Trade Account Creation
  const { mutate: addTradeAccount } =
    trpc.tradeAccountRouter.addTradeAccount.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // Trade Account Update
  const { mutate: updateTradeAccount } =
    trpc.tradeAccountRouter.updateTradeAccount.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // Get all trades
  const { data: tradeData, refetch } = trpc.tradeRouter.getTrades.useQuery(
    undefined,
    {
      onSuccess(tradeData) {
        setPreviousTrades(tradeData);
        setTrades(tradeData);
      },
    }
  );

  // Get all executions
  const { data: executionData } = trpc.executionRouter.getExecutions.useQuery(
    undefined,
    {
      onSuccess(executionData) {
        setPreviousExecutions(executionData);
      },
    }
  );

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files?.[0]);
    }
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
  };

  const handleAccountNameChange = (e) => {
    setAccountName(e.target.value);
  };

  const handleSubmit = async (e) => {
    // Parse file and send to server
    e.preventDefault();
    // console.log(e.target.platform.value)
    // CODE BELOW WORKS
    if (file === null || file === undefined) {
      console.log("No file uploaded");
      return;
    }
    const userId = user.id;
    if (platform === "ThinkOrSwim") {
      ThinkOrSwim(
        file,
        userId,
        addExecutions,
        addTrades,
        previousTrades,
        previousExecutions,
        tradeAccounts,
        addTradeAccount,
        accountName
      );
      // get return value from ThinkOrSwim and console.log it
      console.log("File parsed and uploaded to server");
    }

    if (file && platform === "TradingView") {
      const userId = user.id;
      TradingView(
        file,
        userId,
        addExecutions,
        addTrades,
        previousTrades,
        previousExecutions
      );
      console.log("File parsed and uploaded to server");
    }
  };

  return (
    <>
      <div className="my-3 ml-3 w-full overflow-y-scroll">
        <div className="mr-3 mb-24 lg:mb-0">
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Import Trades
          </h2>
          <p className="mt-2 text-gray-500">
            Upload locally saved files to add to your trading journal
          </p>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <select
                name="platform"
                id="platform"
                onChange={handlePlatformChange}
                placeholder="Financial Service"
                className="rounded border border-gray-700 bg-gray-800 py-2 px-4 pr-8 leading-tight text-white focus:border-gray-500 focus:bg-gray-700 focus:outline-none"
                defaultValue={"Select a Platform"}
              >
                <option value="Select a Platform" disabled>
                  Select a Platform
                </option>
                <option value="TD Ameritrade">TD Ameritrade</option>
                <option value="Robinhood">Robinhood</option>
                <option value="ThinkOrSwim">ThinkOrSwim</option>
                <option value="TradingView">TradingView</option>
              </select>
              <input
                type="text"
                onChange={handleAccountNameChange}
                placeholder="Account Name (Optional)"
                className="rounded border border-gray-700 bg-gray-800 py-2 px-4 pr-8 leading-tight text-white focus:border-gray-500 focus:bg-gray-700 focus:outline-none"
              />

              <label htmlFor="importFile">
                <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-500 py-10 text-gray-500">
                  {file ? (
                    <>
                      <div className="flex">
                        <Image
                          src="/csv-icon.png"
                          alt="CSV Icon"
                          width={50}
                          height={50}
                        />
                        <div className="flex flex-col ml-2">
                          <p className="text-white">{file?.name}</p>
                          <p className="text-gray-500">
                            {file?.size} bytes
                          </p>
                        </div>
                        <input
                        className="hidden"
                        type="file"
                        id="importFile"
                        ref={fileRef}
                        onChange={handleFileChange}
                        accept=".csv"
                      />

                      </div>
                      
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-gray-300 hover:cursor-pointer" />
                      <p className="mt-2">
                        <span className="text-white underline">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="underline">CSV Files Only</p>
                      <input
                        className="hidden"
                        type="file"
                        id="importFile"
                        ref={fileRef}
                        onChange={handleFileChange}
                        accept=".csv"
                      />
                    </>
                  )}
                </div>
              </label>

              <button
                className="rounded bg-primary px-4 py-2 text-white"
                type="submit"
              >
                Upload
              </button>
            </form>
            {/* Instructions go here */}
            <div className="mt-4 rounded-lg bg-gray-700 p-4 text-white lg:col-span-2 lg:ml-4 lg:mt-0">
              <h2 className="text-2xl font-semibold text-white">
                Instructions
              </h2>
              {platform === "" && (
                <p>
                  Select a platform from the dropdown menu to view instructions
                </p>
              )}
              {platform === "TD Ameritrade" && (
                <p>
                  To import trades from TD Ameritrade, you must first export
                  your trades from the platform. To do this, go to the Trade tab
                  and click on the &quot;Export&quot; button. Select
                  &quot;Export to CSV&quot; and save the file to your computer.
                  Then, upload the file using the form above.
                </p>
              )}
              {platform === "Robinhood" && (
                <p>
                  To import trades from Robinhood, you must first export your
                  trades from the platform. To do this, go to the Trade tab and
                  click on the &quot;Export&quot; button. Select &quot;Export to
                  CSV&quot; and save the file to your computer. Then, upload the
                  file using the form above.
                </p>
              )}
              {platform === "ThinkOrSwim" && (
                <p>
                  To import trades from ThinkOrSwim, you must first export your
                  trades from the platform. To do this, go to the Trade tab and
                  click on the &quot;Export&quot; button. Select &quot;Export to
                  CSV&quot; and save the file to your computer. Then, upload the
                  file using the form above.
                </p>
              )}
              {platform === "TradingView" && (
                <p>
                  To import trades from TradingView, you must first export your
                  trades from the platform. To do this, go to the Trade tab and
                  click on the &quot;Export&quot; button. Select &quot;Export to
                  CSV&quot; and save the file to your computer. Then, upload the
                  file using the form above.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportTrades;
