import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { color } from 'chart.js/helpers';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'tailwindcss/tailwind.css'; // Assuming you're using Tailwind for responsiveness


Chart.register(...registerables, MatrixController, MatrixElement, ChartDataLabels);

const MatrixChart = ({ data, color }) => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        if (!data) return;
    
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const purposes = data.map(d => d.purpose);
        const dataCategories = Array.from(new Set(data.flatMap(d => d.dataCategories.map(dc => dc.dataCategory))));

        const matrixData = data.flatMap((d, row) =>
            d.dataCategories.map((dc, col) => ({
                x: dc.dataCategory,
                y: d.purpose,
                v: dc.percentage
            }))
        );
        const chartData = {
            datasets: [{
                label: 'Heat Map',
                data: matrixData,
                backgroundColor: (ctx:any) => {
                    const value = ctx.dataset.data[ctx.dataIndex].v;
                    const alpha = (value / 100).toFixed(2);
                    return `${color} ${alpha})`;
                },
                width: (ctx:any) => ctx.chart.chartArea.width / dataCategories.length,
                height: (ctx:any) => ctx.chart.chartArea.height / purposes.length,
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false, // Important for flexible height
            animation: {
                onComplete: function () {
                  if(chartRef.current){
                    console.log("Base64ImageMatrix", chartRef.current.toBase64Image());
                  }
          
                },
              },
            scales: {
                x: {
                    type: 'category',
                    labels: dataCategories,
                    title: {
                        display: true,
                        text: 'Data Categories'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'category',
                    labels: purposes,
                    title: {
                        display: true,
                        text: 'Purposes'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    },
                }
            },
            plugins: {
                legend: false,
                datalabels: {
                    display: false,
                },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: (context:any) => {
                            const { x, y, raw } = context;
                            return `${raw.v.toFixed(2)}%`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    bottom: 50
                }
            }
        };

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            chartRef.current = new Chart(ctx, {
                type: 'matrix',
                data: chartData,
                options: options
            });
            
        } else {
            console.log("Canvas context is not available");
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [data]);

    if (!data) {
        return <div>No data available</div>;
    }

    return (
        <div className="w-full h-64 md:h-96"> {/* Tailwind for responsive layout */}
            <canvas ref={canvasRef} />
        </div>
    );
};

export default MatrixChart;
