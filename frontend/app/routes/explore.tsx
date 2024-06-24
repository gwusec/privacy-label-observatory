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

interface Run{
    key: string;
    label: string;
}

var runs:Run[] = []
var json_runs: String[] = []

export async function loader({
    request,
}: LoaderFunctionArgs) {
    //Loads the list of apps first
    const url = new URL(request.url)
    const q = url.searchParams.get("page")
    var run = url.searchParams.get("run")

    console.log(run)
    
    //If there's a search query
    var search = url.searchParams.get("q")
    console.log(search)

    if(run == null){
        run = "run_00069"
    }

    var data
    if(search == null){
        const list = await fetch(process.env.BACKEND_API + "appList?start=" + q + "&run=" + run)
        data = await list.json();
    }

    else{
        const list = await fetch(process.env.BACKEND_API + "appList?start=" + q + "&run=" + run + "&q=" + search)
        data = await list.json()
    }


    //Loads the runs that the app contains
    const run_list = await fetch(process.env.BACKEND_API + "api/runs")
    const run_array = await run_list.json()

    runs = await run_array.map((label:string, index:number) => {
        return{
            key: label,
            label: "Run " + (run_array.length - index)
        }
    })

    return [data, runs]
};




export default function Index() {
    const array = useLoaderData<typeof loader>();
    const data = array[0];
    const runs = array[1];
    const navigation = useNavigation();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    return (
        
        <div className="flex divide-x divide-doubles overflow-hidden">
            <ExploreSidebar
                runs={runs}
                searching={searching}
                app_list = {data}
            />  
            <Outlet/>
        </div >
    );
}
