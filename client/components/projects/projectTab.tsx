"use client";

import { useEffect, useState } from "react";
import { SessionData } from "@/types/session";
import { Project } from "@/types";
import ProjectCreateModal from "../modals/ProjectCreateModal";
import ProjectDetailsModal from "../modals/ProjectDetailsModal";
import ProjectsHeader from "./projectHeaders";
import ProjectsTable from "./projecttable";
export default function ProjectsDashboardTab({
  sessionData,
}: {
  sessionData?: SessionData;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "ongoing" | "behind" | "dueSoon" | "completed"
  >("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    // Dummy data for now
    const dummy: Project[] = [
      {
        id: "p1",
        name: "Next.js Dashboard",
        status: "ongoing",
        progress: 65,
        dueDate: "2025-10-25",
        teamMembers: [
          { id: "u1", name: "Komal" },
          { id: "u2", name: "Gaurav" },
        ],
        meetingsCount: 4,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "p2",
        name: "API Gateway",
        status: "completed",
        progress: 100,
        dueDate: "2025-09-15",
        teamMembers: [{ id: "u3", name: "Raj" }],
        meetingsCount: 2,
        lastUpdated: new Date().toISOString(),
      },
    ];
    setProjects(dummy);
  }, []);

  const filtered = projects.filter((p) => {
    switch (filter) {
      case "ongoing":
        return p.status === "ongoing";
      case "completed":
        return p.status === "completed";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <ProjectsHeader
        onFilterChange={setFilter}
        onNewClick={() => setShowCreate(true)}
        filter={filter}
      />
      <ProjectsTable
        projects={filtered}
        loading={loading}
        onView={setSelected}
        onArchive={(id) =>
          setProjects((prev) => prev.filter((p) => p.id !== id))
        }
        onComplete={(id) =>
          setProjects((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, status: "completed", progress: 100 } : p
            )
          )
        }
      />
      {showCreate && (
        <ProjectCreateModal onClose={() => setShowCreate(false)} />
      )}
      {selected && (
        <ProjectDetailsModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
