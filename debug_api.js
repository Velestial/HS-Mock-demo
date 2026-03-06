import http from 'http';

const mapCategory = (categories) => {
    if (!categories || categories.length === 0) return undefined;

    const categoryNames = categories.map(c => c.name.toLowerCase());

    if (categoryNames.some(n => n.includes('bait'))) return 'bait';
    if (categoryNames.some(n => n.includes('rod'))) return 'rod';
    if (categoryNames.some(n => n.includes('tackle') || n.includes('lure') || n.includes('rig'))) return 'tackle';
    if (categoryNames.some(n => n.includes('bundle') || n.includes('kit'))) return 'bundle';
    if (categoryNames.some(n => n.includes('ebook') || n.includes('e-book') || n.includes('guide'))) return 'ebook';

    return undefined;
};

console.log('Fetching products via proxy...');

const req = http.request({
    hostname: '127.0.0.1',
    port: 3001, // New dev server port
    path: '/api/products',
    method: 'GET',
}, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Status Code: ${res.statusCode}`);
            console.log('Response snippet:', data.substring(0, 500));
            return;
        }

        try {
            const products = JSON.parse(data);
            console.log('Total products:', products.length);

            const counts = { bait: 0, rod: 0, tackle: 0, bundle: 0, ebook: 0, undefined: 0 };

            products.forEach(p => {
                const cat = mapCategory(p.categories);
                if (cat) {
                    counts[cat]++;
                } else {
                    counts.undefined++;
                }
            });

            console.log('Category Counts:', JSON.stringify(counts, null, 2));

        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
            console.log('Response start:', data.substring(0, 100)); // Might be HTML
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
