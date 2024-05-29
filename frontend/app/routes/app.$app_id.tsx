import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import VerticalTimeline from "~/components/VerticalTimeline";


export async function loader({params}:LoaderFunctionArgs){
    const q = params.app_id
    if(q == undefined){
        return
    }
    const app = await fetch(process.env.BACKEND_API + "getApp?id=" + q)
    const data = await app.json()
    console.log("hello")
    return(json(data))
};


export default function App() {
    const data = useLoaderData<typeof loader>();
    console.log(data)
    var app_name = data[0]["app_name"]
    var app_id = data[0]["app_id"]
    var image_url = data[0]["image_url"]
    //console.log(app_name)

    return(
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
            <div>
                <VerticalTimeline />    
            </div>
        </div>
    )
}