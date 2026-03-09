const axios = require('axios');
const fs = require('fs');

async function debugScrape() {
    const query = 'paracetamol';
    const url = `https://www.netmeds.com/catalogsearch/result?q=${encodeURIComponent(query)}`;

    try {
        console.log(`Fetching ${url}...`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            }
        });
        fs.writeFileSync('netmeds_debug.html', data);
        console.log('Saved Netmeds HTML to netmeds_debug.html');
        console.log('Length of data:', data.length);

        // Quick check for some keywords
        if (data.includes('paracetamol')) console.log('Found paracetamol in HTML');
        if (data.includes('cls-product-item')) console.log('Found product item class');
        if (data.includes('Access Denied')) console.log('ACCESS DENIED detected');
        if (data.includes('Cloudflare')) console.log('Cloudflare detected');
    } catch (e) {
        console.error('Error:', e.message);
    }
}

debugScrape();
