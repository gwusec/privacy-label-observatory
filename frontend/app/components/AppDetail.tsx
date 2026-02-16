import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useNavigate } from "@remix-run/react";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import HorizontalTimeline from '~/components/HorizontalTimeline';
import AppDataColumn from '~/components/AppDataColumn';
import { Button } from '@nextui-org/react';

//Iconography 
import linked from "../resources/linked.svg"
import not_linked from "../resources/not_linked.svg"
import track from "../resources/track.svg"

import linked_dark from "../resources/linked_dark.svg"
import not_linked_dark from "../resources/not_linked_dark.svg"
import track_dark from "../resources/track_dark.svg"

type PrivacyType = "DATA_USED_TO_TRACK_YOU" | "DATA_LINKED_TO_YOU" | "DATA_NOT_LINKED_TO_YOU";

interface DataCategory {
  identifier: string;
  dataTypes: string[];
}

interface Purpose {
  purpose: string;
  identifier: string;
  dataCategories: DataCategory[] | null;
}

interface dataCat {
  identifier: string,
  dataTypes: string[];
}

interface purpose {
  purpose: string,
  identifier: string,
  dataCategories: dataCat[] | null;
}

interface privLabel {
  identifier: string,
  dataCategories: dataCat[] | null,
  purposes: purpose[] | null;
}

interface PrivacyDetail {
  identifier: string;
  dataCategories: DataCategory[] | null;
  purposes: Purpose[] | null;
}

export default function AppDetail({ data, dates, firstIndex, aiOverview}: { data: any, dates:any, firstIndex: number, aiOverview?: string }) {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevActiveIndex, setPrevActiveIndex] = useState(0);
  const [privDetails, setPrivDetails] = useState<privLabel[]>([]);
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [allColumns, expandAllColumns] = useState(true);
  const { theme } = useTheme();
  var app_name = data[0]["app_name"]
  var app_id = data[0]["app_id"]
  var image_url = data[0]["image_url"]
  var privacy_types = data[1]["privacy"]

  const privacyTypes: Record<PrivacyType, {
      title: string;
      icon: string;
      id: string;
      description?: string;
  }> = {
      "DATA_USED_TO_TRACK_YOU": {
          title: "Data Used to Track You",
          icon: theme === 'dark' ? track_dark : track,
          id: 'duty',
          description: "The following data may be collected and linked to your identity:"
      },
      "DATA_LINKED_TO_YOU": {
          title: "Data Linked to You",
          icon: theme === 'dark' ? linked_dark : linked,
          id: 'dlty',
          description: "The following data may be collected but it is not linked to your identity:"
      },
      "DATA_NOT_LINKED_TO_YOU": {
          title: "Data Not Linked to You",
          icon: theme === 'dark' ? not_linked_dark : not_linked,
          id: 'dnlty',
          description: "The following data may be collected but it is not linked to your identity:"
      }
  };


  const handleReturnToSearch = () => {
    navigate("/search")
  };

  const updateParent = (index: number) => {
    setPrevActiveIndex(activeIndex);
    setActiveIndex(index);
    setPrivDetails(privacy_types[index]["privacy_types"]["privacyDetails"]["privacyTypes"]);
  }

  const handleExpand = (column: any) => {
    expandAllColumns(false)
    if (expandedColumn === column) {
      setExpandedColumn(null); // Collapse if already expanded
    } else {
      setExpandedColumn(column); // Expand the clicked column
    }
  };

  const expandAll = () => {
    setExpandedColumn(null);
    if (allColumns === false) {
      expandAllColumns(true); // Collapse if already expanded
    } else {
      expandAllColumns(false); // Expand the clicked column
    }
  };

  useEffect(() => {
    setPrivDetails(privacy_types[activeIndex]["privacy_types"]["privacyDetails"]["privacyTypes"]);
  }, [activeIndex])

  return (
      <>
          {/* App Header */}
          <div className="ml-10 flex">
              <img
                  className="w-40 h-40 rounded-[22.5%] m-4"
                  src={image_url ?? noPhoto}
                  alt={app_name}
              />
              <div className="ml-10 m-4 flex flex-col justify-center flex-grow">
                  <h1 className="text-2xl font-bold">{app_name}</h1>
                  <h2 className="text-sm text-gray-500">App ID: {app_id}</h2>
                  <div>
                      <a
                          href={`https://apps.apple.com/app/id${app_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          <Button
                              className="mt-2"
                              color="primary"
                              variant="flat"
                          >
                              View on App Store
                          </Button>
                      </a>
                  </div>
              </div>
          </div>
          {/* --- AI Overview --- */}
            {aiOverview && (
                <div className="mx-4 mb-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-800">
                    <h3 className="font-bold mb-2">AI Overview</h3>
                    <p className="whitespace-pre-line">{aiOverview}</p>
                </div>
            )}

          {/* Horizontal Timeline */}
          {firstIndex >= 0 ? (
              <div className={`flex justify-center items-center `}>
                  <div
                      className={` p-4 mb-4 rounded-lg h-fit ml-2 w-fit ${
                          theme === "dark"
                              ? "bg-neutral-300 rounded-lg shadow"
                              : ""
                      }`}
                  >
                      <HorizontalTimeline
                          privtypes={privacy_types}
                          dates={dates}
                          updateParent={updateParent}
                      />
                  </div>
              </div>
          ) : (
              <div className="w-full mb-4 text-center">
                  <p className="text-gray-500">
                      {privacy_types.length} identical{" "}
                      {privacy_types.length === 1
                          ? "measurement"
                          : "measurements"}
                  </p>
              </div>
          )}

          {/* Toolbar buttons */}
          <div className="flex flex-row justify-between items-end mr-4">
              <Button className="ml-6" onClick={handleReturnToSearch}>
                  Return to Search
              </Button>
              {privDetails.length > 0 ? (
                  <Button
                      onClick={() => expandAll()}
                      className={`hidden text-cyan-500 lg:block hover:bg-cyan-300 ${
                          theme === "dark" ? "bg-black" : "bg-white"
                      } font-medium`}
                  >
                      {allColumns ? "Condense" : "Expand"}
                  </Button>
              ) : (
                  <></>
              )}
          </div>

          {/* Privacy Data Columns */}
          <div className="flex gap-4 mx-4 mt-4">
              {/* Show a column for each privacyTypes */}
              {Object.keys(privacyTypes).map((privacyType) => {
                  const config = privacyTypes[privacyType as PrivacyType];

                  const data: PrivacyDetail = privDetails.filter(
                      (detail) => detail.identifier === privacyType
                  )[0];
                  const prevData: PrivacyDetail = privacy_types[
                      prevActiveIndex
                  ]["privacy_types"]["privacyDetails"]["privacyTypes"].filter(
                      (detail: { identifier: string }) =>
                          detail.identifier === privacyType
                  )[0];

                  return (
                      <AppDataColumn
                          key={config.id}
                          privacyDetails={data}
                          prevPrivacyDetails={prevData}
                          configuration={config}
                          showDataTypes={allColumns}
                          expanded={expandedColumn}
                          onExpand={() => handleExpand(config.id)}
                      />
                  );
              })}
          </div>
      </>
  );
}