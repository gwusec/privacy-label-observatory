import React from "react";
import type {
    LinksFunction,
    LoaderFunction,
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

interface App{
    app_name: string;
    app_id: number | undefined;
    run_id: number | undefined;
    app_icon: string | undefined;
}

export async function loaderTwo(id: string | null){
    console.log("Hello")
    const list = await fetch(process.env.BACKEND_API + "search?=" + id)
    const data = await list.json();
    return json(data)
}


export default function AppPage() {
    const app = useLoaderData<typeof loaderTwo>();
    console.log(app)
    return(
        <div>
            <h1>{app["name"]}</h1>
        </div>
    )
}