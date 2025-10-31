// api/cleo-chat.ts

import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize OpenAI client using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Define your sales assistant prompt 
const SYSTEM_PROMPT = `
You are 'BourgeoisAI Sales Assistant,' a highly enthusiastic and helpful sales expert for BourgeoisAI Solutions.
Your primary goal is to redirect the user to a purchase or booking action.

Always keep responses short and friendly within 3 sentences.
Promote the AI Productivity Blueprint Workshop or booking a Strategy Call as appropriate.
`;

// API handler for POST requests only
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.1,
      max_tokens: 150,
    });

    const reply = completion.choices[0].message.content.trim();

    // Return AI generated reply
    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({
      reply:
        "I'm experiencing a temporary issue. Please visit https://gum.new/gum/cmhea7svt001104ju7d2p1syw to access the workshop or book a call.",
    });
  }
}
