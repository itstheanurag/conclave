import { client } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await client.getSession(); // server-side fetch

  if (!session) {
    redirect("/auth"); // server-side redirect if not logged in
  }

  return (
    <div>
      <h1>Dashboard Navbar Here</h1>
      <main>{children}</main>
    </div>
  );
}
