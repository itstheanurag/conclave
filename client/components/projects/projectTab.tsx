"use client";

import { useEffect } from "react";
import { SessionData } from "@/types/session";
import ProjectCreateModal from "../modals/ProjectCreateModal";
import ProjectDetailsModal from "../modals/ProjectDetailsModal";
import ProjectsHeader from "./projectHeaders";
import ProjectsTable from "./projecttable";
import { useProjectStore } from "@/stores/projectStore";

export default function ProjectsDashboardTab({
  sessionData,
}: {
  sessionData?: SessionData;
}) {
  const {
    loading,
    filter,
    selected,
    showCreateModal,
    setFilter,
    selectProject,
    openCreateModal,
    closeCreateModal,
    removeProject,
    updateProject,
    loadDummyData,
    getFilteredProjects,
  } = useProjectStore();

  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  const filteredProjects = getFilteredProjects();

  return (
    <div className="space-y-6">
      <ProjectsHeader
        onFilterChange={setFilter}
        onNewClick={openCreateModal}
        filter={filter}
      />
      <ProjectsTable
        projects={filteredProjects}
        loading={loading}
        onView={selectProject}
        onArchive={removeProject}
        onComplete={(id) =>
          updateProject(id, { status: "completed", progress: 100 })
        }
      />
      {showCreateModal && (
        <ProjectCreateModal onClose={closeCreateModal} />
      )}
      {selected && (
        <ProjectDetailsModal
          project={selected}
          onClose={() => selectProject(null)}
        />
      )}
    </div>
  );
}
