import { useNavigate } from "react-router-dom";
import { useRef, useState } from 'react';
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
import PrivacyTypesChart from "~/components/PrivacyTypesChart"
import DataTypesChart from "~/components/DataTypesChart"


import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PercentageGraph from "~/components/PercentageGraph";

import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{
    title: "Dashboard",
  }];
};

export async function loader({ params }: LoaderFunctionArgs) {
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
  const response4 = await fetch('http://localhost:8017/figure7');
  const privacyTypes = await response4.json();
  const response5 = await fetch('http://localhost:8017/figure8');
  const dataTypes = await response5.json();
  const response6 = await fetch('http://localhost:8017/figure13');
  const appGenre = await response6.json();

  return [vennDiagramData, percentageData, dateJson, longitude, ratios, matrix, privacyTypes, dataTypes, appGenre]
}

export default function Index() {
  const refs = useRef([]);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();
  const vennDiagram = data[0];
  const percentage = data[1];
  const dates = data[2];
  const longitude = data[3];
  const ratios = data[4];
  const matrix = data[5];
  const privacyTypes = data[6];
  const dataTypes = data[7];
  const appGenre = data[8];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const goToApps = () => {
    navigate("/search");
  };

  const goToGraphs = () => {
    navigate("/graphs");
  };

  const handleScroll = (index: any) => {
    setActiveButton(index);
    refs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const { theme } = useTheme();

  return (
    <>
      {state === "loading" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin" size={72} />
        </div>
      ) : (
        <div className={`min-h-screen overflow-visible ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
          <div className="fixed left-0 top-14 p-4">
            <button
              onClick={toggleMenu}
              className={`px-4 py-2 text-lg font-bold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                theme === 'dark' ? 'bg-black text-white border border-slate-800' : 'bg-white text-black border-black'
              }`}
            >
              Graph Navigation
            </button>
          </div>

          <div id="main-text">
            <div>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'fixed left-0 top-120 flex flex-col space-y-4 p-4 items-start' : 'max-h-0 opacity-0'
                } mt-4 space-y-4`}
              >
                <button onClick={() => handleScroll(0)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>App Privacy Trends</button>
                <button onClick={() => handleScroll(1)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Purpose Ratios</button>
                <button onClick={() => handleScroll(2)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Data Category Ratios</button>
                <button onClick={() => handleScroll(3)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Privacy Type Overlap</button>
                <button onClick={() => handleScroll(4)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>App Cost Ratios</button>
                <button onClick={() => handleScroll(5)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Yearly App Releases</button>
                <button onClick={() => handleScroll(6)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Data Categories</button>
                <button onClick={() => handleScroll(7)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>Data Types</button>
                <button onClick={() => handleScroll(8)} className={`px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${
                    theme === 'dark' ? 'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' : 'bg-white text-red border-black'}`}>App Genres</button>
              </div>
              <div style={{ width: '80%', margin: '0 auto' }}>
                <div
                  className={`mb-20 mt-10 ${isExpanded ? 'fixed inset-0 z-50 bg-white' : ''
                    }`}

                  ref={(el) => (refs.current[0] = el)}
                >
                  <h1 className="text-center font-bold">Annual Trends in App Privacy Compliance</h1>
                  <LineChart data={longitude} />

                  <h3 className={`${isExpanded ? 'hidden' : ''}`}>A longitudinal view over the year-long collection period of the total number of apps and the total number of apps with privacy labels (compliant apps). For comparison, we also display the four Privacy Types over the same period. Each data point represents a snapshot of the Apple App Store on that date.</h3>
                  <button
                    onClick={handleToggleExpand}
                    className="px-4 py-2 z-50 bg-slate-400 rounded"
                  >
                    {isExpanded ? 'Exit Fullscreen' : 'Expand'}
                  </button>
                </div>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[1] = el))}>
                  <h1 className="text-center font-bold">Purpose Distribution Across Privacy Types</h1>
                  <div className="flex flex-row space-x-4 mt-10 mb-20">
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Not Linked to You</h1>
                      <Ratios data={ratios.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" />
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Linked to You</h1>
                      <Ratios data={ratios.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" />
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Used to Track You</h1>
                      <Ratios data={ratios.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" />
                    </div>
                  </div>
                  <h3>The ratios of the six Purposes for the Data Used to Track You, Data Linked to You and Data Not Linked to You Privacy Types. The denominator is the number of apps in the specific Privacy Type.</h3>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[2] = el))}>
                  <h1 className="text-center font-bold">Data Category Ratios by Privacy Type</h1>
                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col items-center w-1/2">
                      <h1 className="text-center">Data Not Linked to You</h1>
                      <MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} />
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                      <h1 className="text-center">Data Linked to You</h1>
                      <MatrixChart data={matrix.DATA_LINKED_TO_YOU} />
                    </div>
                  </div>
                  <h4>The ratios of Data Categories by the reported Purpose for the Data Linked to You (left) and Data Not Linked
                    to You (right) Privacy Types.</h4>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[3] = el))}>
                  <h1 className="text-center  font-bold" >Overlap of Apps by Privacy Type</h1>
                  <VennDiagram data={vennDiagram} />
                  <h3 className="mt-5">A Venn diagram of the number of apps in each
                    of the four Privacy Types. Data Not Collected is mutually
                    exclusive to the other three Privacy Types</h3>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[4] = el))}>
                  <h1 className="text-center font-bold" >App Costs vs. Privacy Practices</h1>
                  <PercentageGraph data={percentage} />
                  <h3 className="mt-5 text-wrap">The ratios of app costs for each of the four Privacy Types.  Free apps are more likely than paid apps to collect data, including data used to track and
                    linked to users.</h3>
                </div>

                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[5] = el))}>
                  <h1 className="text-center font-bold" >Yearly App Releases with Privacy Labels</h1>
                  <YearGraph data={dates} />
                  <h3 className="">The number of apps released during a given year for each of the four Privacy Types. The pink bars show the total
                    number of apps with privacy labels released in that year. </h3>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[6] = el))}>
                  <h1 className="text-center font-bold" >Ratio of Data Categories for Each Privacy Type</h1>
                  <div className="flex flex-row space-x-4 mt-10">
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Not Linked to You</h1>
                      <PrivacyTypesChart data={privacyTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" />
                    </div>
                  </div>

                    <div className="mb-20" ref={(el => (refs.current[2] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl">Data Category Ratios by Privacy Type</h1>
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                        <div className="flex flex-col items-center w-full md:w-1/2">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                          <MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/2">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                          <MatrixChart data={matrix.DATA_LINKED_TO_YOU} />
                        </div>
                      </div>
                      <h4 className="text-sm md:text-base">The ratios of Data Categories by the reported Purpose for the Data Linked to You (left) and Data Not Linked
                        to You (right) Privacy Types.</h4>
                    </div>
                    <div className="mb-20" ref={(el => (refs.current[3] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >Overlap of Apps by Privacy Type</h1>
                      <VennDiagram data={vennDiagram} />
                      <h3 className="text-sm md:text-base">A Venn diagram of the number of apps in each
                        of the four Privacy Types. Data Not Collected is mutually
                        exclusive to the other three Privacy Types</h3>
                    </div>
                    <div className="mb-20" ref={(el => (refs.current[4] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >App Costs vs. Privacy Practices</h1>
                      <PercentageGraph data={percentage} />
                      <h3 className="text-sm md:text-base">The ratios of app costs for each of the four Privacy Types.  Free apps are more likely than paid apps to collect data, including data used to track and
                        linked to users.</h3>
                    </div>

                    <div className="mb-20" ref={(el => (refs.current[5] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >Yearly App Releases with Privacy Labels</h1>
                      <YearGraph data={dates} />
                      <h3 className="text-sm md:text-base">The number of apps released during a given year for each of the four Privacy Types. The pink bars show the total
                        number of apps with privacy labels released in that year. </h3>
                    </div>
                    <div className="mb-20" ref={(el => (refs.current[6] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Categories for Each Privacy Type</h1>
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">

                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                          <PrivacyTypesChart data={privacyTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                          <PrivacyTypesChart data={privacyTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                          <PrivacyTypesChart data={privacyTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" />
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base">The ratios of the 14 Data Categories for each of
                        three Privacy Types. The denominator is the number of apps
                        in the specific Privacy Type.</h3>
                    </div>
                    <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={(el => (refs.current[7] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Types for Each Privacy Type</h1>
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                          <DataTypesChart data={dataTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                          <DataTypesChart data={dataTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/3">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                          <DataTypesChart data={dataTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" />
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base">The ratios of the 32 Data Types for each of three
                        Privacy Types. The denominator is the number of apps in the
                        specific Privacy Type.</h3>
                    </div>
                    <div className="mb-20" ref={(el => (refs.current[8] = el))}>
                      <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of App Genre for Each Privacy Type</h1>
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                        <div className="flex flex-col items-center w-full md:w-1/4">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                          <DataTypesChart data={appGenre.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/4">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                          <DataTypesChart data={appGenre.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/4">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                          <DataTypesChart data={appGenre.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" />
                        </div>
                        <div className="flex flex-col items-center w-full md:w-1/4">
                          <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Collected</h1>
                          <DataTypesChart data={appGenre.DATA_NOT_COLLECTED} color="rgba(245, 206, 39, 0.8)" />
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base md:justify-center">The ratios of top apps in app store genres for each of the four Privacy Types. The denominator is the number of apps
                        with the designated app store genre that have a privacy label. This includes only apps placed in the top in genre categories.</h3>
                    </div>
                    </div>
                  </div>
                </div>
            </div>
      )}
          </>
  );
}


