import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import OutsideClickHandler from "react-outside-click-handler";

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
    if (router.pathname.startsWith(route)) {
      return "text-primary dark:text-primary bg-primary/10 dark:bg-primary/10";
    } else {
      return "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";
    }
  };

  const isActiveSVG = (route: string) => {
    if (router.pathname.startsWith(route)) {
      return "text-primary dark:text-primary";
    } else {
      return "group-hover:text-gray-900 text-gray-400 dark:text-gray-400 dark:group-hover:text-white";
    }
  };

  return (
    <nav
      className={`z-20 flex w-full px-4 py-2 ${
        router.pathname == "/" ||
        router.pathname == "/pricing" ||
        router.pathname == "/about"
          ? "fixed top-0 bg-gray-800 lg:bg-transparent"
          : "bg-gray-800"
      }`}
    >
      <div className="grid w-full grid-cols-3 items-center justify-items-center">
        <Link href="/" className="ml-2 mt-2 justify-self-start">
          <h1 className={`deflux text-3xl text-white`}>
            Deflu<span className="text-primary">x</span>
          </h1>
        </Link>
        {router.pathname == "/" ||
        router.pathname == "/pricing" ||
        router.pathname == "/about" ? (
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
            <div
              className={`relative mr-10 hidden justify-self-end lg:block ${
                router.pathname == "/" ||
                router.pathname == "/pricing" ||
                router.pathname == "/about"
                  ? ""
                  : "col-span-2"
              }`}
            >
              <div className="flex text-white">
                <button className="" onClick={() => setShow(!show)}>
                  <Image
                    src={sessionData.user?.image || "/default-avatar.png"}
                    alt="user image"
                    width={50}
                    height={50}
                    className="h-10 w-10 rounded-full border border-white"
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
                <OutsideClickHandler
                  onOutsideClick={() => setShow(false)}
                  useCapture={true}
                >
                  <div
                    id="nav-menu"
                    className="absolute z-20 mt-2 flex w-64 flex-col gap-y-4 rounded-md bg-gray-900 px-2 py-4 text-white shadow-xl"
                  >
                    <Link
                      onClick={() => setShow(!show)}
                      href="/dashboard/overview"
                      className={
                        "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                        isActiveLink("/dashboard/overview")
                      }
                    >
                      <svg
                        aria-hidden="true"
                        className={
                          "h-6 w-6 transition duration-75" +
                          isActiveSVG("/dashboard/overview")
                        }
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                      </svg>
                      <span className="ml-2">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="rounded bg-primary px-4 py-2 text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </OutsideClickHandler>
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
                                href="/dashboard/overview"
                                className={
                                  "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                  isActiveLink("/dashboard/overview")
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
                                    isActiveSVG("/dashboard/overview")
                                  }
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
                                  />
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
                            <li>
                              <Link
                                href="/dashboard/analytics"
                                className={
                                  "group flex items-center rounded-lg p-2 text-base font-normal transition duration-75 " +
                                  isActiveLink("/dashboard/analytics")
                                }
                                onClick={() => showMobileOptions()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className={
                                    "h-6 w-6 transition duration-75" +
                                    isActiveSVG("/dashboard/analytics")
                                  }
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                                  />
                                </svg>

                                <span className="ml-3">Analytics</span>
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
                              <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full rounded-lg bg-primary py-2"
                              >
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
          <div className="col-span-2 flex items-center justify-center justify-self-end text-sm lg:col-span-1 lg:mr-10">
            <button
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard/overview" })
              }
              className="mr-2 rounded px-3 py-1 text-white"
            >
              Log In
            </button>
            <button className="rounded-lg bg-slate-900 px-3 py-1 text-sm text-white">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
