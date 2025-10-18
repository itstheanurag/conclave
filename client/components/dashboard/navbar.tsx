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
      {/* Left side (can be empty or logo) */}
      <div className="flex items-center gap-3">
        {/* You can put a logo or title here if needed */}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
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
