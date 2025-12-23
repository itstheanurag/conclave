"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import NavLinks from "../molecules/Navlinks";
import Button from "../ui/Button";
import ThemeSelectionModal from "../modals/ThemeSelectionModal";
import { useUIStore } from "@/stores/uiStore";

const links = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Services", link: "/services" },
  { label: "Contact", link: "/contact" },
];

const SimpleNavbar = () => {
  const { menuOpen, toggleMenu } = useUIStore();
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const router = useRouter();
  const handleGetStarted = () => router.push("/auth");

  return (
    <>
      <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200">
        <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <a href="/" className="text-2xl tracking-tight text-primary font-bold">
            Conclave
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks links={links} />
            <div className="flex items-center gap-2">
              <Button onClick={handleGetStarted} size="sm">
                Get Started
              </Button>
              <Button onClick={() => setThemeModalOpen(true)} size="sm">
                Theme
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden btn btn-ghost btn-square"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-base-200 flex flex-col items-start p-4 gap-3">
            <NavLinks links={links} />
            <div className="divider my-2" />
            <div className="flex w-full flex-col gap-2">
              <Button onClick={handleGetStarted} size="sm" className="w-full">
                Get Started
              </Button>
              <Button
                onClick={() => setThemeModalOpen(true)}
                size="sm"
                className="w-full"
              >
                Theme
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Theme Modal */}
      {themeModalOpen && (
        <ThemeSelectionModal onClose={() => setThemeModalOpen(false)} />
      )}
    </>
  );
};

export default function Navbar() {
  return <SimpleNavbar />;
}
