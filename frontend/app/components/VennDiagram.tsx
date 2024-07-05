import React from "react";
import { LoaderFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { useState } from "react";
import {lab} from "d3-color"

import { extractSets, generateCombinations, VennDiagram } from '@upsetjs/react';

export async function loader({params}: LoaderFunctionArgs){
    const venn = await fetch(process.env.BACKEND_API + "venn")
    const data = await venn.json()
    return json(data)
}


function VennDiagrams(){
    const data = useLoaderData<typeof loader>();
    console.log("VennDiagram", data)

    const mapping = {
        'Data Not Collected': data['not_collected'],
        'Data Not Linked to You': data['not_linked'],
        'Data Linked to You': data['linked'],
        'Data Used to Track You': data['track'],
        '(Data Not Linked to You ∩ Data Linked to You)': data['linked_not_linked'],
        '(Data Not Linked to You ∩ Data Used to Track You)': data['track_not_linked'],
        '(Data Linked to You ∩ Data Used to Track You)': data['track_linked'],
        '(Data Not Linked to You ∩ Data Linked to You ∩ Data Used to Track You)': data['all_three'],
      };
    
      const colors = {
        'Data Not Collected': 'gray',
        'Data Not Linked to You': 'red',
        'Data Linked to You': 'blue',
        'Data Used to Track You': 'green',
      };

    const elems = useMemo(
        () => [
            {sets: ['Data Not Linked to You'], value: data['not_linked']},
            {sets: ['Data Linked to You'], value: data['linked']},
            {sets: ['Data Used to Track You'], value: data['track']},
            {sets: ['Data Not Linked to You', 'Data Linked to You'], value: data['linked_not_linked']},
            {sets: ['Data Not Linked to You', 'Data Used to Track You'], value: data['track_not_linked']},
            {sets: ['Data Linked to You', 'Data Used to Track You'], value: data['track_linked']},
            {sets: ['Data Not Linked to You','Data Linked to You', 'Data Used to Track You'], value: data['all_three']}, 
        ], 
        [data]
    );

    const singularElem = useMemo(
        () => [
            {sets: ['Data Not Collected'], value: data['not_collected']},
        ], 
        [data]
    );

    const set = useMemo(() => extractSets(singularElem), [singularElem])
    const combination = useMemo(() => generateCombinations(set), [set]);

    const sets = useMemo(() => extractSets(elems), [elems]);
    const combinations = useMemo(() => generateCombinations(sets), [sets]);

    combination.forEach(combine => {
        combine.cardinality = mapping[combine.name]
    })
    
    combinations.forEach(combination => {
        combination.cardinality = mapping[combination.name]
    })


    return (
        <div className="flex flex-row items-center">
            <VennDiagram
                sets={sets}
                combinations={combinations}
                width={780}
                height={400}
                exportButtons={false}
                className="z-10"
            />
            <VennDiagram
                sets={set}
                combinations={combination}
                width={780}
                height={400}
                exportButtons={false}
                className="-ml-52"
            />
        </div>
    );
}

export default VennDiagrams