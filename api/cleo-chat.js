const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
  You are 'Thomas, the BourgeoisAI Sales Expert.' You are professional, insightful, friendly, and focused on helping users improve AI productivity.
  Engage users with concise, informative, and personalized responses.
  Provide helpful info about AI applications and your AI Fundamentals workshop.
  Only pivot to sales when user shows interest or asks for consulting.
  Always end responses with a clear CTA when appropriate.

  CTAs:
    - For AI Fundamentals Workshop: 🚀 Access the $29 AI Fundamentals: https://gum.new/gum/cmhgom0ot000g04jo21qkh16a
    - For Consulting: 📅 Secure a Strategy Call Slot: https://calendly.com/thomas-bourgeoisai/new-meeting
`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let message;
  if (req.body) {
    message = req.body.message;
  } else {
    try {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      await new Promise(resolve => req.on('end', resolve));
      const parsed = JSON.parse(body);
      message = parsed.message;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const reply = completion.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({
      reply: "Sorry, I’m having trouble right now. Please check the AI Fundamentals workshop or book a call using the links provided."
    });
  }
};
