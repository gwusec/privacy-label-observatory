import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader({params}:LoaderFunctionArgs){
    const q = params.app_id
    if(q == undefined){
        return
    }
    const app = await fetch(process.env.BACKEND_API + "getApp?id=" + q)
    const data = await app.json()
    console.log(json(data))
    return(json(data))
};

export default function App() {
    const data = useLoaderData<typeof loader>();
    console.log(data)
    var app_name = data[0]["app_name"]
    var app_id = data[0]["app_id"]
    //console.log(app_name)
    return(
        <div className="text-center mx-2">
            <h1>{app_name}</h1>
            <p>{app_id}</p>
        </div>
    )
}