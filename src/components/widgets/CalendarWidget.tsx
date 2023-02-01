import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { FC, memo, useState } from "react";
import {
  startOfToday,
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isToday,
  isSameMonth,
  isEqual,
  parse,
  add,
  getDay,
  startOfWeek,
  parseISO,
  isSameDay,
} from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface CalendarDayProps {
  trades: any[];
}

const CalendarWidget: FC<CalendarDayProps> = memo(function CalendarWidget({
  trades,
}) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<any>({
    date: today,
    trades: [],
  });
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const newDays = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
  }

  // combine the newDays array with the trades array
  const days = newDays.map((day) => {
    const date = day;
    const events = trades.filter((trade) => isSameDay(trade.dateClosed, day));

    return {
      date,
      trades: events,
    };
  });

  console.log("Selected Date", selectedDay);

  return (
    <div className="pb-4 lg:flex lg:h-full lg:flex-col lg:pb-10">
      <header className="flex items-center justify-between py-4 px-6 lg:flex-none">
        <h1 className="text-lg font-semibold text-white">
          <time dateTime="2022-01">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              onClick={previousMonth}
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-500 bg-gray-700 py-2 pl-3 pr-4 text-gray-400 focus:relative md:w-9 md:px-2 md:hover:bg-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="hidden items-center justify-center border-t border-b border-gray-500 bg-gray-700 px-3.5 text-sm font-medium text-white focus:relative md:flex">
              {format(firstDayCurrentMonth, "MMM")}
            </div>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              onClick={nextMonth}
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-500 bg-gray-700 py-2 pl-4 pr-3 text-gray-400 focus:relative md:w-9 md:px-2 md:hover:bg-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className=" lg:flex lg:h-[80vh] lg:flex-none lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-900 bg-gray-900 text-center text-xs font-semibold leading-6 text-white lg:flex-none">
          <div className="bg-gray-800 py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-gray-800 py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-gray-800 py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-gray-800 py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-gray-800 py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-gray-800 py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-gray-800 py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>
        <div className="flex bg-gray-900 text-xs leading-6 text-white lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                onClick={() =>
                  setSelectedDay({ date: day.date, trades: day.trades || [] })
                }
                className={classNames(
                  isSameMonth(day.date, firstDayCurrentMonth)
                    ? "bg-gray-700"
                    : "bg-gray-800 text-gray-400",
                  dayIdx === 0 && colStartClasses[getDay(day.date)],
                  "relative py-2 px-3"
                )}
              >
                <time
                  dateTime={day.toString()}
                  className={classNames(
                    isToday(day.date) && "bg-primary font-semibold text-white",
                    isEqual(day.date, selectedDay.date) &&
                      isToday(day.date) &&
                      "bg-primary",
                    isEqual(day.date, selectedDay.date) &&
                      !isToday(day.date) &&
                      "bg-sky-600",
                    "flex h-6 w-6 items-center justify-center rounded-full text-white"
                  )}
                >
                  {format(day.date, "d")}
                </time>
                {day.trades.length > 0 && (
                  <ol className="mt-2">
                    {day.trades.reduce(
                      (acc, trade) => acc + trade.netProfit,
                      0
                    ) > 0 ? (
                      <li className="flex items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white">
                        <span className="sr-only">Profit</span>
                        <span>
                          $
                          {day.trades
                            .reduce((acc, trade) => acc + trade.netProfit, 0)
                            .toFixed(2)}
                        </span>
                      </li>
                    ) : (
                      <li className="flex items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                        <span className="sr-only">Loss</span>
                        <span>
                          $
                          {day.trades
                            .reduce((acc, trade) => acc + trade.netProfit, 0)
                            .toFixed(2)}
                        </span>
                      </li>
                    )}
                    <li>
                      <span className="sr-only">Trades</span>
                      <span>Trades: {day.trades.length}</span>
                    </li>
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.toString()}
                type="button"
                onClick={() =>
                  setSelectedDay({ date: day.date, trades: day.trades || [] })
                }
                className={classNames(
                  isSameMonth(day.date, firstDayCurrentMonth)
                    ? "bg-gray-700"
                    : "bg-gray-800",
                  (isEqual(day.date, selectedDay) || isToday(day.date)) &&
                    "font-semibold",
                  isEqual(day.date, selectedDay) && "text-white",
                  !isEqual(day.date, selectedDay) &&
                    isToday(day.date) &&
                    "text-primary",
                  !isEqual(day.date, selectedDay) &&
                    isSameMonth(day.date, firstDayCurrentMonth) &&
                    !isToday(day.date) &&
                    "text-white",
                  !isEqual(day.date, selectedDay) &&
                    !isSameMonth(day.date, firstDayCurrentMonth) &&
                    !isToday(day.date) &&
                    "text-gray-500",
                  "flex h-14 flex-col py-2 px-3 hover:bg-sky-600 focus:z-10"
                )}
              >
                <time
                  dateTime={day.toString()}
                  className={classNames(
                    isEqual(day.date, selectedDay) &&
                      "flex h-6 w-6 items-center justify-center rounded-full",
                    isEqual(day.date, selectedDay) &&
                      isToday(day.date) &&
                      "bg-primary",
                    isEqual(day.date, selectedDay) &&
                      !isToday(day.date) &&
                      "bg-primary",
                    "ml-auto"
                  )}
                >
                  {format(day.date, "d")}
                </time>
                <span className="sr-only">{day.trades.length} trades</span>
                {day.trades.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-row flex-wrap-reverse">
                    {day.trades
                      .slice(0, 5)
                      .map((trade) =>
                        trade.netProfit >= 0 ? (
                          <span
                            key={trade.id}
                            className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-green-500"
                          />
                        ) : (
                          <span
                            key={trade.id}
                            className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-red-500"
                          />
                        )
                      )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay?.trades.length > 0 && (
        <div className="mt-3">
          <ol className="divide-y divide-gray-900 overflow-hidden rounded-lg bg-gray-700 text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.trades.map((trade) => (
              <li
                key={trade.id}
                className="group flex p-4 pr-6 focus-within:bg-gray-600 hover:bg-gray-600"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-white">
                    {trade.symbol}{" "}
                    <span
                      className={classNames(
                        trade.netProfit >= 0 ? "text-green-500" : "text-red-600"
                      )}
                    >
                      {trade.netProfit}
                    </span>
                  </p>
                  <time
                    dateTime={trade.dateClosed}
                    className="mt-2 flex items-center text-gray-100"
                  >
                    <ClockIcon
                      className="mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {format(trade.dateClosed, "h:mm a")}
                  </time>
                </div>
                <button className="ml-6 flex-none self-center rounded-md bg-primary py-2 px-3 font-semibold text-white opacity-0 shadow-sm hover:opacity-90 focus:opacity-100 group-hover:opacity-100">
                  View<span className="sr-only">, {trade.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
});

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default CalendarWidget;
