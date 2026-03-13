const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

const speechToText = async () => {
    try {
        const formData = new FormData();
        // create a dummy 1s wav file
        fs.writeFileSync('dummy.wav', Buffer.from([0, 0, 0, 0])); // invalid, but might get proper API error
        formData.append('file', fs.createReadStream('dummy.wav'));
        formData.append('model', 'saarika:v2.5');

        const response = await axios.post('https://api.sarvam.ai/speech-to-text', formData, {
            headers: {
                ...formData.getHeaders(),
                'api-subscription-key': SARVAM_API_KEY
            }
        });
        fs.writeFileSync('test_stt_error.json', JSON.stringify({success: true, keys: Object.keys(response.data)}));
    } catch (error) {
        fs.writeFileSync('test_stt_error.json', JSON.stringify({error: error.response?.data}, null, 2));
    }
};

speechToText();
