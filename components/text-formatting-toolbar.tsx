"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TextFormattingToolbarProps {
  onFontSizeChange?: (size: string) => void
  currentFontSize?: string
  className?: string
}

export default function TextFormattingToolbar({
  onFontSizeChange,
  currentFontSize = "base",
  className,
}: TextFormattingToolbarProps) {
  const fontSizeOptions = [
    { value: "sm", label: "Small (14px)" },
    { value: "base", label: "Base (16px)" },
    { value: "lg", label: "Large (18px)" },
    { value: "xl", label: "Extra Large (20px)" },
    { value: "2xl", label: "2XL (24px)" },
    { value: "3xl", label: "3XL (30px)" },
  ]

  return (
    <div className={cn("flex items-center gap-4 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700", className)}>
      {/* Font Size Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Font Size:</label>
        <select
          value={currentFontSize}
          onChange={(e) => onFontSizeChange?.(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
        >
          {fontSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

      {/* Helpful Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        💡 Select text in the editor to access formatting options
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Version Info */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        Supports markdown formatting
      </div>
    </div>
  )
}
