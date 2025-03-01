import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { FaSpinner } from "react-icons/fa";
import { useNavigation } from "@remix-run/react";
import Ratios from '~/components/Ratios';
import MatrixChart from '~/components/MatrixChart';
import VennDiagram from "~/components/VennDiagram";
import YearGraph from "~/components/YearGraph"
import PrivacyTypesChart from "~/components/PrivacyTypesChart"
import DataTypesChart from "~/components/DataTypesChart"
import LongitudeChart from "~/components/LongitudeChart";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PercentageGraph from "~/components/PercentageGraph";
import ContentRatings from "~/components/ContentRatings";
import SizeGraph from "~/components/SizeGraph";
import { MetaFunction } from "@remix-run/node";
import RatingCounts from "~/components/RatingCounts";

export const meta: MetaFunction = () => {
  return [{
    title: "Dashboard",
  }];
};

interface GraphPopupProps {
  isOpen: boolean;
  onClose: () => void;
  graphData: any;
  theme: string | undefined;
  id: any;
  setId: any;
  ogId: number;
}

const GraphPopup = ({ isOpen, onClose, graphData, theme, id, setId, ogId }: GraphPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Reset to default when closed
    }

    // Cleanup when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = ''; // Ensure scroll is reset on unmount
    };
  }, [isOpen]);
  if (!isOpen) return null;

  const { id: _, ...dataWithoutId } = graphData;
  console.log(dataWithoutId)

  // Convert dataWithoutId to an array to easily slice it based on the current id
  const dataEntries = Object.entries(dataWithoutId);
  const subtraction = ogId - id;

  // Slice the data based on the current id
  let slicedData = Object.fromEntries(dataEntries.slice(0, dataEntries.length - subtraction));


  const nextData = () => {
    if (id + 1 >= Number(graphData['id'])) {
      setId(Number(graphData['id']))
    } else {
      setId(id += 1)
    }
    slicedData = Object.fromEntries(dataEntries.slice(0, id + 1));
    console.log(slicedData)
  }
  const prevData = () => {
    if (id - 1 <= 0) {
      setId(0)
    } else {
      setId(id -= 1);
    }
    slicedData = Object.fromEntries(dataEntries.slice(0, id + 1));
    console.log(slicedData)
  }

  // Next and Prev Buttons Disabled?
  const isPrevDisabled = id <= 0;
  const isNextDisabled = id >= Number(graphData['id']);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'} bg-opacity-50`}>
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} p-6 rounded-lg shadow-lg w-full max-w-[95vw] h-[90vh] flex flex-col`}>

        {/* Graph Section */}
        <div className="flex-grow pt-40 overflow-auto">
          <LongitudeChart data={slicedData} isExpanded={true} />
        </div>

        {/* Buttons Section */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevData}
            disabled={isPrevDisabled}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Remove a Run
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded`}
          >
            Close
          </button>
          <button
            onClick={nextData}
            disabled={isNextDisabled}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Add a Run
          </button>
        </div>
      </div>
    </div>

  );
};

export async function loader({ params }: LoaderFunctionArgs) {
  const latestRun = await fetch(process.env.BACKEND_API + "latestIndex"); 
  const runData: string = (await latestRun.json()).latestRun;

  const venn = await fetch(process.env.BACKEND_API + "venn")
  const vennDiagramData = await venn.json()

  const percentage = await fetch(process.env.BACKEND_API + "graph16?run=" + runData);
  const percentageData = await percentage.json();

  const dates = await fetch(process.env.BACKEND_API + "graph14");
  const dateJson = await dates.json();

  const response = await fetch(process.env.BACKEND_API + "longUpdated");
  const longitude = await response.json();

  const response2 = await fetch(process.env.BACKEND_API + "ratios");
  const ratios = await response2.json();

  const response3 = await fetch(process.env.BACKEND_API + "matrix");
  const matrix = await response3.json();

  const response4 = await fetch(process.env.BACKEND_API + "figure7");
  const privacyTypes = await response4.json();

  const response5 = await fetch(process.env.BACKEND_API + "figure8");
  const dataTypes = await response5.json();

  const response6 = await fetch(process.env.BACKEND_API + "figure13");
  const appGenre = await response6.json();

  const version = await fetch(process.env.BACKEND_API + "graph11?run=" + runData);
  const versionData = await version.json();

  const rating = await fetch(process.env.BACKEND_API + "graph12?run=" + runData);
  const ratingData = await rating.json();

  const size = await fetch(process.env.BACKEND_API + "graph15?run=" + runData);
  const sizeData = await size.json();

  return [vennDiagramData, percentageData, dateJson, longitude, ratios, matrix, privacyTypes, dataTypes, appGenre, versionData, ratingData, sizeData];
}

export default function Index() {
  const refs = useRef<Array<HTMLDivElement>>([]);
  const navigate = useNavigate();
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
  const contentData = data[9];
  const ratingData = data[10];
  const sizeData = data[11];


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(Number(longitude['id']));
  const ogId = Number(longitude['id'])

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
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

  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Find which section is currently in view
      const currentSection = refs.current.findIndex((ref) => {
        if (!ref) return false;
        const { offsetTop, offsetHeight } = ref;
        return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
      });

      if (currentSection !== -1) {
        setActiveButton(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (index) => {
    setActiveButton(index);
    refs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const getButtonStyles = (index:number) => {
    const baseStyles = `px-4 py-1 text-md font-semibold shadow-xl rounded-full transition-all duration-200`;
    const activeStyles = `scale-110 ${theme === 'dark' ?
      'bg-slate-700 border-2 border-slate-500 text-white' :
      'bg-slate-200 border-2 border-slate-300 text-black'}`;
    const inactiveStyles = `hover:scale-110 ${theme === 'dark' ?
      'bg-black border border-slate-800 text-dred hover:shadow-lg hover:shadow-slate-800' :
      'bg-white text-red border-black'}`;

    return `${baseStyles} ${activeButton === index ? activeStyles : inactiveStyles}`;
  };

  return (
    <>
      {state === "loading" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <FaSpinner className="animate-spin" size={72} />
        </div>
      ) : (
        <div className={`min-h-screen bg-cover overflow-visible ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
          <div className="fixed left-0 top-14 p-4 hidden md:block">
            <button
              onClick={toggleMenu}
              className={`px-4 py-2 text-lg font-bold shadow-xl rounded-full transition-transform duration-200 transform hover:scale-110 ${theme === 'dark' ? 'bg-black text-white border border-slate-800' : 'bg-white text-black border-black'
                }`}
            >
              Graph Navigation
            </button>
          </div>

          <div id="main-text">
            <div className="hidden md:block">
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'fixed left-0 top-120 flex flex-col space-y-4 p-4 items-start' : 'max-h-0 opacity-0'
                } mt-8 space-y-4`}>
                <button onClick={() => handleScroll(0)} className={getButtonStyles(0)}>
                  App Privacy Trends
                </button>
                <button onClick={() => handleScroll(1)} className={getButtonStyles(1)}>
                  Purpose Ratios
                </button>
                <button onClick={() => handleScroll(2)} className={getButtonStyles(2)}>
                  Data Category Ratios
                </button>
                <button onClick={() => handleScroll(3)} className={getButtonStyles(3)}>
                  Privacy Type Overlap
                </button>
                <button onClick={() => handleScroll(4)} className={getButtonStyles(4)}>
                  App Costs
                </button>
                <button onClick={() => handleScroll(5)} className={getButtonStyles(5)}>
                  Content Ratings
                </button>
                <button onClick={() => handleScroll(6)} className={getButtonStyles(6)}>
                  Rating Counts
                </button>
                <button onClick={() => handleScroll(7)} className={getButtonStyles(7)}>
                  App Sizes
                </button>
                <button onClick={() => handleScroll(8)} className={getButtonStyles(8)}>
                  Yearly App Releases
                </button>
                <button onClick={() => handleScroll(9)} className={getButtonStyles(9)}>
                  Data Categories
                </button>
                <button onClick={() => handleScroll(10)} className={getButtonStyles(10)}>
                  Data Types
                </button>
                <button onClick={() => handleScroll(11)} className={getButtonStyles(11)}>
                  App Genres
                </button>
              </div>
              <div style={{ width: '80%', margin: '0 auto' }}>
                <div
                  className={`mb-20`}
                  ref={(el:HTMLDivElement) => (refs.current[0] = el)}
                >
                  <h1 className="text-center font-bold">Annual Trends in App Privacy Compliance</h1>
                  <LongitudeChart data={longitude} isExpanded={isPopupOpen} />
                  <button
                    onClick={handleOpenPopup}
                    className={`px-4 py-2 z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'} rounded`}
                  >
                    Expand
                  </button>
                  <h3 className={``}>A longitudinal view over the year-long collection period of the total number of apps and the total number of apps with privacy labels (compliant apps). For comparison, we also display the four Privacy Types over the same period. Each data point represents a snapshot of the Apple App Store on that date.</h3>

                  <GraphPopup
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                    graphData={longitude}
                    theme={theme}
                    id={id}
                    setId={setId}
                    ogId={ogId}
                  />
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={((el:HTMLDivElement) => (refs.current[1] = el))}>
                  <h1 className="text-center font-bold">Purpose Distribution Across Privacy Types</h1>
                  <div className="flex flex-row space-x-4 mt-10 mb-20">
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Not Linked to You</h1>
                      <Ratios data={ratios.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Linked to You</h1>
                      <Ratios data={ratios.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <h1 className="text-center">Data Used to Track You</h1>
                      <Ratios data={ratios.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                    </div>
                  </div>
                  <h3>The ratios of the six Purposes for the Data Used to Track You, Data Linked to You and Data Not Linked to You Privacy Types. The denominator is the number of apps in the specific Privacy Type.</h3>
                </div>
                <div className={`mb-20`} ref={((el:HTMLDivElement) => (refs.current[2] = el))}>
                  <h1 className="text-center font-bold">Data Category Ratios by Privacy Type</h1>
                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col items-center w-1/2">
                      <h1 className="text-center">Data Not Linked to You</h1>
                      {/*<MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235," theme={theme} />*/}
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                      <h1 className="text-center">Data Linked to You</h1>
                      {/*<MatrixChart data={matrix.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255," theme={theme} />*/}
                    </div>
                  </div>
                  <h4>The ratios of Data Categories by the reported Purpose for the Data Linked to You (left) and Data Not Linked
                    to You (right) Privacy Types.</h4>
                </div>
                <div className={`mb-20`} ref={((el:HTMLDivElement) => (refs.current[3] = el))}>
                  <h1 className="text-center  font-bold" >Overlap of Apps by Privacy Type</h1>
                  <VennDiagram data={vennDiagram} />
                  <h3 className="mt-5">A Venn diagram of the number of apps in each
                    of the four Privacy Types. Data Not Collected is mutually
                    exclusive to the other three Privacy Types</h3>
                </div>
                <div className={`mb-20 `} ref={((el:HTMLDivElement) => (refs.current[4] = el))}>
                  <h1 className="text-center font-bold" >App Costs vs. Privacy Practices</h1>
                  <PercentageGraph data={percentage} />
                  <h3 className="mt-5 text-wrap">The ratios of app costs for each of the four Privacy Types.  Free apps are more likely than paid apps to collect data, including data used to track and
                    linked to users.</h3>
                </div>

                <div className={`mb-20 `} ref={((el:HTMLDivElement) => (refs.current[5] = el))}>
                  <h1 className="text-center font-bold" > Content Ratings vs. Privacy Practices</h1>
                  <ContentRatings data={contentData} />
                  <h3 className="mt-5 text-wrap"> The ratios of content ratings for each of the four Privacy Types. The denominator is the number of apps with the
                    designated content rating that have a privacy label. </h3>
                </div>

                <div className={`mb-20 `} ref={((el:HTMLDivElement) => (refs.current[6] = el))}>
                  <h1 className="text-center font-bold" > Rating Counts vs. Privacy Practices</h1>
                  <RatingCounts data={ratingData} />
                  <h3 className="mt-5 text-wrap"> The ratios of the rating counts for each of the four Privacy Types. The denominator is the number of apps with the
                    designated rating counts that have a privacy label. Apps with a larger number of user ratings are more likely to collect data,
                    including data used to track users. Ratings counts are not localized metadata and apps with low ratings counts in the US region
                    may have higher counts elsewhere. </h3>
                </div>

                <div className={`mb-20 `} ref={((el:HTMLDivElement) => (refs.current[7] = el))}>
                  <h1 className="text-center font-bold" > App Sizes vs. Privacy Practices</h1>
                  <SizeGraph data={sizeData} />
                  <h3 className="mt-5 text-wrap"> The ratios of app sizes for each of the four Privacy Types. The denominator is the number of apps with the designated
                    app size that have a privacy label. Apps that are larger in size are more likely to collect data, including data used to track and
                    linked to users.</h3>
                </div>

                <div className={`mb-20 `} ref={((el:HTMLDivElement) => (refs.current[8] = el))}>
                  <h1 className="text-center font-bold" >Yearly App Releases with Privacy Labels</h1>
                  <YearGraph data={dates} />
                  <h3 className="">The number of apps released during a given year for each of the four Privacy Types. The pink bars show the total
                    number of apps with privacy labels released in that year. </h3>
                </div>
                <div className="mb-20" ref={((el:HTMLDivElement) => (refs.current[9] = el))}>
                  <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Categories for Each Privacy Type</h1>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">

                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                      <PrivacyTypesChart data={privacyTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                      <PrivacyTypesChart data={privacyTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                      <PrivacyTypesChart data={privacyTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base">The ratios of the 14 Data Categories for each of
                    three Privacy Types. The denominator is the number of apps
                    in the specific Privacy Type.</h3>
                </div>
                <div className={`mb-20 ${isExpanded ? 'hidden' : ''}`} ref={((el:HTMLDivElement) => (refs.current[10] = el))}>
                  <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Types for Each Privacy Type</h1>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                      <DataTypesChart data={dataTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                      <DataTypesChart data={dataTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                      <DataTypesChart data={dataTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base">The ratios of the 32 Data Types for each of three
                    Privacy Types. The denominator is the number of apps in the
                    specific Privacy Type.</h3>
                </div>
                <div className="pb-20" ref={((el:HTMLDivElement) => (refs.current[11] = el))}>
                  <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of App Genre for Each Privacy Type</h1>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                    <div className="flex flex-col items-center w-full md:w-1/4">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                      <DataTypesChart data={appGenre.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/4">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                      <DataTypesChart data={appGenre.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/4">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                      <DataTypesChart data={appGenre.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/4">
                      <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Collected</h1>
                      <DataTypesChart data={appGenre.DATA_NOT_COLLECTED} color="rgba(245, 206, 39, 0.8)" theme={theme} />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base md:justify-center">The ratios of top apps in app store genres for each of the four Privacy Types. The denominator is the number of apps
                    with the designated app store genre that have a privacy label. This includes only apps placed in the top in genre categories.</h3>
                </div>
              </div>
            </div>
          </div>
          {/* Used for Mobile View */}
          <div className="block md:hidden min-h-screen h-fit">

            {/* Longitude Graph */}
            <div className="w-full max-w-3xl mx-auto px-4 md:px-8">
              <div className="mb-10 md:mb-20">
                <h1 className="text-center text-lg md:text-2xl font-bold">Annual Trends in App Privacy Compliance</h1>
                <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
                  <LongitudeChart data={longitude} isExpanded={isPopupOpen} />
                </div>
              </div>
            </div>

            {/* Ratio Graphs */}
            <div className={`mb-10 mt-20 md:mb-20`} >
              <h1 className="text-center font-bold text-lg md:text-2xl">Purpose Distribution Across Privacy Types</h1>
              <div className="flex flex-col md:flex-row md:space-x-4 mt-6 md:mt-10 mb-8 md:mb-20 space-y-8 md:space-y-0">
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h2 className="text-center text-base md:text-lg">Data Not Linked to You</h2>
                  <Ratios data={ratios.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h2 className="text-center text-base md:text-lg">Data Linked to You</h2>
                  <Ratios data={ratios.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h2 className="text-center text-base md:text-lg">Data Used to Track You</h2>
                  <Ratios data={ratios.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                </div>
              </div>

              <h3 className="text-sm md:text-base">
                The ratios of the six Purposes for the Data Used to Track You, Data Linked to You, and Data Not Linked to You Privacy Types. The denominator is the number of apps in the specific Privacy Type.
              </h3>
            </div>

            <div >
              <h1 className="text-center font-bold">Data Category Ratios by Privacy Type</h1>
              <div
                className={`flex flex-col md:flex-row md:space-x-4 space-y-10 md:space-y-0`}
              >
                <div className="flex flex-col items-center w-full md:w-1/2">
                  <h1 className="text-center text-lg md:text-xl">Data Not Linked to You</h1>
                  {/*<MatrixChart data={matrix.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235," theme={theme} />*/}
                </div>
                <div className="flex flex-col items-center w-full md:w-1/2">
                  <h1 className="text-center text-lg md:text-xl">Data Linked to You</h1>
                  {/*<MatrixChart data={matrix.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255," theme={theme} />*/}
                </div>
              </div>

              <h4 className="text-center mt-6 text-sm md:text-base">
                The ratios of Data Categories by the reported Purpose for the Data Linked to You (left) and Data Not Linked to You (right) Privacy Types.
              </h4>
            </div>

            {/* Venn Diagram Chart */}
            <div className={`mb-20`}>
              <h1 className="text-center  font-bold" >Overlap of Apps by Privacy Type</h1>
              <VennDiagram data={vennDiagram} />
              <h3 className="mt-5">A Venn diagram of the number of apps in each
                of the four Privacy Types. Data Not Collected is mutually
                exclusive to the other three Privacy Types</h3>
            </div>

            {/* Percentage Graph */}
            <div className={`mb-20 `}>
              <h1 className="text-center font-bold" >App Costs vs. Privacy Practices</h1>
              <PercentageGraph data={percentage} />
              <h3 className="mt-5 text-wrap">The ratios of app costs for each of the four Privacy Types.  Free apps are more likely than paid apps to collect data, including data used to track and
                linked to users.</h3>
            </div>

            {/* Content Graph */}
            <div className={`mb-20 h-full`}>
              <h1 className="text-center font-bold" > Content Ratings vs. Privacy Practices</h1>
              <ContentRatings data={contentData} />
              <h3 className="mt-5 text-wrap"> The ratios of content ratings for each of the four Privacy Types. The denominator is the number of apps with the
                designated content rating that have a privacy label. </h3>
            </div>

            {/* Rating Graph */}
            <div className={`mb-20 h-full`}>
              <h1 className="text-center font-bold" > Rating Counts vs. Privacy Practices</h1>
              <RatingCounts data={ratingData} />
              <h3 className="mt-5 text-wrap"> The ratios of the rating counts for each of the four Privacy Types. The denominator is the number of apps with the
                designated rating counts that have a privacy label. Apps with a larger number of user ratings are more likely to collect data,
                including data used to track users. Ratings counts are not localized metadata and apps with low ratings counts in the US region
                may have higher counts elsewhere. </h3>
            </div>

            {/* Size Graph */}
            <div className={`mb-20 h-full`}>
              <h1 className="text-center font-bold" > App Sizes vs. Privacy Practices</h1>
              <SizeGraph data={sizeData} />
              <h3 className="mt-5 text-wrap"> The ratios of app sizes for each of the four Privacy Types. The denominator is the number of apps with the designated
                app size that have a privacy label. Apps that are larger in size are more likely to collect data, including data used to track and
                linked to users.</h3>
            </div>

            {/* Year Graph */}
            <div className={`mb-20 `}>
              <h1 className="text-center font-bold" >Yearly App Releases with Privacy Labels</h1>
              <YearGraph data={dates} />
              <h3 className="">The number of apps released during a given year for each of the four Privacy Types. The pink bars show the total
                number of apps with privacy labels released in that year. </h3>
            </div>

            {/* Privacy Types Charts */}
            <div className="mb-20">
              <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Categories for Each Privacy Type</h1>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">

                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                  <PrivacyTypesChart data={privacyTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                  <PrivacyTypesChart data={privacyTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                  <PrivacyTypesChart data={privacyTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                </div>
              </div>
              <h3 className="text-sm md:text-base">The ratios of the 14 Data Categories for each of
                three Privacy Types. The denominator is the number of apps
                in the specific Privacy Type.</h3>
            </div>

            {/* Data Types Chart */}
            <div className={`mb-20`} >
              <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of Data Types for Each Privacy Type</h1>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                  <DataTypesChart data={dataTypes.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                  <DataTypesChart data={dataTypes.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                  <DataTypesChart data={dataTypes.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                </div>
              </div>
              <h3 className="text-sm md:text-base">The ratios of the 32 Data Types for each of three
                Privacy Types. The denominator is the number of apps in the
                specific Privacy Type.</h3>
            </div>

            <div>
              <h1 className="text-center font-bold text-xl md:text-2xl" >Ratio of App Genre for Each Privacy Type</h1>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-10 mb-20">
                <div className="flex flex-col items-center w-full md:w-1/4">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Linked to You</h1>
                  <DataTypesChart data={appGenre.DATA_NOT_LINKED_TO_YOU} color="rgba(54, 162, 235, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/4">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Linked to You</h1>
                  <DataTypesChart data={appGenre.DATA_LINKED_TO_YOU} color="rgba(153, 102, 255, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/4">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Used to Track You</h1>
                  <DataTypesChart data={appGenre.DATA_USED_TO_TRACK_YOU} color="rgba(75, 192, 192, 1)" theme={theme} />
                </div>
                <div className="flex flex-col items-center w-full md:w-1/4">
                  <h1 className="text-center font-semibold text-lg md:text-xl">Data Not Collected</h1>
                  <DataTypesChart data={appGenre.DATA_NOT_COLLECTED} color="rgba(245, 206, 39, 0.8)" theme={theme} />
                </div>
              </div>
              <h3 className="text-sm md:text-base md:justify-center">The ratios of top apps in app store genres for each of the four Privacy Types. The denominator is the number of apps
                with the designated app store genre that have a privacy label. This includes only apps placed in the top in genre categories.</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

