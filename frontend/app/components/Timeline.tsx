import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";


import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import VerticalTimeline from "~/components/VerticalTimeline";
import HorizontalTimeline from '~/components/HorizontalTimeline';

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

export default function Timeline({data}:{data:any}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [privDetails, setPrivDetails] = useState<privLabel[]>([]);
    const [expandedColumn, setExpandedColumn] = useState(null);

    const handleClick = (event: any, index: number) => {
        console.log("called", index)
        setActiveIndex(index)
    };

    const handleExpand = (column:any) => {
        if (expandedColumn === column) {
          setExpandedColumn(null); // Collapse if already expanded
        } else {
          setExpandedColumn(column); // Expand the clicked column
        }
      };

    const updateParent = (index: number) => {
        setActiveIndex(index)
    }
    const { theme } = useTheme();
    

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
        <div className=' '>
            <div className="ml-10 flex">
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
                <div className="ml-10 m-2 items-start mt-6">
                    <h1 className="text-2xl font-bold">{app_name}</h1>
                    <h2 className="text-sm text-gray-500">id: {app_id}</h2>
                </div>
            </div>
            <div className="flex">
                <div className='p-2 flex w-full'>

                    {/* Need to come back to this since currently it's wrong */}
                    <div className={`m-4 rounded-lg w-full text-center p-4 shadow-md ${theme === 'dark' ? 'text-white bg-neutral-800 hover:text-red hover:bg-neutral-200' : 'text-red bg-neutral-300 hover:text-white hover:bg-neutral-700'} transform transition duration-200 hover:scale-105 ${expandedColumn === 'column1' || expandedColumn === null ? 'block' : 'hidden'}`} id='duty'>
                        <div className='flex justify-end'>
                            {expandedColumn === 'column1' ? <MdFullscreenExit onClick={() => handleExpand('column1')} size={28}/> : <MdFullscreen onClick={() => handleExpand('column1')} size={28}/>}
                        </div>
                        {checkValueInDetails('DATA_USED_TO_TRACK_YOU') ? 
                            <div>
                                <h3 className="">Data Used to Track You</h3> 
                                {privDetails.map(priv =>
                                    priv.identifier === "DATA_USED_TO_TRACK_YOU" ? 
                                    <ul className="mt-4 pl-6 list-none space-y-4">
                                        {expandedColumn === null && 
                                            <div>
                                                The following data may be collected and linked to your identity:
                                            </div>
                                        }
                                        {priv.dataCategories && priv.dataCategories.map((dataCategory, dataCategoryIndex) => (
                                            <div key={dataCategoryIndex} className="space-y-2">
                                            <li className="text-lg text-gray-800 font-semibold">
                                                {dataCategory.dataCategory}
                                                </li>
                                                {expandedColumn === 'column1' && dataCategory.dataTypes && dataCategory.dataTypes.map((dataType, dataTypeIndex) => (
                                                    <div key={dataCategoryIndex} className="p-2">
                                                    <li className="text-base text-gray-700 rounded-md p-2 border border-blue-200">
                                                        <span key={dataTypeIndex} className='inline-block text-sm px-2 m-1 rounded-full border border-orange-400'>
                                                            {dataType.data_type}
                                                        </span>
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
                            <div className=''>
                                
                                <h3>Data Used to Track You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                    <div  className={`m-4 rounded-lg w-full text-center p-4 shadow-md ${theme === 'dark' ? 'text-white bg-neutral-800 hover:text-red hover:bg-neutral-200' : 'text-red bg-neutral-300 hover:text-white hover:bg-neutral-700'} transform transition duration-200 hover:scale-105  ${expandedColumn === 'column2' || expandedColumn === null ? 'block' : 'hidden'}`} id='dly'>
                        <div className='flex justify-end'>
                            {expandedColumn === 'column2' ? <MdFullscreenExit onClick={() => handleExpand('column2')} size={28}/> : <MdFullscreen onClick={() => handleExpand('column2')} size={28}/>}
                        </div>    
                        {checkValueInDetails('DATA_LINKED_TO_YOU') ? 
                            <div>
                                <h3 className="">Data Linked to You</h3>
                                {privDetails.map(priv =>
                                    priv.identifier === "DATA_LINKED_TO_YOU" ? 
                                    <ul className="mt-4 pl-6 list-none space-y-4">
                                        {expandedColumn === null && 
                                            <div>
                                                The following data may be collected and linked to your identity:
                                            </div>
                                        }
                                        {priv.purposes && priv.purposes.map((purpose, purposeIndex) => (
                                            <div key={purposeIndex} className="space-y-2">
                                            <li className="text-lg text-gray-800 font-semibold">
                                                {purpose.purpose}
                                                </li>
                                                {expandedColumn === 'column2' && purpose.dataCategories && purpose.dataCategories.map((dataCategory, dataCategoryIndex) => (
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
                            <div className="">
                                
                                <h3>Data Linked to You</h3>
                                <p>No Data</p>
                            </div>}
                    </div>

                <div className={`m-4 rounded-lg w-full text-center p-4 shadow-md ${theme === 'dark' ? 'text-white bg-neutral-800 hover:text-red hover:bg-neutral-200' : 'text-red bg-neutral-300 hover:text-white hover:bg-neutral-700'} transform transition duration-200 hover:scale-105  ${expandedColumn === 'column3' || expandedColumn === null ? 'block' : 'hidden'}`} id='dnly'>
                    {checkValueInDetails('DATA_NOT_LINKED_TO_YOU') ? 
                        <div>
                            <div className='flex justify-end'>    
                                {expandedColumn === 'column3' ? <MdFullscreenExit onClick={() => handleExpand('column3')} size={28}/> : <MdFullscreen onClick={() => handleExpand('column3')} size={28}/>}
                            </div>
                            <h3>Data Not Linked to You</h3>
                            {privDetails.map(priv =>
                            priv.identifier === "DATA_NOT_LINKED_TO_YOU" ? 
                            <ul className="mt-4 pl-6 list-none space-y-4">
                                {expandedColumn === null && 
                                    <div>
                                        The following data may be collected but it is not linked to your identity:
                                    </div>
                                }
                                {priv.purposes && priv.purposes.map((purpose, purposeIndex) => (
                                    <div key={purposeIndex} className="space-y-2">
                                    <li className="text-lg text-gray-800 font-semibold">
                                        {purpose.purpose}
                                        </li>
                                        {expandedColumn === 'column3' && purpose.dataCategories && purpose.dataCategories.map((dataCategory, dataCategoryIndex) => (
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
                        <div > 
                            <div className='flex justify-end'>    
                                {expandedColumn === 'column3' ? <MdFullscreenExit onClick={() => handleExpand('column3')} size={28}/> : <MdFullscreen onClick={() => handleExpand('column3')} size={28}/>}
                            </div>
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
            <div className="flex justify-center items-center">
                <div className="mt-4 bg-white p-4 justify-center rounded-lg shadow h-fit ml-2 w-fit dark:bg-slate-800">
                    <HorizontalTimeline privtypes={privacy_types} activeIndex={activeIndex} updateParent={updateParent} handleClick={handleClick}/>
                </div>
            </div>
        </div>
    )
}