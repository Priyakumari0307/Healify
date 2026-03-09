const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a senior medical data extractor specializing in parsing handwriting from doctor prescriptions.
Analyze the prescription image and extract all information into this EXACT JSON format.
Return ONLY valid JSON — no markdown, no explanation.

{
  "patient_details": { "name": "...", "age": "...", "gender": "...", "date": "..." },
  "doctor_details": { "name": "...", "registration_number": "..." },
  "diagnosis": "...",
  "medications": [
    {
      "medicine_name": "...",
      "dosage": "...",
      "frequency": "...",
      "duration": "...",
      "special_instructions": "...",
      "confidence": "0.90",
      "warnings": [],
      "risk_score": 0
    }
  ],
  "interactions": [],
  "additional_notes": "...",
  "overall_confidence": 0.85,
  "patient_friendly_summary": "A summary for <name> regarding their prescription for <N> medications.",
  "medication_timeline": [],
  "fraud_suspicion_flag": false
}

Rules:
- Use 'Not provided' if info is missing.
- Normalize frequency (e.g., OD, BD, TDS, 1-0-1).
- Correct obvious medicine spelling errors.
- confidence per medication is a string decimal e.g. "0.90".
- Do NOT hallucinate. Only extract what is visible.
`;

const analyzeWithGroq = async (imagePath) => {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: SYSTEM_PROMPT },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                }
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct", // Updated to the recommended Groq vision model ID
            temperature: 0,
            max_tokens: 2048,
            top_p: 1,
            stream: false,
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Groq Analysis Error:', error);
        throw new Error(`Analysis failed: ${error.message}`);
    }
};

module.exports = { analyzeWithGroq };
