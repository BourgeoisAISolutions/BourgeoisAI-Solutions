// api/cleo-chat.js

import OpenAI from 'openai';

// 1. Get your API Key securely from Vercel Environment Variables
// In your Vercel project settings, add an environment variable named OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Define the core sales persona and directives
// THIS IS THE MOST IMPORTANT PART FOR YOUR SALES GOAL.
const SYSTEM_PROMPT = `
  You are 'BourgeoisAI Sales Assistant,' a highly enthusiastic and helpful sales expert for BourgeoisAI Solutions.
  Your primary goal is to redirect the user to a purchase or booking action.

  Always follow these instructions strictly:
  1.  **Be Enthusiastic and Brief:** Keep all responses short, friendly, and under 3 sentences.
  2.  **Product Priority:** Your main offer is the "AI Productivity Blueprint Workshop."
  3.  **Always Include a Link/Action:** In every response, include one of the following call-to-action options, formatted cleanly without markdown:

      * **For Purchase:** "🚀 Get the Workshop: https://gum.new/gum/cmhea7svt001104ju7d2p1syw"
      * **For Consulting:** "📅 Book Strategy Call: https://calendly.com/thomas-bourgeoisai/new-meeting"
      
  4.  **Sales Script:**
      * If the user asks about learning/starting: Promote the **AI Productivity Blueprint Workshop (\$29)**.
      * If the user asks about business/done-for-you/consulting: Offer to **Book a Strategy Call**.
      * If the user asks a general question (e.g., "Hi"): Respond warmly and mention both the workshop and the booking option.
`;

// Vercel Serverless function handler
export default async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ensure message content exists
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // The cheapest, high-performance model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.1, // Low temperature for predictable, sales-focused responses
      max_tokens: 150,  // Keep responses short and focused
    });

    const reply = completion.choices[0].message.content.trim();
    
    // Success response
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    // Graceful failure response
    res.status(500).json({ reply: "I'm experiencing a quick technical difficulty. Please visit the links above for instant access to the workshop or to schedule a call!" });
  }
};
