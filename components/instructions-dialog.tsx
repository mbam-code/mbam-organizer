"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InstructionsDialogProps {
  isOpen: boolean
  mode: string
  modeLabel: string
  selectedText: string
  onApply: (instructions: string) => void
  onCancel: () => void
}

export default function InstructionsDialog({
  isOpen,
  mode,
  modeLabel,
  selectedText,
  onApply,
  onCancel,
}: InstructionsDialogProps) {
  const [instructions, setInstructions] = React.useState("")

  // Reset when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setInstructions("")
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleApply = () => {
    onApply(instructions)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Ctrl/Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleApply()
    }
    // Escape to cancel
    if (e.key === "Escape") {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-burgundy-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {modeLabel}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Selected Text Preview */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
                Selected Text:
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 max-h-24 overflow-hidden">
                {selectedText}
              </div>
            </div>

            {/* Instructions Input */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">
                Additional Instructions (Optional):
              </label>
              <div className="relative">
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Tell the AI exactly how you'd like to change this selection. For example:\n"Make this more conversational and concise"\n"Use simpler vocabulary"\n"Add more technical details"\n\nLeave blank to use default ${modeLabel.toLowerCase()} behavior.`}
                  className="min-h-32 resize-none border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                  {instructions.length} chars | Ctrl+Enter to apply
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="px-6 bg-burgundy-600 hover:bg-burgundy-700 text-white"
            >
              Apply Edit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
