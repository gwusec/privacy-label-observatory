import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import 'shepherd.js/dist/css/shepherd.css';
import { useTheme } from "next-themes";
import Shepherd from 'shepherd.js';

import { FaSpinner } from "react-icons/fa";
import { useNavigation } from "@remix-run/react";

export default function Index() {
  const navigate = useNavigate()
  const {state} = useNavigation()

  const goToApps=()=>{
    navigate("/search");
  }

  const goToGraphs=()=>{
    navigate("/graphs");
  }

  const { theme } = useTheme();
  return (
    <>
    {state === "loading" ?
    <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-2/4">
        <FaSpinner className="animate-spin" size={72}/>
    </div>
    :
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'}`}>
      <div id="main-text">

      <div className="mb-20">
        <h1 className="text-4xl font-semibold mb-16 text-center">GWU SEC Privacy Label Observatory Dashboard</h1>
        <h2 className="text-lg text-white-700 mb-4 text-center">
          We collected nearly weekly snapshots of the privacy labels of 1.6+ million apps over the span of a year. Explore our database:
        </h2>
        <div className="flex justify-center items-center space-x-4">
          <button onClick={() => goToApps()} className={`px-4 py-1 text-lg font-semibold rounded-full border ${theme === 'dark' ? 'text-dred hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red border-black'}`}>the Apps</button>
          <button onClick={() => goToGraphs()} className={`px-4 py-1 text-lg font-semibold rounded-full border ${theme === 'dark' ? 'text-dred hover:text-red hover:bg-white' : 'text-red hover:text-white hover:bg-red border-black'}`}>the Graphs</button>
          </div>
        </div>
        
      </div>
    </div>
    }
    </>
  );
}
