import { Bell, Search } from "lucide-react";
import ThemeController from "@/components/theme";
import { SessionData } from "@/types/session";
import { logout } from "@/actions";

interface DashboardNavbarProps {
  sessionData: SessionData;
}

export default function DashboardNavbar({ sessionData }: DashboardNavbarProps) {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="bg-base-200 border-b border-base-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
            <input
              type="text"
              placeholder="Search meetings, projects, or people..."
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

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
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
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
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
