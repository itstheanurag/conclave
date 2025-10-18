"use client";

import { useState } from "react";
import { SessionData } from "@/types/session";
import Button from "../ui/Button";
import ThemeController from "@/components/theme";
import { logout } from "@/actions";
import MeetingModal from "../modals/CreateMeetingModal";
import { Bell } from "lucide-react";

interface DashboardNavbarProps {
  sessionData: SessionData;
}

export default function DashboardNavbar({ sessionData }: DashboardNavbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-base-300/60 backdrop-blur-md shadow-sm border-b border-base-200 px-4 py-3 flex justify-between items-center">
      <div className="relative w-full max-w-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/70 pointer-events-none z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary z-0"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => setIsModalOpen(true)}>+ Meet</Button>

        <button className="btn btn-ghost btn-square">
          <Bell className="w-5 h-5" />
        </button>

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
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 mt-2 border border-base-300 z-50"
          >
            <li className="menu-title px-4 py-2">
              <span className="text-sm font-semibold">
                {sessionData.user.name}
              </span>
              <span className="text-xs text-base-content/70 truncate">
                {sessionData.user.email}
              </span>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a href="/dashboard/profile">Profile</a>
            </li>
            <li>
              <a href="/dashboard/settings">Settings</a>
            </li>
            <div className="divider my-1"></div>
            <li>
              <div className="px-2">
                <ThemeController className="w-full" />
              </div>
            </li>
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
          </ul>
        </div>
      </div>

      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
}
