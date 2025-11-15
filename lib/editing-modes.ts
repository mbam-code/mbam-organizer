import { LucideIcon, Sparkles, RotateCw, FileText, Maximize2, CheckCircle, FileEdit } from "lucide-react"

export interface EditingMode {
  id: string
  label: string
  description: string
  icon: LucideIcon
  requiresTone?: boolean // Whether this mode needs a tone selector
}

export const EDITING_MODES: EditingMode[] = [
  {
    id: "improve_selection",
    label: "Improve Writing",
    description: "Enhance clarity, style, and flow",
    icon: Sparkles,
  },
  {
    id: "rewrite_selection",
    label: "Rewrite in New Tone",
    description: "Rewrite with a different tone or style",
    icon: RotateCw,
    requiresTone: true,
  },
  {
    id: "summarize_selection",
    label: "Summarize",
    description: "Create a concise summary",
    icon: FileText,
  },
  {
    id: "expand_selection",
    label: "Expand",
    description: "Add more detail and depth",
    icon: Maximize2,
  },
  {
    id: "fix_grammar",
    label: "Fix Grammar",
    description: "Correct spelling and grammar",
    icon: CheckCircle,
  },
  {
    id: "rewrite_document",
    label: "Rewrite Entire Document",
    description: "Rewrite the whole document",
    icon: FileEdit,
  },
]

export const TONE_STYLES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
  { id: "playful", label: "Playful" },
  { id: "confident", label: "Confident" },
  { id: "empathetic", label: "Empathetic" },
]
