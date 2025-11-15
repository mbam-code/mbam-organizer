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
 *
 * UI:
 * - When closed: Click the "🎨 Colors" pill in the bottom-right to open
 * - When open: Click the "✕" button in the top-right to close
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


  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-xs font-medium font-mono bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
          title="Click to open color inspector"
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
        <h3 className="font-bold text-foreground text-sm">Color Inspector</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-foreground hover:text-primary hover:bg-primary/10 p-1 rounded transition-colors"
          title="Close inspector"
        >
          ✕
        </button>
      </div>

      {/* Theme & Browser Info */}
      <div className="border-b border-border pb-2 mb-2">
        <div className="text-foreground space-y-1">
          <div className="font-semibold">Theme: <span className="text-primary font-bold">{isDarkMode ? "DARK" : "LIGHT"}</span></div>
          <div className="font-semibold">Browser: <span className="text-foreground font-mono text-[11px]">{browserInfo}</span></div>
        </div>
      </div>

      {/* Active CSS Variables */}
      <div className="border-b border-border pb-2 mb-2">
        <h4 className="font-bold text-foreground mb-2 text-sm">Active CSS Variables:</h4>
        {Object.entries(computedColors)
          .filter(([_, v]) => v)
          .slice(0, 10)
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 mb-2 text-foreground">
              <code className="flex-1 text-[11px] font-semibold">{key}:</code>
              <div
                className="w-6 h-6 rounded border-2 border-border flex-shrink-0"
                style={{ backgroundColor: value }}
                title={value}
              />
              <code className="text-[10px] font-semibold whitespace-nowrap">{value}</code>
            </div>
          ))}
      </div>

      {/* Porsche Color Palette */}
      <div>
        <h4 className="font-bold text-foreground mb-2 text-sm">Porsche Palette:</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PORSCHE_COLORS).map(([name, hex]) => (
            <div key={name} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-border flex-shrink-0"
                title={hex}
                style={{ backgroundColor: hex }}
              />
              <code className="text-[10px] text-foreground font-semibold truncate">{name}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t border-border mt-3 pt-2 text-[11px] text-foreground">
        Click the <span className="font-semibold">Colors</span> button to reopen this panel
      </div>
    </div>
  )
}
