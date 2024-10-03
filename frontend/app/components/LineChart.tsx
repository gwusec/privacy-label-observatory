import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';
import html2canvas from 'html2canvas';
import { animate } from 'framer-motion';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface DataItem {
  key: string;
  doc_count: number;
}

interface LineChartProps {
  data: {
    DATA_USED_TO_TRACK_YOU: DataItem[];
    EXISTS_PRIVACY_LABELS: DataItem[];
    ALL_APPS: DataItem[];
    DATA_NOT_LINKED_TO_YOU: DataItem[];
    DATA_NOT_COLLECTED: DataItem[];
    DATA_LINKED_TO_YOU: DataItem[];
  };
  isExpanded: boolean;
}



const LineChart: React.FC<LineChartProps> = ({ data, isExpanded }) => {
  console.log("LineChart", data);
  const fetcher = useFetcher();
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const hasData = (dataset: DataItem[]) => dataset && dataset.length > 0;

  const labels = (data.DATA_USED_TO_TRACK_YOU || []).map(item => item.key.toString());
  console.log('labels', labels)

  const getData = (dataset: DataItem[]) => {
    const dataMap = new Map<string, number>();
    dataset.forEach(item => dataMap.set(item.key, item.doc_count));
    const result = labels.map(label => dataMap.get(label) || 0);
    return result
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Apps',
        data: getData(data.ALL_APPS),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Compliant Apps',
        data: getData(data.EXISTS_PRIVACY_LABELS),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Not Collected',
        data: getData(data.DATA_NOT_COLLECTED),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Not Linked to You',
        data: getData(data.DATA_NOT_LINKED_TO_YOU),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Linked to You',
        data: getData(data.DATA_LINKED_TO_YOU),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Data Used to Track You',
        data: getData(data.DATA_USED_TO_TRACK_YOU),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
      },
    ].filter(dataset => dataset.data.length > 0),
  };

  let base64Image = null;
  const options = {
    animation: {
      onComplete: function () {
        if (chartRef.current) {
          console.log("LineChartImage", chartRef.current.toBase64Image());
        }

      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Run Number',
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Apps',
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9'
        }
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };


  console.log(base64Image);


  return (
    <div className="flex items-center justify-center w-full">
      {/* {isExpanded && (
        <button
          className="text-2xl mx-4 p-2 rounded-full"
        //onClick={() => handleArrowClick('left')}
        >
          ←
        </button>
      )} */}
      <Line data={chartData} options={options} ref={chartRef} />
      {/* {isExpanded && (
        <button
          className="text-2xl mx-4 p-2 rounded-full"
        //onClick={() => handleArrowClick('right')}
        >
          →
        </button>
      )}
       <fetcher.Form method="post">
      <button type="submit">
        Click me to send request to Express
      </button>
    </fetcher.Form> */}
    </div>
  );


};

export default LineChart;
