import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'tailwindcss/tailwind.css'; // Assuming you're using Tailwind for responsiveness


Chart.register(...registerables, MatrixController, MatrixElement, ChartDataLabels);

const MatrixChart = ({ data, color, theme }) => {
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
                backgroundColor: (ctx: any) => {
                    const value = ctx.dataset.data[ctx.dataIndex].v;
                    const alpha = (value / 100).toFixed(2);
                    return `${color} ${alpha})`;
                },
                width: (ctx: any) => ctx.chart.chartArea.width / dataCategories.length,
                height: (ctx: any) => ctx.chart.chartArea.height / purposes.length,
            }]
        };

        const isMobile = window.innerWidth < 768;

        const options = {
            responsive: true,
            maintainAspectRatio: false, // Important for flexible height
            scales: {
                x: {
                    type: 'category',
                    labels: dataCategories,
                    title: {
                        color: theme === 'dark' ? 'white' : 'black',
                        display: true,
                        text: 'Data Categories'
                    },
                    ticks: {
                        autoSkip: isMobile,
                        maxRotation: isMobile ? 30 : 45, // Reduce rotation on mobile
                        minRotation: isMobile ? 0 : 45,
                        color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamically set label color
                        font: {
                            size: isMobile ? 10 : 14, // Optional: Adjust the font size for better visibility
                        },
                    }, 
                    grid: {
                        display: false
                    }, 
                    border: {
                        display: false
                    }

                },
                y: {
                    type: 'category',
                    labels: purposes,
                    title: {
                        color: theme === 'dark' ? 'white' : 'black',
                        display: true,
                        text: 'Purposes'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamically set label color
                        font: {
                            size: isMobile ? 10 : 14,
                        },
                    },
                    grid: {
                        display: false
                    }, 
                    border: {
                        display: false
                    }
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
                        label: (context: any) => {
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

        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [data, theme]);

    if (!data) {
        return <div>No data available</div>;
    }

    return (
        <div className="flex justify-center items-center w-full h-72 md:h-96">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default MatrixChart;
