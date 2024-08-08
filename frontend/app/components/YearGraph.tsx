import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const startingYear = 22

const generateLabels = (length:number) => {
    const labels = []
    for(let i=0; i<length; i++){
        if(startingYear-i < 10){
            labels.push(`200${startingYear-i}`)
        }
        else{
            labels.push(`20${startingYear-i}`)
        }
    }
    return labels.reverse()
}

const createSampleData = (years:any, dataset:any, total:any, label:any, backgroundColor:any) => ({
    labels: years,
    datasets: [
        {
            label: 'Total Apps',
            data: total,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: label,
            data: dataset,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            borderWidth: 1,
        }
    ],
});

function YearGraph({data}:{data:any}){
    const years = generateLabels(Object.keys(data["totals"]).length)
    console.log("years", years)
    const total = data["totals"]
    console.log("data", data)
    const linked = data["dlty"]

    const not_linked = data["dnlty"]
    const tracked = data["duty"]
    const collected = data["dnc"]

    const sampleDatasets = [
        createSampleData(years, data["dlty"], total, 'Linked Apps', 'rgba(54, 162, 235, 0.5)'),
        createSampleData(years, data["dnlty"], total, 'Not Linked Apps', 'rgba(255, 206, 86, 0.5)'),
        createSampleData(years, data["duty"], total, 'Tracked Apps', 'rgba(75, 192, 192, 0.5)'),
        createSampleData(years, data["dnc"], total, 'Collected Apps', 'rgba(153, 102, 255, 0.5)'),
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },

        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: false,
                beginAtZero: true,
            },
        }
    }

    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },

        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                    display: false,
                    stepSize: 20, // Optional: Sets step size, depending on your data range
                    maxTicksLimit: 10, // Limit the number of tick marks
                },
                grid: {
                    drawTicks: true, // Ensures tick marks are drawn
                },
            },
        }
    }

    

    return(
        <div className="w-full p-4">
        <div className="flex flex-row gap-4 w-full">
            {sampleDatasets.map((sampleData, index) => (
                <div key={index} className="w-full h-[300px]"> {/* Adjust width and height as needed */}
                    {index === 0 ? (
                        <Bar data={sampleData} options={options} />
                    ) : (
                        <Bar data={sampleData} options={options2} />
                    )}
                </div>
            ))}
        </div>
    </div>
    
    )
}

export default YearGraph