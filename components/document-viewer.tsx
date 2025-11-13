"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DocumentViewerProps {
  content: string
  onTextSelect?: (selectedText: string) => void
  className?: string
}

export default function DocumentViewer({ content, onTextSelect, className }: DocumentViewerProps) {
  const handleMouseUp = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    if (selectedText && onTextSelect) {
      onTextSelect(selectedText)
    }
  }

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "p-6 rounded-lg border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800",
        "overflow-auto",
        "select-text cursor-text",
        className
      )}
      onMouseUp={handleMouseUp}
    >
      <div className="whitespace-pre-wrap font-serif text-gray-900 dark:text-gray-100 leading-relaxed">
        {content || (
          <div className="text-gray-400 dark:text-gray-600 italic">
            Your content will appear here...
          </div>
        )}
      </div>
    </div>
  )
}
