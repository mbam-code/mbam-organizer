"use client"

import * as React from "react"
import ArtifactEditor from "@/components/artifact-editor"
import ArtifactChatPanel from "@/components/artifact-chat-panel"
import type { ChatMessage } from "@/types/artifact"

export default function ArtifactPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])

  const handleChatMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }

  const handleUserMessage = (content: string) => {
    // This would be for freeform chat with AI
    // For now, we'll just add the user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    handleChatMessage(userMessage)

    // TODO: Implement freeform chat with AI
    // You could call another API endpoint here for general conversation
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-[400px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <ArtifactChatPanel
            messages={messages}
            onSendMessage={handleUserMessage}
            className="h-full"
          />
        </div>

        {/* Right Panel: Artifact Editor */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <ArtifactEditor
            onChatMessage={handleChatMessage}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
