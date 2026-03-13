const axios = require('axios');
const fs = require('fs');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

const textToSpeech = async (text) => {
    try {
        const response = await axios.post('https://api.sarvam.ai/text-to-speech', {
            inputs: [text],
            target_language_code: 'hi-IN',
            speaker: 'ritu',
            pace: 1.0,
            enable_preprocessing: true,
            model: 'bulbul:v3'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-subscription-key': SARVAM_API_KEY
            }
        });
        fs.writeFileSync('test_error.json', JSON.stringify({success: true, keys: Object.keys(response.data)}));
    } catch (error) {
        fs.writeFileSync('test_error.json', JSON.stringify({error: error.response?.data}, null, 2));
    }
};

textToSpeech('testing');
