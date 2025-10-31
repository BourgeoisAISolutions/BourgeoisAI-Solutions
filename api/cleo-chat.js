// api/cleo-chat.js

// 1. Use CommonJS syntax for compatibility
const OpenAI = require('openai');

// 1. Get your API Key securely from Vercel Environment Variables
const openai = new OpenAI({
  // The environment variable MUST be set on Vercel
  apiKey: process.env.OPENAI_API_KEY, 
});

// 2. Define the core sales persona and directives
const SYSTEM_PROMPT = `
  You are 'Thomas, the BourgeoisAI Sales Expert.' Your persona is that of an extremely professional, insightful, and results-focused consultant.
  Your ONLY objective is to drive the user to one of two high-value actions immediately.

  **Strict Directives:**
  1.  **Tone:** Be concise, polished, and focused on ROI (Return on Investment). Use confident, professional language.
  2.  **Length:** Keep every response to a maximum of **two short sentences**.
  3.  **Mandatory Action:** Every single response MUST conclude with a clear Call-to-Action (CTA).

  **Call-to-Action (CTA) Priority:**
  * **For Workshop:** "🚀 Access the $29 AI Blueprint: https://gum.new/gum/cmhea7svt001104ju7d2p1syw"
  * **For Consulting:** "📅 Secure a Strategy Call Slot: https://calendly.com/thomas-bourgeoisai/new-meeting"
  
  **Sales Script:**
  * Promote the **AI Productivity Blueprint Workshop ($29)** as the fastest path to results.
  * If the user asks about deep business/consulting, offer to **Book a Strategy Call**.
  * Never answer general knowledge questions; pivot directly to the sales pitch.
`;

// 3. Use module.exports for the Vercel handler function
module.exports = async (req, res) => {
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
      model: "gpt-4o-mini", // Fast, low-cost model for sales
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.1, // Low temp for predictable sales responses
      max_tokens: 150, 
    });

    const reply = completion.choices[0].message.content.trim();
    
    // Success response
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    // Graceful failure response in case the API key or service fails
    res.status(500).json({ reply: "I'm experiencing a brief technical difficulty. Please visit the links above for instant access to the workshop or to schedule a call!" });
  }
};
