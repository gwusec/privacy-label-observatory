import React from "react";
import { useRef } from 'react';
import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";
import {loaderTwo} from "./routes/appPage"
import {HiArrowNarrowRight, HiArrowNarrowLeft} from "react-icons/hi"
import {
    Form,
    //Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useParams,
    useSearchParams,
    useSubmit,
} from "@remix-run/react";

import { LoremIpsum } from "react-lorem-ipsum";
import { loremIpsum } from 'react-lorem-ipsum';
import { name, surname, username } from 'react-lorem-ipsum';


import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button,
    Divider
} from "@nextui-org/react";

import {loader} from "./routes/explore"



interface Run{
    key: string;
    label: string;
}

interface AppId{
    app_name: string;
    app_id:string; 
}

interface ExplorerSidebarProps {
    q: string | null; // the query string
    runs: Run[]; //the dropdown information
    searching: boolean | undefined; //waiting for db data or not?
    app_list: AppId[] | undefined; //list of {appname,appid} list to render following a search
  }



export default function ExploreSidebar(props: ExplorerSidebarProps){
    const q = props.q;
    const runs = props.runs;
    const searching = props.searching;
    const app_list = props.app_list;
    const [searchParams, setSearchParams] = useSearchParams();

    //If direction is 0, that means the left was clicked
    //If direction is 1, that means the right was clicked
    //Will increment or decrement href based on that
    const onLeftHandler = () => {
        const search = searchParams.get("page")
        var page: number = +search!;
        page -= 1;
        const newPage: string = ""+page;

        const params = new URLSearchParams;
        params.set("page", newPage)
        setSearchParams(params)
    }

    const onRightHandler = () => {
        const search = searchParams.get("page")
        var page: number = +search!;
        page += 1;
        const newPage: string = ""+page;

        const params = new URLSearchParams;
        params.set("page", newPage)
        setSearchParams(params)
    }

    const onAppHandler = (appName:String, appId:number) => {
        console.log(appName + " " + appId)
        const url = new URL(window.location.href)
        console.log(url.searchParams.get('id'))
        loaderTwo(url.searchParams.get('id'))
        setSearchParams((prev) => {
            prev.set("id", ""+appId)
            return prev
        })
    }

    var page = +searchParams.get("page")!;

   
    
    const init_label = runs[0]["label"] ? runs[0].label: "None";


    const [selectedKeys, setSelectedKeys] = React.useState(new Set([init_label]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

   
    
    return (
        <div id="explore-sidebar" className="w-1/5 items-stretch h-screen overflow-y-auto dark:divide-white divide-black ">
            <h2 className="text-center underline">iOS Apps</h2>
            <div id="search-region" className="mt-2">
                <Form id="search-form"
                    // onChange={(event) => {
                    //     const isFirstSearch = q === null;
                    //     submit(event.currentTarget, {
                    //         replace: !isFirstSearch,
                    //     });
                    // }}
                    role="search">
                    <div className="w-full flex flex-row flex-wrap gap-4">
                        <Input
                            key="lg"
                            radius="lg"
                            name="q"
                            type="serach"
                            //label="Search"
                            placeholder="Search for app by name"
                            defaultValue={q || ""}
                            className="max-w-1/5 m-2"
                        />
                    </div>
                    <div
                        id="search-spinner"
                        aria-hidden
                        hidden={!searching}
                    />
                    <div className="flex flex-wrap w-full">
                        <div className="m-2">
                            <Button
                                variant="bordered"
                            >
                                Search
                            </Button>
                        </div>
                        <div className="m-2">
                            <Dropdown backdrop="blur">
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className="capitalize"
                                    >
                                        {selectedValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Select Runs"
                                    variant="flat"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={setSelectedKeys}
                                    items={runs}
                                >
                                    {(item) => (
                                        <DropdownItem
                                            key={item.key}
                                            color="default"
                                            className=""
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                    </div>
                </Form>
            </div>
            <div id="search-results-region" className="mt-2">
                <div className="flex flex-row">
                    {page > 0 ?
                        <HiArrowNarrowLeft className="mx-2 w-full hover:opacity-40" onClick={onLeftHandler}/>
                    :
                        null
                    }
                    
                    <HiArrowNarrowRight className="mx-2 w-full hover:opacity-40" onClick={onRightHandler}/>
                </div>
                <ul className="my-2">
                    {app_list.map(app => <li className="hover:opacity-40 cursor-pointer" onClick={() => onAppHandler(app.app_name, app.app_id)}>{app.app_name}</li>)}
                </ul>
            </div>
        </div >

    );
}
