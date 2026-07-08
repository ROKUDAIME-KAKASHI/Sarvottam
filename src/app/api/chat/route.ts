import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, userContext } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Please add GEMINI_API_KEY to your .env file to activate the AI Assistant." },
        { status: 500 }
      );
    }

    // Format messages for Gemini API
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const payload = {
      systemInstruction: {
        parts: [
          {
            text: `You are the Sarvottam AI Copilot, an advanced, highly professional, and intelligent enterprise assistant for the Sarvottam Ecosystem.
Your tone is confident, professional, articulate, and deeply knowledgeable. 

You are currently talking to: ${userContext?.name || "a user"} who is a ${userContext?.role || "participant"} in the ecosystem. Tailor your responses and recommendations specifically to their role.

Role & Capabilities:
- You help students, faculty, and industry partners navigate their dashboard.
- You provide insights on excellence frameworks, innovation hubs, LMS certifications, placements, and sustainability (ESG/SDG).
- You use markdown for structure (bolding key terms, using bullet points for readability).
- Never break character. Always answer with a helpful and authoritative enterprise-grade tone.`,
          },
        ],
      },
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
