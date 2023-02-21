import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { WidthProvider, Responsive } from "react-grid-layout";
import SideNav from "../../components/SideNav";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardAnalyticsPage: NextPage = () => {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "a", x: 0, y: 0, w: 3, h: 2 },
      { i: "b", x: 3, y: 0, w: 3, h: 2 },
      { i: "c", x: 3, y: 2, w: 3, h: 2 },
      { i: "d", x: 9, y: 0, w: 3, h: 2 },
    ],
    md: [
      { i: "a", x: 0, y: 0, w: 3, h: 2 },
      { i: "b", x: 3, y: 0, w: 3, h: 2 },
      { i: "c", x: 3, y: 2, w: 3, h: 2 },
      { i: "d", x: 9, y: 0, w: 3, h: 2 },
    ],
    sm: [
      { i: "a", x: 0, y: 0, w: 2, h: 1 },
      { i: "b", x: 2, y: 0, w: 2, h: 1 },
      { i: "c", x: 4, y: 0, w: 2, h: 1 },
      { i: "d", x: 6, y: 0, w: 2, h: 1 },
    ],
    xs: [
      { i: "a", x: 0, y: 0, w: 2, h: 1 },
      { i: "b", x: 2, y: 0, w: 2, h: 1 },
      { i: "c", x: 0, y: 1, w: 2, h: 1 },
      { i: "d", x: 2, y: 1, w: 2, h: 1 },
    ],
    xxs: [
      { i: "a", x: 0, y: 0, w: 1, h: 1 },
      { i: "b", x: 1, y: 0, w: 1, h: 1 },
      { i: "c", x: 0, y: 1, w: 1, h: 1 },
      { i: "d", x: 1, y: 1, w: 1, h: 1 },
    ],
  });

  console.log(layouts)

  return (
    <>
      <Head>
        <title>Dashboard Analytics</title>
        <meta name="description" content="Deflux dashboard analytics" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-[calc(100vh-59px)] bg-white dark:bg-gray-900">
        <SideNav />
        <div className="my-3 ml-3 w-full overflow-y-scroll">
          <div className="mr-3 mb-24 lg:mb-0">
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              rowHeight={60}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 }}
              onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
            >
              <div key="a" className="bg-gray-800 rounded-lg text-white">a</div>
              <div key="b" className="bg-gray-800 rounded-lg text-white">b</div>
              <div key="c" className="bg-gray-800 rounded-lg text-white">c</div>
              <div key="d" className="bg-gray-800 rounded-lg text-white">d</div>
            </ResponsiveGridLayout>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardAnalyticsPage;
