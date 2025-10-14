"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export default function ThemeController() {
  const themes = ["sunset", "nord", "dim", "lofi", "halloween"];
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Prevent SSR/client mismatch

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-outline rounded-lg btn-sm">Themes</button>
      <ul className="dropdown-content bg-base-100 border border-base-200 rounded-xl w-52 mt-2 shadow-lg p-2 z-[1]">
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => setTheme(t)}
              className={`btn btn-sm btn-ghost w-full justify-start rounded-lg capitalize ${
                resolvedTheme === t ? "border border-primary text-primary" : ""
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
