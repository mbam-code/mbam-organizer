export interface DocumentVersion {
  id: string
  timestamp: Date
  documentText: string
  operation: string // e.g., "Improved selection", "Fixed grammar", "Rewrote document"
  modeUsed: string // e.g., "improve_selection", "fix_grammar"
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    type?: "edit_action" | "explanation"
    operation?: string
  }
}
