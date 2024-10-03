import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, ChartDataLabels);

interface PrivacyTypesData {
  purpose: string;
  percentage: string;
}

interface PrivacyTypesProps {
  data: PrivacyTypesData[];
  color: string;
  theme: string | undefined;
}

const PrivacyTypesChart: React.FC<PrivacyTypesProps> = ({ data, color, theme }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const labels = data.map(item => item.purpose);
    const percentages = data.map(item => parseFloat(item.percentage));

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Data Linked to You',
            data: percentages,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            barThickness: 15, // Adjust thickness of bars
            categoryPercentage: 0.7, // Space between bars (0.5 - 1.0)
          }]
        },
        options: {
          indexAxis: 'y', // Horizontal bar chart
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 30,
              right: 30 // Adjust padding around the chart
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false // Remove grid lines
              },
              ticks: {
                display: false // Hide x-axis labels
              },
              maxTicksLimit: 5 // Limit the number of x-axis ticks
            },
            y: {
              grid: {
                display: false // Remove grid lines
              },
              ticks: {
                minRotation: 0, // Ensure labels are horizontal
                maxRotation: 0, // Ensure labels are horizontal
                padding: 5 // Increase padding between labels and chart
              }
            }
          },
          plugins: {
            legend: {
              display: false // Hide legend
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.raw + '%'; // Append '%' to tooltip labels
                }
              }
            },
            datalabels: {
              color: theme === 'dark' ? 'white' : 'black',
              anchor: 'end',
              align: 'end',
              formatter: (value) => `${value}%`, // Append '%' to data labels
              offset: 5 // Offset data labels from the end of the bars
            }
          }
        }
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts or data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, theme]);

  return <canvas ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default PrivacyTypesChart;
