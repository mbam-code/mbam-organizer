"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 p-0"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-transform hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600 transition-transform hover:rotate-90" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
