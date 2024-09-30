import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Function to update window size
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener on mount
    window.addEventListener('resize', handleResize);

    // Call handleResize initially to set the initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  return windowSize;
}

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
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const chartRef = useRef<ChartJS | null>(null);
  const { width, height } = useWindowSize();
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const labels = (data.DATA_USED_TO_TRACK_YOU || []).map(item => item.key.toString());

  const getData = (dataset: DataItem[]) => {
    const dataMap = new Map<string, number>();
    dataset.forEach(item => dataMap.set(item.key, item.doc_count));
    return labels.map(label => dataMap.get(label) || 0);
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Apps',
        data: getData(data.ALL_APPS),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 3,  // Thicker line
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
        title: {
          display: true,
          text: 'Run Date',
        },
        ticks: {
          font: {
            size: {width} < 768 ? 10 : 12,  // Smaller font size for mobile
          },
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Apps',
        },
        ticks: {
          font: {
            size: {width} < 768 ? 10 : 12,  // Smaller font size for mobile
          },
        },
        grid: {
          color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
    elements: {
      line: {
        borderWidth: {width} < 768 ? 2 : 3,  // Thicker lines for larger screens
      },
    },
  };
                               
  return (
    <div className="w-full h-96 md:h-96">
      <Line data={chartData} options={options} ref={chartRef} />
    </div>
  );
};

export default LineChart;
