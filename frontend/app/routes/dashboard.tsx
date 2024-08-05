import { useNavigate } from "react-router-dom";
// import 'shepherd.js/dist/css/shepherd.css';
import { useTheme } from "next-themes";
import Shepherd from 'shepherd.js';

import { FaSpinner } from "react-icons/fa";
import { useNavigation } from "@remix-run/react";
import LineChart from '~/components/LineChart';
import Ratios from '~/components/Ratios';
import MatrixChart from '~/components/MatrixChart';
import VennDiagram from "~/components/VennDiagram";
import YearGraph from "~/components/YearGraph"

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PercentageGraph from "~/components/PercentageGraph";

export async function loader({params}: LoaderFunctionArgs){
  const venn = await fetch(process.env.BACKEND_API + "venn")
  const vennDiagramData = await venn.json()
  const percentage = await fetch(process.env.BACKEND_API + "graph16")
  const percentageData = await percentage.json()
  const dates = await fetch(process.env.BACKEND_API + "graph14")
  const dateJson = await dates.json()

  const response = await fetch('http://localhost:8017/longitude');
  const longitude = await response.json();
  const response2 = await fetch('http://localhost:8017/ratios');
  const ratios = await response2.json();
  const response3 = await fetch('http://localhost:8017/matrix');
  const matrix = await response3.json();


  return [vennDiagramData, percentageData, dateJson, longitude, ratios, matrix]
}

export default function Index() {
  const navigate = useNavigate()
  const { state } = useNavigation()
    const data = useLoaderData<typeof loader>();
    const vennDiagram = data[0]
    const percentage = data[1]
    const dates = data[2]
    const longitude = data[3]
    const ratios = data[4]
    const matrix = data[5]

  const goToApps = () => {
    navigate("/search");
  }

  const goToGraphs = () => {
    navigate("/graphs");
  }

  const { theme } = useTheme();
  return (
    <>
      {state === "loading" ?
        <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
          <FaSpinner className="animate-spin" size={72} />
        </div>
        :
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'} overflow-hidden`}>
          <div id="main-text">

            <div className="mb-20">
              <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Dashboard</h1>
              <h2 className="text-lg text-white-700 mb-4 text-center">
                We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year. Explore our database:
              </h2>
              <div className="flex justify-center items-center space-x-4">
                <button onClick={() => goToApps()} className={`px-4 py-1 text-lg font-semibold rounded-full border ${theme === 'dark' ? 'text-dred hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red border-black'}`}>the Apps</button>
                {/* <button onClick={() => goToGraphs()} className={`px-4 py-1 text-lg font-semibold rounded-full border ${theme === 'dark' ? 'text-dred hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red border-black'}`}>the Graphs</button> */}
              </div>

              <div style={{ width: '80%',  margin: '0 auto' }}>
                    <div className="mb-10 mt-10">
                        <h1 className="text-center font-bold">Longitude Data Chart</h1>
                            <LineChart data={longitude} />
                        <h3>A longitudinal view over the year-long collection period of the total number of apps and the total number of apps with privacy labels (compliant apps). For comparison, we also display the four Privacy Types over the same period. Each data point represents a snapshot of the Apple App Store on that date.</h3>
                    </div>
                    <div className="mb-10">
                      <h1 className="text-center font-bold">Purpose Chart</h1>
                      <div className="flex flex-row space-x-4 mt-10 mb-10">
                          <div className="flex flex-col items-center w-1/3">
                              <h1 className="text-center mb-4">Data Used to Track You</h1>
                              <Ratios data={ratios.DATA_USED_TO_TRACK_YOU} />
                          </div>
                          <div className="flex flex-col items-center w-1/3">
                              <h1 className="text-center mb-4">Data Linked to You</h1>
                              <Ratios data={ratios.DATA_LINKED_TO_YOU} />
                          </div>
                          <div className="flex flex-col items-center w-1/3">
                              <h1 className="text-center mb-4">Data Not Linked to You</h1>
                              <Ratios data={ratios.DATA_NOT_LINKED_TO_YOU} />
                          </div>
                      </div>
                      <h3>The ratios of the six Purposes for the Data Used to Track You, Data Linked to You and Data Not Linked to You Privacy Types. The denominator is the number of apps in the specific Privacy Type.</h3>
                    </div>
                    <div className="mb-10">
                      <h1 className="text-center font-bold">Matrix Charts</h1>
                      <div className="flex flex-row space-x-4 mt-10 mb-10">
                          <div className="flex flex-col items-center w-1/2">
                              <h1 className="text-center mb-4">Data Linked to You</h1>
                              <MatrixChart data={matrix.DATA_LINKED_TO_YOU} />
                          </div>
                          <div className="flex flex-col items-center w-1/2">
                              <h1 className="text-center mb-4">Data Not Linked to You</h1>
                              <MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} />
                          </div>
                      </div>
                      <h3>The ratios of of Data Categories by the reported Purpose for the Data Linked to You and Data Not Linked
to You Privacy Types.</h3>
                    </div>
                    <div className="mb-10"> 
                        <h1 className="text-center  font-bold" >Venn Diagram</h1>
                        <VennDiagram data={vennDiagram}/>
                        <h3 className="mt-5">A Venn diagram of the number of apps in each
of the four Privacy Types. Data Not Collected is mutually
exclusive to the other three Privacy Types</h3>
                    </div>
                    <div className="mb-10">
                      <h1 className="text-center font-bold" >Data Collected per Payment Method</h1>
                        <PercentageGraph data={percentage} />
                        <h3 className="mt-5 text-wrap">The ratios of app costs for each of the four Privacy Types.  Free apps are more likely than paid apps to collect data, including data used to track and
linked to users.</h3>
                    </div>

                    <div className="mb-10">
                    <h1 className="text-center  font-bold" >Years vs Type of Apps</h1>
                        <YearGraph data={dates} />
                        <h3 className="">The number of apps released during a given year for each of the four Privacy Types. The pink bars show the total
number of apps with privacy labels released in that year. </h3>
                        </div>
                </div>
            </div>

          </div>
        </div>
      }
    </>
  );
}