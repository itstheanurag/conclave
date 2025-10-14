"use client";
import React from "react";

export default function ThemeController() {
  const themes = ["sunset", "nord", "dim", "lofi", "halloween"];

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        className="btn btn-ghost rounded-lg btn-sm font-semibold tracking-wide transition-all"
      >
        Theme
      </div>

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
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-ghost justify-start border border-transparent hover:border-primary hover:text-primary transition-colors rounded-lg capitalize"
              value={theme}
              aria-label={theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
