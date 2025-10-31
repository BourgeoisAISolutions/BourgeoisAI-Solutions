// api/cleo-chat.js

// 1. Use 'require' syntax for maximum Node.js compatibility
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ... (SYSTEM_PROMPT and all logic remain the same) ...

// 2. Use 'module.exports' for maximum Vercel compatibility
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    // Vercel requires response status/end
    return res.status(405).json({ error: 'Method Not Allowed' }); 
  }

  // ... (Rest of your original code logic here) ...
  
  // Example of final response structure:
  // res.status(200).json({ reply });
};
