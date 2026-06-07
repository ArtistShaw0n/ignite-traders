"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Reads the initial theme on first render via a lazy initializer.
 * The HTML never runs this during SSR (server returns hydration-safe default
 * via the `<Script>` in root layout), and on the client `useState` calls this
 * once before paint — avoiding a flicker AND avoiding setState-in-effect.
 */
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Mark mounted after first render so we know hydration is complete and we can
  // render the real (theme-aware) icon. Avoids hydration mismatch warnings —
  // this is a standard SSR-safe hydration signal, not state synchronisation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => mounted && setTheme(theme === "light" ? "dark" : "light")}
      aria-label={
        !mounted ? "Toggle theme" : isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      suppressHydrationWarning
      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--fg-primary)] hover:bg-[var(--bg-surface-muted)] transition-colors"
    >
      {/* Both icons rendered — CSS shows the right one. Avoids SSR/CSR
          hydration mismatch (server doesn't know the user's stored theme)
          while still showing an icon immediately on first paint. */}
      <Moon size={18} className={isDark ? "hidden" : "block"} />
      <Sun size={18} className={isDark ? "block" : "hidden"} />
    </button>
  );
}
