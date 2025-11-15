"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SkillsDropdown, { type Skill } from "@/components/skills-dropdown"
import DocumentViewer from "@/components/document-viewer"
import ChatPanel, { type ChatMessage } from "@/components/chat-panel"
import { CheckCircle2, Type, Zap, Wrench, Palette, Download, FileEdit, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateId } from "@/lib/utils"

const AVAILABLE_SKILLS: Skill[] = [
  {
    id: "grammar",
    label: "Grammar Expert",
    icon: CheckCircle2,
    color: "#10B981",
    description: "Improve grammar and clarity",
    enabled: false,
  },
  {
    id: "style",
    label: "Style Expert",
    icon: Type,
    color: "#8B5CF6",
    description: "Enhance writing style and flow",
    enabled: false,
  },
  {
    id: "conciseness",
    label: "Conciseness Expert",
    icon: Zap,
    color: "#F59E0B",
    description: "Make content more concise",
    enabled: false,
  },
  {
    id: "technical",
    label: "Technical Expert",
    icon: Wrench,
    color: "#3B82F6",
    description: "Improve technical accuracy",
    enabled: false,
  },
  {
    id: "creative",
    label: "Creative Expert",
    icon: Palette,
    color: "#EC4899",
    description: "Add creative flair and engagement",
    enabled: false,
  },
]

export default function ContentRefinement() {
  const [documentContent, setDocumentContent] = React.useState("")
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingContent, setEditingContent] = React.useState("")
  const [skills, setSkills] = React.useState<Skill[]>(AVAILABLE_SKILLS)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedText, setSelectedText] = React.useState<string | undefined>()

  const handleSkillToggle = (skillId: string) => {
    setSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill
      )
    )
  }

  const handleStartEditing = () => {
    setEditingContent(documentContent)
    setIsEditing(true)
  }

  const handleSaveDocument = () => {
    setDocumentContent(editingContent)
    setIsEditing(false)
  }

  const handleCancelEditing = () => {
    setEditingContent("")
    setIsEditing(false)
  }

  const handleSendMessage = async (instruction: string) => {
    if (!documentContent.trim()) {
      alert("Please write or paste some content in the document first")
      return
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: instruction,
      selectedText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const activeSkills = skills.filter(s => s.enabled).map(s => ({
        label: s.label,
        description: s.description,
      }))

      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: documentContent,
          instruction,
          selectedText,
          activeSkills,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to refine content")
      }

      const data = await response.json()

      // Update document with refined content
      setDocumentContent(data.refinedContent)

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Document updated successfully",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Clear selection after processing
      setSelectedText(undefined)
    } catch (error: any) {
      console.error("Error refining content:", error)

      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Error: ${error.message}. Please make sure your API key is configured correctly.`,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextSelect = (text: string) => {
    setSelectedText(text)
  }

  const handleClearSelection = () => {
    setSelectedText(undefined)
  }

  const handleExport = () => {
    const content = documentContent
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `content-${Date.now()}.txt`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Refinement Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Refine your content conversationally with Claude. Select skills to control which expert perspectives guide the refinement.
          </p>
        </div>

        {/* Skills Control Panel */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <SkillsDropdown skills={skills} onSkillToggle={handleSkillToggle} />

              {/* Active Skills Display */}
              <div className="flex flex-wrap gap-2">
                {skills.filter(s => s.enabled).map(skill => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${skill.color}20`,
                      color: skill.color,
                      border: `1px solid ${skill.color}40`,
                    }}
                  >
                    <skill.icon className="w-3 h-3" />
                    {skill.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!documentContent}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
          {/* Left: Document Viewer/Editor */}
          <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileEdit className="w-5 h-5" />
                Document
              </h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEditing}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEditing}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveDocument}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="Start writing your content here..."
                  className="h-full resize-none border-0 rounded-none focus:ring-0 font-serif"
                />
              ) : (
                <DocumentViewer
                  content={documentContent}
                  onTextSelect={handleTextSelect}
                  className="h-full border-0 rounded-none"
                />
              )}
            </div>
          </div>

          {/* Right: Chat Panel */}
          <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Refinement Chat
              </h2>
            </div>

            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              selectedText={selectedText}
              onClearSelection={handleClearSelection}
              className="flex-1"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-accent/10 dark:bg-accent/10 border border-accent rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            How to use:
          </h3>
          <ol className="text-sm text-foreground space-y-1 ml-4 list-decimal">
            <li>Click "Edit" to write or paste your initial content</li>
            <li>Select expert skills from the dropdown to guide Claude's refinements</li>
            <li>Optionally, highlight text in the document to focus on specific sections</li>
            <li>Type your refinement instructions in the chat (e.g., "Make the introduction more engaging")</li>
            <li>Claude will revise the entire document and update it for you</li>
            <li>Continue refining by giving more instructions or toggling different skills</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
