import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";
import { trpc } from "../../../utils/trpc";
import SideNav from "../../../components/SideNav";
import { useState, useRef, useContext, useEffect } from "react";
import type { Trade, Execution, TradeTag, Tag } from "@prisma/client";
import { useRouter } from "next/router";
import {
  ChevronLeftIcon,
  XCircleIcon,
  ArrowUpTrayIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import OutsideClickHandler from 'react-outside-click-handler';
import cuid from "cuid";
import ColorPicker from "../../../components/colorPicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import ScreenshotModal from "../../../components/ScreenshotModal";
import { TradeContext } from "../../../context/TradeContext";
import Link from "next/link";
import { AnalyticsContext } from "../../../context/AnalyticsContext";

const IndividualTrade: NextPage = () => {
  const { trades } = useContext(TradeContext);
  const { refetchTagAnalytics } = useContext(AnalyticsContext);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [executions, setExecutions] = useState<Execution[] | null>(null);
  const [tags, setTags] = useState<Tag[] | []>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [tempTag, setTempTag] = useState<any>({});
  const [userTags, setUserTags] = useState<Tag[] | []>([]);
  const [suggestedTags, setSuggestedTags] = useState<Tag[] | []>([]);
  const [colorPickerClickedId, setColorPickerClickedId] = useState<string>("");
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [presignedData, setPresignedData] = useState<any>(null);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState<boolean>(false);
  const [screenshotClickedId, setScreenshotClickedId] = useState<string>("");
  const [screenshots, setScreenshots] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [nextTrade, setNextTrade] = useState<Trade | null>(null);
  const [prevTrade, setPrevTrade] = useState<Trade | null>(null);

  useEffect(() => {
    if (trade) {
      getNextTrade();
      getPrevTrade();
      // Set suggested tags 
      setSuggestedTags(userTags.filter((tag) => {
        // Only show 5 suggested tags
        return tag.name.toLowerCase().includes(tagInput.toLowerCase());
      }));
    }
  }, [trade, userTags, tagInput]);

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
        setNotes(tradeData.notes ? tradeData.notes : "");
        getNextTrade();
      },
    }
  );
  // get tags
  const { data: userTagsData, refetch: refetchUserTags } = trpc.tagRouter.getTags.useQuery(
    undefined,
    {
      onSuccess(userTagsData) {
        setUserTags(userTagsData);
      },
    }
  );

  // get tags by trade id and refetch after adding a tag
  const { data: tagData, refetch: refetchTags } = trpc.tagRouter.getTagsByTradeId.useQuery(
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
      refetchTags();
      refetchUserTags();
      refetchTagAnalytics();
      setTagInput("");
    },
    onError(error) {
      // Create a toast to show error
      toast.error("Tag already added to trade!", {
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
          {
            id: tagId,
            name: tagName,
            userId: sessionData?.user.id,
            color: "#18B4B7",
            updatedAt: new Date(),
            createdAt: new Date()
          },
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
      refetchUserTags();
      setTagInput("");
      setTags(
        tags.map((tag) => {
          if (tag.id === updatedTag.id) {
            return updatedTag;
          }
          return tag;
        })
      );
    },
  });

  const { mutateAsync: createPresignedUrl } =
    trpc.imageRouter.createPresignedUrl.useMutation({
      onSuccess(presignedStuff) {
        setPresignedData(presignedStuff);
      },
    });

  const { data: screenshotsData, refetch: refetchScreenshots } =
    trpc.imageRouter.getImagesForTrade.useQuery(
      { tradeId: tradeId },
      {
        onSuccess(screenshotsData) {
          setScreenshots(screenshotsData);
        },
      }
    );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.currentTarget.files?.[0]);
  };

  const handleScreenshotSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);

    const { url, fields } = (await createPresignedUrl({
      tradeId: tradeId,
    })) as any;

    console.log("PRESIGNED DATA", presignedData);

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    // await fetch(url, {
    //   method: 'POST',
    //   body: formData,
    // });
    const options = {
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        // eslint-disable-next-line prefer-const
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        if (percent < 100) {
          setUploadProgress(percent);
        }
      },
    };

    await axios.post(url, formData, options);

    setFile(null);
    setIsUploading(false);
    refetchScreenshots();
  };

  const { mutate: deleteScreenshotFromTrade } =
    trpc.imageRouter.deleteScreenshotFromTrade.useMutation({
      onSuccess(deletedScreenshot) {
        console.log("DELETED SCREENSHOT", deletedScreenshot);
        refetchScreenshots();
      },
    });

  const { mutate: updateTradeWithNotes } =
    trpc.tradeRouter.updateTradeWithNotes.useMutation({
      onSuccess() {
        toast.success("Notes updated!", {
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
      onError(error) {
        toast.error("Only 500 characters allowed", {
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

  const handleNotesSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateTradeWithNotes({
      id: tradeId,
      notes: notes,
    });
  };

  const getNextTrade = async () => {
    // get next trade by using the current trade's index in the trades array
    if (!trades) return;
    if (!trade) return;

    // get id out of trade
    const { id } = trade;

    // get array of trade ids
    const tradeIds = trades.map((trade) => trade.id);

    // find current trade index in trades array by comparing trade.id
    const index = tradeIds.indexOf(id);

    // set next trade to the trade at the next index
    const nextTrade = trades[index - 1];

    if (nextTrade) {
      setNextTrade(nextTrade);
    }
  };

  const getPrevTrade = async () => {
    // get next trade by using the current trade's index in the trades array
    if (!trades) return;
    if (!trade) return;

    // get id out of trade
    const { id } = trade;

    // get array of trade ids
    const tradeIds = trades.map((trade) => trade.id);

    // find current trade index in trades array by comparing trade.id
    const index = tradeIds.indexOf(id);

    // set next trade to the trade at the next index
    const prevTrade = trades[index + 1];

    if (prevTrade) {
      setPrevTrade(prevTrade);
    }
  };

  console.log("NEXT TRADE", nextTrade);


  return (
    <>
      <Head>
        <title>Deflux Dashboard</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 mb-24 text-white lg:mb-3">
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
                    <div className="lg:rounded-md lg:border lg:border-gray-700 lg:bg-gray-800 lg:px-2 lg:py-1 text-gray-200">
                      {tags?.map((tag) => (
                        <>
                          <span
                            key={tag.id}
                            onClick={() => {
                              setColorPickerActive(!colorPickerActive);
                              setColorPickerClickedId(tag.id);
                            }}
                            className={`relative mr-2 inline-flex cursor-pointer items-center rounded-full px-3 py-0.5 text-sm font-medium text-white my-1`}
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
                                <OutsideClickHandler
                                  onOutsideClick={() =>
                                    setColorPickerActive(false)
                                  }
                                >
                                <ColorPicker
                                  color={tag.color}
                                  tagId={tag.id}
                                  updateTagColor={updateTagColor}
                                />
                                </OutsideClickHandler>
                              ) : null
                            }
                          </span>
                        </>
                      ))}
                      <form onSubmit={handleSubmit} className="lg:inline-block w-full lg:w-auto relative">
                        <input
                          type="text"
                          className="mr-3 lg:mt-0 appearance-none lg:border-none lg:bg-transparent lg:py-1 lg:px-2 leading-tight text-gray-200 lg:focus:outline-none border border-gray-700 bg-gray-800 rounded-md mt-4 w-full p-2"
                          placeholder="Add a tag"
                          value={tagInput}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setTagInput(e.target.value)}
                        />
                        {tagInput && (
                          <div className="p-2 bg-gray-700 rounded-md absolute lg:top-12 top-16 z-20">
                            <p className="text-sm mb-2 text-gray-400">Suggestions</p>
                            {suggestedTags?.map((suggestion) => (
                              <button
                                key={suggestion.id}
                                type="button"
                                className={`relative mr-2 inline-flex cursor-pointer items-center rounded-full px-3 py-0.5 text-sm font-medium text-white my-1`}
                                style={{ backgroundColor: suggestion.color }}
                                onClick={() => {
                                  addTagToTrade({
                                    tradeId,
                                    tagId: suggestion.id,
                                    tagName: suggestion.name,
                                  });
                                  setTagInput("");
                                }}
                              >
                                {suggestion.name}
                              </button>
                            ))}
                          </div>
                      )}
                      </form>
                    </div>
                  </div>
                  <div className="mb-4 flex w-full flex-col justify-between lg:flex-row">
                    <p className="text-sm uppercase text-gray-200">
                      Screenshots
                    </p>
                    <p className="text-xs text-gray-500">
                      Limited to 3 per trade
                    </p>
                  </div>
                  <div className="mt-1 mb-4">
                    <div className="flex flex-col gap-x-4 gap-y-3 lg:flex-row lg:gap-y-0">
                      {screenshots?.map((screenshot) => (
                        <>
                          <div
                            key={screenshot.id}
                            className="group relative h-full w-full hover:cursor-pointer hover:bg-blend-overlay lg:h-32 lg:w-48"
                            onClick={() => {
                              setScreenshotClickedId(screenshot.id);
                              setScreenshotModalOpen(!screenshotModalOpen);
                            }}
                          >
                            <Image
                              src={screenshot.url}
                              alt="Screenshot"
                              className="h-full w-full rounded-lg object-cover"
                              width={150}
                              height={100}
                            />
                            <div className="invisible absolute top-0 right-0 z-20 group-hover:visible">
                              <button
                                type="button"
                                className="inline-flex items-center rounded-full border border-transparent bg-red-600 p-1 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() =>
                                  deleteScreenshotFromTrade({
                                    tradeId,
                                    imageId: screenshot.id,
                                  })
                                }
                              >
                                <XCircleIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Dismiss</span>
                              </button>
                            </div>
                          </div>
                          {screenshotClickedId === screenshot.id && (
                            <ScreenshotModal
                              url={screenshot.url}
                              setScreenshotModalOpen={setScreenshotModalOpen}
                              open={screenshotModalOpen}
                            />
                          )}
                        </>
                      ))}
                      {screenshots.length < 3 && (
                        <form
                          onSubmit={handleScreenshotSubmit}
                          className="w-full lg:w-48"
                        >
                          <div className="mb-10 inline-block h-32 w-full rounded-lg border border-dashed border-gray-700 lg:mb-2 lg:w-48">
                            <label htmlFor="uploadImage">
                              <div className="flex h-full w-full flex-col items-center justify-center">
                                <ArrowUpTrayIcon className="mx-auto h-8 w-8 text-gray-400 hover:cursor-pointer" />
                                <input
                                  type="file"
                                  id="uploadImage"
                                  ref={fileRef}
                                  className="hidden"
                                  placeholder="Add a screenshot"
                                  onChange={onFileChange}
                                />
                                {!file && (
                                  <span className="mt-2 text-center text-xs hover:cursor-pointer">
                                    Click to add an image
                                  </span>
                                )}
                                {file && (
                                  <span className="mt-2 text-center text-xs">
                                    {file.name}
                                  </span>
                                )}
                                {file && isUploading && (
                                  <div className="mt-2 h-2.5 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      className="h-2.5 rounded-full bg-blue-600"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                          {file && !isUploading && (
                            <button
                              type="submit"
                              className='mt-2 w-full rounded-lg bg-primary py-2 text-white'
                            >
                              Upload
                            </button>
                          )}
                          
                        </form>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 flex w-full flex-col justify-between lg:flex-row">
                    <p className="text-sm uppercase text-gray-200">Notes</p>
                    <p className="text-xs text-gray-500">
                      <span
                        className={`${
                          notes.length > 500 ? "text-red-600" : ""
                        }`}
                      >
                        {notes.length}
                      </span>
                      /500
                    </p>
                  </div>
                  <div className="mt-1 mb-4">
                    <form onSubmit={handleNotesSubmit}>
                      <textarea
                        className="h-32 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-gray-200 focus:border-primary focus:ring-0"
                        placeholder="Add notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="mt-2 w-full rounded-lg bg-primary py-2 text-white lg:w-auto lg:px-4"
                      >
                        Save Note
                      </button>
                    </form>
                  </div>
                  <div className="mt-8 flex w-full lg:justify-center lg:gap-x-8 justify-between">
                    <Link href={`/dashboard/trades/${prevTrade ? prevTrade.id : trade.id}`}>
                      <button
                        type="button"
                        className={`flex items-center text-primary ${prevTrade === null ? "opacity-50" : prevTrade.id === trade.id ? "opacity-50" : null}`}
                      >
                        <ChevronLeftIcon className="h-6 w-6" />Previous Trade 
                      </button>
                    </Link>
                    <Link href={`/dashboard/trades/${nextTrade ? nextTrade.id : trade.id}`}>
                      <button
                        type="button"
                        className={`flex items-center text-primary ${nextTrade === null ? "opacity-50" : nextTrade.id === trade.id ? "opacity-50" : null}`}
                      >
                        Next Trade <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </Link>
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

export default IndividualTrade;
