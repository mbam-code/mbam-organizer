"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { EDITING_MODES, TONE_STYLES, type EditingMode } from "@/lib/editing-modes"
import { motion, AnimatePresence } from "framer-motion"
import { useClickAway } from "@/hooks/use-click-away"

export interface EditorModeSelectorProps {
  selectedMode: string
  onModeChange: (modeId: string) => void
  selectedTone?: string
  onToneChange?: (tone: string) => void
  className?: string
}

export default function EditorModeSelector({
  selectedMode,
  onModeChange,
  selectedTone,
  onToneChange,
  className,
}: EditorModeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isToneOpen, setIsToneOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const toneDropdownRef = React.useRef<HTMLDivElement>(null)

  useClickAway(dropdownRef, () => setIsOpen(false))
  useClickAway(toneDropdownRef, () => setIsToneOpen(false))

  const currentMode = EDITING_MODES.find(m => m.id === selectedMode) || EDITING_MODES[0]
  const currentTone = TONE_STYLES.find(t => t.id === selectedTone) || TONE_STYLES[0]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Mode Selector */}
      <div className="relative" ref={dropdownRef}>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
          Editing Mode
        </Label>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-64 justify-between text-sm"
        >
          <span className="flex items-center gap-2">
            <currentMode.icon className="w-4 h-4" />
            {currentMode.label}
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
            >
              <div className="p-2">
                {EDITING_MODES.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onModeChange(mode.id)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-md text-left transition-colors",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        selectedMode === mode.id && "bg-primary/10 dark:bg-primary/10"
                      )}
                    >
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mode.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {mode.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tone Selector (only shown for modes that need it) */}
      {currentMode.requiresTone && onToneChange && (
        <div className="relative" ref={toneDropdownRef}>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
            Tone Style
          </Label>
          <Button
            variant="outline"
            onClick={() => setIsToneOpen(!isToneOpen)}
            className="w-40 justify-between text-sm"
          >
            {currentTone.label}
            <ChevronDown className={cn("w-4 h-4 transition-transform", isToneOpen && "rotate-180")} />
          </Button>

          <AnimatePresence>
            {isToneOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
              >
                <div className="p-1">
                  {TONE_STYLES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => {
                        onToneChange(tone.id)
                        setIsToneOpen(false)
                      }}
                      className={cn(
                        "w-full px-3 py-2 rounded-md text-left text-sm transition-colors",
                        "hover:bg-gray-100 dark:hover:bg-gray-700",
                        selectedTone === tone.id && "bg-primary/10 dark:bg-primary/10 font-medium"
                      )}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
