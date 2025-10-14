"use client";
import React, { useEffect, useState } from "react";

export default function ThemeController() {
  const themes = ["sunset", "nord", "dim", "lofi", "halloween"];
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-outline rounded-lg btn-sm">Themes</button>

      <ul
        tabIndex={0}
        className="dropdown-content bg-base-100 border border-base-200 rounded-xl w-52 mt-2 shadow-lg p-2 z-[1]"
      >
        <li className="text-sm font-semibold text-base-content/70 px-2 py-1">
          Choose a theme
        </li>
        <div className="divider my-1" />
        {themes.map((theme) => (
          <li key={theme}>
            <button
              onClick={() => handleThemeChange(theme)}
              className={`btn btn-sm btn-ghost w-full justify-start rounded-lg capitalize transition-colors ${
                currentTheme === theme
                  ? "border border-primary text-primary"
                  : "border border-transparent"
              }`}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
