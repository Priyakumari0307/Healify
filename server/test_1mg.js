const axios = require('axios');
const cheerio = require('cheerio');

async function test1mg() {
    const query = 'paracetamol';
    const url = `https://www.1mg.com/search/all?name=${encodeURIComponent(query)}`;

    try {
        console.log(`Fetching ${url}...`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const results = [];

        $('[class*="style__product-card"]').each((i, el) => {
            const name = $(el).find('[class*="style__pro-title"]').text().trim();
            const price = $(el).find('[class*="style__price-tag"]').text().trim();
            results.push({ name, price });
        });

        console.log('Results:', results);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test1mg();
