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
    if(run == null){
        run = "run_00069"
    }
    console.log(run)
    const list = await fetch(process.env.BACKEND_API + "appList?start=" + q + "&run=" + run)
    const data = await list.json();

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

    
    // const runs = [ //will be set by loader
    //     {
    //         key: "run_69",
    //         label: "Run 69",
    //     },
    //     {
    //         key: "run_68",
    //         label: "Run 68",
    //     },
    //     {
    //         key: "run_x",
    //         label: "...",
    //     },

    // ];

    return (
        <div className="flex divide-x divide-doubles">
            <ExploreSidebar
                runs={runs}
                searching={searching}
                app_list = {data}
            />  
            <Outlet/>
        </div >
    );
}
