import React, { useState, useEffect } from 'react'
import {Bar} from 'react-chartjs-2'
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { LoaderFunction, LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function PercentageGraph ({data}:{data:any}) {   
    console.log(data)
    const track = [data["duty_free_no_app"], data["duty_free_in_app"], data["duty_paid_no_app"], data["duty_paid_in_app"]]
    const not_linked = [data["dnlty_free_no_app"], data["dnlty_free_in_app"], data["dnlty_paid_no_app"], data["dnlty_paid_in_app"]]
    const linked = [data["dlty_free_no_app"], data["dlty_free_in_app"], data["dlty_paid_no_app"], data["dlty_paid_in_app"]]
    const collected = [data["dnc_free_no_app"], data["dnc_free_in_app"], data["dnc_paid_no_app"], data["dnc_paid_in_app"]]

    const chartData = {
        labels: [
            'Free', 'Free In-App', 'Paid', 'Paid In-App',
          ],
        datasets: [
            {
                label: 'Data Not Collected',
                data: collected,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            }
        ],
    };

    const chartData2 = {
        labels: [
            'Free', 'Free In-App', 'Paid', 'Paid In-App',
          ],
        datasets: [
            {
                label: 'Data Not Linked to You',
                data: not_linked,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            }
        ],
    };

    const chartData3 = {
        labels: [
            'Free', 'Free In-App', 'Paid', 'Paid In-App',
          ],
        datasets: [
            {
                label: 'Data Linked to You',
                data: linked,
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 1,
            }
        ],
    };

    const chartData4 = {
        labels: [
            'Free', 'Free In-App', 'Paid', 'Paid In-App',
          ],
        datasets: [
            {
                label: 'Data Used to Track You',
                data: track,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            datalabels: {
                display: true,
                align: 'end',
                anchor: 'start',
                color: '#000',
                formatter: (value: number) => `${value}%`, // Format the label
                font: {
                    weight: 'bold'
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value: number) => `${value}%`,
                },
            },
        },
    };

    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            datalabels: {
                display: true,
                align: 'end',
                anchor: 'start',
                color: '#000',
                formatter: (value: number) => `${value}%`, // Format the label
                font: {
                    weight: 'bold'
                },
            },
        },
        scales: {
            y: {
                display: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                    display: false,
                    stepSize: 20, // Optional: Sets step size, depending on your data range
                    maxTicksLimit: 10, // Limit the number of tick marks
                },
                grid: {
                    drawTicks: true, // Ensures tick marks are drawn
                },
            },
        },
    };


    return (
        <div className="w-full p-4 bg-slate-200">
        <h2 className="text-lg font-semibold mb-4">PercentageGraph</h2>
        <div className='flex flex-row gap-4 h-52'>
                {chartData && <Bar data={chartData} options={options} />}
                {chartData2 && <Bar data={chartData2} options={options2} />}
                {chartData3 && <Bar data={chartData3} options={options2} />}
                {chartData4 && <Bar data={chartData4} options={options2} />}
        </div>
    </div>
    );
}
