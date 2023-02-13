import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import { useState, useEffect, useContext } from "react";
import type { Trade, Execution, TradeTag, Tag } from "@prisma/client";
import { TradeContext } from "../../../context/TradeContext";
import { useRouter } from "next/router";
import { ChevronLeftIcon, XCircleIcon } from "@heroicons/react/24/solid";
import cuid from "cuid";
import ColorPicker from "../../../components/colorPicker";

const Trades: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [executions, setExecutions] = useState<Execution[] | null>(null);
  const [tags, setTags] = useState<Tag[] | []>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [tempTag, setTempTag] = useState<any>({});
  const [colorPickerClickedId, setColorPickerClickedId] = useState<string>("");
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);

  const utils = trpc.useContext();

  // get the trade id from the url and put it in tradeId
  const router = useRouter();
  const tradeId = router.query.id as string;

  // get userId from session
  const { data: sessionData } = useSession();

  // get the trade by using trpc
  const { data: tradeData } = trpc.tradeRouter.getTradeById.useQuery(
    { id: tradeId },
    {
      onSuccess(tradeData) {
        setTrade(tradeData);
        setExecutions(tradeData.executions);
      },
    }
  );

  // get tags by trade id and refetch after adding a tag

  const { data: tagData, refetch } = trpc.tagRouter.getTagsByTradeId.useQuery(
    { tradeId: tradeId },
    {
      onSuccess(tagData) {
        // pull out tags from each tradeTag and put them in an array
        const tags = tagData.map((tradeTag) => tradeTag.tag);
        setTags(tags);
      },
    }
  );

  const { mutate: addTagToTrade } = trpc.tradeRouter.addTagToTrade.useMutation({
    onSuccess() {
      refetch();
      setTagInput("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { tagId, tagName } = tempTag;
    addTagToTrade({ tradeId: tradeId, tagId: tagId, tagName: tagName });
    if (sessionData && sessionData.user) {
      // Only set tags if tag.name doesn't already exist
      if (!tags.find((tag) => tag.name === tagName)) {
        setTags([
          ...tags,
          { id: tagId, name: tagName, userId: sessionData?.user.id, color: "#18B4B7" },
        ]);
      }
    }
    setTempTag({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const trimmedTag = tagInput.trim();

    // On enter key press, add the tag and assign id to the the tag using cuid
    if (key === "Enter" && trimmedTag) {
      setTempTag({ tagId: cuid(), tagName: trimmedTag });
      setTagInput("");
    }
  };

  const { mutate: deleteTagFromTrade } =
    trpc.tagRouter.deleteTagFromTrade.useMutation({
      onSuccess(deletedTag) {
        console.log("DELETED TAG", deletedTag);
        setTagInput("");
        setTags(tags.filter((tag) => tag.id !== deletedTag.tagId));
      },
    });

    const { mutate: updateTagColor } = trpc.tagRouter.updateTagColor.useMutation({
      onSuccess(updatedTag) {
        console.log("UPDATED TAG", updatedTag);
        setTagInput("");
        setTags(tags.map((tag) => {
          if (tag.id === updatedTag.id) {
            return updatedTag;
          }
          return tag;
        }));
      },
    });

  const handleColorClick = (e: React.MouseEvent<HTMLButtonElement>, tagId) => {
    e.preventDefault();
    // Only open the colorPicker for the tag that was clicked
    if (colorPickerClickedId === tagId) {
      setColorPickerActive(!colorPickerActive);
    } else {
      setColorPickerActive(true);
    }
    setColorPickerClickedId(tagId);
  };

  console.log(tags);

  return (
    <>
      <Head>
        <title>Deflux Dashboard</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-[calc(100vh-84px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 text-white">
            {/* Create next Link that goes back to previous page */}

            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center text-sm"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">Back</span>
            </button>
            {/* Data here */}
            {trade && sessionData && (
              <>
                <div className="mb-3 flex">
                  <div>
                    <h3 className="text-2xl text-primary">{trade?.symbol}</h3>
                    <p className="text-sm text-gray-500">Full name of stock</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-200">Summary</p>
                  <div className="mt-1 mb-4 flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow sm:rounded-lg">
                          <table className="w-full">
                            <thead className="rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white">
                              <tr>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Symbol
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Platform
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Side
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Net Profit
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Commission
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Open Date
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Close Date
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="rounded-b-lg bg-gray-800">
                              <tr className="border-b border-gray-700 bg-gray-800 px-2 py-3 last:rounded-b-lg last:border-0 dark:text-white">
                                <td className="whitespace-nowrap px-6 py-4">
                                  {trade.symbol}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {trade.platform}
                                </td>
                                <td
                                  className={`whitespace-nowrap px-6 py-4 ${
                                    trade.side === "LONG"
                                      ? "text-green-500"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.side}
                                </td>
                                <td
                                  className={`whitespace-nowrap px-6 py-4 ${
                                    trade.netProfit >= 0
                                      ? "text-green-500"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.netProfit}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-red-600">
                                  {trade.totalCommission}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {new Date(trade.dateOpened).toLocaleString(
                                    "en-US",
                                    {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    }
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {new Date(trade.dateClosed).toLocaleString(
                                    "en-US",
                                    {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    }
                                  )}
                                </td>
                                <td
                                  className={`whitespace-nowrap px-6 py-4 ${
                                    trade.winLoss === "WIN"
                                      ? "text-green-500"
                                      : "text-red-600"
                                  }`}
                                >
                                  {trade.winLoss}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm uppercase text-gray-200">Executions</p>
                  <div className="mt-1 mb-4 flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden shadow sm:rounded-lg">
                          <table className="w-full">
                            <thead className="rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white">
                              <tr>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Action
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Date
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Time
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Price
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Quantity
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Commission
                                </th>
                                <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                                  Return
                                </th>
                              </tr>
                            </thead>
                            <tbody className="rounded-b-lg bg-gray-800">
                              {executions?.map((execution) => (
                                <tr
                                  key={execution.id}
                                  className="border-b border-gray-700 bg-gray-800 px-2 py-3 last:rounded-b-lg last:border-0 dark:text-white"
                                >
                                  <td
                                    className={`whitespace-nowrap px-6 py-4 ${
                                      execution.side === "BUY"
                                        ? "text-green-500"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {execution.side}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {new Date(
                                      execution.dateTime
                                    ).toLocaleString("en-US", {
                                      dateStyle: "short",
                                    })}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {new Date(
                                      execution.dateTime
                                    ).toLocaleString("en-US", {
                                      timeStyle: "short",
                                    })}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {execution.price}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {execution.quantity}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-red-600">
                                    {execution.commission}
                                  </td>
                                  <td
                                    className={`whitespace-nowrap px-6 py-4 ${
                                      execution.return === null
                                        ? "text-white"
                                        : execution.return >= 0
                                        ? "text-green-500"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {execution.return
                                      ? execution.return
                                      : "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm uppercase text-gray-200">Tags</p>
                  <div className="mt-1 mb-4">
                    <div className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-gray-200">
                      {tags?.map((tag) => (
                        <>
                          <span
                            key={tag.id}
                            onClick={() => {
                              setColorPickerActive(!colorPickerActive);
                              setColorPickerClickedId(tag.id);
                            }}
                            className={`relative mr-2 inline-flex cursor-pointer items-center rounded-full px-3 py-0.5 text-sm font-medium text-white`}
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                            <button
                              type="button"
                              className="-mr-1 ml-2 flex items-center justify-center rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                              onClick={() =>
                                deleteTagFromTrade({ tradeId, tagId: tag.id })
                              }
                            >
                              <span className="sr-only">Dismiss</span>
                              <XCircleIcon
                                className="h-5 w-5 text-white"
                                aria-hidden="true"
                              />
                            </button>
                            {
                              // Only open ColorPicker for the tag that was clicked
                              colorPickerActive &&
                              colorPickerClickedId === tag.id ? (
                                <ColorPicker
                                  color={tag.color}
                                  tagId={tag.id}
                                  updateTagColor={updateTagColor}
                                />
                              ) : null
                            }
                          </span>
                        </>
                      ))}
                      <form onSubmit={handleSubmit} className="inline-block">
                        <input
                          type="text"
                          className="mr-3 appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-200 focus:outline-none"
                          placeholder="Add a tag"
                          value={tagInput}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setTagInput(e.target.value)}
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Trades;
