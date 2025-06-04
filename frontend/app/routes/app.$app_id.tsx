import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Timeline from '~/components/Timeline';
import { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useEffect } from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    if (!data || data.length === 0) {
        return [{
            title: "App Not Found",
        }];
    }

    const appName = data[1][0]['app_name'];
    return [{
        title: `Explorer - ${appName}`,
    }];
};

export async function loader({ params }: LoaderFunctionArgs) {

    // First, get dates
    const dates = await fetch(process.env.BACKEND_API + "dates");
    const datesJson = await dates.json();

    // Then, get app
    const q = params.app_id
    if (!q || q == undefined || isNaN(Number(q))) {
        return redirect("/error")
    }

    const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
    const data = await app.json()
    return [datesJson, data];
};

export default function searchApp() {

    const data = useLoaderData<typeof loader>();
    const app = data[1];
    const dates = data[0]
    
    return (
        <div className={`items-start min-h-screen h-full`}>
            <Timeline data={app} dates={dates}/>
        </div>
    )
}