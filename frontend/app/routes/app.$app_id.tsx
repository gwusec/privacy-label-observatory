import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@nextui-org/react';
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Timeline from '~/components/Timeline';

export async function loader({params}:LoaderFunctionArgs){
    console.log("running this loader")
    const q = params.app_id
    console.log(q)
    if(q == undefined){
        return
    }

    const app = await fetch(process.env.BACKEND_API + "fullApp?id=" + q)
    const data = await app.json()
    return(json(data))
};

export default function searchApp(){

    const data = useLoaderData<typeof loader>();
    console.log("data", data)
    return(
        <div className={`items-start min-h-screen h-full`}>
            <Timeline data={data}/>
        </div>
    )
}