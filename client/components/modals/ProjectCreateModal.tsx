import Button from "@/components/ui/Button";
import { useState } from "react";

export default function ProjectCreateModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Create Project</h3>
        <input
          className="input input-bordered w-full"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Create</Button>
        </div>
      </div>
    </div>
  );
}
