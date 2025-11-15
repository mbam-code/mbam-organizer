"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  RotateCw,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface FloatingToolbarProps {
  position: { x: number; y: number } | null
  onImprove: () => void
  onRewrite: () => void
  onExplain: () => void
  onMoreOptions: () => void
  isLoading?: boolean
}

export default function FloatingToolbar({
  position,
  onImprove,
  onRewrite,
  onExplain,
  onMoreOptions,
  isLoading = false,
}: FloatingToolbarProps) {
  if (!position) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          className={cn(
            "flex items-center gap-1 p-1",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "rounded-lg shadow-lg",
            "backdrop-blur-sm"
          )}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={onImprove}
            disabled={isLoading}
            className="h-8 px-3 text-xs font-medium hover:bg-secondary/10 dark:hover:bg-secondary/10"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Improve
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onRewrite}
            disabled={isLoading}
            className="h-8 px-3 text-xs font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
            Rewrite
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onExplain}
            disabled={isLoading}
            className="h-8 px-3 text-xs font-medium hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Explain
          </Button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={onMoreOptions}
            disabled={isLoading}
            className="h-8 px-2 text-xs font-medium"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Pointer triangle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-gray-800"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
