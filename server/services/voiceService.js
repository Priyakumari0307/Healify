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
        formData.append('model', 'saarika:v2.5'); // Updated model from snippet

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
        // Ensure text is within character limit for REST API
        const trimmedText = text.length > 2500 ? text.substring(0, 2497) + "..." : text;

        const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
            text: trimmedText,
            target_language_code: 'hi-IN', // Snippet suggests hi-IN handles English well too
            speaker: 'Ritu',
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

        if (!audioBase64) {
            console.error("Sarvam TTS unexpected response:", response.data);
            throw new Error("No audio content in response");
        }

        return audioBase64;
    } catch (error) {
        console.error("Sarvam TTS Error Detail:", error.response?.data || error.message);
        throw new Error("Text-to-speech conversion failed");
    }
};

module.exports = { speechToText, textToSpeech };
