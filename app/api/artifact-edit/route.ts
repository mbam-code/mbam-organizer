import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { mode, selectedText, fullDocumentText, instructions, toneStyle } = await request.json()

    if (!fullDocumentText) {
      return NextResponse.json(
        { error: "Full document text is required" },
        { status: 400 }
      )
    }

    // Build system prompt for strict JSON responses
    const systemPrompt = `You are an AI editing engine for a content creation app with highlight-to-edit functionality.

Your job is to help users edit their content by responding to specific editing modes.

CRITICAL: You must ALWAYS respond with valid JSON only. No markdown, no backticks, no prose - just pure JSON.

Available editing modes and their meanings:
- "improve_selection": Enhance clarity, style, and flow of selected text while keeping the meaning
- "rewrite_selection": Completely rewrite selected text in a different way
- "summarize_selection": Create a concise summary of selected text
- "expand_selection": Add more detail and depth to selected text
- "fix_grammar": Correct spelling, grammar, and punctuation in selected text
- "rewrite_document": Rewrite the entire document with improvements
- "explain_selection": Provide an explanation of selected text (no text changes)

Response format (choose the appropriate one based on mode):

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

Rules:
1. Output ONLY the JSON object - no other text
2. Do not use markdown code fences or backticks
3. Keep explanations brief (1-2 sentences)
4. For selection edits, return ONLY the replacement for the selected portion
5. Preserve the original meaning unless the mode explicitly asks to change it
6. For tone changes, adjust the writing style accordingly`

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
      model: "claude-sonnet-4-20250514",
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
