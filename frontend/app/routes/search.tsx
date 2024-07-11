import { useTheme } from 'next-themes';
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Links, Meta, Scripts, ScrollRestoration, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useRef, useEffect } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
    // Loads the list of apps first
    const url = new URL(request.url);
    // If there's a search query
    const q = url.searchParams.get("q");
    let data = [];

    if (q) {
        const list = await fetch(process.env.BACKEND_API + "appList?q=" + q);
        data = await list.json();
    }

    return json({ data, q });
}

export default function Search() {
    const { theme } = useTheme();
    const { data, q } = useLoaderData<typeof loader>();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const submit = useSubmit();

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className={`${theme === 'dark' ? 'bg-dark-gradient' : 'bg-light-gradient'} min-h-screen flex justify-center`}>
                <div className="absolute top-20 w-full max-w-lg mx-auto p-4">
                    <div className={`flex flex-col items-center shadow-lg rounded-lg p-4 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <h1 className="text-2xl font-bold mb-4">IOS Apps</h1>
                        <Form id="search-form" onChange={(event) =>
                            submit(event.currentTarget)
                        }
                            role="search" className="w-full flex flex-col items-center">
                            <input
                                ref={inputRef}
                                id="q"
                                aria-label="Search apps"
                                placeholder="Search apps"
                                type="search"
                                name="q"
                                defaultValue={q || ""}
                                className="px-4 py-2 border border-gray-300 rounded-md w-full text-black"
                                onFocus={() => setIsFocused(true)}
                            />
                            {isFocused && data.length > 0 && (
                                <ul className={`absolute top-full left-0 right-0 mt-2 border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto  ${theme === 'dark' ? 'bg-grey text-white' : 'bg-white text-black'}`}>
                                    {data.map((app, index) => (
                                        <li key={index} className={`px-4 py-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'}`}>
                                            {app.app_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form>
                    </div>
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
