import { useTheme } from 'next-themes';
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Links, Meta, Scripts, ScrollRestoration, useNavigation, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useRef, useEffect } from 'react';
import { Link, Outlet } from '@remix-run/react';
import { MetaFunction } from "@remix-run/node";
import { FaSpinner } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import AppSearch from '~/components/AppSelector';

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

    // Fetch the list of cached apps regardless of search query
    const cacheResponse = await fetch(process.env.BACKEND_API + "cache");
    cachedApps = await cacheResponse.json();

    // If there's a search query, fetch search results
    if (q) {
        const list = await fetch(process.env.BACKEND_API + "search?q=" + q);
        searchResults = await list.json();
    }

    return json({
        cachedApps,
        searchResults,
        q
    });
}
export default function Search() {
    const { theme } = useTheme();
    const { state } = useNavigation()
    const { cachedApps, searchResults, q } = useLoaderData<typeof loader>();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const submit = useSubmit();

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    return (
        <>
            {state === "loading" ?
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <FaSpinner className="animate-spin" size={72} />
                </div>
                :
                <div>
                </div>
            }
            <div className='h-screen'>
                <div className={`min-h-screen flex justify-center`}>
                    <div className="absolute top-20 w-full max-w-lg mx-auto p-4">
                        <div className={`flex flex-col items-center shadow-lg rounded-lg p-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                            <h1 className="text-2xl font-bold mb-4">IOS Apps</h1>
                            <Form id="search-form"
                                role="search" className="w-full flex flex-col items-center">
                                <div className='flex '>
                                    <input
                                        id="q"
                                        aria-label="Search apps"
                                        placeholder="Search apps"
                                        type="search"
                                        name="q"
                                        defaultValue={q || ""}
                                        className="px-4 py-2 border border-gray-300 rounded-md w-full min-w-40 text-black pr-10"
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Search"
                                        className="px-4 py-2 text-black rounded-r-md"
                                    >
                                        {theme === 'dark' ?
                                            <FaSearch color='white' className="w-5 h-5" />
                                            :
                                            <FaSearch color='black' className="w-5 h-5" />
                                        }

                                    </button>
                                </div>
                                <div ref={inputRef}>
                                    {searchResults.length > 0 && (
                                        <ul className={`absolute top-full left-0 right-0 mt-2 border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto  ${theme === 'dark' ? 'bg-grey text-white' : 'bg-white text-black'}`}>
                                            {searchResults.map((app: any, index: any) => (
                                                <Link className='w-full' to={'/app/' + app.app_id}>
                                                    <li key={index} className={`px-4 py-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'}`}>
                                                        {app.app_name}
                                                    </li>
                                                </Link>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </Form>
                        </div>

                    </div>
                    <div className='hidden md:block pl-2 ml-2'>
                        <AppSearch cacheList={cachedApps} />
                    </div>
                    <div className='pt-40 w-full'>
                        <Outlet />
                    </div>

                </div >

            </div >

        </>
    );
}
