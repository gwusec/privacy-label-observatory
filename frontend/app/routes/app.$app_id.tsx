import React, { useEffect, useState } from 'react';

import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import VerticalTimeline from "~/components/VerticalTimeline";

interface dataCat{
    dataCategory: String, 
    dataTypes: String[];
}

interface purpose{
    purpose: String,
    identifier: String,
    dataCategories: dataCat[] | null;
}

interface privLabel{
    privacyTypes: String,
    identifier: String,
    dataCategories: dataCat[] | null,
    purposes: purpose[] | null;
}


export async function loader({params}:LoaderFunctionArgs){
    console.log("running this loader")
    const q = params.app_id
    console.log(q)
    if(q == undefined){
        return
    }
    const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
    const data = await app.json()
    console.log("hello")
    return(json(data))
};




export default function App() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [privDetails, setPrivDetails] = useState<privLabel[]>([]);

    const handleClick = (event: any, index: number) => {
        console.log("called", index)
        setActiveIndex(index)
    };

    const updateParent = (index: number) => {
        setActiveIndex(index)
    }
    
    
    const data = useLoaderData<typeof loader>();
    console.log(data)
    var app_name = data[0]["app_name"]
    var app_id = data[0]["app_id"]
    var image_url = data[0]["image_url"]
    var privacy_types = data[1]["privacy"]

    useEffect(() => {
        setPrivDetails(privacy_types[activeIndex]["privacy_types"]["privacyDetails"])
        console.log("privDetails", privDetails)
    })

    const checkValueInDetails = (value:any) => {
        return privDetails.some(detail => detail.identifier === value);
    };

    return(
        <div>
            <div className="flex items-center">
                {image_url == undefined ?
                <img
                    className="w-40 h-40 rounded-xl m-4"
                    src={noPhoto}
                />  
                :
                
                <img
                    className="w-40 h-40 rounded-xl m-4"
                    src={image_url}

                />  
                }
                <div className="m-2">
                    <h1 className="text-xl font-bold">{app_name}</h1>
                    <h2 className="text-sm text-gray-500">{app_id}</h2>
                </div>
            </div>
            <div className="flex">
                <div className="mt-4 bg-white p-4 rounded-lg shadow w-fit dark:bg-slate-800">
                    <VerticalTimeline privtypes={privacy_types} activeIndex={activeIndex} updateParent={updateParent} handleClick={handleClick}/>   
                </div>
                <div className='p-2 flex w-full'>

                    {/* Need to come back to this since currently it's wrong */}
                    <div className="m-4 bg-white rounded-lg shadow w-full text-center" id='duty'>
                        {checkValueInDetails('DATA_USED_TO_TRACK_YOU') ? 
                            <h3 className="bg-green-200">Data Used to Track You</h3> 
                            :
                            <div className='bg-red-200'>
                                
                                <h3>Data Used to Track You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                    <div className="m-4 bg-white rounded-lg shadow w-full text-center" id='dly'>
                        {checkValueInDetails('DATA_LINKED_TO_YOU') ? 
                            <h3 className="bg-green-200">Data Linked to You</h3> 
                            :
                            <div className="bg-red-200">
                                
                                <h3>Data Linked to You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                    <div className="m-4 bg-white rounded-lg shadow w-full text-center" id='dnly'>
                    {checkValueInDetails('DATA_NOT_LINKED_TO_YOU') ? 
                        <div>
                            <h3 className="bg-green-200">Data Not Linked to You</h3>
                            {privDetails.map(privacy =>
                            privacy.identifier === "DATA_NOT_LINKED_TO_YOU" ? 
                            <div>
                                {privacy.purposes && privacy.purposes.map(purpose => 
                                    <div>
                                        <h4 className='text-cyan-400'>{purpose.purpose}</h4>
                                    </div>
                                )}
                            </div> 
                            : 
                            <div></div>
                            )} 
                        </div>
                        :
                        <div className='bg-red-200'>
                            
                            <h3>Data Not Linked to You</h3>
                            <p>No Data</p>
                        </div>}
                    </div>
                </div>
                <div>
                    {/* {activeIndex !== null && activeIndex < privacy_types.length && (
                        <div>
                            
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-bold">Privacy Details</h3>
                            <pre>{JSON.stringify(privacy_types[activeIndex], null, 2)}</pre>
                        </div>

                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}