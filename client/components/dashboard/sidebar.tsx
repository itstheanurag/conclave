import { useState } from "react";
import {
  Home,
  Calendar,
  Video,
  Users,
  Code,
  Settings,
  MessageSquare,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "meetings", label: "Meetings", icon: Video },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "teams", label: "Teams", icon: Users },
  { id: "projects", label: "Projects", icon: Code },
  { id: "discussions", label: "Discussions", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-base-200 border-r border-base-300 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Code className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Conclave</span>
          </div>
        )}
        {collapsed && <Code className="w-8 h-8 text-primary mx-auto" />}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-base-300 space-y-2">
        <button
          onClick={() => onTabChange("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-primary text-primary-content"
              : "hover:bg-base-300"
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-base-300"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
