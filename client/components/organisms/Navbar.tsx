"use client";
import React from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import NavLinks from "../molecules/Navlinks";
import ThemeController from "../theme";
import { menuOpenAtom } from "@/atoms/ui";
import { useAtom } from "jotai";
import Button from "../ui/Button";
import { useSession } from "@/hooks/auth";
import { logout } from "@/actions";
import { SessionData } from "@/types/session";

const links = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Services", link: "/services" },
  { label: "Contact", link: "/contact" },
];

const SimpleNavbar = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom);
  const router = useRouter();
  const handleGetStarted = () => router.push("/auth");

  return (
    <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200">
      <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <a href="/" className="text-xl font-bold tracking-wide text-primary">
          Conclave
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks links={links} />
          <div className="flex items-center gap-2">
            <Button onClick={handleGetStarted} size="sm">
              Get Started
            </Button>
            <ThemeController />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden btn btn-ghost btn-square"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <ThemeController className="w-full" />
          </div>
        </div>
      )}
    </nav>
  );
};

const DashboardNavbar = ({ sessionData }: { sessionData: SessionData }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const data = await logout();

    console.log(data);

    router.replace("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200">
      <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-full">
        <a href="/" className="text-xl font-bold tracking-wide text-primary">
          Conclave
        </a>

        <div className="flex items-center gap-2 relative">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="cursor-pointer">
              {sessionData.user.image ? (
                <img
                  src={sessionData.user.image}
                  alt={sessionData.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {sessionData.user.name[0]}
                </div>
              )}
            </label>

            {/* Dropdown content */}
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-48 mt-2"
            >
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </li>
              <li>
                <ThemeController />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function Navbar() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200">
        <div className="mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          <div className="h-6 w-24 bg-base-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-base-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-base-200 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return session ? <DashboardNavbar sessionData={session} /> : <SimpleNavbar />;
}
