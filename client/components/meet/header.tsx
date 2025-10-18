import { Settings } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Product Design Review</h1>
        <p className="text-sm text-base-content/60">Meeting ID: 123-456-789</p>
      </div>
      <div className="flex-none gap-2">
        <button className="btn btn-ghost btn-circle">
          <Settings className="w-5 h-5" />
        </button>
        <div className="badge badge-lg badge-neutral">45:23</div>
      </div>
    </div>
  );
}
