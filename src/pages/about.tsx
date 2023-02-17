import { type NextPage } from "next";
import Head from "next/head";

const About: NextPage = () => {
  return (
    <div>
      <Head>
        <title>About Deflux</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-y-scroll h-screen overflow-x-hidden bg-gray-900">
        <section>
          <h1>About</h1>
        </section>
      </main>
    </div>
  );
};

export default About;