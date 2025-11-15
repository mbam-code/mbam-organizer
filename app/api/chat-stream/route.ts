import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"
import { CHAT_ARTIFACT_SYSTEM_PROMPT } from "@/lib/system-prompts"

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

/**
 * POST /api/chat-stream
 *
 * Streams a Claude response that may contain artifacts wrapped in <antArtifact> tags.
 * Uses Server-Sent Events (SSE) to stream the response in real-time.
 *
 * Request body:
 * {
 *   userMessage: string - The user's message
 *   model?: string - Selected model (validated against ALLOWED_MODELS)
 *   messages?: Array - Previous chat messages for context (optional)
 * }
 *
 * Response: Server-Sent Events stream with the following event types:
 * - "content_block_delta": Streamed text chunk { "delta": { "text": "..." } }
 * - "message_stop": End of stream
 * - "error": Error occurred { "error": "..." }
 */
export async function POST(request: NextRequest) {
  try {
    const { userMessage, model, messages = [] } = await request.json()

    if (!userMessage) {
      return NextResponse.json(
        { error: "userMessage is required" },
        { status: 400 }
      )
    }

    // Validate and sanitize model
    let selectedModelId = DEFAULT_MODEL
    if (model && ALLOWED_MODELS.includes(model)) {
      selectedModelId = model
    } else if (model) {
      console.warn(`Invalid model "${model}" requested, falling back to ${DEFAULT_MODEL}`)
    }

    // Convert chat messages to Anthropic format if provided
    const conversationMessages = messages.map((msg: any) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    // Add the new user message
    conversationMessages.push({
      role: "user" as const,
      content: userMessage,
    })

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Create streaming message
          const stream = await anthropic.messages.stream({
            model: selectedModelId,
            max_tokens: 4096,
            system: CHAT_ARTIFACT_SYSTEM_PROMPT,
            messages: conversationMessages,
          })

          // Stream each content block delta
          for await (const event of stream) {
            if (event.type === "content_block_delta") {
              const delta = event.delta as any
              if (delta.type === "text_delta") {
                // Send streamed text chunk
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "content_block_delta",
                      delta: { text: delta.text },
                    })}\n\n`
                  )
                )
              }
            } else if (event.type === "message_stop") {
              // Send stream end marker
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "message_stop",
                  })}\n\n`
                )
              )
            }
          }

          controller.close()
        } catch (error: any) {
          console.error("Streaming error:", error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: error.message || "Streaming failed",
              })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    // Return SSE response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Error in chat stream API:", error)
    return NextResponse.json(
      { error: error.message || "Failed to start streaming" },
      { status: 500 }
    )
  }
}
