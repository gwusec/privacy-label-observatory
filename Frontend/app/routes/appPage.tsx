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

interface App{
    app_name: string;
    app_id: number | undefined;
    run_id: number | undefined;
    app_icon: string | undefined;
}

export async function Loader({
    request
}: LoaderFunctionArgs){
    const url = new URL(request.url)
    console.log("gets in here")
    const q = url.searchParams.get("id")
    const list = await fetch(process.env.BACKEND_API + "search?id=" + q)
    const data = await list.json
    console.log(data);
    return json(data);
}


export default function AppPage() {
    const data = useLoaderData<typeof Loader>();
    console.log("Hello")
    console.log(data)
    const app_name = data["app_name"];
    const app_id = data["app_id"];
    console.log(app_name)
    console.log(app_id)

    return(
        <div>
            <h1>{app_name}</h1>
            <h1>{app_id}</h1>
        </div>
    )
}