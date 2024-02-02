import React from "react";
import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";
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
    useSubmit,
} from "@remix-run/react";

// import {
//     Dropdown,
//     DropdownTrigger,
//     DropdownMenu,
//     DropdownSection,
//     DropdownItem
// } from "@nextui-org/dropdown";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button,
    Divider
} from "@nextui-org/react";


export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    return json({ q });
};

export default function Index() {
    const { q } = useLoaderData();
    const navigation = useNavigation();

    const runs = [ //will be set by loader
        {
            key: "run_0069",
            label: "Run 69",
        },
        {
            key: "Run_0068",
            label: "Run 68",
        },
        {
            key: "Run_x",
            label: "...",
        },

    ];
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["run_0069"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    return (
        <div className="flex items-stretch">
            <div id="sidebar" className="w-1/5  items-stretch">
                <h2 className="text-center underline">iOS Apps</h2>
                <div id="search-region " className="mt-2">
                    <Form id="search-form"
                        onChange={(event) => {
                            const isFirstSearch = q === null;
                            submit(event.currentTarget, {
                                replace: !isFirstSearch,
                            });
                        }}
                        role="search">


                        <div className="w-full flex flex-row flex-wrap gap-4">
                            <Input
                                key="lg"
                                radius="lg"
                                name="q"
                                type="serach"
                                label="Search"
                                placeholder="Search"
                                defaultValue={q || ""}
                                className="max-w-1/5 m-2"
                            />
                        </div>
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div className="flex m-2">
                            <div className="mr-2">
                                <Button
                                    variant="bordered"
                                >
                                    Search
                                </Button>
                            </div>
                            <div>
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
                <div id="results-region" className="mt-2">
                </div>
            </div>
            <Divider orientation="vertical" />
            <div id="view-region" className="w-4/5 items-stretch">
                <h2 className="text-center underline">View</h2>

            </div>
        </div>
    );
}
