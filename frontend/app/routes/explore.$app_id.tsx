import React from "react";

import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";

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



export async function loader({params}:LoaderFunctionArgs){
    const q = params.app_id
    if(q == undefined){
        return
    }
    const app = await fetch(process.env.BACKEND_API + "getApp?id=" + q)
    const data = await app.json()
    return(json(data))
};

export default function App() {
    const data = useLoaderData<typeof loader>();
    console.log(data)
    var app_name = data[0]["app_name"]
    var app_id = data[0]["app_id"]
    var privacy_types:privLabel[] = data[0]["privacy_types"]
    //console.log(app_name)
    return(
        <div className="text-center mx-2 pl-10">
            <h1>{app_name}</h1>
            <h2>{app_id}</h2>
            {privacy_types.map(
                priv =>
                    <div>
                        <h3>{priv.privacyTypes}</h3>
                        <ul>
                            {priv.dataCategories.map(
                                category =>
                                <div className="flex">
                                <li className="text-lg whitespace-pre">{category.dataCategory}: </li>
                                {category.dataTypes.map(
                                    (typ, index) => 
                                    <div className="text-orange-400 whitespace-pre">
                                        <p>{typ.data_type}{index !== category.dataTypes.length - 1 && ','} </p>
                                    </div>
                                )}
                                </div> 

                            )}
                        </ul>
                    </div>
            )}
        </div>
    )
}
