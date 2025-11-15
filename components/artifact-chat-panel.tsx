"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Send, Loader2, Info } from "lucide-react"
import type { ChatMessage } from "@/types/artifact"
import { generateId } from "@/lib/utils"

export interface Artifact {
  identifier: string
  type: string
  title: string
  content: string
}

export interface ArtifactChatPanelProps {
  messages: ChatMessage[]
  selectedModel?: string
  onSendMessage?: (message: string) => void
  onArtifactCreated?: (artifact: Artifact) => void
  isLoading?: boolean
  className?: string
}

export default function ArtifactChatPanel({
  messages,
  selectedModel = "claude-3-5-haiku-20241022",
  onSendMessage,
  onArtifactCreated,
  isLoading = false,
  className,
}: ArtifactChatPanelProps) {
  const [input, setInput] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  /**
   * Parses artifact tags from streamed text.
   * Handles incomplete tags that may span across stream chunks.
   *
   * Returns: { chatText: string, artifact: Artifact | null }
   */
  const parseArtifactFromText = (text: string): { chatText: string; artifact: Artifact | null } => {
    // Match artifact tags: <antArtifact identifier="..." type="..." title="...">content</antArtifact>
    const artifactRegex = /<antArtifact\s+identifier="([^"]*)"\s+type="([^"]*)"\s+title="([^"]*)">([^]*?)<\/antArtifact>/g

    let chatText = text
    let artifact: Artifact | null = null

    const match = artifactRegex.exec(text)
    if (match) {
      // Extract artifact
      artifact = {
        identifier: match[1],
        type: match[2],
        title: match[3],
        content: match[4],
      }

      // Remove artifact tag from chat text
      chatText = text.replace(artifactRegex, "").trim()
    }

    return { chatText, artifact }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !isStreaming) {
      const userMessage = input
      setInput("")

      // Add user message to chat
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      }
      onSendMessage?.(userMessage)

      // Stream response from API
      setIsStreaming(true)
      try {
        const response = await fetch("/api/chat-stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage,
            model: selectedModel,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        // Read and parse SSE stream
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let fullStreamText = ""
        let finalArtifact: Artifact | null = null

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === "content_block_delta" && data.delta?.text) {
                  fullStreamText += data.delta.text

                  // Check if we have a complete artifact in the stream so far
                  const { chatText, artifact } = parseArtifactFromText(fullStreamText)
                  if (artifact && !finalArtifact) {
                    finalArtifact = artifact
                  }
                } else if (data.type === "message_stop") {
                  // Stream complete
                  break
                } else if (data.type === "error") {
                  console.error("Stream error:", data.error)
                  throw new Error(data.error)
                }
              } catch (e) {
                console.error("Error parsing SSE:", e)
              }
            }
          }
        }

        // Parse final text and artifact
        const { chatText, artifact } = parseArtifactFromText(fullStreamText)

        // Add assistant message to chat (without artifact tags)
        if (chatText) {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: chatText,
            timestamp: new Date(),
          }
          onSendMessage?.(assistantMsg.content)
        }

        // Create artifact if present
        if (artifact) {
          onArtifactCreated?.(artifact)
        }
      } catch (error: any) {
        console.error("Streaming error:", error)

        // Add error message
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: `Error: ${error.message || "Failed to get response"}`,
          timestamp: new Date(),
        }
        onSendMessage?.(errorMsg.content)
      } finally {
        setIsStreaming(false)
      }
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Conversation
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Chat with AI or see edit history
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-sm mb-2">No messages yet</p>
              <p className="text-xs">
                Edit actions and AI responses will appear here
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user"
                  ? "justify-end"
                  : message.role === "system"
                  ? "justify-center"
                  : "justify-start"
              )}
            >
              {message.role === "system" ? (
                // System message (edit actions)
                <div className="max-w-[90%] rounded-lg p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                      {message.content}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ) : (
                // User or assistant message
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.metadata?.type === "explanation"
                      ? "bg-accent/10 dark:bg-accent/10 text-foreground border border-accent"
                      : "bg-secondary/10 dark:bg-secondary/10 text-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user"
                        ? "opacity-75"
                        : "text-gray-500 dark:text-gray-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (optional) */}
      {onSendMessage && (
        <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message to AI..."
              className="resize-none"
              rows={2}
              disabled={isLoading || isStreaming}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isStreaming}
              className="self-end"
            >
              {isLoading || isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      )}
    </div>
  )
}
