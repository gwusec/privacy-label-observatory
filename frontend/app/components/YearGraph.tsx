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
import { useTheme } from 'next-themes';

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

const createSampleData = (years:any, dataset:any, total:any, label:any, backgroundColor:any, theme:any) => ({
    labels: years,
    datasets: [
        {
            label: 'Total Apps',
            data: total,
            backgroundColor: theme === 'light' ? 'rgba(227, 222, 225, 0.8)' : 'rgba(106, 106, 106, 0.8)',
            borderColor: theme === 'light' ? 'rgba(227, 222, 225, 0.8)' : 'rgba(106, 106, 106, 0.8)',
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
    const {theme} = useTheme();
    const years = generateLabels(Object.keys(data["totals"]).length)
    const total = data["totals"]
    const linked = data["dlty"]

    const not_linked = data["dnlty"]
    const tracked = data["duty"]
    const collected = data["dnc"]

    const sampleDatasets = [
        createSampleData(years, data["dnc"], total, 'Data Not Collected', 'rgba(255, 206, 86, 1)',  theme),
        createSampleData(years, data["dnlty"], total, 'Data Not Linked', 'rgba(54, 162, 235, 1)', theme),
        createSampleData(years, data["dlty"], total, 'Data Linked', 'rgba(153, 102, 255, 1)', theme),
        createSampleData(years, data["duty"], total, 'Data Used to Track', 'rgba(75, 192, 192, 1)', theme),
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }
              },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
                  },
            },
            y: {
                stacked: false,
                beginAtZero: true,
                grid: {
                    color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
                  },
            },
        }
    }

    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }
              },

        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
                  },
            },
            y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                    display: false
                },
                grid: {
                    drawTicks: true,
                    color: theme === 'dark' ? '#f1f1f1' : '#b9b9b9',
                  },
            },
        }
    }

    

    return(
<div className="grid grid-cols-2 px-10 pt-10">

        {sampleDatasets.map((sampleData, index) => (
            <div
                key={index}
                className="min-w-[300px] max-w-[400px] h-[300px] flex-shrink-0"
            >
                <Bar data={sampleData} options={index === 0 ? options : options2} />
            </div>
        ))}

</div>

    
    )
}

export default YearGraph