import { Briefcase, CheckSquare, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { Project } from "@/types/dashboard";

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  onView: (p: Project) => void;
  onArchive: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function ProjectsTable({
  projects,
  loading,
  onView,
  onArchive,
  onComplete,
}: ProjectsTableProps) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due</th>
                <th>Team</th>
                <th>Meetings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    Loading…
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Briefcase className="inline w-4 h-4 mr-2" /> {p.name}
                    </td>
                    <td>{p.status}</td>
                    <td>{p.progress}%</td>
                    <td>{p.dueDate ?? "—"}</td>
                    <td>
                      <Users className="inline w-4 h-4 mr-1" />{" "}
                      {p.teamMembers?.length ?? 0}
                    </td>
                    <td>{p.meetingsCount ?? 0}</td>
                    <td className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(p)}
                      >
                        View
                      </Button>
                      {p.status !== "completed" && (
                        <Button size="sm" onClick={() => onComplete(p.id)}>
                          <CheckSquare className="w-4 h-4 mr-1" /> Done
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onArchive(p.id)}
                      >
                        Archive
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
