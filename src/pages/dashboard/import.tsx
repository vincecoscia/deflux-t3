import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { parse } from "papaparse";

import { trpc } from "../../utils/trpc";
import SideNav from "../../components/SideNav";

const Import: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<string>('TD Ameritrade'); // TODO: Type this better

  const { data: sessionData } = useSession();

  const {mutate: uploadTrades} = trpc.tradeRouter.uploadTrades.useMutation({
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files?.[0]);
    }
     
      console.log("HEY",file)
  }

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(e.target.value);
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Parse file and send to server
    e.preventDefault();
    // console.log(e.target.platform.value)
    // CODE BELOW WORKS
    if(file === null || file === undefined) {
        console.log('No file uploaded')
        return
    }
    if (file && platform === 'ThinkOrSwim') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        parse(file, {
          beforeFirstChunk: (chunk: string | string[]) => {
            // Only parse after the row with 'Account Trade History' in it
            const start = chunk.indexOf('DATE');
            const end = chunk.indexOf('Futures Statements');
            
            return chunk.slice(start, end);
            
          },
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          chunk: (results: { data: any[]; }) => {
            // Find all where TYPE === 'TRD'
            const trades = results.data.filter((row: any) => row.TYPE === 'TRD');
            // clean trades
            const cleanedTrades = trades.map((trade: any) => {
              let commission = 0;
              // combine commissions and fees
              commission = (trade["Commissions & Fees"] + trade["Misc Fees"])
              // deconstruct trade.DESCRIPTION and pull out symbol, side, price, and quantity
              const description = trade.DESCRIPTION.split(' ');
              const side = description[0] === 'BOT' ? 'BUY' : 'SELL';
              // remove + from quantity
              const quantity = Number(description[1].replace('+', ''));
              // remove everything after the :
              const symbol = description[2].split(':')[0];
              // remove everything before the @ and convert to number
              const price = Number(description[3].split('@')[1]);

              const dateTime = new Date(trade.DATE + ' ' + trade.TIME);

              return {
                symbol,
                quantity,
                price,
                commission,
                side,
                return: trade.AMOUNT,
                platform: 'ThinkOrSwim',
                dateTime,
                userId: sessionData?.user?.id || 'test',
              };
            });
            uploadTrades(cleanedTrades);
          },

        });
    } else {
        console.log('File not uploaded or wrong platform selected')
    }
    // CODE ABOVE WORKS
  }

  console.log('FUCK', file);
  

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
      {/* If not logged in, can't view page */}
      {!sessionData && (
        <main className="dark:bg-gray-900 h-[calc(100vh-84px)] flex justify-center items-center">
            <h1 className="text-white text-3xl">Must be logged in to view this page</h1>
        </main>
      )}
      {/* If logged in, show page */}
      {sessionData && (
      <main className="flex h-[calc(100vh-84px)] bg-white dark:bg-gray-900">
        <SideNav />
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <select name="platform" id="platform" onChange={handlePlatformChange}>
                <option value="TD Ameritrade">TD Ameritrade</option>
                <option value="Robinhood">Robinhood</option>
                <option value="ThinkOrSwim">ThinkOrSwim</option>
                <option value="TradingView">TradingView</option>
            </select>
            <label className="text-white" htmlFor="file">Upload a file</label>
            <input className="text-white" type="file" onChange={handleFileChange} />
            <button className="px-4 py-2 bg-primary text-white rounded" type="submit">Upload</button>
        </form>
      </main>
      )}
    </>
  );
};

export default Import;
