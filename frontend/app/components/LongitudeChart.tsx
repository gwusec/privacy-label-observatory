import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { useTheme } from 'next-themes';
import 'chartjs-adapter-date-fns';
import html2canvas from 'html2canvas';
import { animate } from 'framer-motion';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale);

interface RunData {
    index: string;
    date: string;
    values: {
      ALL_APPS: number;
      EXISTS_PRIVACY_LABELS: number;
      DATA_USED_TO_TRACK_YOU: number;
      DATA_LINKED_TO_YOU: number;
      DATA_NOT_COLLECTED: number;
      DATA_NOT_LINKED_TO_YOU: number;
    };
  }
  
  interface LineChartProps {
    data: RunData[];
    isExpanded: boolean;
  }



const LongitudeChart: React.FC<LineChartProps> = ({ data, isExpanded }) => {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chartjs-plugin-zoom").then((zoomPlugin) => {
        ChartJS.register(zoomPlugin.default);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  let labels:Date[] = []

  for (var key in data){
    if(key != "id"){
        labels.push(new Date(data[key]["date"]));
    }
  }

  const getData = (key: keyof RunData["values"]) => {
    let map:number[] = []
    for (var val in data){
        if(val != "id"){
            map.push(data[val]["values"][key]);
        }

    }
    return map;
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Apps',
        data: getData("ALL_APPS"),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 3,  // Thicker line
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Compliant Apps',
        data: getData("EXISTS_PRIVACY_LABELS"),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Not Collected',
        data: getData("DATA_NOT_COLLECTED"),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Not Linked to You',
        data: getData("DATA_NOT_LINKED_TO_YOU"),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Linked to You',
        data: getData("DATA_LINKED_TO_YOU"),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Used to Track You',
        data: getData("DATA_USED_TO_TRACK_YOU"),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,        tension: 0.1,
        pointRadius: 0,
      },
    ].filter(dataset => dataset.data.length > 0),
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
            unit: 'day',
            displayFormats: {
                day: 'MMM dd, yyyy',
            },
        },
        title: {
          display: true,
          color: theme === 'dark' ? '#f1f1f1' : '#1e1e1e',
          text: 'Run Date',
        },
        ticks: {
          color: theme === 'dark' ? '#f1f1f1' : '#1e1e1e', // X-axis ticks color
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
        },
      },
      y: {
        title: {
          color: theme === 'dark' ? '#f1f1f1' : '#1e1e1e',
          display: true,
          text: 'Number of Apps',
        },
        ticks: {
          color: theme === 'dark' ? '#f1f1f1' : '#1e1e1e', // X-axis ticks color
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
        },
        suggestedMax: 600000,
        max: undefined,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }
      },
      datalabels: {
        color: theme === 'dark' ? '#ffffff' : '#000000',
        display: false,
      }
    },
  };


//   <button className={`p-2 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'} hidden md:block rounded`} onClick={() => chartRef.current?.resetZoom()}>
//   Reset Zoom
// </button>
                 
  return (
    <div className="w-full h-96 md:h-96 pb-10 pt-4">
      <Line data={chartData} options={options} ref={chartRef} />

    </div>
  );
  
  
};

export default LongitudeChart;
