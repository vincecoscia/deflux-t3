import {
  memo,
  useContext,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  FC,
} from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import { AnalyticsContext } from "../../context/AnalyticsContext";
import { UserPreferenceContext } from "../../context/UserPreferencesContext";
import { SideNavContext } from "../../context/SideNavContext";
import OutsideClickHandler from "react-outside-click-handler";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StatisticsProps {
  tradeAnalytics: any[];
}

const Statistics: FC<StatisticsProps> = ({ tradeAnalytics }) => {
  const { tagAnalytics } = useContext(AnalyticsContext);
  const { isCollapsed } = useContext(SideNavContext);
  const { userPreferences, refetchUserPreferences } = useContext(
    UserPreferenceContext
  );
  const [selectedAnalytics, setSelectedAnalytics] = useState<any[]>([]);
  const [layouts, setLayouts] = useState({});
  const [open, setOpen] = useState(false);

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  useEffect(() => {
    // when isCollapsed changes, we need to dispatch a resize event to the window to force the grid to re-render
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }, [isCollapsed]);

  const { mutate: updateUserPreference } =
    trpc.userPreferenceRouter.updateUserPreference.useMutation({
      onSuccess() {
        refetchUserPreferences();
        toast.success("Preferences Updated", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
      onError(error) {
        toast.error(error.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
    });

  const getLayoutAndAnalytics = () => {
    // if a userPreferences key === "Stat-Widget-Layout" exists, then we need to set the layout to the value of the key
    const layoutPreference = userPreferences.find(
      (userPreference) => userPreference.key === "Stat-Widget-Layout"
    );
    const analyticsPreference = userPreferences.find(
      (userPreference) => userPreference.key === "Stat-Widget-Selection"
    );
    // if the layoutPreference exists, then we need to set the layout to the value of the key
    if (layoutPreference) {
      setLayouts(layoutPreference.value as any);
    } else {
      setLayouts(getInitialLayouts(tradeAnalytics));
    }
    if (analyticsPreference) {
      // filter the tradeAnalytics to only include the analytics that are in the analyticsPreference
      const filteredAnalytics = tradeAnalytics.filter((analytics) =>
        // analyticsPreference.value is an array of objects with a name property
        (analyticsPreference.value as { name: string; value: number }[]).some(
          (analyticsPreference) => analyticsPreference.name === analytics.name
        )
      );

      // set the selectedAnalytics2 to the filteredAnalytics
      setSelectedAnalytics(filteredAnalytics);
    } else {
      setSelectedAnalytics(tradeAnalytics);
    }
  };

  useLayoutEffect(() => {
    getLayoutAndAnalytics();
    ResponsiveGridLayout;
  }, [tradeAnalytics, userPreferences, ResponsiveGridLayout]);

  const getInitialLayouts = (selectedAnalytics) => {
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

  return (
    <>
      <div className="w-full text-white">
        <button
          className="mb-2 flex w-full items-center justify-center rounded-lg border border-dashed border-gray-500 py-2"
          onClick={() => setOpen(!open)}
        >
          Edit Statistics Widgets
        </button>
        <div className="rounded-lg bg-gray-800 p-2">
          <h3 className="px-3">Statistics</h3>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            rowHeight={60}
            breakpoints={{ lg: 800, xs: 480, xxs: 0 }}
            cols={{ lg: 4, xs: 3, xxs: 2 }}
            onLayoutChange={(currentLayout, allLayouts) =>
              setLayouts(allLayouts)
            }
          >
            
            {
              selectedAnalytics.map((analytics) => (
                <div key={analytics.name} className="rounded-lg bg-gray-700 p-2">
                  <h5 className="text-xs text-gray-400">{analytics.name}</h5>
                  <p>{analytics.value}</p>
                </div>
              ))}
          </ResponsiveGridLayout>
        </div>
      </div>
      {open && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 px-3 backdrop-blur lg:px-0">
          <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <div className="rounded-lg bg-gray-800 p-4">
              <h3 className="text-lg text-white">Available Widgets</h3>
              <hr className="mt-2 mb-4 h-px border-0 bg-gray-700" />
              <fieldset className="grid grid-cols-3 gap-2">
                {tradeAnalytics.map((analytics) => (
                  <div
                    key={analytics.name}
                    className="relative flex items-start"
                  >
                    <div className="flex h-5 items-center">
                      <input
                        id={analytics.name}
                        name={analytics.name}
                        type="checkbox"
                        checked={selectedAnalytics.some(
                          (selected) => selected.name === analytics.name
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnalytics([
                              ...selectedAnalytics,
                              analytics,
                            ]);
                          } else {
                            setSelectedAnalytics(
                              selectedAnalytics.filter(
                                (selected) => selected.name !== analytics.name
                              )
                            );
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={analytics.name}
                        className="font-medium text-white"
                      >
                        {analytics.name}
                      </label>
                      <p id="comments-description" className="text-gray-500">
                        {analytics.value}
                      </p>
                    </div>
                  </div>
                ))}
              </fieldset>
              <div className="mt-4 flex w-full gap-x-2 text-white">
                <button
                  className="flex w-full items-center justify-center rounded-lg bg-primary py-2"
                  onClick={() =>
                    updateUserPreference({
                      key: "Stat-Widget-Layout",
                      value: layouts,
                    })
                  }
                >
                  Save Layout
                </button>
                <button
                  className="flex w-full items-center justify-center rounded-lg bg-primary py-2"
                  onClick={() =>
                    updateUserPreference({
                      key: "Stat-Widget-Selection",
                      value: selectedAnalytics,
                    })
                  }
                >
                  Save Selections
                </button>
              </div>
            </div>
          </OutsideClickHandler>
        </div>
      )}
    </>
  );
};

export default Statistics;
