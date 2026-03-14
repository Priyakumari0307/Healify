const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.IMAGE_BASED_SEARCHING || process.env.GROQ_API_KEY,
});

const VISION_SYSTEM_PROMPT = `You are "Healify Vision AI", a specialized clinical diagnostic assistant.
Your task is to analyze medical images provided by patients (e.g., skin rashes, swelling, eye redness, etc.).

When analyzing an image:
1. Identify the visible symptoms or anomalies.
2. Provide a thoughtful analysis of what it might be.
3. Suggest the most likely conditions (Differential Diagnosis).
4. Advise on next steps and when to see a doctor.
5. maintain a professional, empathetic, and clinical tone.

IMPORTANT:
- Always include a disclaimer that this is AI-generated and not a formal diagnosis.
- If the image indicates an emergency, advise immediate medical care.
- Do not mention precise dosages of any medication.
- Focus on describing what you see in medical terms.

Tone: Professional, clinical, yet empathetic.`;

/**
 * Analyzes an image using Groq's vision model
 * @param {string} imagePath - Path to the image file
 * @param {string} userMessage - Additional context from the user
 * @returns {Promise<string>} - Analysis from the AI
 */
const analyzeMedicalImage = async (imagePath, userMessage = "") => {
    try {
        // Read the image file and convert to base64
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const ext = path.extname(imagePath).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        if (ext === '.webp') mimeType = 'image/webp';
        if (ext === '.gif') mimeType = 'image/gif';

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: VISION_SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: userMessage || "Please analyze this medical image and tell me what symptoms you see and what might be the cause." },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Groq Vision Analysis Error:", error);
        throw error;
    }
};

module.exports = { analyzeMedicalImage };
