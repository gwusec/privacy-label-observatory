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

export async function loader({
    request,
}: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const q = url.searchParams.get("page")
    const list = await fetch(process.env.BACKEND_API + "appList?start=" + q)
    const data = await list.json();
    return json(data)
};

export async function loaderTwo({
    request,
}: LoaderFunctionArgs){
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    console.log(q);
    return json({q});
}


export default function Index() {
    const data = useLoaderData<typeof loader>();
    const { q } = useLoaderData<typeof loaderTwo>();
    console.log(q);
    const navigation = useNavigation();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    const runs = [ //will be set by loader
        {
            key: "run_69",
            label: "Run 69",
        },
        {
            key: "run_68",
            label: "Run 68",
        },
        {
            key: "run_x",
            label: "...",
        },

    ];




    return (
        <div className="flex divide-x divide-doubles">
            <ExploreSidebar
                runs={runs}
                searching={searching}
                app_list = {data}
            />

            /* Should add a page, like explore sidebar, in order to render the 
            app that we want to render. Should show the default first app on the list */
            <Divider orientation="vertical" />
            <div id="view-region" className="w-4/5 items-stretch h-screen overflow-y-aut">
                <h2 className="text-center underline">View</h2>

            </div>
        </div >
    );
}
