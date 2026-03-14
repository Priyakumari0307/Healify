const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY

/**
 * Converts speech to text using Sarvam AI Saaras v3 model
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<string>} - Transcribed text
 */
const speechToText = async (audioFilePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioFilePath));
        formData.append('model', 'saaras:v3');

        const response = await axios.post('https://api.sarvam.ai/speech-to-text', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-subscription-key': SARVAM_API_KEY
            }
        });

        // Handle both possible response formats from snippet
        return response.data.transcript || response.data.transcription;
    } catch (error) {
        console.error("Sarvam STT Error:", error.response?.data || error.message);
        throw new Error("Speech-to-text conversion failed");
    }
};

/**
 * Converts text to speech using Sarvam AI Bulbul v3 model with "Ritu" voice
 * @param {string} text - Text to convert
 * @returns {Promise<string>} - Base64 encoded audio or audio buffer
 */
const textToSpeech = async (text) => {
    try {
        // Clean markdown and formatting so the AI voice pronounces it smoothly
        let cleanText = text.replace(/#+\s?/g, '')
                            .replace(/\*/g, '')
                            .replace(/>/g, '')
                            .replace(/_/g, '')
                            .replace(/\n\s*\n/g, '. ')
                            .replace(/\n/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();

        // Split text into chunks that are under the 450 character limit for Sarvam API 'inputs' array
        const chunks = [];
        let textRemaining = cleanText;

        while (textRemaining.length > 0) {
            if (textRemaining.length <= 450) {
                chunks.push(textRemaining);
                break;
            }
            
            // try to split at last period within 450
            let splitIndex = textRemaining.lastIndexOf('.', 450);
            if (splitIndex === -1) {
                splitIndex = textRemaining.lastIndexOf(' ', 450);
                if (splitIndex === -1) splitIndex = 450;
            }
            chunks.push(textRemaining.substring(0, splitIndex + 1));
            textRemaining = textRemaining.substring(splitIndex + 1).trim();
        }

        const audioBase64Array = [];

        for (const chunk of chunks) {
            if (!chunk) continue;
            const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
                inputs: [chunk],
                target_language_code: 'hi-IN',
                speaker: 'ritu',
                model: 'bulbul:v3',
                pace: 1.0,
                enable_preprocessing: true,
                speech_sample_rate: 24000
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': SARVAM_API_KEY
                }
            });

            // Robust decoding logic from snippet
            const audioBase64 = response.data.audio_base64 ||
                response.data.audio ||
                (response.data.audios ? response.data.audios[0] : null);

            if (audioBase64) {
                audioBase64Array.push(audioBase64);
            } else {
                console.error("Sarvam TTS unexpected response for chunk:", response.data);
            }
        }

        if (audioBase64Array.length === 0) {
            throw new Error("No audio content in response");
        }

        return audioBase64Array;
    } catch (error) {
        console.error("Sarvam TTS Error Detail:", error.response?.data || error.message);
        throw new Error("Text-to-speech conversion failed");
    }
};

module.exports = { speechToText, textToSpeech };
