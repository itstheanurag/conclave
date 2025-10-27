import CallLayout from "@/components/call/layout";
import React from "react";

const MeetingLayout = ({ children }: { children: React.ReactNode }) => {
  return <CallLayout>{children}</CallLayout>;
};

export default MeetingLayout;
