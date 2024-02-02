import type { LinksFunction } from "@remix-run/node";
import {
  //Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@nextui-org/react";

import { ThemeSwitcher } from "./ThemeSwitcher";
import SiteIcon from "./SiteIcon";

export default function AppNavBar() {
  return (
    <div className="shadow-md shadow-gray-500 dark:shadow-slate-400 mb-5">
    <Navbar >
      <NavbarBrand>
        <Link color="foreground" underline="hover" href="/" >
          <SiteIcon></SiteIcon>
          <p className="font-bold text-inherit">Privacy Label Observatory</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem >
          <Link color="foreground" underline="hover" href="/dashboard" >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/explore">
            Explore
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </div>
  );
}
