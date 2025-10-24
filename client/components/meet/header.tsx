import { Clock, Info, Settings, ShieldCheck } from "lucide-react";

export default function MeetingHeader() {
  return (
    <div className="navbar bg-base-200/80 backdrop-blur-sm border-b border-base-300/50 px-6">
      <div className="flex-1 flex flex-col items-start">
        <h1 className="text-xl font-bold">Product Design Review</h1>
        <span>Meeting ID: 123-456-789</span>
      </div>
      <div className="flex-none gap-2">
        <div className="badge badge-success badge-lg gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted</span>
        </div>
        <div className="badge badge-lg badge-neutral">45:23</div>
        <button className="btn btn-ghost btn-circle">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
