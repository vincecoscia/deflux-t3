import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import localFont from "@next/font/local";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { trpc } from "../utils/trpc";

const azonix = localFont({ src: "../styles/fonts/Azonix.woff2" });

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Deflux</title>
        <meta
          name="description"
          content="Track your trades, optimize your profits"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      {/* If not logged in, view homepage */}
      <main className="overflow-y-scroll h-screen overflow-x-hidden bg-gray-900">
        <section className="h-screen w-full bg-gray-900 relative">
          <div className="curve lg:block hidden"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1922"
            height="235.672"
            viewBox="0 0 1922 235.672"
            className="absolute lg:bottom-[-5rem] bottom-0 lg:w-screen h-36 lg:h-auto w-auto"
          >
            <g
              id="layered-waves-haikei_2_"
              data-name="layered-waves-haikei (2)"
              transform="translate(0 -458.994)"
            >
              <path
                id="Path_15"
                data-name="Path 15"
                d="M0,467.3l35.664,4.149c35.45,4.149,106.778,12.447,177.892,20.413C284.67,500,356,507.63,427.111,502.485c71.114-5.311,142.442-23.566,213.556-33.524s142.442-11.617,213.556-8.63c71.114,3.153,142.442,10.787,213.555,17.426s142.442,12.281,213.556,8.962,142.442-15.6,213.556-17.26,142.442,7.3,213.556,8.3c71.114,1.162,142.442-5.477,177.892-8.8L1922,465.642V694.667H0Z"
                transform="translate(0 0)"
                fill="#18b4b7"
              />
              <path
                id="Path_16"
                data-name="Path 16"
                d="M0,534.346l35.664-3.206c35.45-3.385,106.778-9.8,177.892-20.842S356,483.935,427.111,481.441c71.114-2.316,142.442,8.372,213.556,17.279s142.442,16.032,213.556,20.485,142.442,6.235,213.555,6.769c71.114.713,142.442,0,213.556-2.85,71.114-3.028,142.442-8.372,213.556-16.032,71.114-7.838,142.442-17.813,213.556-16.745,71.114,1.247,142.442,13.716,177.892,19.951L1922,516.533V694.667H0Z"
                transform="translate(0 0)"
                fill="#058ea4"
              />
              <path
                id="Path_17"
                data-name="Path 17"
                d="M0,502l35.664,5.449c35.45,5.644,106.778,16.542,177.892,23.353S356,540.339,427.111,541.9s142.442,2.335,213.556,6.422c71.114,4.282,142.442,12.066,213.556,15.958s142.442,3.892,213.555-1.557c71.114-5.644,142.442-16.542,213.556-25.105,71.114-8.368,142.442-14.207,213.556-17.71,71.114-3.7,142.442-4.865,213.556,5.06,71.114,10.12,142.442,31.527,177.892,42.231L1922,577.9V694.667H0Z"
                transform="translate(0 0)"
                fill="#226886"
              />
              <path
                id="Path_18"
                data-name="Path 18"
                d="M0,562l35.664-4c35.45-4,106.778-12,177.892-15.8,71.114-3.9,142.442-3.5,213.556-4s142.442-1.9,213.556-3.7,142.442-4.2,213.556-2.3c71.114,1.8,142.442,7.8,213.555,12.6,71.114,4.9,142.442,8.5,213.556,9.7s142.442-.2,213.556-2.3c71.114-2.2,142.442-5.2,213.556-8.4,71.114-3.1,142.442-6.5,177.892-8.1L1922,534v67H0Z"
                transform="translate(0 93.667)"
                fill="#2a4561"
              />
              <path
                id="Path_19"
                data-name="Path 19"
                d="M0,566H35.664c35.45,0,106.778,0,177.892,2S356,574,427.111,573.2c71.114-.9,142.442-6.5,213.556-6.4,71.114.2,142.442,6.2,213.556,10,71.114,3.9,142.442,5.5,213.555,2.9,71.114-2.7,142.442-9.7,213.556-14,71.114-4.4,142.442-6,213.556-5.7s142.442,2.7,213.556,3.7,142.442.6,177.892.5L1922,564v37H0Z"
                transform="translate(0 93.667)"
                fill="#232639"
              />
            </g>
          </svg>
          <Image
            src="/deflux-screenshot.png"
            alt="Deflux Dashboard"
            width={600}
            height={600}
            className="absolute right-[-4rem] top-1/3 object-contain rounded-lg shadow-2xl lg:block hidden"
          />
          <div className="container mx-auto h-full">
            <div className="flex flex-col lg:justify-center lg:h-full mx-4 pt-48 lg:pt-0">
            <h2 className="mb-10 lg:w-1/2 w-full lg:text-6xl text-4xl font-semibold leading-none tracking-wide text-white text-center lg:text-start">
              Unleash your trading potential.
            </h2>
            {/* <Image
              src="/deflux-screenshot.png"
              alt="Deflux Dashboard"
              width={600}
              height={600}
              className="lg:hidden block mx-auto rounded-lg shadow-2xl"
            /> */}
            <p className="mb-10 lg:w-1/2 w-full text-xl font-medium text-gray-500 text-center lg:text-start">
              At Deflux, we believe that everyone has the potential to be a
              successful trader. That&apos;s why we&apos;ve created a platform
              that helps you track your trades, identify your strengths, and
              optimize your strategies for maximum success.
            </p>
            <div className="flex lg:gap-x-10 gap-x-4 w-full justify-center lg:justify-start">
              <button className="rounded-lg bg-primary lg:py-4 lg:px-6 py-2 px-4 lg:text-xl font-semibold text-black/75 hover:bg-primary/75">
                Get Started
              </button>
              <button className="flex rounded-lg border-2 border-primary lg:py-4  py-2 px-4 lg:px-6 lg:text-xl font-semibold text-white hover:bg-primary items-center">
                <span className="mr-2">Learn More </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="lg:h-7 lg:w-7 w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
            </div>
          </div>
        </section>
        <section className="w-full h-screen bg-secondary">
          
          </section>
      </main>
    </>
  );
};

export default Home;
