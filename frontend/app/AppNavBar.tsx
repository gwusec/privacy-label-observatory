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
import GWIcon from "./GWIcon";


export default function AppNavBar() {
  return (
    <div className="sticky top-0 z-50 shadow-md shadow-gray-500 dark:shadow-slate-400 mb-5">
    <Navbar >


      <NavbarBrand>

        <Link color="foreground" underline="hover" href="/" >
          <GWIcon></GWIcon>
          <SiteIcon></SiteIcon>
          <p className="font-bold text-inherit">Privacy Label Observatory</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="foreground" underline="hover" href="/">
            Home
          </Link>
        </NavbarItem> */}
        <NavbarItem >
          <Link color="foreground" underline="hover" href="/dashboard" >
            Dashboard
          </Link>
        </NavbarItem>
        {/* <NavbarItem >
          <Link color="foreground" underline="hover" href="/wiki" >
            Wiki
          </Link>
        </NavbarItem> */}
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/graphs">
            Graphs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/explore?page=0&run=run_00069">
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/search">
            Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/">
            Documentation
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link color="foreground" href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="default" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </div>
  );
}
