const fetch = require('node-fetch');
const fs = require('fs');

async function debug() {
    try {
        console.log('Fetching...');
        const res = await fetch('http://localhost:3030/api/v1/home');
        const json = await res.json();
        console.log('Success:', json.success);
        fs.writeFileSync('f:/oni-chan/api-debug.json', JSON.stringify(json, null, 2));
        console.log('Saved to api-debug.json');
    } catch (e) {
        console.error('Error:', e.message);
    }
}

debug();
