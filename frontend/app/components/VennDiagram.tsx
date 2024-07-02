import React from "react";
import { LoaderFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { useState } from "react";

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
        'Data Not Linked to You': data['not_linked'],
        'Data Linked to You': data['linked'],
        'Data Used to Track You': data['track'],
        '(Data Not Linked to You ∩ Data Linked to You)': data['linked_not_linked'],
        '(Data Not Linked to You ∩ Data Used to Track You)': data['track_not_linked'],
        '(Data Linked to You ∩ Data Used to Track You)': data['track_linked'],
        '(Data Not Linked to You ∩ Data Linked to You ∩ Data Used to Track You)': data['all_three'],
      };

    const valuesMap = {};

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

    const sets = useMemo(() => extractSets(elems), [elems]);
    const combinations = useMemo(() => generateCombinations(sets), [sets]);

    
    combinations.forEach(combination => {
        combination.cardinality = mapping[combination.name]
    })


    return (
        <div>
            <VennDiagram
                sets={sets}
                combinations={combinations}
                width={780}
                height={400}
            />
        </div>
    );
}

export default VennDiagrams