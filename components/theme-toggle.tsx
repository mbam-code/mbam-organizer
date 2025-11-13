"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by waiting for client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gold bg-burgundy dark:bg-gray-900"
      role="group"
      aria-label="Theme toggle"
    >
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded transition-all ${
          !isDark
            ? "bg-gold/20 ring-2 ring-gold"
            : "hover:bg-gold/10"
        }`}
        title="Light mode"
        aria-pressed={!isDark}
      >
        <Sun className="h-5 w-5 text-gold" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded transition-all ${
          isDark
            ? "bg-gold/20 ring-2 ring-gold"
            : "hover:bg-gold/10"
        }`}
        title="Dark mode"
        aria-pressed={isDark}
      >
        <Moon className="h-5 w-5 text-white" />
      </button>
    </div>
  )
}
