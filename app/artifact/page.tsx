"use client"

import * as React from "react"
import ArtifactEditor from "@/components/artifact-editor"
import ArtifactChatPanel, { type Artifact } from "@/components/artifact-chat-panel"
import type { ChatMessage } from "@/types/artifact"

export default function ArtifactPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [selectedModel, setSelectedModel] = React.useState("claude-3-5-haiku-20241022")

  // Current artifact state - manages the artifact displayed in the editor
  const [currentArtifact, setCurrentArtifact] = React.useState<{
    identifier: string
    type: string
    title: string
    content: string
  } | null>(null)

  const handleChatMessage = (message: ChatMessage | string) => {
    if (typeof message === "string") {
      // String content - wrap in ChatMessage
      const chatMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, chatMsg])
    } else {
      // Already a ChatMessage
      setMessages((prev) => [...prev, message])
    }
  }

  const handleUserMessage = (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    handleChatMessage(userMessage)
  }

  const handleArtifactCreated = (artifact: Artifact) => {
    // Update current artifact when one is created from chat
    setCurrentArtifact(artifact)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-[400px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <ArtifactChatPanel
            messages={messages}
            selectedModel={selectedModel}
            onSendMessage={handleUserMessage}
            onArtifactCreated={handleArtifactCreated}
            className="h-full"
          />
        </div>

        {/* Right Panel: Artifact Editor */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <ArtifactEditor
            initialDocumentText={currentArtifact?.content || ""}
            initialDocumentTitle={currentArtifact?.title || "Untitled Document"}
            selectedModel={selectedModel}
            onSelectedModelChange={setSelectedModel}
            onChatMessage={handleChatMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
