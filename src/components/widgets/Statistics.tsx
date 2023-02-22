import { memo, useContext, useEffect, useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import { AnalyticsContext } from "../../context/AnalyticsContext";
import OutsideClickHandler from "react-outside-click-handler";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Statistics = memo(function Statistics() {
  const { tradeAnalytics, tagAnalytics } = useContext(AnalyticsContext);
  const [selectedAnalytics, setSelectedAnalytics] = useState<any[]>([]);
  const [layouts, setLayouts] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // set the selected analytics to the trade analytics
    setSelectedAnalytics(tradeAnalytics);
    // set the layouts to the layouts returned from the getLayouts function
    setLayouts(getLayouts(tradeAnalytics));
  }, [tradeAnalytics]);

  const getLayouts = (selectedAnalytics) => {
    // map over the selected analytics and return the layout
    const xsBreakpoints = selectedAnalytics.map((analytics, index) => {
      // if the index is greater than 2, then we need to get the remainder of the index divided by 3 for xs breakpoint
      const xValue = index > 2 ? index % 3 : index;
      // for every time the index is greater than 2, we need to increment the y value by 1
      const yValue = index > 2 ? Math.floor(index / 3) : 0;
      
      // return the layout for the xs breakpoint
      return {
        i: analytics.name,
        x: xValue,
        y: yValue,
        w: 1,
        h: 1,
      };
    });

    const xxsBreakpoints = selectedAnalytics.map((analytics, index) => {
      // if the index is greater than 1, then we need to get the remainder of the index divided by 2 for xxs breakpoint
      const xValue = index > 1 ? index % 2 : index;
      // for every time the index is greater than 1, we need to increment the y value by 1
      const yValue = index > 1 ? Math.floor(index / 2) : 0;

      // return the layout for the xxs breakpoint
      return {
        i: analytics.name,
        x: xValue,
        y: yValue,
        w: 1,
        h: 1,
      };
    });

    const lgBreakpoints = selectedAnalytics.map((analytics, index) => {
      // if the index is greater than 3, then we need to get the remainder of the index divided by 4 for lg breakpoint
      const xValue = index > 3 ? index % 4 : index;
      // for every time the index is greater than 3, we need to increment the y value by 1
      const yValue = index > 3 ? Math.floor(index / 4) : 0;

      // return the layout for the lg breakpoint
      return {
        i: analytics.name,
        x: xValue,
        y: yValue,
        w: 1,
        h: 1,
      };
    });

    // return the layouts for all breakpoints
    return {
      lg: lgBreakpoints,
      xs: xsBreakpoints,
      xxs: xxsBreakpoints,
    };
  };

  console.log("THE FUCKING LAYOUTS", layouts)

  return (
    <>
    <div className="w-full text-white">
      <button 
        className="border border-dashed border-gray-500 rounded-lg flex items-center justify-center py-2 w-full mb-2" 
        onClick={() => setOpen(!open)}
        >
        Edit Statitics Widgets
      </button>
      <div className="bg-gray-800 p-2 rounded-lg">
        <h3 className="px-3">Statistics</h3>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          rowHeight={60}
          breakpoints={{ lg: 800, xs: 480, xxs: 0 }}
          cols={{ lg: 4, xs: 3, xxs: 2 }}
          onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
        >
          {selectedAnalytics.map((analytics) => (
            <div key={analytics.name} className="bg-gray-700 p-2 rounded-lg">
              <h5 className="text-xs text-gray-400">{analytics.name}</h5>
              <p>{analytics.value}</p>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
    {open && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white text-lg">Available Widgets</h3>
          <hr className="h-px mt-2 mb-4 border-0 bg-gray-700"/>
          <fieldset className="gap-2 grid grid-cols-3">
            {tradeAnalytics.map((analytics) => (
                    <div key={analytics.name} className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={analytics.name}
                        name={analytics.name}
                        type="checkbox"
                        checked={selectedAnalytics.some((selected) => selected.name === analytics.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnalytics([...selectedAnalytics, analytics]);
                          } else {
                            setSelectedAnalytics(selectedAnalytics.filter((selected) => selected.name !== analytics.name));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={analytics.name} className="font-medium text-white">
                        {analytics.name}
                      </label>
                      <p id="comments-description" className="text-gray-500">
                        {analytics.value}
                      </p>
                    </div>
                  </div>
            ))}
          </fieldset>

            </div>
        </OutsideClickHandler>
        </div>
    )}
    </>
  );
});

export default Statistics;
