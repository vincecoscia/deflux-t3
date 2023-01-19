import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '../utils/trpc'
import { ThinkOrSwim } from './mixins/ThinkOrSwim'

export default function ImportTrades() {
  const [file, setFile] = useState(null); // TODO: Type this better
  const [platform, setPlatform] = useState('TD Ameritrade'); // TODO: Type this better

  const { data: sessionData } = useSession();

  const {mutate: uploadTrades} = trpc.tradeRouter.uploadTrades.useMutation({
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const {mutate: addTradeGroup } = trpc.tradeGroupRouter.addTradeGroup.useMutation({
    onSuccess: (data) => {
      console.log(data)
    }
  })


  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files?.[0]);
    }
  }

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
}

  const handleSubmit = async (e) => {
    // Parse file and send to server
    e.preventDefault();
    // console.log(e.target.platform.value)
    // CODE BELOW WORKS
    if(file === null || file === undefined) {
        console.log('No file uploaded')
        return
    }
    if (file && platform === 'ThinkOrSwim') {
      const userId = sessionData.user.id
      ThinkOrSwim(file, userId, uploadTrades, addTradeGroup)
    } else {
        console.log('File not uploaded or wrong platform selected')
    }
  }

  return (
    <>
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
    </>
  );
}
