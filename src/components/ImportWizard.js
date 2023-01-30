import { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ThinkOrSwim } from "./mixins/ThinkOrSwim";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ImportTrades() {
  const [file, setFile] = useState(null); // TODO: Type this better
  const [platform, setPlatform] = useState("TD Ameritrade"); // TODO: Type this better
  const [previousTrades, setPreviousTrades] = useState([]);
  const [previousExecutions, setPreviousExecutions] = useState([]);

  const { data: sessionData } = useSession();

  const { mutate: addExecutions } =
    trpc.executionRouter.addExecutions.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      }
    });

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
    }
  });

  const { data: tradeData } = trpc.tradeRouter.getTrades.useQuery(
    undefined,
    {
      onSuccess(tradeData) {
        setPreviousTrades(tradeData);
      },
    }
  );

  const { data: executionData } =
  trpc.executionRouter.getExecutions.useQuery(undefined, {
    onSuccess(executionData) {
      setPreviousExecutions(executionData);
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files?.[0]);
    }
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
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
    if (file && platform === "ThinkOrSwim") {
      const userId = sessionData.user.id;
      ThinkOrSwim(file, userId, addExecutions, addTrades, previousTrades, previousExecutions);
      // get return value from ThinkOrSwim and console.log it
      console.log("File uploaded and parsed");
    } else {
      console.log("File not uploaded or wrong platform selected");
    }
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <select name="platform" id="platform" onChange={handlePlatformChange}>
          <option value="TD Ameritrade">TD Ameritrade</option>
          <option value="Robinhood">Robinhood</option>
          <option value="ThinkOrSwim">ThinkOrSwim</option>
          <option value="TradingView">TradingView</option>
        </select>
        <label className="text-white" htmlFor="file">
          Upload a file
        </label>
        <input className="text-white" type="file" onChange={handleFileChange} />
        <button
          className="rounded bg-primary px-4 py-2 text-white"
          type="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
}
