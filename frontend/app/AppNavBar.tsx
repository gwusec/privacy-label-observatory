import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@nextui-org/react";

import { ThemeSwitcher } from "./ThemeSwitcher";
import React, {useEffect, useState} from "react";
import SiteIcon from "./SiteIcon";
import GWIcon from "./GWIcon";
import UICIcon from "./UICLogo";
import RichIcon from "./resources/shield_ur.svg"


export default function AppNavBar() {
  



  return (
    <div className="sticky top-0 z-50 shadow-md shadow-gray-500 dark:shadow-slate-400 mb-5">
    <Navbar >
      <NavbarBrand>
        <Link color="foreground" underline="hover" href="/" >
        <div className="invisible sm:visible sm:mr-2">
          <GWIcon></GWIcon>
          </div>
        <div className="invisible sm:visible sm:mr-2">
          <UICIcon></UICIcon>
          </div>
          <div className="invisible sm:visible sm:mr-2">
            <img src={RichIcon} alt="" className="sm:w-12 sm:h-12 size-12"/>
          </div>
          <SiteIcon></SiteIcon>
          <p className="font-bold text-inherit">Privacy Label Observatory</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem >
          <Link color="foreground" underline="hover" href="/dashboard" >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/search">
            Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" underline="hover" href="/documentation">
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
