import React, { useEffect, useState } from 'react';

import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import VerticalTimeline from "~/components/VerticalTimeline";

interface dataType{
    data_category: Number, 
    data_type: String
  }
  
  interface dataCat{
      dataCategory: String, 
      dataTypes: dataType[];
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
    const [expandedColumn, setExpandedColumn] = useState(null);

    const handleClick = (event: any, index: number) => {
        console.log("called", index)
        setActiveIndex(index)
    };

    const handleExpand = (column) => {
        if (expandedColumn === column) {
          setExpandedColumn(null); // Collapse if already expanded
        } else {
          setExpandedColumn(column); // Expand the clicked column
        }
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
        <div className='h-full'>
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
                <div className="mt-4 bg-white p-4 rounded-lg shadow h-fit ml-2 w-fit dark:bg-slate-800">
                    <VerticalTimeline privtypes={privacy_types} activeIndex={activeIndex} updateParent={updateParent} handleClick={handleClick}/>   
                </div>
                <div className='p-2 flex w-full'>

                    {/* Need to come back to this since currently it's wrong */}
                    <div className={`m-4 bg-white rounded-lg shadow w-full text-center ${expandedColumn === 'column1' || expandedColumn === null ? 'block' : 'hidden'}`} id='duty'>
                        <button onClick={() => handleExpand('column1')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none">
                                {expandedColumn === 'column1' ? 'Shrink' : 'Expand'}
                        </button>
                        {checkValueInDetails('DATA_USED_TO_TRACK_YOU') ? 
                            <h3 className="bg-green-200">Data Used to Track You</h3> 
                            :
                            <div className='bg-red'>
                                
                                <h3>Data Used to Track You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                    <div  className={`m-4 bg-white rounded-lg shadow w-full text-center ${expandedColumn === 'column2' || expandedColumn === null ? 'block' : 'hidden'}`} id='dly'>
                        <button onClick={() => handleExpand('column2')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none">
                            {expandedColumn === 'column2' ? 'Shrink' : 'Expand'}
                        </button>
                        {checkValueInDetails('DATA_LINKED_TO_YOU') ? 
                            <h3 className="bg-green-200">Data Linked to You</h3> 
                            :
                            <div className="bg-red">
                                
                                <h3>Data Linked to You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                    <div  className={`m-4 bg-white rounded-lg shadow w-full text-center transition ${expandedColumn === 'column3' || expandedColumn === null ? 'block' : 'hidden'}`} id='dnly'>
                        <button onClick={() => handleExpand('column3')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none">
                            {expandedColumn === 'column3' ? 'Shrink' : 'Expand'}
                        </button>
                    {checkValueInDetails('DATA_NOT_LINKED_TO_YOU') ? 
                        <div>
                            <h3 className="bg-green-200">Data Not Linked to You</h3>
                            {privDetails.map(priv =>
                            priv.identifier === "DATA_NOT_LINKED_TO_YOU" ? 
                            <ul className="mt-4 pl-6 list-none space-y-4">
                      {priv.purposes && priv.purposes.map((purpose, purposeIndex) => (
                        <div key={purposeIndex} className="space-y-2">
                          <li className="text-lg text-gray-800 font-semibold">
                            {purpose.purpose}
                            </li>
                            {purpose.dataCategories && purpose.dataCategories.map((dataCategory, dataCategoryIndex) => (
                                <div key={dataCategoryIndex} className="p-2">
                                <li className="text-base text-gray-700 rounded-md p-2 border border-blue-200">
                                {dataCategory.dataCategory}:
                                {dataCategory.dataTypes && dataCategory.dataTypes.map((dataType, dataTypeIndex) => (
                                    <span key={dataTypeIndex} className='inline-block text-sm px-2 m-1 rounded-full border border-orange-400'>
                                    {dataType.data_type}
                                    </span>
                                ))}
                                </li>
                            </div>
                            ))}
                            </div>
                            ))}
                        </ul>
                            : 
                            <div></div>
                            )} 
                        </div>
                        :
                        <div className='bg-red'>
                            
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