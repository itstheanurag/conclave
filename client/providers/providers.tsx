"use client";

import Navbar from "@/components/organisms/Navbar";
import { useSession } from "@/hooks/auth";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const { session } = useSession();

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light">
      {!session && <Navbar />}
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  );
}
