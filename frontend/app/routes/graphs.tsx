import React from "react";
import { useNavigation } from "@remix-run/react";
import { FaSpinner } from "react-icons/fa";
import { json, LoaderFunction } from '@remix-run/node'; // Corrected import
import { useLoaderData } from '@remix-run/react'; // Corrected import
import LineChart from '~/components/LineChart'; // Ensure this path is correct

export const loader: LoaderFunction = async () => {
    const response = await fetch('http://localhost:8017/longitude');
    const data = await response.json();
    return json(data);
};

export default function Graphs() {
    const { state } = useNavigation();
    const data = useLoaderData();

    return (
        <>
            {state === "loading" ?
                <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
                    <FaSpinner className="animate-spin" size={72} />
                </div>
                :
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <h1>Longitude Data Chart</h1>
                    <LineChart data={data} />
                    <h3>A longitudinal view over the year-long collection period of the total number of apps and the total number of apps
with privacy labels (compliant apps). For comparison, we also display the four Privacy Types over the same period. Each data
point represents a snapshot of the Apple App Store on that date.</h3>
                </div>

            }
            {/* <div className="h-screen p-2">
                <h1>Graphs</h1>
                <iframe className="pointer-events-none w-full" src="http://localhost:5601/app/dashboards#/view/e35304c0-2f07-11ef-be6b-3f0232c42c87?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&_a=()&hide-filter-bar=true" height="600" width="800"></iframe>
            </div> */}
        </>
    );
}
