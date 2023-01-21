"use client";
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Chart() {
  const series = [
    {
      name: "Profit",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ];

  const options = {
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
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Stock Price Movement',
      align: 'left'
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
        formatter: function (val) {
          return (val / 1000000).toFixed(0)
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
}
