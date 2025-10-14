"use client";
import React, { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import ThemeController from "../theme";

const links = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Services", link: "/services" },
  { label: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200">
      <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <a href="/" className="text-xl font-bold tracking-wide text-primary">
          Conclave
        </a>

        <div className="hidden md:flex items-center justify-between gap-6">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.link}
              className="text-sm tracking-tight text-base-content hover:text-primary hover:scale-105 transition-transform duration-200 capitalize "
            >
              {item.label}
            </a>
          ))}

          {/* Auth + Theme buttons */}
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm rounded-lg">
              Get Started
            </button>
            <ThemeController />
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden btn btn-ghost btn-square"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-200 flex flex-col items-start p-4 gap-3">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.link}
              className="btn btn-ghost w-full justify-start capitalize"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className="divider my-2" />

          <div className="flex w-full flex-col gap-2">
            <div className="flex gap-6 w-full">
              <button className="btn btn-primary btn-sm rounded-lg">
                Get Started
              </button>

              <ThemeController />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
