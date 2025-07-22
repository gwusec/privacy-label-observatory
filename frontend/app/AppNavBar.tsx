import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link
} from "@nextui-org/react";

import { ThemeSwitcher } from "./ThemeSwitcher";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SiteIcon from "./SiteIcon";
import GWIcon from "./GWIcon";
import UICIcon from "./UICLogo";
import RichIcon from "./resources/shield_ur.svg"

export default function AppNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Search", href: "/search" },
    { name: "Documentation", href: "/documentation" }
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 shadow-md shadow-gray-500 dark:shadow-slate-400 mb-5">
      <Navbar 
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <Link color="foreground" underline="hover" href="/" >
            <div className="invisible sm:visible sm:mr-2">
              <GWIcon></GWIcon>
            </div>
            <div className="invisible sm:visible sm:mr-2">
              <UICIcon></UICIcon>
            </div>
            <SiteIcon></SiteIcon>
            <p className="font-bold text-inherit">Privacy Label Observatory</p>
          </Link>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link 
                color="foreground" 
                underline="hover" 
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Mobile Menu Toggle */}
        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle 
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        <NavbarContent>
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                color="foreground"
                className="w-full"
                href={item.href}
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.href);
                }}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}