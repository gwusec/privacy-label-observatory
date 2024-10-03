import React, { useEffect, useRef } from 'react';
import { useTheme } from "next-themes";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, ChartDataLabels); // Register the plugin

interface RatioData {
  purpose: string;
  percentage: string;
}

interface RatiosProps {
  data: RatioData[];
  color: string;
  theme: string | undefined;
}

const Ratios: React.FC<RatiosProps> = ({ data, color, theme }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // Ref to store the chart instance

  useEffect(() => {
    const labels = data.map(item => item.purpose);
    const percentages = data.map(item => parseFloat(item.percentage));

    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
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
            barThickness: 15
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

  return <canvas ref={chartRef} />;
};

export default Ratios;
