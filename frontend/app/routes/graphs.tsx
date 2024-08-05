import React from "react";
import { useNavigation } from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import VennDiagram from "~/components/VennDiagram";
import YearGraph from "~/components/YearGraph"

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PercentageGraph from "~/components/PercentageGraph";

export async function loader({params}: LoaderFunctionArgs){
    const venn = await fetch(process.env.BACKEND_API + "venn")
    const vennDiagramData = await venn.json()
    const percentage = await fetch(process.env.BACKEND_API + "graph16")
    const percentageData = await percentage.json()
    const dates = await fetch(process.env.BACKEND_API + "graph14")
    const dateJson = await dates.json()
    return [vennDiagramData, percentageData, dateJson]
}

export default function Graphs(){
    const { state } = useNavigation()
    const data = useLoaderData<typeof loader>();
    const vennDiagram = data[0]
    const percentage = data[1]
    const dates = data[2]
    console.log(data)

    return(
        <>
        {state === "loading" ?
        <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
            <FaSpinner className="animate-spin" size={72}/>
        </div>
        :
        
        <div className="h-screen p-2">
            <h1>Graphs</h1>
            <VennDiagram data={vennDiagram}/>
            <PercentageGraph data={percentage}/>
            <YearGraph data={dates} />
        </div>
        }
        </>
    )
}