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
import { useTheme } from "next-themes";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function VersionUpdate ({data}:{data:any}) {   
    const { theme } = useTheme();
    const track = [data["duty_4"], data["duty_9"], data["duty_12"], data["duty_17"]]
    const not_linked = [data["dnlty_4"], data["dnlty_9"], data["dnlty_12"], data["dnlty_17"]]
    const linked = [data["dlty_4"], data["dlty_9"], data["dlty_12"], data["dlty_17"]]
    const collected = [data["dnc_4"], data["dnc_9"], data["dnc_12"], data["dnc_17"]]

    const chartData = {
        labels: [
            '4+', '9+', '12+', '17+',
          ],
        datasets: [
            {
                label: 'Data Not Collected',
                data: collected,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            }
        ],
    };

    const chartData2 = {
        labels: [
            '4+', '9+', '12+', '17+',
          ],
        datasets: [
            {
                label: 'Data Not Linked to You',
                data: not_linked,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ],
    };

    const chartData3 = {
        labels: [
            '4+', '9+', '12+', '17+',
          ],
        datasets: [
            {
                label: 'Data Linked to You',
                data: linked,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            }
        ],
    };

    const chartData4 = {
        labels: [
            '4+', '9+', '12+', '17+',
          ],
        datasets: [
            {
                label: 'Data Used to Track You',
                data: track,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
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
                color: theme === 'dark' ? '#FFF' : '#000',
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
        <div className="w-2/6 items-start pr-20 pt-10">
        <div className='flex flex-row gap-1'>
                {chartData && <Bar data={chartData} options={options2} />}
                {chartData2 && <Bar data={chartData2} options={options2} />}
                {chartData3 && <Bar data={chartData3} options={options2} />}
                {chartData4 && <Bar data={chartData4} options={options2} />}
        </div>
    </div>
    );
}
