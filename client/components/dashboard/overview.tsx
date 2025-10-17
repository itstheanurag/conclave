import { SessionData } from "@/types/session";
import { Calendar, Users, Video, Code } from "lucide-react";

interface OverviewTabProps {
  sessionData: SessionData;
}

const quickStats = [
  { label: "Meetings This Week", value: "12", change: "+3" },
  { label: "Active Projects", value: "8", change: "+2" },
  { label: "Team Members", value: "24", change: "+5" },
  { label: "Hours Collaborated", value: "156", change: "+28" },
];

const upcomingMeetings = [
  {
    id: 1,
    title: "API Design Review",
    time: "2:00 PM",
    attendees: 4,
    type: "Review",
  },
  {
    id: 2,
    title: "Sprint Planning",
    time: "4:30 PM",
    attendees: 8,
    type: "Planning",
  },
  {
    id: 3,
    title: "Code Pair Programming",
    time: "Tomorrow 10:00 AM",
    attendees: 2,
    type: "Coding",
  },
];

const recentProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    status: "active",
    members: 6,
    meetings: 12,
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    status: "active",
    members: 4,
    meetings: 8,
  },
  {
    id: 3,
    name: "API Gateway Service",
    status: "planning",
    members: 3,
    meetings: 5,
  },
];

export default function OverviewTab({ sessionData }: OverviewTabProps) {
  const firstName = sessionData.user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
        <p className="text-base-content/70">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/70">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <span className="text-sm text-success">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Upcoming Meetings</h2>
              <button className="btn btn-sm btn-ghost">View All</button>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{meeting.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-base-content/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {meeting.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {meeting.attendees} attendees
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-primary badge-sm">
                      {meeting.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Active Projects</h2>
              <button className="btn btn-sm btn-ghost">View All</button>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <span
                      className={`badge badge-sm ${
                        project.status === "active"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-base-content/70">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {project.meetings} meetings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-outline flex-col h-24 gap-2">
              <Video className="w-6 h-6" />
              Start Meeting
            </button>
            <button className="btn btn-outline flex-col h-24 gap-2">
              <Calendar className="w-6 h-6" />
              Schedule
            </button>
            <button className="btn btn-outline flex-col h-24 gap-2">
              <Code className="w-6 h-6" />
              New Project
            </button>
            <button className="btn btn-outline flex-col h-24 gap-2">
              <Users className="w-6 h-6" />
              Invite Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
