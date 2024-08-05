// File path: /components/MatrixChart.jsx

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { color } from 'chart.js/helpers';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, MatrixController, MatrixElement, ChartDataLabels);

const MatrixChart = ({ data }) => {
    console.log("data passed in:", data)
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    
    useEffect(() => {
        console.log("useEffect triggered");
        if (!data) {
            console.log("No data provided");
            return;
        }
    
        console.log("Data available:", data);
    
        if (chartRef.current) {
            console.log("Destroying existing chart");
            chartRef.current.destroy();
        }
    
        // Process data and create chart
        const purposes = data.map(d => d.purpose);
        const dataCategories = Array.from(new Set(data.flatMap(d => d.dataCategories.map(dc => dc.dataCategory))));
    
        const matrixData = data.flatMap((d, row) =>
            d.dataCategories.map((dc, col) => ({
                x: dc.dataCategory,
                y: d.purpose,
                v: dc.percentage
            }))
        );
    
        console.log("Matrix data:", matrixData);
    
        const chartData = {
            datasets: [{
                label: 'Heat Map',
                data: matrixData,
                backgroundColor: (ctx:any) => {
                    const value = ctx.dataset.data[ctx.dataIndex].v;
                    const alpha = (value / 100).toFixed(2);
                    return `rgba(0, 100, 255, ${alpha})`;
                },
                width: (ctx:any) => ctx.chart.chartArea.width / dataCategories.length,
                height: (ctx:any) => ctx.chart.chartArea.height / purposes.length,
            }]
        };
    
        const options = {
            scales: {
                x: {
                    type: 'category',
                    labels: data[0].dataCategories.map(cat => cat.dataCategory),
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
                    labels: data.map(item => item.purpose),
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
                    display: false,
                    callbacks: {
                        label: (context:any) => {
                            const { x, y, raw } = context;
                            return `${raw.v}%`;
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
            console.log("Creating new chart");
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
                console.log("Cleaning up chart");
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [data]);

    if (!data) {
        return <div>No data available</div>;
    }

    return <canvas ref={canvasRef} />;
};

export default MatrixChart;

// import React, { useEffect, useRef } from 'react';
// import { Chart, registerables } from 'chart.js';
// import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

// Chart.register(...registerables, MatrixController, MatrixElement);

// const MatrixChart = ({ data }) => {
//     const chartRef = useRef(null);
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         console.log("useEffect triggered");

//         if (!data) {
//             console.log("No data provided");
//             return;
//         }

//         console.log("Data available:", data);

//         // Destroy existing chart if present
//         if (chartRef.current) {
//             console.log("Destroying existing chart");
//             chartRef.current.destroy();
//             chartRef.current = null; // Make sure to nullify the ref after destruction
//         }

//         // Process data
//         const purposes = data.map(d => d.purpose);
//         const dataCategories = Array.from(new Set(data.flatMap(d => d.dataCategories.map(dc => dc.dataCategory))));

//         const matrixData = data.flatMap((d, row) =>
//             d.dataCategories.map((dc, col) => ({
//                 x: col,
//                 y: row,
//                 v: dc.percentage
//             }))
//         );

//         console.log("Matrix data:", matrixData);

//         const chartData = {
//             datasets: [{
//                 label: 'Heat Map',
//                 data: matrixData,
//                 backgroundColor: (ctx) => {
//                     const value = ctx.dataset.data[ctx.dataIndex].v;
//                     const alpha = (value / 100).toFixed(2);
//                     return `rgba(0, 100, 255, ${alpha})`;
//                 },
//                 width: (ctx) => ctx.chart.chartArea.width / dataCategories.length,
//                 height: (ctx) => ctx.chart.chartArea.height / purposes.length,
//             }]
//         };

//         const options = {
//             responsive: true,
//             scales: {
//                 x: {
//                     type: 'category',
//                     labels: dataCategories,
//                     title: {
//                         display: true,
//                         text: 'Data Categories'
//                     },
//                     ticks: {
//                         autoSkip: false,
//                         maxRotation: 45,
//                         minRotation: 45
//                     }
//                 },
//                 y: {
//                     type: 'category',
//                     labels: purposes,
//                     title: {
//                         display: true,
//                         text: 'Purposes'
//                     },
//                     ticks: {
//                         autoSkip: false,
//                         maxRotation: 0,
//                         minRotation: 0
//                     }
//                 }
//             },
//             plugins: {
//                 tooltip: {
//                     callbacks: {
//                         label: (context) => {
//                             const v = context.dataset.data[context.dataIndex].v;
//                             return `Percentage: ${v}%`;
//                         }
//                     }
//                 },
//                 legend: {
//                     display: false
//                 }
//             },
//             layout: {
//                 padding: {
//                     left: 50,
//                     right: 50,
//                     top: 50,
//                     bottom: 50
//                 }
//             }
//         };

//         const ctx = canvasRef.current?.getContext('2d');
//         if (ctx) {
//             console.log("Creating new chart");
//             chartRef.current = new Chart(ctx, {
//                 type: 'matrix',
//                 data: chartData,
//                 options: options
//             });
//         } else {
//             console.log("Canvas context is not available");
//         }

//         return () => {
//             if (chartRef.current) {
//                 console.log("Cleaning up chart");
//                 chartRef.current.destroy();
//                 chartRef.current = null;
//             }
//         };
//     }, [data]);

//     if (!data) {
//         return <div>No data available</div>;
//     }

//     return <canvas ref={canvasRef} style={{ width: '100%', height: '500px' }} />;
// };

// export default MatrixChart;
