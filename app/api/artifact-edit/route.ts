import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Allowed models with validation
const ALLOWED_MODELS = [
  "claude-3-5-haiku-20241022",
  "claude-3-5-sonnet-20241022",
  "claude-3-opus-20250219",
]

const DEFAULT_MODEL = "claude-3-5-haiku-20241022"

export async function POST(request: NextRequest) {
  try {
    const { mode, selectedText, fullDocumentText, instructions, toneStyle, model } = await request.json()

    // Validate and sanitize model
    let selectedModelId = DEFAULT_MODEL
    if (model && ALLOWED_MODELS.includes(model)) {
      selectedModelId = model
    } else if (model) {
      console.warn(`Invalid model "${model}" requested, falling back to ${DEFAULT_MODEL}`)
    }

    if (!fullDocumentText) {
      return NextResponse.json(
        { error: "Full document text is required" },
        { status: 400 }
      )
    }

    // Build system prompt for strict JSON responses
    const systemPrompt = `You are an AI editing engine for a content creation app with highlight-to-edit functionality.

Your role is to help users edit and improve their content by responding to specific editing modes and optional custom instructions.

## Contract

You will receive:
- A "mode" describing the type of operation (e.g., improve_selection, rewrite_selection, explain_selection, rewrite_document)
- "selectedText" (optional) - the user's highlighted text to edit
- "fullDocumentText" - the complete document for context
- "instructions" (optional) - custom user instructions that provide additional guidance

## Instruction Handling

If "instructions" is provided and non-empty:
- Treat the instructions as HIGH-PRIORITY guidance for editing the selected text
- Follow both the "mode" AND the custom instructions
- The instructions override default mode behavior when there's a conflict
- Example: If mode="improve_selection" but instructions="make it 2x longer", prioritize the length instruction

If "instructions" is empty or not provided:
- Apply the default behavior for the given mode

## Available Editing Modes

- "improve_selection": Enhance clarity, style, and flow of selected text while keeping the meaning
- "rewrite_selection": Completely rewrite selected text in a different way (respecting any instructions)
- "summarize_selection": Create a concise summary of selected text
- "expand_selection": Add more detail and depth to selected text
- "fix_grammar": Correct spelling, grammar, and punctuation in selected text
- "rewrite_document": Rewrite the entire document with improvements (respecting any instructions)
- "explain_selection": Provide an explanation of selected text (no text changes)

## Response Format

CRITICAL: You must ALWAYS respond with valid JSON only. No markdown, no backticks, no prose - just pure JSON.

Choose the appropriate format based on the mode:

For selection edits (improve, rewrite, summarize, expand, fix_grammar):
{
  "type": "selection_edit",
  "replacementText": "the edited version of the selected text",
  "explanation": "optional brief explanation of what you changed"
}

For full document edits (rewrite_document):
{
  "type": "document_edit",
  "newDocumentText": "the complete new document text",
  "explanation": "optional brief explanation of changes made"
}

For explanations only (explain_selection):
{
  "type": "explanation_only",
  "explanation": "your explanation of the selected text"
}

## Rules

1. Output ONLY the JSON object - no other text
2. Do not use markdown code fences or backticks
3. Keep explanations brief (1-2 sentences)
4. For selection edits, return ONLY the replacement for the selected portion (not the full document)
5. Preserve the original meaning unless the mode explicitly asks to change it or instructions require otherwise
6. For tone changes, adjust the writing style accordingly
7. When custom instructions conflict with mode, instructions take precedence
8. Always produce valid, parseable JSON`

    // Build user prompt based on mode
    let userPrompt = ""

    if (mode === "explain_selection") {
      userPrompt = `Explain this text:\n\n${selectedText}\n\nProvide a clear, concise explanation.`
    } else if (mode === "rewrite_document") {
      userPrompt = `Rewrite this entire document to improve clarity, flow, and impact:\n\n${fullDocumentText}`
      if (instructions) {
        userPrompt += `\n\nAdditional instructions: ${instructions}`
      }
    } else {
      // Selection-based edits
      const modeDescriptions: Record<string, string> = {
        improve_selection: "Improve the clarity, style, and flow of",
        rewrite_selection: `Rewrite in a ${toneStyle || "professional"} tone`,
        summarize_selection: "Create a concise summary of",
        expand_selection: "Expand with more detail and depth",
        fix_grammar: "Fix spelling, grammar, and punctuation in",
      }

      const action = modeDescriptions[mode] || "Edit"

      userPrompt = `Full document for context:\n${fullDocumentText}\n\n---\n\nSelected text to edit:\n${selectedText}\n\n---\n\n${action} the selected text above.`

      if (instructions) {
        userPrompt += `\n\nAdditional instructions: ${instructions}`
      }
    }

    const message = await anthropic.messages.create({
      model: selectedModelId,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    })

    const responseText = message.content[0].type === "text" ? message.content[0].text : ""

    // Parse JSON response
    let parsedResponse
    try {
      // Remove any potential markdown fences
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      parsedResponse = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", responseText)
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          rawResponse: responseText,
        },
        { status: 500 }
      )
    }

    // Validate response structure
    if (!parsedResponse.type) {
      return NextResponse.json(
        {
          error: "Invalid response structure - missing type field",
          rawResponse: responseText,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      result: parsedResponse,
      usage: message.usage,
    })
  } catch (error: any) {
    console.error("Error in artifact edit API:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process edit" },
      { status: 500 }
    )
  }
}
