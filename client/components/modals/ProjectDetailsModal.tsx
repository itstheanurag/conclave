import { Clock, BarChart2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Project } from "@/types/dashboard";

export default function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-2xl p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mt-4 text-sm space-y-2">
          <div>
            <BarChart2 className="inline w-4 h-4 mr-1" /> {project.progress}%
            complete
          </div>
          <div>
            <Clock className="inline w-4 h-4 mr-1" /> Due:{" "}
            {project.dueDate ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
