import { Briefcase } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProjectsHeaderProps {
  filter: string;
  onFilterChange: (filter: any) => void;
  onNewClick: () => void;
}

export default function ProjectsHeader({
  filter,
  onFilterChange,
  onNewClick,
}: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Projects</h2>
        <p className="text-base-content/70">
          Track ongoing projects, progress, and team details.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="btn-group hidden sm:flex">
          {["all", "ongoing", "completed"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? "btn-active" : ""}`}
              onClick={() => onFilterChange(f as any)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Button onClick={onNewClick}>
          <Briefcase className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>
    </div>
  );
}
