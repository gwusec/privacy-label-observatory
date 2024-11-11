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

export default function PercentageGraph ({data}:{data:any}) {   
    const { theme } = useTheme();
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
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
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
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
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
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }
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
            x: {
                ticks:{
                    color: theme === 'dark' ? 'white' : 'black',
                }
            },
            y: {
                display: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                    display: false,
                    stepSize: 20, // Optional: Sets step size, depending on your data range
                    maxTicksLimit: 10, // Limit the number of tick marks
                    color: theme === 'dark' ? 'white' : 'black',
                    
                },
                grid: {
                    drawTicks: true, // Ensures tick marks are drawn
                },
            },
        },
    };


    return (
        <div className="grid grid-cols-2 gap-10 px-10 pt-10">
            <div className="w-full">
                <Bar data={chartData} options={options} />
            </div>
            <div className="w-full">
                <Bar data={chartData2} options={options} />
            </div>
            <div className="w-full">
                <Bar data={chartData3} options={options} />
            </div>
            <div className="w-full">
                <Bar data={chartData4} options={options} />
            </div>
        </div>
    );
    
}
