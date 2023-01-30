"use client";
import { FC } from "react";
import { memo } from "react";
import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartProps {
  data: any[];
}

const Chart: FC<ChartProps> = memo(function Chart({data}) {
  console.log('CHART DATA', data)
  // Pull out the balances from each trade
  const trades = data.map((trade) => trade.balance);
  // Pull out the dateClosed from each trade
  const dates = data.map((trade) => trade.dateClosed.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }));
  const dateAndTime = data.map((trade) => trade.dateClosed.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }));

  const series = [
    {
      name: 'Balance',
      data: trades,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 300,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: false,
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Account Balance',
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#FFF'
      }
    },
    fill: {
      type: 'gradient',
      colors: ['#18B4B7'],
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0],
        type: 'vertical'
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val: any) {
          return '$'+ val.toFixed(2).toLocaleString();
        }
      },
      marker: {
        show: false,
      },
      theme: 'dark',
    },
    xaxis: {
      type: 'datetime',
      categories: dates,
      labels: {
        style: {
          colors: '#FFF',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFF',
        }
      }
    },
    grid: {
      show: false,
    },
    colors: ['#18B4B7'],
  };

  return (
    <div className="w-full">
      <ApexCharts
        options={options}
        series={series}
        type="area"
        height={300}
        width={'100%'}
      />
    </div>
  );
});

export default Chart;
