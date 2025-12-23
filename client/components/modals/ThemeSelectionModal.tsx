"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

const RECOMMENDED_THEMES = [
  "dark",
  "luxury",
  "dracula",
  "sunset",
  "dim",
  "lofi",
  "halloween",
];

const ALL_THEMES = [
  "bumblebee",
  "corporate",
  "valentine", 
  "forest",
  "pastel",
  "fantasy",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export default function ThemeSelectionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { currentTheme, setCurrentTheme } = useUIStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (resolvedTheme) setCurrentTheme(resolvedTheme);
  }, [resolvedTheme, setCurrentTheme]);

  if (!mounted) return null;

  const renderThemeCard = (theme: string) => (
    <div
      key={theme}
      className={cn(
        "card w-full bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-200",
        currentTheme === theme && "border-2 border-primary"
      )}
      onClick={() => {
        setTheme(theme);
        setCurrentTheme(theme);
      }}
      data-theme={theme}
    >
      <div className="card-body p-4">
        <h4 className="card-title text-base-content capitalize">{theme}</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-6 w-6 rounded-full bg-primary"></div>
          <div className="h-6 w-6 rounded-full bg-secondary"></div>
          <div className="h-6 w-6 rounded-full bg-accent"></div>
          <div className="h-6 w-6 rounded-full bg-neutral"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-base-200 rounded-lg shadow-lg z-10 w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Palette className="mr-2" /> Select Theme
        </h3>

        {/* Recommended Themes */}
        <section className="mb-6">
          <h4 className="font-semibold mb-3 text-base-content">Recommended</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {RECOMMENDED_THEMES.map(renderThemeCard)}
          </div>
        </section>

        {/* All Themes */}
        <section>
          <h4 className="font-semibold mb-3 text-base-content">All Themes</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALL_THEMES.map(renderThemeCard)}
          </div>
        </section>
      </div>
    </div>
  );
}
