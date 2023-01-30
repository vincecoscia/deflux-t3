import React from "react";
import localFont from "@next/font/local";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const azonix = localFont({ src: "../styles/fonts/Azonix.woff2" });

export default function Navbar() {
  const [show, setShow] = React.useState(false);
  const [showMobile, setShowMobile] = React.useState(false);

  const { data: sessionData } = useSession();
  const router = useRouter();

  const isActive = (route: string) => {
    if (route === router.pathname) {
      return "text-white dark:text-white";
    } else {
      return "text-gray-500";
    }
  };

  const showOptions = () => {
    setShow(!show);
  };

  const showMobileOptions = () => {
    setShowMobile(!showMobile);
  };

  return (
    <nav className="flex w-full bg-gray-800 px-4 py-2">
      <div className="grid w-full grid-cols-3 items-center justify-items-center">
        <Link href="/" className="justify-self-start px-4 py-4">
          <h1 className={`${azonix.className} text-3xl text-white`}>
            Deflu<span className="text-primary">x</span>
          </h1>
        </Link>
        <div className="hidden text-gray-500 lg:flex">
          <Link href="/" className={`+ mr-10 ${isActive("/")}`}>
            Home
          </Link>
          <Link href="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
        </div>
        {sessionData && (
          <>
            <div className="relative mr-10 hidden justify-self-end lg:block">
              <div className="flex text-white">
                <button className="" onClick={() => showOptions()}>
                  <Image
                    src={sessionData.user?.image || "/default-avatar.png"}
                    alt="user image"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </button>
                <div className="ml-4 flex flex-col justify-center">
                  <h3 className="text-sm font-bold">
                    {sessionData.user?.name}
                  </h3>
                  <h4 className="text-sm">{sessionData.user?.email}</h4>
                </div>
              </div>
              {show && (
                <div className="absolute mt-2 flex w-48 flex-col rounded-md bg-gray-900 px-4 py-4 text-white shadow-xl">
                  <Link href="/dashboard" className="py-3">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="py-3">
                    Profile
                  </Link>
                  <Link href="/settings" className="mb-4 py-3">
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="rounded bg-primary px-4 py-2 text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Navigation */}
            <div className="lg:hidden col-span-2 justify-self-end">
              <button
                onClick={() => showMobileOptions()}
                className="flex flex-col items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
              {showMobile && (
                <div className={`h-screen fixed top-0 right-0 bottom-0 translate-x-full transition-transform ease-in-out duration-200 ${showMobile ? 'open' : ''} w-full p-5} z-50 bg-gray-900 text-white`}>
                  <div className="flex justify-between">
                    <div className="flex text-white">
                      <button className="" onClick={() => showOptions()}>
                        <Image
                          src={sessionData.user?.image || "/default-avatar.png"}
                          alt="user image"
                          width={50}
                          height={50}
                          className="rounded-full"
                         />
                       </button>
                      <div className="ml-4 flex flex-col justify-center">
                        <h3 className="text-sm font-bold">
                          {sessionData.user?.name}
                        </h3>
                        <h4 className="text-sm">{sessionData.user?.email}</h4>
                      </div>
                    </div>
                    <button className="px-4 cursor-pointer m:hidden" onClick={() => showMobileOptions()}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <Link href="/" className="py-3" onClick={() => showMobileOptions()}>
                      Home
                    </Link>
                    <Link href="/dashboard" className="py-3"  onClick={() => showMobileOptions()}>
                      Dashboard
                    </Link>
                    <Link href="/profile" className="py-3" onClick={() => showMobileOptions()}>
                      Profile
                    </Link>
                    <Link href="/settings" className="py-3" onClick={() => showMobileOptions()}>
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="rounded bg-primary px-4 py-2 text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {!sessionData && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="col-span-2 justify-self-end rounded bg-primary px-4 py-2 text-white lg:col-span-1 lg:mr-10"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
