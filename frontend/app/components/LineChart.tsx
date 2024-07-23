// src/components/LineChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface DataItem {
  key: number;
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
  // Ensure all datasets are available
  const hasData = (dataset: DataItem[]) => dataset && dataset.length > 0;

  // Transform data into format suitable for Chart.js
  const chartData = {
    labels: (data.DATA_USED_TO_TRACK_YOU || []).map(item => item.key.toString()), // Assuming all datasets have the same keys
    datasets: [
      {
        label: 'Total Apps',
        data: hasData(data.ALL_APPS) ? data.ALL_APPS.map(item => item.doc_count) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
      {
        label: 'Compliant Apps',
        data: hasData(data.EXISTS_PRIVACY_LABELS) ? data.EXISTS_PRIVACY_LABELS.map(item => item.doc_count) : [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
      {
        label: 'Data Not Collected',
        data: hasData(data.DATA_NOT_COLLECTED) ? data.DATA_NOT_COLLECTED.map(item => item.doc_count) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
      {
        label: 'Data Not Linked to You',
        data: hasData(data.DATA_NOT_LINKED_TO_YOU) ? data.DATA_NOT_LINKED_TO_YOU.map(item => item.doc_count) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
      {
        label: 'Data Linked to You',
        data: hasData(data.DATA_LINKED_TO_YOU) ? data.DATA_LINKED_TO_YOU.map(item => item.doc_count) : [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
      {
        label: 'Data Used to Track You',
        data: data.DATA_USED_TO_TRACK_YOU.map(item => item.doc_count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        tension: 0.1,
      },
    ].filter(dataset => dataset.data.length > 0), // Filter out empty datasets
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Run Number',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Apps',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
