"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Send, Loader2, X } from "lucide-react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  selectedText?: string
  timestamp: Date
}

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (instruction: string) => void
  isLoading: boolean
  selectedText?: string
  onClearSelection?: () => void
  className?: string
}

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading,
  selectedText,
  onClearSelection,
  className,
}: ChatPanelProps) {
  const [instruction, setInstruction] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (instruction.trim() && !isLoading) {
      onSendMessage(instruction)
      setInstruction("")
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-sm mb-2">Start refining your content</p>
              <p className="text-xs">
                Type an instruction below to improve your document
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/10 dark:bg-secondary/10 text-foreground"
                )}
              >
                {message.selectedText && (
                  <div className="mb-2 pb-2 border-b border-border">
                    <p className="text-xs opacity-75 mb-1">Selected text:</p>
                    <p className="text-xs italic">"{message.selectedText}"</p>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selection Indicator */}
      {selectedText && (
        <div className="px-4 py-2 bg-accent/10 dark:bg-accent/10 border-t border-accent">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground mb-1">
                Text selected:
              </p>
              <p className="text-xs text-foreground italic truncate">
                "{selectedText}"
              </p>
            </div>
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={
              selectedText
                ? "Tell Claude how to refine the selected text..."
                : "Tell Claude how to refine your document..."
            }
            className="resize-none"
            rows={3}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!instruction.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? (
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
    </div>
  )
}
