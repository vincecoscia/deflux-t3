/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useMemo } from "react";
import { memo } from "react";
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
import { Button, PageButton } from './shared/Button'
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
    <label className="flex gap-x-2 items-baseline">
      <input
        type="text"
        className="block rounded-md py-1 px-4 shadow-sm bg-gray-600 placeholder-gray-300 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} records...`}
      />
    </label>
  )
}

const TradeTable: React.FC<TradeTableProps> = memo(function TradeTable({
  data,
}) {
  console.log(data);

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
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
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
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
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
                              cell.column.id === "dateClosed"
                                ? new Date(cell.value).toLocaleString("en-US", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : cell.column.id === "netProfit" ? (
                                  <span
                                    className={`${
                                      cell.value > 0 ? "text-green-400" : "text-red-400"
                                    }`}
                                  >
                                    {cell.value}
                                  </span>
                                ) :  cell.column.id === "grossProfit" ? (
                                  <span
                                    className={`${
                                      cell.value > 0 ? "text-green-400" : "text-red-400"
                                    }`}
                                  >
                                    {cell.value}
                                  </span>
                                ) : cell.column.id === "winLoss" ? (
                                  <span
                                    className={`${
                                      cell.value === "WIN" ? "text-green-400" : "text-red-400"
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
                                )

                                    }
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
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <select
              value={state.pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[5, 10, 20].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
              <PageButton
                onClick={() => nextPage()}
                disabled={!canNextPage
                }>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
});

export default TradeTable;
