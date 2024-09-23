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

import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{
    title: "Dashboard",
  }];
};

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
    navigate("/dashboard");
  }

  const goToInfo = () => {
    navigate("/documentation");
  }

  const { theme } = useTheme();
  return (
    <>
      {state === "loading" ?
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin" size={72} />
        </div>
        :
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark' : 'bg-light'} overflow-hidden`}>
          <div id="main-text">

            <div className="mb-20">
              <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Dashboard</h1>
              <h2 className="text-lg text-white-700 mb-4 text-center">
                We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year.
              </h2>
              <h2 className="text-xl text-white-700 mb-4 mt-5 text-center">
                Explore our database:
              </h2>
              <div className="flex justify-center items-center space-x-10 mt-20">
              < button onClick={() => goToApps()}className={`px-5 py-3 text-xl font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-grey '}`}>the Apps</button>
                <button onClick={() => goToGraphs()} className={`px-5 py-3 text-xl font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-grey '}`}>the Graphs</button>
                <button onClick={() => goToInfo()} className={`px-5 py-3 text-xl font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-grey '}`}>the Research</button>
              </div>
              </div>

          </div>
        </div>
      }
    </>
  );
}

