const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_INSTRUCTION = `You are a professional, empathetic, and knowledgeable AI Doctor for Healify. 
Your goal is to listen to the patient's symptoms and provide:
1. A brief assessment of the condition.
2. A quick, safe home remedy or immediate action if applicable.
3. Clear instructions on what they should do next (e.g., rest, hydrate, or see a specialist).

CRITICAL: Always keep responses concise (under 60 words) for natural speech. 
IMPORTANT: Maintain a professional medical tone and include a brief standard disclaimer if the situation sounds serious.
Respond in the same language the user speaks (English or Hindi).`;

const getAIResponse = async (userInput, history = []) => {
    try {
        // Map history to Groq's message format
        // history [{ role: 'user', parts: '...' }, { role: 'model', parts: '...' }] 
        // -> [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }]
        const messages = history.map(h => ({
            role: h.role === 'model' ? 'assistant' : h.role,
            content: h.parts || h.content
        }));

        // Add current user message
        messages.push({ role: 'user', content: userInput });

        // Add system message at the beginning
        messages.unshift({ role: 'system', content: SYSTEM_INSTRUCTION });

        const response = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", // Powerful text model on Groq
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Groq Chat Service Error:", error);
        throw error;
    }
};

module.exports = { getAIResponse };