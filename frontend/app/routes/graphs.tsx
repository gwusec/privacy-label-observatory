import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";

export default function Graphs(){
    return(
        <div className="h-screen p-2">
            <h1>Graphs</h1>
            <iframe className="pointer-events-none w-full" src="http://localhost:5601/app/dashboards#/view/e35304c0-2f07-11ef-be6b-3f0232c42c87?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&_a=()&hide-filter-bar=true" height="600" width="800"></iframe>
            <LoremIpsum
            p={5}
            />
        </div>
    )
}