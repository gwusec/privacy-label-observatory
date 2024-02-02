//import { cssBundleHref } from "@remix-run/css-bundle";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

// export const links: LinksFunction = () => [
//   ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
// ];

export default function App() {

  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppNavBar />
        <div id="main">
          <div class="container mx-auto space-y-4">
          <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
    </NextThemesProvider>
    </NextUIProvider>
  );
}
