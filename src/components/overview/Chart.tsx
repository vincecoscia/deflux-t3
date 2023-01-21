import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { type } from "os";

export default function Chart() {
  const series = [
    {
      name: "All Tasks",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
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
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
        className="w-full"
      />
    </div>
  );
}
