"use client";
import { useTheme } from "next-themes";

export default function ThemeController() {
  const themes = ["sunset", "nord", "dim", "lofi", "halloween"];
  const { theme, setTheme } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-outline rounded-lg btn-sm">Themes</button>
      <ul className="dropdown-content bg-base-100 border border-base-200 rounded-xl w-52 mt-2 shadow-lg p-2 z-[1]">
        {themes.map((t) => (
          <li key={t}>
            <button
              onClick={() => setTheme(t)}
              className={`btn btn-sm btn-ghost w-full justify-start rounded-lg capitalize ${
                theme === t ? "border border-primary text-primary" : ""
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
