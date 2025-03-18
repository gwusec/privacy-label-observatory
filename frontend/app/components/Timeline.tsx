import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { useNavigate } from "@remix-run/react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import noPhoto from "../resources/no_available_photo.jpg"

//CSS and Component for the timeline
import HorizontalTimeline from '~/components/HorizontalTimeline';
import { Button } from '@nextui-org/react';

//Iconography 
import linked from "../resources/linked.svg"
import not_linked from "../resources/not_linked.svg"
import track from "../resources/track.svg"

import linked_dark from "../resources/linked_dark.svg"
import not_linked_dark from "../resources/not_linked_dark.svg"
import track_dark from "../resources/track_dark.svg"


interface dataType {
    data_category: number,
    data_type: string
}

interface dataCat {
    identifier: string,
    dataTypes: dataType[];
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

//Function that given a data type or a purpose (depending on privacy type)
//Returns the dynamic svg to be loaded
const getIconPath = (category: string, theme: string | undefined) => {

    const iconMapping = {
        "BROWSING_HISTORY": {
            light: "/apple_icons/browsing_history.svg",
            dark: "/apple_icons/browsing_history_dark.svg"
        },
        "CONTACT_INFO": {
            light: "/apple_icons/contact_info.svg",
            dark: "/apple_icons/contact_info_dark.svg"
        },
        "CONTACTS": {
            light: "/apple_icons/contacts.svg",
            dark: "/apple_icons/contacts_dark.svg"
        },
        "DIAGNOSTICS": {
            light: "/apple_icons/diagnostics.svg",
            dark: "/apple_icons/diagnostics_dark.svg"
        },
        "FINANCIAL_INFO": {
            light: "/apple_icons/financial_info.svg",
            dark: "/apple_icons/financial_info_dark.svg"
        },
        "HEALTH_AND_FITNESS": {
            light: "/apple_icons/health_and_fitness.svg",
            dark: "/apple_icons/health_and_fitness_dark.svg"
        },
        "IDENTIFIERS": {
            light: "/apple_icons/identifiers.svg",
            dark: "/apple_icons/identifiers_dark.svg"
        },
        "LOCATION": {
            light: "/apple_icons/location.svg",
            dark: "/apple_icons/location_dark.svg"
        },
        "OTHER_DATA": {
            light: "/apple_icons/other_data.svg",
            dark: "/apple_icons/other_data_dark.svg"
        },
        "PURCHASES": {
            light: "/apple_icons/purchases.svg",
            dark: "/apple_icons/purchases_dark.svg"
        },
        "SEARCH_HISTORY": {
            light: "/apple_icons/search_history.svg",
            dark: "/apple_icons/search_history_dark.svg"
        },
        "SENSITIVE_INFO": {
            light: "/apple_icons/sensitive_info.svg",
            dark: "/apple_icons/sensitive_info_dark.svg"
        },
        "USAGE_DATA": {
            light: "/apple_icons/usage_data.svg",
            dark: "/apple_icons/usage_data_dark.svg"
        },
        "USER_CONTENT": {
            light: "/apple_icons/user_content.svg",
            dark: "/apple_icons/user_content_dark.svg"
        }
    };


    // Return the corresponding icon or a default icon if the category is not found
    const icons = iconMapping[category];
    if (icons) {
        return theme === 'dark' ? icons.dark : icons.light;
    } else {
        return theme === 'dark' ? "/apple_icons/other_data_dark.svg" : "/apple_icons/other_data.svg";
    }
};

export default function Timeline({ data }: { data: any }) {
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(0);
    const [privDetails, setPrivDetails] = useState<privLabel[]>([]);
    const [expandedColumn, setExpandedColumn] = useState(null);
    const [allColumns, expandAllColumns] = useState(true);

    const handleClick = (event: any, index: number) => {
        setActiveIndex(index)
    };

    const handleButton = () => {
        navigate("/search")
    };

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


    const updateParent = (index: number) => {
        setActiveIndex(index)
    }
    const { theme } = useTheme();
    var app_name = data[0]["app_name"]
    var app_id = data[0]["app_id"]
    var image_url = data[0]["image_url"]
    var privacy_types = data[1]["privacy"]

    useEffect(() => {
        setPrivDetails(privacy_types[activeIndex]["privacy_types"]["privacyDetails"])
        if (privDetails.length == 0) { }
        else {
            setPrivDetails(privacy_types[activeIndex]["privacy_types"]["privacyDetails"]["privacyTypes"]);
        }
    }, [privDetails])

    useEffect(() => {
        setPrivDetails(privacy_types[activeIndex]["privacy_types"]["privacyDetails"]["privacyTypes"]);
    }, [activeIndex])




    const checkValueInDetails = (value: any) => {
        return privDetails.some(detail => detail.identifier === value);
    };


    return (
        <div className=''>
            <div className="ml-10 flex">
                {image_url == undefined ?
                    <img
                        className="w-40 h-40 rounded-xl m-4"
                        src={noPhoto}
                    />
                    :

                    <img
                        className="w-40 h-40 rounded-xl m-4"
                        src={image_url}

                    />
                }
                <div className="ml-10 m-2 items-start mt-6">
                    <h1 className="text-2xl font-bold">{app_name}</h1>
                    <h2 className="text-sm text-gray-500">App ID: {app_id}</h2>

                </div>
            </div>
            {privDetails.length > 0 ?
                <div
                    className={`flex justify-center items-center `}
                >
                    <div className={` p-4 mb-4 rounded-lg h-fit ml-2 w-fit ${theme === 'dark'
                        ? 'bg-neutral-300 rounded-lg shadow'
                        : ''
                        }`}>
                        <HorizontalTimeline
                            privtypes={privacy_types}
                            activeIndex={activeIndex}
                            updateParent={updateParent}
                            handleClick={handleClick}
                        />
                    </div>
                </div>
                :
                <></>
            }
            <div className='flex flex-row justify-between items-end mr-4'>
                <Button className='ml-6' onClick={handleButton}>Return to Search</Button>
                {privDetails.length > 0 ?
                    <Button onClick={() => expandAll()} className={`hidden text-cyan-500 lg:block hover:bg-cyan-300 ${theme === 'dark' ? 'bg-black' : 'bg-white'} font-medium`}>{allColumns ? 'Condense' : 'Expand'}</Button>
                    :
                    <></>
                }
            </div>
            {privDetails.length > 0 ?
                <>
                    <div className="flex hidden lg:block">
                        <div className='p-2 flex w-full'>
                            <div
                                className={`m-4 rounded-lg w-full h-fit text-center p-4 shadow-md 
                ${theme === 'dark' && expandedColumn != 'column1' ?
                                        'text-white bg-neutral-800' :
                                        'text-red bg-neutral-300'} 
                ${expandedColumn !== 'column1' ?
                                        (theme === 'dark' ?
                                            'hover:text-red hover:bg-neutral-200' :
                                            'hover:text-white hover:bg-neutral-700') :
                                        ''} 
                ${expandedColumn === 'column1' ?
                                        (theme === 'dark' ?
                                            'text-red bg-neutral-200' :
                                            'text-white bg-neutral-700') :
                                        ''} 
                transform transition duration-200 
                ${expandedColumn === 'column1' || expandedColumn === null ? 'block' : 'hidden'}`}
                                id='duty'
                            >
                                <div className='flex justify-end'>
                                    {expandedColumn === 'column1' ? <MdFullscreenExit onClick={() => handleExpand('column1')} size={28} /> : <MdFullscreen onClick={() => handleExpand('column1')} size={28} />}
                                </div>
                                {checkValueInDetails('DATA_USED_TO_TRACK_YOU') ?
                                    <div>
                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={track_dark} alt="" className="w-8 h-8" /> : <img src={track} alt="" className="w-8 h-8" />}

                                            <h3 className="text-lg">Data Used to Track You</h3>
                                        </div>
                                        {privDetails.map(priv =>
                                            priv.identifier === "DATA_USED_TO_TRACK_YOU" ?
                                                <div>
                                                    {expandedColumn === null && allColumns === false &&
                                                        <div>
                                                            The following data may be collected and linked to your identity:
                                                        </div>
                                                    }
                                                    <ul className={`mt-2 ml-6 pt-2 ${expandedColumn === null ? 'grid grid-cols-2' : 'grid grid-cols-4'} gap-4 `}>

                                                        {priv.dataCategories && priv.dataCategories.map((dataCategory, dataCategoryIndex) => (
                                                            <div
                                                                key={dataCategoryIndex}
                                                                className={`flex flex-col ${expandedColumn === null && allColumns === false ? 'items-start' : 'items-center mb-6'} `}
                                                            >
                                                                {/* Data Category Header */}
                                                                <div className={`w-full ${expandedColumn === null && allColumns === false ? 'pl-6' : 'text-center mb-4'}`}>
                                                                    <li className={`text-lg font-semibold flex ${expandedColumn === null && allColumns === false ? '' : 'justify-center'} items-center space-x-2`}>
                                                                        {expandedColumn === null && allColumns === false ? (
                                                                            <div className="flex items-center space-x-2">
                                                                                <img src={getIconPath(dataCategory.identifier, theme)} className="w-6 h-6" />
                                                                                <div className='pl-4'>{dataCategory.identifier}</div>
                                                                            </div>
                                                                        ) : (
                                                                            <div>{dataCategory.identifier}</div>
                                                                        )}
                                                                    </li>
                                                                </div>

                                                                {/* Data Types */}
                                                                {(expandedColumn === 'column1' || allColumns === true) && dataCategory.dataTypes && (
                                                                    <div className="flex flex-wrap justify-center gap-2">
                                                                        {dataCategory.dataTypes.map((dataType, dataTypeIndex) => (
                                                                            <span
                                                                                key={dataTypeIndex}
                                                                                className="inline-block text-sm px-3 py-1 m-1 rounded-full border border-orange-400"
                                                                            >
                                                                                {dataType}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}


                                                            </div>
                                                        ))}



                                                    </ul>
                                                </div>
                                                :
                                                <div></div>
                                        )}
                                    </div>
                                    :
                                    <div className=''>

                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={track_dark} alt="" className="w-8 h-8" /> : <img src={track} alt="" className="w-8 h-8" />}

                                            <h3 className="text-lg">Data Used to Track You</h3>
                                        </div>
                                        <p>No Data Collected</p>
                                    </div>}
                            </div>

                            <div
                                className={`m-4 rounded-lg w-full h-fit text-center p-4 shadow-md 
                ${theme === 'dark' && expandedColumn != 'column2' ?
                                        'text-white bg-neutral-800' :
                                        'text-red bg-neutral-300'} 
                ${expandedColumn !== 'column2' ?
                                        (theme === 'dark' ?
                                            'hover:text-red hover:bg-neutral-200' :
                                            'hover:text-white hover:bg-neutral-700') :
                                        ''} 
                ${expandedColumn === 'column2' ?
                                        (theme === 'dark' ?
                                            'text-black bg-neutral-200' :
                                            'text-white bg-neutral-700') :
                                        ''} 
                transform transition duration-200 
                ${expandedColumn === 'column2' || expandedColumn === null ? 'block' : 'hidden'}`}
                                id='dly'
                            >
                                <div className='flex justify-end'>
                                    {expandedColumn === 'column2' ? <MdFullscreenExit onClick={() => handleExpand('column2')} size={28} /> : <MdFullscreen onClick={() => handleExpand('column2')} size={28} />}
                                </div>
                                {checkValueInDetails('DATA_LINKED_TO_YOU') ?
                                    <div>
                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={linked_dark} alt="" className="w-8 h-8" /> : <img src={linked} alt="" className="w-8 h-8" />}
                                            <h3 className="text-lg">Data Linked to You</h3>
                                        </div>
                                        {privDetails.map((priv) =>
                                            priv.identifier === "DATA_LINKED_TO_YOU" ? (
                                                <div>
                                                    {expandedColumn === null && allColumns === false && (
                                                        <div>
                                                            The following data may be collected but it is not linked to your
                                                            identity:
                                                        </div>
                                                    )}
                                                    <ul
                                                        className={`mt-4 pl-6 list-none ${allColumns === false ? "" : "grid grid-cols-2"} ${expandedColumn === null ? "" : "grid grid-cols-4"} `}
                                                    >

                                                        {(() => {
                                                            // Create a Set to hold all unique data categories across all purposes
                                                            const allUniqueCategories = new Set();

                                                            // Collect all unique data categories when not expanded
                                                            priv.purposes!.forEach((purpose) => {
                                                                purpose.dataCategories!.forEach((category) =>
                                                                    allUniqueCategories.add(category.identifier)
                                                                );
                                                            });


                                                            if (expandedColumn === null && allColumns === false) {
                                                                return (
                                                                    <ul className="mt-4 pl-6 grid grid-cols-2 gap-4">
                                                                        {Array.from(allUniqueCategories).map((dataCategory, index) => (
                                                                            <li className="text-lg font-semibold flex items-center space-x-2">
                                                                                <img src={getIconPath(dataCategory, theme)} className="w-6 h-6" />
                                                                                <div className='pl-6'>{dataCategory}</div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                );
                                                            }
                                                            return priv.purposes!.map((purpose, purposeIndex) => (
                                                                <div key={purposeIndex}>
                                                                    <li className="text-lg font-semibold">{purpose.identifier}</li>
                                                                    {purpose.dataCategories!.map((dataCategory, dataCategoryIndex) => (
                                                                        <div key={dataCategoryIndex} className="p-2">
                                                                            <li className="text-base rounded-md p-2 flex flex-col">
                                                                                {dataCategory.identifier}:
                                                                                <div className="flex flex-wrap justify-center">
                                                                                    {dataCategory.dataTypes &&
                                                                                        dataCategory.dataTypes.map((dataType, dataTypeIndex) => (
                                                                                            <span
                                                                                                key={dataTypeIndex}
                                                                                                className="inline-block text-sm px-2 m-1 rounded-full border border-orange-400"
                                                                                            >
                                                                                                {dataType}
                                                                                            </span>
                                                                                        ))}
                                                                                </div>
                                                                            </li>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ));
                                                        })()}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )
                                        )}
                                    </div>
                                    :
                                    <div className="">

                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={linked_dark} alt="" className="w-8 h-8" /> : <img src={linked} alt="" className="w-8 h-8" />}

                                            <h3 className="text-lg">Data Linked to You</h3>
                                        </div>
                                        <p>No Data Collected</p>
                                    </div>}
                            </div>

                            <div
                                className={`m-4 rounded-lg w-full h-fit text-center p-4 shadow-md 
                ${theme === 'dark' && expandedColumn != 'column3' ?
                                        'text-white bg-neutral-800' :
                                        'text-red bg-neutral-300'} 
                ${expandedColumn !== 'column3' ?
                                        (theme === 'dark' ?
                                            'hover:text-red hover:bg-neutral-200' :
                                            'hover:text-white hover:bg-neutral-700') :
                                        ''} 
                ${expandedColumn === 'column3' ?
                                        (theme === 'dark' ?
                                            'text-black bg-neutral-200' :
                                            'text-white bg-neutral-700') :
                                        ''} 
                transform transition duration-200 
                ${expandedColumn === 'column3' || expandedColumn === null ? 'block' : 'hidden'}`}
                                id='dnly'
                            >
                                {checkValueInDetails('DATA_NOT_LINKED_TO_YOU') ?
                                    <div>
                                        <div className='flex justify-end'>
                                            {expandedColumn === 'column3' ? <MdFullscreenExit onClick={() => handleExpand('column3')} size={28} /> : <MdFullscreen onClick={() => handleExpand('column3')} size={28} />}
                                        </div>
                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={not_linked_dark} alt="" className="w-8 h-8" /> : <img src={not_linked} alt="" className="w-8 h-8" />}

                                            <h3 className="text-lg">Data Not Linked to You</h3>
                                        </div>
                                        {privDetails.map((priv) =>
                                            priv.identifier === "DATA_NOT_LINKED_TO_YOU" ? (
                                                <div>
                                                    {expandedColumn === null && allColumns === false && (
                                                        <div>
                                                            The following data may be collected but it is not linked to your
                                                            identity:
                                                        </div>
                                                    )}
                                                    <ul
                                                        className={`mt-4 pl-6 list-none ${expandedColumn === null ? "" : "grid grid-cols-4"} 
                                                ${allColumns === false ? "" : "grid grid-cols-2"
                                                            }`}
                                                    >

                                                        {(() => {
                                                            // Create a Set to hold all unique data categories across all purposes
                                                            const allUniqueCategories = new Set();

                                                            // Collect all unique data categories when not expanded
                                                            priv.purposes!.forEach((purpose) => {
                                                                purpose.dataCategories!.forEach((category) =>
                                                                    allUniqueCategories.add(category.identifier)
                                                                );
                                                            });


                                                            if (expandedColumn === null && allColumns === false) {
                                                                return (
                                                                    <ul className="mt-4 pl-6 grid grid-cols-2 gap-4">
                                                                        {Array.from(allUniqueCategories).map((dataCategory, index) => (
                                                                            <li className="text-lg font-semibold flex items-center space-x-2">
                                                                                <img src={getIconPath(dataCategory, theme)} className="w-6 h-6" />
                                                                                <div className='pl-6'>{dataCategory}</div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                );
                                                            }

                                                            // Render purposes, data categories, and data types when expanded
                                                            return priv.purposes!.map((purpose, purposeIndex) => (
                                                                <div key={purposeIndex}>
                                                                    <li className="text-lg font-semibold">{purpose.identifier}</li>
                                                                    {purpose.dataCategories!.map((dataCategory, dataCategoryIndex) => (
                                                                        <div key={dataCategoryIndex} className="p-2">
                                                                            <li className="text-base rounded-md p-2 flex flex-col">
                                                                                {dataCategory.identifier}:
                                                                                <div className="flex flex-wrap justify-center">
                                                                                    {dataCategory.dataTypes &&
                                                                                        dataCategory.dataTypes.map((dataType, dataTypeIndex) => (
                                                                                            <span
                                                                                                key={dataTypeIndex}
                                                                                                className="inline-block text-sm px-2 m-1 rounded-full border border-orange-400"
                                                                                            >
                                                                                                {dataType}
                                                                                            </span>
                                                                                        ))}
                                                                                </div>
                                                                            </li>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ));
                                                        })()}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )
                                        )}
                                    </div>
                                    :
                                    <div >
                                        <div className='flex justify-end'>
                                            {expandedColumn === 'column3' ? <MdFullscreenExit onClick={() => handleExpand('column3')} size={28} /> : <MdFullscreen onClick={() => handleExpand('column3')} size={28} />}
                                        </div>
                                        <div className='flex justify-center space-x-4'>
                                            {theme === 'dark' ? <img src={not_linked_dark} alt="" className="w-8 h-8" /> : <img src={not_linked} alt="" className="w-8 h-8" />}

                                            <h3 className="text-lg">Data Not Linked to You</h3>
                                        </div>
                                        <p>No Data Collected</p>
                                    </div>}
                            </div>
                        </div>

                    </div>

                    <div className='lg:hidden'>
                        {checkValueInDetails('DATA_USED_TO_TRACK_YOU') ?
                            <div className={`m-4 rounded-lg w-fit h-fit text-center p-4 shadow-md 
                                    ${theme === 'dark' ?
                                    'text-white bg-neutral-800' :
                                    'text-black bg-neutral-300'} 
                                    `}
                                id='duty'>
                                <div className='flex justify-center space-x-4'>
                                    {theme === 'dark' ? <img src={track_dark} alt="" className="w-8 h-8" /> : <img src={track} alt="" className="w-8 h-8" />}
                                    <h3 className="text-lg">Data Used to Track You</h3>
                                </div>
                                {privDetails.map(priv =>
                                    priv.identifier === "DATA_USED_TO_TRACK_YOU" ?
                                        <div>
                                            <ul className={`mt-2 ml-6 pt-2 ${expandedColumn === null ? 'grid grid-cols-2' : 'grid grid-cols-4'} gap-4 `}>

                                                {priv.dataCategories && priv.dataCategories.map((dataCategory, dataCategoryIndex) => (
                                                    <div key={dataCategoryIndex} className={`flex flex-wrap ${expandedColumn === null && allColumns === false ? 'justify-start' : 'justify-center'}`}>
                                                        <div className="w-full">
                                                            <li className="text-lg font-semibold flex items-center space-x-2">
                                                                {expandedColumn === null && allColumns === false ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <img src={getIconPath(dataCategory.dataCategory, theme)} className="w-6 h-6" />
                                                                        <div className='pl-6'>{dataCategory.dataCategory}</div>
                                                                    </div>
                                                                ) : (
                                                                    <div className='text-center'>
                                                                        {dataCategory.dataCategory}
                                                                    </div>
                                                                )}
                                                            </li>
                                                        </div>
                                                    </div>
                                                ))}

                                            </ul>
                                        </div>
                                        :
                                        <div></div>
                                )}
                            </div>
                            :
                            <div className={`m-4 rounded-lg ${theme === 'dark' ?
                                'text-white bg-neutral-800' :
                                'text-black bg-neutral-300'} 
                            `} id='dlty'>
                                <div className='flex justify-center items-center space-x-4'>
                                    {theme === 'dark' ? <img src={track_dark} alt="" className="w-8 h-8" /> : <img src={track} alt="" className="w-8 h-8" />}

                                    <h3 className="text-lg">Data Used to Track You</h3>
                                </div>
                                <p className='text-center mt-4'>No Data Collected</p>
                            </div>
                        }
                        {checkValueInDetails('DATA_LINKED_TO_YOU') ?
                            <div className={`m-4 rounded-lg w-fit h-fit text-center p-4 shadow-md 
                                ${theme === 'dark' ?
                                    'text-white bg-neutral-800' :
                                    'text-black bg-neutral-300'} 
                                `}
                                id='dlty'>
                                <div className='flex justify-center space-x-4'>
                                    {theme === 'dark' ? <img src={linked_dark} alt="" className="w-8 h-8" /> : <img src={linked} alt="" className="w-8 h-8" />}

                                    <h3 className="text-lg">Data Linked to You</h3>
                                </div>
                                {privDetails.map((priv) =>
                                    priv.identifier === "DATA_LINKED_TO_YOU" ? (
                                        <div>
                                            <ul
                                                className={`mt-4 pl-6 list-none ${allColumns === false ? "" : "grid grid-cols-2"} ${expandedColumn === null ? "" : "grid grid-cols-4"} `}
                                            >

                                                {(() => {
                                                    // Create a Set to hold all unique data categories across all purposes
                                                    const allUniqueCategories = new Set();

                                                    // Collect all unique data categories when not expanded
                                                    priv.purposes!.forEach((purpose) => {
                                                        purpose.dataCategories!.forEach((category) =>
                                                            allUniqueCategories.add(category.dataCategory)
                                                        );
                                                    });


                                                    return (
                                                        <ul className="mt-4 pl-6 grid grid-cols-2 gap-4">
                                                            {Array.from(allUniqueCategories).map((dataCategory, index) => (
                                                                <li className="text-lg font-semibold flex items-center space-x-2">
                                                                    <img src={getIconPath(dataCategory, theme)} className="w-6 h-6" />
                                                                    <div className='pl-6'>{dataCategory}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    );

                                                })()}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )
                                )}
                            </div>
                            :
                            <div className={`m-4 rounded-lg ${theme === 'dark' ?
                                'text-white bg-neutral-800' :
                                'text-black bg-neutral-300'} 
                            `} id='dlty'>
                                <div className='flex justify-center items-center space-x-4'>
                                    <img src={linked} alt="" className="w-8 h-8" />
                                    <h3 className="text-lg">Data Linked to You</h3>
                                </div>
                                <p className='text-center mt-4'>No Data Collected</p>
                            </div>}
                        {checkValueInDetails('DATA_NOT_LINKED_TO_YOU') ?
                            <div className={`m-4 rounded-lg w-fit h-fit text-center p-4 shadow-md 
                                ${theme === 'dark' ?
                                    'text-white bg-neutral-800' :
                                    'text-black bg-neutral-300'} 
                                `}
                                id='dnlty'>
                                <div className='flex justify-center space-x-4'>
                                    {theme === 'dark' ? <img src={not_linked_dark} alt="" className="w-8 h-8" /> : <img src={not_linked} alt="" className="w-8 h-8" />}
                                    <h3 className="text-lg">Data Not Linked to You</h3>
                                </div>
                                {privDetails.map((priv) =>
                                    priv.identifier === "DATA_NOT_LINKED_TO_YOU" ? (
                                        <div>
                                            <ul
                                                className={`mt-4 pl-6 list-none ${expandedColumn === null ? "" : "grid grid-cols-4"} 
                                                ${allColumns === false ? "" : "grid grid-cols-2"
                                                    }`}
                                            >

                                                {(() => {
                                                    // Create a Set to hold all unique data categories across all purposes
                                                    const allUniqueCategories = new Set();

                                                    // Collect all unique data categories when not expanded
                                                    priv.purposes!.forEach((purpose) => {
                                                        purpose.dataCategories!.forEach((category) =>
                                                            allUniqueCategories.add(category.dataCategory)
                                                        );
                                                    });


                                                    return (
                                                        <ul className="mt-4 pl-6 grid grid-cols-2 gap-4">
                                                            {Array.from(allUniqueCategories).map((dataCategory, index) => (
                                                                <li className="text-lg font-semibold flex items-center space-x-2">
                                                                    <img src={getIconPath(dataCategory, theme)} className="w-6 h-6" />
                                                                    <div className='pl-6'>{dataCategory}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    );

                                                })()}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )
                                )}
                            </div>
                            :
                            <div className={`m-4 rounded-lg ${theme === 'dark' ?
                                'text-white bg-neutral-800' :
                                'text-black bg-neutral-300'} 
                            `} id='dlty'>
                                <div className='flex justify-center items-center space-x-4'>
                                    {theme === 'dark' ? <img src={not_linked_dark} alt="" className="w-8 h-8" /> : <img src={not_linked} alt="" className="w-8 h-8" />}

                                    <h3 className="text-lg text-center">Data Not Linked to You</h3>
                                </div>
                                <p className='text-center mt-4'>No Data Collected</p>
                            </div>}
                    </div>

                </>
                :
                <div className='flex max-w-96  h-20 mx-auto text-center border-2 border-black rounded-3xl bg-neutral-300'>
                    <p className='m-auto'>Data Not Collected</p>
                </div>

            }
        </div>

    )
}