//import { cssBundleHref } from "@remix-run/css-bundle";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { MetaFunction } from "@remix-run/node";


import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";


import stylesheet from "~/tailwind.css";
import AppNavBar from "./AppNavBar";
import Footer from "./components/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];


export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Label Observatory" },
    { name: "description", content: "Welcome  Remix!" },
  ];
};

export default function App() {
  const navigate = useNavigate();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col">
        <NextUIProvider navigate={navigate}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <AppNavBar />
            <div id="main-body" className="bg-gradient-to-b dark:from-black  dark:to-gray-900 from-white to-gray-100">
            <Outlet />
            </div>
            {/* <div className="block lg:hidden fixed bottom-0 w-full z-50">
              <Footer />
            </div> */}
            <ScrollRestoration />
            <Scripts />

          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>

  );
}
