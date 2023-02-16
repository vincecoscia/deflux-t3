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

  const isActiveLink = (route: string) => {
    if (route === router.pathname) {
      return "text-primary dark:text-primary bg-primary/10 dark:bg-primary/10";
    } else {
      return "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";
    }
  };

  const isActiveSVG = (route: string) => {
    if (route === router.pathname) {
      return "text-primary dark:text-primary";
    } else {
      return "group-hover:text-gray-900 text-gray-400 dark:text-gray-400 dark:group-hover:text-white";
    }
  };

  console.log("PATHNAME", router.pathname)

  return (
    <nav className={`flex w-full px-4 py-2 z-20 ${router.pathname == "/" || router.pathname == "/pricing" || router.pathname == "/about" ? "fixed top-0" : "bg-gray-800"}`}>
      <div className="grid w-full grid-cols-3 items-center justify-items-center">
        <Link href="/" className="justify-self-start ml-2 mt-2">
          <h1 className={`deflux text-3xl text-white`}>
            Deflu<span className="text-primary">x</span>
          </h1>
        </Link>
        {router.pathname == "/" || router.pathname == "/pricing" || router.pathname == "/about" ? (
        <div className="hidden text-gray-500 lg:flex">
          <Link href="/" className={`mr-10 ${isActive("/")}`}>
            Home
          </Link>
          <Link href="/pricing" className={`mr-10 ${isActive("/pricing")}`}>
            Pricing
          </Link>
          <Link href="/about" className={isActive("/about")}>
            About
          </Link>
        </div>
        ) : null}
        {sessionData && (
          <>
            <div className={`relative mr-10 hidden justify-self-end lg:block ${router.pathname == "/" || router.pathname == "/pricing" || router.pathname == "/about" ? "" : "col-span-2"}`}>
              <div className="flex text-white">
                <button className="" onClick={() => showOptions()}>
                  <Image
                    src={sessionData.user?.image || "/default-avatar.png"}
                    alt="user image"
                    width={50}
                    height={50}
                    className="rounded-full w-10 h-10 border border-white"
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
            <div className="col-span-2 justify-self-end lg:hidden">
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
              {/* MOBILE MENU */}
              <>
                {showMobile && <div className="site-navbar-backdrop"></div>}
                <div
                  className={`site-navbar ${
                    showMobile ? "open" : ""
                  } z-50 w-full bg-gray-900 p-5 text-white`}
                >
                  <div className="flex justify-end">
                    <button
                      className="m:hidden cursor-pointer px-4"
                      onClick={() => showMobileOptions()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {sessionData && (
                    <>
                      <div className="flex h-full flex-col justify-between">
                        <div>
                        <ul className="mt-4 space-y-2">
                          <li>
                            <Link
                              onClick={() => showMobileOptions()}
                              href="/dashboard"
                              className={
                                "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                isActiveLink("/dashboard")
                              }
                            >
                              <svg
                                aria-hidden="true"
                                className={
                                  "h-6 w-6 transition duration-75" +
                                  isActiveSVG("/dashboard")
                                }
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                              </svg>
                              <span className="ml-3">Overview</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => showMobileOptions()}
                              href="/dashboard/trades"
                              className={
                                "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                isActiveLink("/dashboard/trades")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={
                                  "h-6 w-6 transition duration-75" +
                                  isActiveSVG("/dashboard/trades")
                                }
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                />
                              </svg>

                              <span className="ml-3">Journal</span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              onClick={() => showMobileOptions()}
                              href="/dashboard/calendar"
                              className={
                                "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                isActiveLink("/dashboard/calendar")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={
                                  "h-6 w-6 transition duration-75" +
                                  isActiveSVG("/dashboard/calendar")
                                }
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                />
                              </svg>

                              <span className="ml-3">Calendar</span>
                            </Link>
                          </li>
                        </ul>
                        <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
                          <li>
                            <Link
                              onClick={() => showMobileOptions()}
                              href="/dashboard/import"
                              className={
                                "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                isActiveLink("/dashboard/import")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={
                                  "h-6 w-6 transition duration-75" +
                                  isActiveSVG("/dashboard/import")
                                }
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
                                />
                              </svg>

                              <span className="ml-3">Import Trades</span>
                            </Link>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                              <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                              </svg>
                              <span className="ml-3">Components</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="group flex items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            >
                              <svg
                                aria-hidden="true"
                                className="h-6 w-6 flex-shrink-0 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span className="ml-3">Help</span>
                            </a>
                          </li>
                          <li>
                            <button onClick={() => signOut()} className="w-full bg-primary rounded-lg py-2">
                                Sign Out
                            </button>
                          </li>
                        </ul>
                        </div>
                        <div className="flex text-white">
                          <Image
                            src={
                              sessionData.user?.image || "/default-avatar.png"
                            }
                            alt="user image"
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="ml-4 flex flex-col justify-center">
                            <h3 className="text-sm font-bold">
                              {sessionData.user?.name}
                            </h3>
                            <h4 className="text-sm">
                              {sessionData.user?.email}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            </div>
          </>
        )}
        {!sessionData && (
          <div className="flex text-sm justify-center items-center col-span-2 justify-self-end lg:col-span-1 lg:mr-10">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="rounded px-3 py-1 text-white mr-2"
          >
            Log In
          </button>
          <button 
            className="text-white text-sm rounded-lg px-3 py-1 bg-slate-900">
            Sign Up
          </button>
          </div>
        )}
      </div>
    </nav>
  );
}
