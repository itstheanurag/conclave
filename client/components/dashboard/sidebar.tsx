"use client";

import { useDashboardStore, TabId } from "@/stores/dashboardStore";
import {
  Home,
  Calendar,
  Video,
  Users,
  Code,
  MessageSquare,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Key,
} from "lucide-react";

const navigationItems: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "apikeys", label: "ApiKeys", icon: Key },
  { id: "meetings", label: "Meetings", icon: Video },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "teams", label: "Teams", icon: Users },
  { id: "projects", label: "Projects", icon: Code },
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

export default function Sidebar() {
  const { activeTab, sidebarCollapsed, setActiveTab, toggleSidebar } =
    useDashboardStore();

  return (
    <aside
      className={`${
        sidebarCollapsed ? "w-20" : "w-64"
      } bg-base-200 border-r border-base-300 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Conclave</span>
          </div>
        )}
        {sidebarCollapsed && <Code className="w-8 h-8 text-primary mx-auto" />}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-base-300 space-y-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-base-300"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
