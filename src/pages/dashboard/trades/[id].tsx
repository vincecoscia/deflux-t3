import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import { useState, useRef } from "react";
import type { Trade, Execution, TradeTag, Tag } from "@prisma/client";
import { useRouter } from "next/router";
import { ChevronLeftIcon, XCircleIcon, ArrowUpTrayIcon  } from "@heroicons/react/24/solid";
import cuid from "cuid";
import ColorPicker from "../../../components/colorPicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ScreenshotModal from "../../../components/ScreenshotModal";

const Trades: NextPage = () => {
  const [trade, setTrade] = useState<Trade | null>(null);
  const [executions, setExecutions] = useState<Execution[] | null>(null);
  const [tags, setTags] = useState<Tag[] | []>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [tempTag, setTempTag] = useState<any>({});
  const [colorPickerClickedId, setColorPickerClickedId] = useState<string>("");
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [presignedData, setPresignedData] = useState<any>(null);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState<boolean>(false);
  const [screenshotClickedId, setScreenshotClickedId] = useState<string>("");
  const [screenshots, setScreenshots] = useState<any>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  // const utils = trpc.useContext();

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
    onError(error) {
      // Create a toast to show error
      toast.error('Tag already added to trade!', {
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

    const { mutateAsync: createPresignedUrl } = trpc.imageRouter.createPresignedUrl.useMutation({
      onSuccess(presignedStuff) {
        setPresignedData(presignedStuff);
      },
    });

    const { data: screenshotsData, refetch: refetchScreenshots }= trpc.imageRouter.getImagesForTrade.useQuery(
      {tradeId: tradeId},
      {
        onSuccess(screenshotsData) {
          setScreenshots(screenshotsData);
        },
      }
    );

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.currentTarget.files?.[0]);
    };

    const handleScreenshotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;

      const { url, fields } = await createPresignedUrl({tradeId: tradeId}) as any;

      console.log("PRESIGNED DATA", presignedData);

      const data = {
        ...fields,
        'Content-Type': file.type,
        file,
      }
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      await fetch(url, {
        method: 'POST',
        body: formData,
      });
      setFile(null)
      refetchScreenshots();
    }

    const { mutate: deleteScreenshotFromTrade } = trpc.imageRouter.deleteScreenshotFromTrade.useMutation({
      onSuccess(deletedScreenshot) {
        console.log("DELETED SCREENSHOT", deletedScreenshot);
        setScreenshots(screenshots.filter((screenshot) => screenshot.id !== deletedScreenshot.id));
      },
    });

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
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 text-white mb-24 lg:mb-3">
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
                  <div className="w-full flex justify-between flex-col lg:flex-row mb-4">
                    <p className="text-sm uppercase text-gray-200">Screenshots</p>
                    <p className='text-xs text-gray-500'>Limited to 3 per trade</p>
                  </div>
                  <div className="mt-1 mb-4">
                    <div className="flex gap-x-4 gap-y-3 lg:gap-y-0 flex-col lg:flex-row">
                      {screenshots?.map((screenshot) => (
                        <>
                        <div
                          key={screenshot.id}
                          className="lg:w-48 lg:h-32 w-full h-full hover:bg-blend-overlay hover:cursor-pointer relative group"
                          onClick={() => {
                            setScreenshotClickedId(screenshot.id);
                            setScreenshotModalOpen(!screenshotModalOpen)}}
                        >
                          <Image
                            src={screenshot.url}
                            alt="Screenshot"
                            className="h-full w-full object-cover rounded-lg"
                            width={640}
                            height={480}
                          />
                          <div className="absolute top-0 right-0 invisible group-hover:visible z-20">
                            <button
                              type="button"
                              className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() =>
                                deleteScreenshotFromTrade({
                                  tradeId,
                                  imageId: screenshot.id,
                                })
                              }
                            >
                              <XCircleIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Dismiss</span>
                            </button>
                          </div>
                        </div>
                        {screenshotClickedId === screenshot.id && (
                        <ScreenshotModal url={screenshot.url} setScreenshotModalOpen={setScreenshotModalOpen} open={screenshotModalOpen}/>
                        )}
                        </>
                      ))}
                      {screenshots.length < 3 && (
                      <form onSubmit={handleScreenshotSubmit} className="inline-block w-48 h-32 border border-dashed border-gray-700 rounded-lg">
                        <label htmlFor="uploadImage">
                          <div className="flex flex-col items-center justify-center h-full w-full">
                          <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto hover:cursor-pointer" />
                          <input
                            type="file"
                            id="uploadImage"
                            ref={fileRef}
                            className="hidden"
                            placeholder="Add a screenshot"
                            onChange={onFileChange}
                          />
                          {!file && <span className='text-xs text-center mt-2 hover:cursor-pointer'>Click to add an image</span>}
                          {file && <span className='text-xs text-center mt-2'>{file.name}</span>}
                          </div>
                        </label>
                        {file && (
                        <button
                          type="submit"
                          className="w-full py-2 bg-primary text-white rounded-lg mt-2"
                        >
                          Upload
                        </button>
                      )}
                      </form>
                      )}
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
