"use client"

import * as React from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModelOption {
  id: string
  label: string
  description: string
  costTier: "cheap" | "balanced" | "expensive"
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "claude-3-5-haiku-20241022",
    label: "Haiku (Fast & Cheap)",
    description: "Fast, low-cost model for simple tasks",
    costTier: "cheap",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    label: "Sonnet (Balanced)",
    description: "Well-rounded model for most tasks",
    costTier: "balanced",
  },
  {
    id: "claude-3-opus-20250219",
    label: "Opus (Highest Quality)",
    description: "Most powerful model, best for complex tasks",
    costTier: "expensive",
  },
]

export interface ModelSelectorProps {
  currentModel: string
  onModelChange: (modelId: string) => void
  className?: string
}

export default function ModelSelector({
  currentModel,
  onModelChange,
  className,
}: ModelSelectorProps) {
  const selectedModel = AVAILABLE_MODELS.find(m => m.id === currentModel)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Zap className="w-4 h-4 text-burgundy-600" />
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
        Model:
      </label>
      <select
        value={currentModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
      >
        {AVAILABLE_MODELS.map(model => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
      {selectedModel && (
        <span className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
          {selectedModel.description}
        </span>
      )}
    </div>
  )
}
