"use client"

import React, { useEffect, useState } from "react"
import { PORSCHE_COLORS, LIGHT_MODE_TOKENS, DARK_MODE_TOKENS } from "@/lib/porsche-colors"

/**
 * Color Debug Inspector
 *
 * A simple overlay component that shows:
 * 1. Current theme (light/dark)
 * 2. Active CSS variables and their computed values
 * 3. Porsche color palette reference
 * 4. Browser info for debugging cross-browser differences
 *
 * Usage: Add <ColorDebugInspector /> near the end of your layout
 * Press 'D' to toggle the inspector
 */

interface ComputedColors {
  [key: string]: string;
}

export function ColorDebugInspector() {
  const [isOpen, setIsOpen] = useState(false)
  const [computedColors, setComputedColors] = useState<ComputedColors>({})
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [browserInfo, setBrowserInfo] = useState("")

  useEffect(() => {
    // Detect theme
    const htmlElement = document.documentElement
    setIsDarkMode(htmlElement.classList.contains("dark"))

    // Get computed CSS variables
    const root = document.documentElement
    const cssVariables = [
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--accent",
      "--accent-foreground",
      "--border",
      "--input",
      "--muted",
      "--muted-foreground",
      "--destructive",
      "--destructive-foreground",
      "--ring",
    ]

    const colors: ComputedColors = {}
    cssVariables.forEach((varName) => {
      const value = getComputedStyle(root).getPropertyValue(varName).trim()
      colors[varName] = value
    })
    setComputedColors(colors)

    // Get browser info
    const ua = navigator.userAgent
    let browserName = "Unknown"
    if (ua.includes("Chrome")) browserName = "Chrome"
    else if (ua.includes("Safari")) browserName = "Safari"
    else if (ua.includes("Firefox")) browserName = "Firefox"
    else if (ua.includes("Edg")) browserName = "Edge"

    setBrowserInfo(`${browserName} | ${window.innerWidth}x${window.innerHeight}`)
  }, [])

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const htmlElement = document.documentElement
      setIsDarkMode(htmlElement.classList.contains("dark"))

      // Recalculate colors
      const root = document.documentElement
      const cssVariables = [
        "--background",
        "--foreground",
        "--card",
        "--primary",
        "--accent",
        "--border",
      ]

      const colors: ComputedColors = {}
      cssVariables.forEach((varName) => {
        const value = getComputedStyle(root).getPropertyValue(varName).trim()
        colors[varName] = value
      })
      setComputedColors(colors)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  // Toggle with 'D' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && e.ctrlKey) {
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 text-xs font-mono bg-primary text-primary-foreground rounded opacity-50 hover:opacity-100 transition-opacity"
          title="Press Ctrl+D to toggle color inspector"
        >
          🎨 Colors
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-card border border-border rounded-lg shadow-lg p-4 font-mono text-xs overflow-y-auto max-h-96">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-primary">Color Inspector</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Theme & Browser Info */}
      <div className="border-b border-border pb-2 mb-2">
        <div className="text-muted-foreground">
          <div>Theme: <span className="text-primary font-bold">{isDarkMode ? "DARK" : "LIGHT"}</span></div>
          <div>Browser: <span className="text-accent">{browserInfo}</span></div>
        </div>
      </div>

      {/* Active CSS Variables */}
      <div className="border-b border-border pb-2 mb-2">
        <h4 className="font-bold text-secondary mb-1">Active CSS Variables:</h4>
        {Object.entries(computedColors)
          .filter(([_, v]) => v)
          .slice(0, 10)
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <code className="text-muted-foreground flex-1">{key}:</code>
              <div
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: value }}
                title={value}
              />
              <code className="text-accent text-[10px]">{value}</code>
            </div>
          ))}
      </div>

      {/* Porsche Color Palette */}
      <div>
        <h4 className="font-bold text-secondary mb-1">Porsche Palette:</h4>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(PORSCHE_COLORS).map(([name, hex]) => (
            <div key={name} className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded border border-border"
                title={hex}
                style={{ backgroundColor: hex }}
              />
              <code className="text-[9px] text-muted-foreground">{name}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t border-border mt-2 pt-2 text-[10px] text-muted-foreground">
        Press <kbd className="bg-muted px-1 rounded">Ctrl+D</kbd> to toggle
      </div>
    </div>
  )
}
