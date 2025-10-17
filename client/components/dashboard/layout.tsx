"use client";
import { useState } from "react";
import { useSession } from "@/hooks/auth";
import DashboardNavbar from "./navbar";
import OverviewTab from "./overview";
import Sidebar from "./sidebar";

interface DashboardLayoutClientProps {
  children?: React.ReactNode;
}

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const { session, loading } = useSession();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading || !session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-base-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar sessionData={session} />

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" ? (
            <OverviewTab sessionData={session} />
          ) : (
            children || (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2 capitalize">
                    {activeTab}
                  </h2>
                  <p className="text-base-content/70">
                    Content for this section coming soon...
                  </p>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
