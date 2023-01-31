/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useMemo } from "react";
import { memo } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { SortDownIcon, SortUpIcon, SortIcon } from "./shared/Icons";
import { Button, PageButton } from "./shared/Button";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";

interface TradeTableProps {
  data: any[];
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex items-baseline gap-x-2">
      <input
        type="text"
        className="block rounded-md bg-gray-600 py-2 px-4 w-64 text-white placeholder-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} records...`}
      />
    </label>
  );
}

const TradeTable: React.FC<TradeTableProps> = memo(function TradeTable({
  data,
}) {
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [sortedTrades, setSortedTrades] = useState<any[]>([]);

  useEffect(() => {
    // Sort trades by dateClosed descending
    const sortedTrades = data.sort((a, b) => {
      const dateA = new Date(a.dateClosed);
      const dateB = new Date(b.dateClosed);
      return dateB.getTime() - dateA.getTime();
    });
    setSortedTrades(sortedTrades);
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Symbol",
        accessor: "symbol",
      },
      {
        Header: "Platform",
        accessor: "platform",
      },
      {
        Header: "Date Opened",
        accessor: "dateOpened",
      },
      {
        Header: "Date Closed",
        accessor: "dateClosed",
      },
      {
        Header: "Open Price",
        accessor: "openPrice",
      },
      {
        Header: "Close Price",
        accessor: "closePrice",
      },
      {
        Header: "Net Profit",
        accessor: "netProfit",
      },
      {
        Header: "Gross Profit",
        accessor: "grossProfit",
      },
      {
        Header: "Commission",
        accessor: "totalCommission",
      },
      {
        Header: "Status",
        accessor: "winLoss",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable({ 
    columns, 
    data: sortedTrades,
    initialState: { 
      pageIndex: 0, 
      pageSize: 10,
      hiddenColumns: ['grossProfit', 'totalCommission']
    }
   }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>
      <div className="flex items-center justify-between">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => setShowColumnFilter(!showColumnFilter)}
                className="inline-flex w-full justify-center rounded-md border border-gray-700 bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                Selected Columns
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {showColumnFilter && (
            <div
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
            >
              <div className="py-1 px-2" role="none">
                {/* <label className="flex items-baseline gap-x-2">
                  <input
                    type="checkbox"
                    {...getToggleHideAllColumnsProps()}
                    className="form-checkbox rounded-md text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-white">Toggle All</span>
                </label> */}
                {allColumns.map((column) => (
                  <label className="flex items-baseline gap-x-2 mt-1">
                    <input
                      type="checkbox"
                      {...column.getToggleHiddenProps()}
                      className="form-checkbox rounded-md text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-white"><>{column.Header}</></span>
                  </label>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-1 flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <table {...getTableProps()} className="w-full">
                <thead className="rounded-t-lg bg-gray-700 px-2 py-4 dark:text-white">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                          <div className="flex items-center">
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="h-4 w-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="rounded-b-lg bg-gray-800"
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className="border-b border-gray-700  bg-gray-800 px-2 py-3 last:rounded-b-lg last:border-0 hover:bg-primary hover:bg-opacity-10 dark:text-white"
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="whitespace-nowrap px-6 py-4"
                            >
                              {cell.column.id === "dateOpened" ||
                              cell.column.id === "dateClosed" ? (
                                new Date(cell.value).toLocaleString("en-US", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })
                              ) : cell.column.id === "netProfit" ? (
                                <span
                                  className={`${
                                    cell.value > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {cell.value}
                                </span>
                              ) : cell.column.id === "grossProfit" ? (
                                <span
                                  className={`${
                                    cell.value > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {cell.value}
                                </span>
                              ) : cell.column.id === "winLoss" ? (
                                <span
                                  className={`${
                                    cell.value === "WIN"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {cell.value}
                                </span>
                              ) : cell.column.id === "symbol" ? (
                                <span className="text-primary">
                                  {cell.value}
                                </span>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-1">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-white">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="block w-full rounded-md border-gray-300 bg-gray-600 py-1 px-2 text-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 25].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
});

export default TradeTable;
