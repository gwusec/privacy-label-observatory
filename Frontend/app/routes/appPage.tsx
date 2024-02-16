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
    params
}: LoaderFunctionArgs){
    
}

export default function AppPage(props: App) {
    const app_name = props.app_name;
    const app_id = props.app_id;

    return(
        <div>
            <h1>{app_name}</h1>
            <h1>{app_id}</h1>
        </div>
    )
}