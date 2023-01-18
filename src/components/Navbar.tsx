import React from "react";
import localFont from "@next/font/local";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const azonix = localFont({ src: "../styles/fonts/Azonix.woff2" });

export default function Navbar() {
  const [show, setShow] = React.useState(false);

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

  return (
    <nav className="flex w-full bg-gray-800 px-4 py-2">
      <div className="grid w-full grid-cols-3 items-center justify-items-center">
        <Link href="/" className="justify-self-start px-4 py-4">
        <h1
          className={`${azonix.className} text-3xl text-white`}
        >
          Deflu<span className="text-primary">x</span>
        </h1>
        </Link>
        <div className="text-gray-500">
          <Link href="/" className={`mr-10 + ${isActive("/")}`}>
            Home
          </Link>
          <Link href="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
        </div>
        {sessionData && (
          <div className="relative mr-10 justify-self-end">
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
                <h3 className="text-sm font-bold">{sessionData.user?.name}</h3>
                <h4 className="text-sm">{sessionData.user?.email}</h4>
              </div>
            </div>
            {show && (
              <div className="absolute mt-2 flex w-48 flex-col rounded-md bg-gray-900 shadow-xl px-4 py-4 text-white">
                <Link href="/dashboard" className="py-3">Dashboard</Link>
                <Link href="/profile" className="py-3">Profile</Link>
                <Link href="/settings" className="py-3 mb-4">Settings</Link>
                <button
                  onClick={() => signOut()}
                  className="rounded bg-primary px-4 py-2 text-white"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
        {!sessionData && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard/overview" })}
            className="mr-10 justify-self-end rounded bg-primary px-4 py-2 text-white"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}
