"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <Link href="/editor" className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Pix</span>
            <span style={{ color: "#E74C3C" }}>3</span>
            <span style={{ color: "#3498DB" }}>l</span>
            <span className="text-foreground">Prompt</span>
          </Link>
          <span className="text-xs font-medium text-muted-foreground">
            v1.0.0
          </span>
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
