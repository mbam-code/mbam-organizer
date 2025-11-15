"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X, Clock, RotateCcw, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { DocumentVersion } from "@/types/artifact"

export interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
  versions: DocumentVersion[]
  currentDocumentText: string
  onRestore: (version: DocumentVersion) => void
}

export default function VersionHistory({
  isOpen,
  onClose,
  versions,
  currentDocumentText,
  onRestore,
}: VersionHistoryProps) {
  const [previewVersion, setPreviewVersion] = React.useState<DocumentVersion | null>(null)

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Version History
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Versions List */}
            <div className="flex-1 overflow-y-auto p-4">
              {versions.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No previous versions yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Versions will be saved as you edit
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Current version */}
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Current Version
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          {currentDocumentText.slice(0, 60)}
                          {currentDocumentText.length > 60 && "..."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Previous versions */}
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        "hover:border-gray-300 dark:hover:border-gray-600",
                        "bg-white dark:bg-gray-900",
                        "border-gray-200 dark:border-gray-700",
                        previewVersion?.id === version.id &&
                          "ring-2 ring-blue-500 dark:ring-blue-400"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {version.operation}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatTimestamp(version.timestamp)}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewVersion(version)}
                            className="h-7 w-7 p-0"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Restore this version? Current changes will be lost.")) {
                                onRestore(version)
                                setPreviewVersion(null)
                              }
                            }}
                            className="h-7 w-7 p-0"
                            title="Restore"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {version.documentText.slice(0, 100)}
                        {version.documentText.length > 100 && "..."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            {previewVersion && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Preview
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewVersion(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {previewVersion.documentText}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
