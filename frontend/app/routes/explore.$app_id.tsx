import React, {useState} from "react";

import { Button } from "@nextui-org/react";

import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";
import noPhoto from "../resources/no_available_photo.jpg"

import {
    Form,
    Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "@remix-run/react";


import ExploreSidebar from "../ExploreSidebar";

import {
    Divider
} from "@nextui-org/react";
import { None } from "framer-motion";

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



export async function loader({params, request}:LoaderFunctionArgs){
    const q = params.app_id
    const url = new URL(request.url)
    var run = url.searchParams.get("run")
    if(q == undefined){
        return
    }
    const app = await fetch(process.env.BACKEND_API + "getApp?id=" + q + "&run=" + run)
    const data = await app.json()
    return(json(data))
};

export default function App() {
    const data = useLoaderData<typeof loader>();
    const navigation = useNavigation();

    var jsonData = JSON.parse(JSON.stringify(data[0]["json"]))

    const [expandedCategories, setExpandedCategories] = useState({});



    const app_name = jsonData["app_name"]
    const app_id = jsonData["app_id"]
    const image_url = data[0]["image_url"]
    const privacy_types: privLabel[] = jsonData.privacylabels.privacyDetails;
    
    console.log("privtypes", privacy_types)

    return(
    <div className="text-center mx-2 pl-10 w-full">
        <div>
            <div className="flex items-center">
                {image_url == undefined ?
                <img
                    className="w-40 h-40 rounded-xl mr-4"
                    src={noPhoto}
                />  
                :
                
                <img
                    className="w-40 h-40 rounded-xl mr-4"
                    src={image_url}

                />  
                }
                <div className="m-2">
                    <h1 className="text-xl font-bold">{app_name}</h1>
                    <h2 className="text-sm text-gray-500">{app_id}</h2>
                </div>
                <div className="m-2">
                  <Link to={"/app/" + app_id}><Button>App View</Button></Link>
                </div>
            </div>
            <div className="flex flexbox">
            {privacy_types.length > 0 ? privacy_types.map(priv =>
                <div className="border-2 m-2 w-96 h-fit overflow-y-auto">
                    <h3 className="mt-6 text-2xl font-bold text-gray-900">{priv.privacyTypes}</h3>
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
                      {priv.dataCategories && priv.dataCategories.map((dataCategory, dataCategoryIndex) => (
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
                    </ul>
                </div>
            ) : <h3 className="mt-6 text-2xl font-bold text-gray-900">No Privacy Data Available for this App</h3>}
            </div>
        </div>
    </div>
    )
}
