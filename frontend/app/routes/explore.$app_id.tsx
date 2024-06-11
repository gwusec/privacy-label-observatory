import React from "react";

import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";
import noPhoto from "../resources/no_available_photo.jpg"

import {
    Form,
    //Link,
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



    const app_name = jsonData["app_name"]
    const app_id = jsonData["app_id"]
    const image_url = data[0]["image_url"]
    const privacy_types: privLabel[] = jsonData.privacylabels.privacyDetails;
    
    console.log(privacy_types)

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
            </div>
            {privacy_types.map(priv =>
                <div>
                    <h3 className="mt-4 text-lg font-bold">{priv.privacyTypes}</h3>
                    <ul className="pl-8">

                        {priv.purposes && priv.purposes.map(purpose => //every mapping is a loop
                            <div className="flex p-2">
                                <li className="text-base text-gray-700">{purpose.purpose}: </li>
                                {purpose.dataCategories && purpose.dataCategories.map(dataCategory => 
                                    <div>
                                        <li>{dataCategory.dataCategory}</li>
                                        {dataCategory.dataTypes.map(dataType => 
                                            <div>
                                                <li>{dataType}</li>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    </div>
    )
}
