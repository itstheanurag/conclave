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
    <div className="dropdown dropdown-end">
      <button className="btn btn-outline rounded-lg btn-sm capitalize w-full">
        {currentTheme}
      </button>
      <ul className="dropdown-content bg-base-100 border border-base-200 rounded-xl w-full mt-2 shadow-lg p-2 z-[1]">
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => {
                setTheme(t);
                setCurrentTheme(t);
              }}
              className={`btn btn-sm btn-ghost w-full justify-start rounded-lg capitalize ${
                currentTheme === t ? "border border-primary text-primary" : ""
              }`}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
