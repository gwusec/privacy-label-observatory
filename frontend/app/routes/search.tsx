import { useTheme } from 'next-themes';
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useNavigate } from "@remix-run/react";
import { Link, Outlet } from '@remix-run/react';
import { MetaFunction } from "@remix-run/node";
import { FaSpinner } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import AppSearch from '~/components/AppSelector';
import RecentlyChanged from '~/components/RecentlyChanged';

export const meta: MetaFunction = () => {
    return [{
        title: "Search",
    }];
};


export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    // Get search query
    const q = url.searchParams.get("q") || "";

    let cachedApps = [];
    let searchResults = [];
    let recentlyChanged = [];

    // Fetch the list of cached apps regardless of search query
    const cacheResponse = await fetch(process.env.BACKEND_API + "cache");
    cachedApps = await cacheResponse.json();

    // Fetch recently changed apps
    const recentlyChangedResponse = await fetch(process.env.BACKEND_API + "recently-changed");
    recentlyChanged = await recentlyChangedResponse.json();

    // If there's a search query, fetch search results
    if (q) {
        const list = await fetch(process.env.BACKEND_API + "search?q=" + q);
        searchResults = await list.json();
    }

    return json({
        cachedApps,
        searchResults,
        recentlyChanged,
        q
    });
}


export default function Search() {
    const { state } = useNavigation();
    const navigate = useNavigate();
    const { cachedApps, searchResults, recentlyChanged, q } = useLoaderData<typeof loader>();
    const [searchValue, setSearchValue] = useState(q || "");
    return (
        <>
            {state === "loading" && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <FaSpinner className="animate-spin" size={72} />
                </div>
            )}
            <div className="min-h-screen py-6 lg:py-8">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-[1fr_minmax(0,1fr)_1fr] lg:gap-8 flex flex-col gap-6">
                        <div className="order-2 lg:order-none">
                            <div className="lg:sticky lg:top-6">
                                <AppSearch cacheList={cachedApps}/>
                            </div>
                        </div>
                        <div className="w-full order-1 lg:order-none">
                            <div className="mb-8 lg:mb-12">
                                <div className="rounded-2xl shadow-md px-6 py-4 md:px-8 md:py-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">

                                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                                        IOS Apps
                                    </h1>
                                    <Form id="search-form" role="search" className="w-full">
                                        <div className="relative w-full">
                                            <input
                                                id="q"
                                                aria-label="Search apps"
                                                placeholder="Search apps"
                                                type="text"
                                                name="q"
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                className="w-full px-4 py-3 pr-12 rounded-lg border transition bg-white text-gray-900 border-gray-300 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:border-gray-400"/>  
                                            {searchValue ? (
                                                <button
                                                    type="button"
                                                    aria-label="Clear search"
                                                    onClick={() => {
                                                        setSearchValue("");
                                                        navigate("/search");
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                                >
                                                    ✕
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    aria-label="Search"
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                                >
                                                    <FaSearch className="w-5 h-5" />
                                                </button>
                                            )}
                                            {(searchResults.length > 0 || q) && (
                                                <div className="absolute top-full left-0 right-0 mt-2 z-20">
                                                    {searchResults.length > 0 ? (
                                                        <ul
                                                            className="rounded-lg border-2 shadow-lg max-h-80 overflow-y-auto bg-white border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                                                            {searchResults.map((app: any) => (
                                                                <Link key={app.app_id} to={'/app/' + app.app_id}>
                                                                    <li className="px-4 py-3 border-b cursor-pointer transition border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                                                                        {app.app_name}
                                                                    </li>
                                                                </Link>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div
                                                            className="rounded-lg border-2 px-4 py-3 shadow-lg bg-white border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                                                            No results found for "{q}"
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            </div>

                       
                            {(searchResults.length > 0 || q) && (
                                <div className="mt-8">
                                    <h2 className="text-gray-300 dark:text-gray-700">
                                        Results ({searchResults.length})
                                    </h2>
                                    <Outlet />
                                </div>
                            )}

                        </div>

                
                        <div className="order-3 lg:order-none">
                            <div className="lg:sticky lg:top-6">
                                <RecentlyChanged cacheList={recentlyChanged} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
