import React from "react";
import { useNavigation } from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import VennDiagram from "~/components/VennDiagram";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({params}: LoaderFunctionArgs){
    const venn = await fetch(process.env.BACKEND_API + "venn")
    const data = await venn.json()
    return json(data)
}

export default function Graphs(){
    const { state } = useNavigation()
    const data = useLoaderData<typeof loader>();
    console.log(data["data"])

    return(
        <>
        {state === "loading" ?
        <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
            <FaSpinner className="animate-spin" size={72}/>
        </div>
        :
        
        <div className="h-screen p-2">
            <h1>Graphs</h1>
            <VennDiagram />
        </div>
        }
        </>
    )
}