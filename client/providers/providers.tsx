"use client";

import Navbar from "@/components/organisms/Navbar";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/dashboard", "/settings", "/meet"];

  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <ThemeProvider>
      {!shouldHideNavbar && <Navbar />}
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </ThemeProvider>
  );
}
