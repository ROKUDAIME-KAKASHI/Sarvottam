import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Please add GEMINI_API_KEY to your .env file to activate the AI Assistant." },
        { status: 500 }
      );
    }

    // Format messages for Gemini API
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Add a system prompt equivalent as the first message if needed, but for simplicity we just pass the history
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: "You are Sarvottam Assistant, a helpful AI guide for the Sarvottam Ecosystem. Keep your answers concise, professional, and directly related to academic/industry collaboration, project management, and platform features." }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Sarvottam Assistant." }]
        },
        ...formattedMessages
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
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
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
