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

interface dataTyp{
    data_type: String
}

interface dataCat{
    dataCategory: String, 
    dataTypes: dataTyp[];
}

interface privLabel{
    privacyTypes: String
    identifier: String
    dataCategories: dataCat[];
}



export async function loader({params, request}:LoaderFunctionArgs){
    console.log('gets into here')
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
    console.log("image")
    console.log(image_url)
    const privacy_types: privLabel[] = jsonData.privacylabels.privacyDetails;

    //console.log(app_name)
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
                <div key={priv.privacyTypes}>
                    <h3 className="mt-4 text-lg font-bold">{priv.privacyTypes}</h3>
                    <ul className="pl-8">
                        {priv.dataCategories.map(category =>
                            <div key={category.dataCategory} className="flex p-2">
                                <li className="text-base text-gray-700">{category.dataCategory}: </li>
                                <div className="ml-2">
                                    {category.dataTypes.map((typ, index) =>
                                        <span key={index} className="inline-block px-2 py-1 text-sm font-semibold text-orange-600 bg-orange-100 rounded-full mr-2">
                                            {typ.data_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    </div>
    )
}
