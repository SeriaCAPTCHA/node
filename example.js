const SeriaCAPTCHA = require('./seriacaptcha');

function runSync() {
    const client = new SeriaCAPTCHA();
    try {
        const res = client.verifySync('demo_appid', 'demo_token', 'demo_secret', '127.0.0.1');
        console.log('Sync result:', res);
    } catch (e) {
        console.error('Sync error:', e.message);
    }
}

async function runAsync() {
    const client = new SeriaCAPTCHA();
    try {
        const res = await client.verifyAsync('demo_appid', 'demo_token', 'demo_secret');
        console.log('Async result:', res);
    } catch (e) {
        console.error('Async error:', e.message);
    }
}

console.log('Running sync example...');
runSync();

console.log('\nRunning async example...');
runAsync();