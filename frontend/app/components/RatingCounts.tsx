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

export default function RatingCounts ({data}:{data:any}) {   
    const { theme } = useTheme();
    const track = [data["duty_1"], data["duty_10"], data["duty_100"], data["duty_1000"], data["duty_10000"], data["duty_100000"]]
    const not_linked = [data["dnlty_1"], data["dnlty_10"], data["dnlty_100"], data["dnlty_1000"], data["dnlty_10000"], data["dnlty_100000"]]
    const linked = [data["dlty_1"], data["dlty_10"], data["dlty_100"], data["dlty_1000"], data["dlty_10000"], data["dlty_100000"]]
    const collected = [data["dnc_1"], data["dnc_10"], data["dnc_100"], data["dnc_1000"], data["dnc_10000"], data["dnc_100000"]]
    
    const options2 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    padding: 10
                }, 
            },
            datalabels: {
                display: true,
                align: 'end',
                anchor: 'end', // Positions labels above the bars
                color: theme === 'dark' ? '#FFF' : '#000',
                formatter: (value: number) => `${value}%`,
                font: {
                    size: 10, // Reduce font size for readability
                    weight: 'bold'
                },
                rotation: -45, // Rotate labels to reduce overlap
            },
        },
        layout: {
            padding: {
                top: 20, // Adds padding between the legend and the graph
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 45, // Rotate x-axis labels
                    minRotation: 45
                }
            },
            y: {
                display: true,
                beginAtZero: true,
                ticks: {
                    display: false,
                    stepSize: 20,
                    maxTicksLimit: 10,
                },
                grid: {
                    drawTicks: true,
                },
            },
        },
    };
    

    const mergedChartData = {
        labels: ['0', '10', '100', '1000', '10000', '100000'],
        datasets: [
            {
                label: 'Data Not Collected',
                data: collected,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
            {
                label: 'Data Not Linked to You',
                data: not_linked,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Data Linked to You',
                data: linked,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Data Used to Track You',
                data: track,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    return (
        <div className="w-full items-start px-4 py-4">
            {/* Chart container with dynamic height */}
            <div className="relative" style={{ height: '40vh' }}> {/* Adjust height as needed */}
                <Bar data={mergedChartData} options={options2} />
            </div>
        </div>
    );
    
}
