import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: "You are Healify, a friendly healthcare assistant. Use a soft, helpful tone. Include medical disclaimers." // Requirement CB-01 & CB-04
});

export const getAIResponse = async (userInput, history = []) => {
    const chat = model.startChat({
        history: history, // Requirement CB-03: Context-aware conversations
        generationConfig: { maxOutputTokens: 1000 },
    });

    const result = await chat.sendMessage(userInput);
    return result.response.text();
};