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

function YearGraph({data}:{data:any}){
    const years = generateLabels(Object.keys(data["totals"]).length)
    console.log("years", years)
    const total = data["totals"]
    const linked = data["dlty"]
    const not_linked = data["dnlty"]
    const tracked = data["duty"]
    const collected = data["dnc"]

    const sampleData = {
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
                label: 'Data Not Collected',
                data: collected,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
        <div className="w-full p-4 bg-slate-200">
            <h2 className="text-lg font-semibold mb-4">Grouped Bar Chart</h2>
            <div className="flex flex-row gap-4 h-52 w-fit">
                {data && <Bar data={sampleData} options={options} />}
                {data && <Bar data={sampleData} options={options2} />}
                {data && <Bar data={sampleData} options={options2} />}
                {data && <Bar data={sampleData} options={options2} />}
            </div>
        </div>
    )
}

export default YearGraph