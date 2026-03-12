const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_INSTRUCTION = "You are Healify, a friendly healthcare assistant. Use a soft, helpful tone. Include medical disclaimers. This is AI-generated advice. Consult a doctor for medical concerns.";

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