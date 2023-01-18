import React from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { trpc } from '../utils/trpc'

import SideNav from '../components/SideNav'


export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);

  const { data: sessionData } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.target.files?.[0]);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();
      if (file) {
          formData.append('file', file);
          try {
              const { data } = await trpc.useMutation('uploadFile').mutateAsync(formData);
              console.log(data);
              // do something with the server response
          } catch (error) {
              // handle error
          }
      }
  }
  

  return (
    <>
      {/* If not logged in, can't view page */}
      {!sessionData && (
        // Redirect to login page
        <main className="dark:bg-gray-900 h-screen">
            <h1 className="text-white text-3xl pt-64 mx-auto w-full">Must be logged in to view this page</h1>
        </main>
      )}
      {/* If logged in, show page */}
      {sessionData && (
      <main className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <SideNav />
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <select name="platform" id="platform">
                <option value="binance">TD Ameritrade</option>
                <option value="coinbase">Robinhood</option>
                <option value="coinbase">ThinkOrSwim</option>
                <option value="coinbase">TradingView</option>
            </select>
            <label className="text-white" htmlFor="file">Upload a file</label>
            <input className="text-white" type="file" onChange={handleFileChange} />
            <button className="px-4 py-2 bg-primary text-white rounded" type="submit">Upload</button>
        </form>
      </main>
      )}
    </>
  );
}
