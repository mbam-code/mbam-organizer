import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { document, instruction, selectedText, activeSkills } = await request.json()

    if (!document || !instruction) {
      return NextResponse.json(
        { error: "Document and instruction are required" },
        { status: 400 }
      )
    }

    // Build the system prompt based on active skills
    const skillInstructions = activeSkills
      .map((skill: { label: string; description: string }) => {
        return `- ${skill.label}: ${skill.description}`
      })
      .join("\n")

    const systemPrompt = `You are an expert content editor helping to refine written content. The following expert skills are currently active and should guide your editing:

${skillInstructions || "No specific skills selected - use general best practices."}

When refining content:
1. Consider the user's specific instruction
2. Apply the active skills to improve the content
3. If text is selected, focus on that part but review the entire document for coherence
4. Return the COMPLETE revised document (not just the changed section)
5. Maintain the original meaning and facts unless explicitly asked to change them
6. Ensure all parts of the document flow together naturally

Return ONLY the revised content without explanations or meta-commentary.`

    const userPrompt = selectedText
      ? `Here is the full document:

<document>
${document}
</document>

The user has selected this specific text to focus on:
<selected_text>
${selectedText}
</selected_text>

User instruction: ${instruction}

Please revise the document according to the instruction, paying special attention to the selected text, but return the COMPLETE updated document.`
      : `Here is the document to refine:

<document>
${document}
</document>

User instruction: ${instruction}

Please revise the document according to the instruction and return the COMPLETE updated document.`

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

    const refinedContent = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({
      refinedContent,
      usage: message.usage,
    })
  } catch (error: any) {
    console.error("Error calling Claude API:", error)
    return NextResponse.json(
      { error: error.message || "Failed to refine content" },
      { status: 500 }
    )
  }
}
