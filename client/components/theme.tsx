"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/ui";
import { cn } from "@/lib/utils";

export default function ThemeController({ className }: { className?: string }) {
  const themes = ["sunset", "nord", "dim", "lofi", "halloween"];
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useAtom(themeAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      setCurrentTheme(resolvedTheme);
    }
  }, [resolvedTheme, setCurrentTheme]);

  if (!mounted) return null;

  return (
    <div className={cn("dropdown dropdown-end", className)}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline btn-sm rounded-lg capitalize"
      >
        {currentTheme}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 border border-base-200 rounded-xl w-40 mt-2 shadow-lg p-2 z-[100]"
      >
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => {
                setTheme(t);
                setCurrentTheme(t);
              }}
              className={cn(
                "btn btn-sm btn-ghost w-full justify-start rounded-lg capitalize",
                currentTheme === t && "border border-primary text-primary"
              )}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
