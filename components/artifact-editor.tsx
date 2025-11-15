"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import EditorModeSelector from "@/components/editor-mode-selector"
import FloatingToolbar from "@/components/floating-toolbar"
import ModelSelector from "@/components/model-selector"
import InstructionsDialog from "@/components/instructions-dialog"
import VersionHistory from "@/components/version-history"
import { Copy, Download, Clock, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateId } from "@/lib/utils"
import type { DocumentVersion, ChatMessage } from "@/types/artifact"
import { EDITING_MODES } from "@/lib/editing-modes"

export interface ArtifactEditorProps {
  initialDocumentText?: string
  initialDocumentTitle?: string
  selectedModel?: string
  onSelectedModelChange?: (model: string) => void
  onChatMessage: (message: ChatMessage) => void
  className?: string
}

export default function ArtifactEditor({
  initialDocumentText = "",
  initialDocumentTitle = "Untitled Document",
  selectedModel: propSelectedModel = "claude-3-5-haiku-20241022",
  onSelectedModelChange,
  onChatMessage,
  className,
}: ArtifactEditorProps) {
  const [documentTitle, setDocumentTitle] = React.useState(initialDocumentTitle)
  const [documentText, setDocumentText] = React.useState(initialDocumentText)
  const [selectedMode, setSelectedMode] = React.useState("improve_selection")
  const [selectedTone, setSelectedTone] = React.useState("professional")
  const [versions, setVersions] = React.useState<DocumentVersion[]>([])
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedModel, setSelectedModel] = React.useState(propSelectedModel)

  // Sync with parent-provided props when they change
  React.useEffect(() => {
    if (initialDocumentText) {
      setDocumentText(initialDocumentText)
    }
  }, [initialDocumentText])

  React.useEffect(() => {
    if (initialDocumentTitle) {
      setDocumentTitle(initialDocumentTitle)
    }
  }, [initialDocumentTitle])

  // Notify parent of model changes
  const handleModelChange = (model: string) => {
    setSelectedModel(model)
    onSelectedModelChange?.(model)
  }

  // Selection state
  const [selection, setSelection] = React.useState<{
    text: string
    start: number
    end: number
  } | null>(null)
  const [toolbarPosition, setToolbarPosition] = React.useState<{ x: number; y: number } | null>(null)

  // Instructions dialog state
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = React.useState(false)
  const [pendingEditMode, setPendingEditMode] = React.useState<string | null>(null)

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Handle text selection
  const handleTextSelect = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = documentText.substring(start, end).trim()

    console.log("[SELECTION DEBUG] handleTextSelect fired", {
      selectionStart: start,
      selectionEnd: end,
      selectedText,
      hasSelection: selectedText.length > 0,
    })

    if (selectedText.length > 0) {
      setSelection({ text: selectedText, start, end })

      // Use a simple approach: position toolbar based on textarea bounds
      // and center it horizontally
      const textareaRect = textarea.getBoundingClientRect()

      // Position toolbar at the top-center of the textarea, above the visible area
      const x = textareaRect.left + textareaRect.width / 2
      const y = textareaRect.top - 80  // 80px above textarea top

      console.log("[SELECTION DEBUG] Setting toolbar position:", {
        x,
        y,
        textareaTop: textareaRect.top,
        textareaLeft: textareaRect.left,
        textareaWidth: textareaRect.width,
      })
      setToolbarPosition({ x, y })
    } else {
      console.log("[SELECTION DEBUG] Clearing selection (no text)")
      setSelection(null)
      setToolbarPosition(null)
    }
  }

  // Clear selection
  const clearSelection = () => {
    console.log("[SELECTION DEBUG] clearSelection() called")
    console.trace("[SELECTION DEBUG] clearSelection stack trace")
    setSelection(null)
    setToolbarPosition(null)
  }

  // Save version to history
  const saveVersion = (operation: string, modeUsed: string) => {
    const version: DocumentVersion = {
      id: generateId(),
      timestamp: new Date(),
      documentText,
      operation,
      modeUsed,
    }
    setVersions(prev => [version, ...prev])
  }

  // Handle edit action
  const handleEdit = async (mode: string, customInstruction?: string) => {
    if (!documentText.trim()) {
      setError("Document is empty. Please add some content first.")
      return
    }

    setIsLoading(true)
    setError(null)
    clearSelection()

    try {
      // Determine if this is a selection edit or full document edit
      const isSelectionEdit = mode !== "rewrite_document" && selection

      // Log action to chat
      const modeLabel = EDITING_MODES.find(m => m.id === mode)?.label || mode
      const actionMessage: ChatMessage = {
        id: generateId(),
        role: "system",
        content: isSelectionEdit
          ? `Applying "${modeLabel}" to selected text: "${selection!.text.substring(0, 50)}${selection!.text.length > 50 ? "..." : ""}"`
          : `Applying "${modeLabel}" to entire document`,
        timestamp: new Date(),
        metadata: {
          type: "edit_action",
          operation: modeLabel,
        },
      }
      onChatMessage(actionMessage)

      // Call API
      const response = await fetch("/api/artifact-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          mode,
          selectedText: isSelectionEdit ? selection!.text : undefined,
          fullDocumentText: documentText,
          instructions: customInstruction,
          toneStyle: mode === "rewrite_selection" ? selectedTone : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process edit")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error("API returned unsuccessful response")
      }

      const result = data.result

      // Save current version before making changes
      saveVersion(modeLabel, mode)

      // Handle different response types
      if (result.type === "selection_edit" && isSelectionEdit) {
        // Replace selected text
        const newText =
          documentText.substring(0, selection!.start) +
          result.replacementText +
          documentText.substring(selection!.end)

        setDocumentText(newText)

        // Add explanation to chat if provided
        if (result.explanation) {
          const explainMessage: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: result.explanation,
            timestamp: new Date(),
          }
          onChatMessage(explainMessage)
        }
      } else if (result.type === "document_edit") {
        // Replace entire document
        setDocumentText(result.newDocumentText)

        // Add explanation to chat if provided
        if (result.explanation) {
          const explainMessage: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: result.explanation,
            timestamp: new Date(),
          }
          onChatMessage(explainMessage)
        }
      } else if (result.type === "explanation_only") {
        // Just add explanation to chat, don't modify document
        const explainMessage: ChatMessage = {
            id: generateId(),
          role: "assistant",
          content: result.explanation,
          timestamp: new Date(),
          metadata: {
            type: "explanation",
          },
        }
        onChatMessage(explainMessage)
      }
    } catch (err: any) {
      console.error("Edit error:", err)
      setError(err.message || "Failed to process edit")

      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Error: ${err.message || "Failed to process edit"}`,
        timestamp: new Date(),
      }
      onChatMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Open instructions dialog for a given mode
  const openInstructionsDialog = (mode: string) => {
    if (!selection) {
      setError("No text selected. Please select text first.")
      return
    }
    setPendingEditMode(mode)
    setIsInstructionsDialogOpen(true)
  }

  // Handle instructions dialog apply
  const handleInstructionsApply = (instructions: string) => {
    if (!pendingEditMode) return
    setIsInstructionsDialogOpen(false)
    handleEdit(pendingEditMode, instructions)
    setPendingEditMode(null)
  }

  // Handle instructions dialog cancel
  const handleInstructionsCancel = () => {
    setIsInstructionsDialogOpen(false)
    setPendingEditMode(null)
  }

  // Quick action handlers for floating toolbar
  const handleImprove = () => openInstructionsDialog("improve_selection")
  const handleRewrite = () => openInstructionsDialog("rewrite_selection")
  const handleExplain = () => openInstructionsDialog("explain_selection")
  const handleMoreOptions = () => {
    // TODO: Show modal with all editing options
    alert("More options coming soon!")
  }

  // Restore version
  const handleRestoreVersion = (version: DocumentVersion) => {
    setDocumentText(version.documentText)
    setIsVersionHistoryOpen(false)

    const restoreMessage: ChatMessage = {
      id: generateId(),
      role: "system",
      content: `Restored version from ${version.timestamp.toLocaleString()}`,
      timestamp: new Date(),
    }
    onChatMessage(restoreMessage)
  }

  // Export document
  const handleExport = () => {
    const blob = new Blob([documentText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement("a")
    link.href = url
    link.download = `${documentTitle.replace(/\s+/g, "_")}.txt`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Copy to clipboard
  const handleCopy = async () => {
    await navigator.clipboard.writeText(documentText)
    // Could add a toast notification here
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Editor Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
            placeholder="Document title..."
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVersionHistoryOpen(true)}
              disabled={versions.length === 0}
            >
              <Clock className="w-4 h-4 mr-2" />
              History ({versions.length})
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!documentText}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!documentText}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-between gap-4">
          <EditorModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
          />
          <ModelSelector
            currentModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative">
        <Textarea
          ref={textareaRef}
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          onMouseUp={handleTextSelect}
          onKeyUp={handleTextSelect}
          onClick={(e) => {
            console.log("[SELECTION DEBUG] onClick fired, event.detail:", e.detail)
            // Only clear selection if this is a plain click (not a drag)
            // Check if there's no selection in the textarea
            const textarea = textareaRef.current
            if (textarea && textarea.selectionStart === textarea.selectionEnd) {
              console.log("[SELECTION DEBUG] onClick: No selection detected, clearing")
              clearSelection()
            } else {
              console.log("[SELECTION DEBUG] onClick: Selection exists, NOT clearing")
            }
          }}
          placeholder="Start writing your content here..."
          className="h-full resize-none border-0 rounded-none focus:ring-0 font-serif text-base leading-relaxed p-6"
          disabled={isLoading}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          </div>
        )}

        {/* Floating Toolbar */}
        <FloatingToolbar
          position={toolbarPosition}
          onImprove={handleImprove}
          onRewrite={handleRewrite}
          onExplain={handleExplain}
          onMoreOptions={handleMoreOptions}
          isLoading={isLoading}
        />
      </div>

      {/* Instructions Dialog */}
      {pendingEditMode && (
        <InstructionsDialog
          isOpen={isInstructionsDialogOpen}
          mode={pendingEditMode}
          modeLabel={EDITING_MODES.find(m => m.id === pendingEditMode)?.label || pendingEditMode}
          selectedText={selection?.text || ""}
          onApply={handleInstructionsApply}
          onCancel={handleInstructionsCancel}
        />
      )}

      {/* Version History Panel */}
      <VersionHistory
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        versions={versions}
        currentDocumentText={documentText}
        onRestore={handleRestoreVersion}
      />
    </div>
  )
}
