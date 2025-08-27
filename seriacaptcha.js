const {
    URL
} = require('url');
const fetch = require('node-fetch');
const syncRequest = require('sync-request');

class SeriaCAPTCHA {
    constructor(endpoint = 'https://hk.seriacaptcha.com', timeout = 3000) {
        const parsed = new URL(endpoint);
        if (!parsed.hostname) {
            throw new Error('Invalid endpoint format');
        }
        if (!parsed.hostname.endsWith('.seriacaptcha.com')) {
            throw new Error('Only .seriacaptcha.com root domains are allowed as endpoint');
        }

        this.endpoint = endpoint.replace(/\/+$/g, '') + '/verify.php';
        this.timeout = timeout; // milliseconds
    }

    verifySync(appid, token, secret, ip = null, userAgent = null) {
        const params = new URLSearchParams({
            key: appid,
            token: token,
            secret: secret
        });
        if (ip !== null) params.append('ip', ip);
        if (userAgent !== null) params.append('user_agent', userAgent);

        const headers = {
            'User-Agent': 'SeriaCAPTCHA Node.js SDK/1.0'
        };

        const url = this.endpoint + '?' + params.toString();
        try {
            const res = syncRequest('GET', url, {
                headers: headers,
                timeout: this.timeout
            });
            const body = res.getBody('utf8');
            return JSON.parse(body);
        } catch (err) {
            throw new Error('Request failed: ' + err.message);
        }
    }

    async verifyAsync(appid, token, secret, ip = null, userAgent = null) {
        const params = new URLSearchParams({
            key: appid,
            token: token,
            secret: secret
        });
        if (ip !== null) params.append('ip', ip);
        if (userAgent !== null) params.append('user_agent', userAgent);

        const headers = {
            'User-Agent': 'SeriaCAPTCHA Node.js SDK/1.0'
        };

        const url = this.endpoint + '?' + params.toString();
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), this.timeout);
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: headers,
                signal: controller.signal
            });
            clearTimeout(id);
            const text = await res.text();
            return JSON.parse(text);
        } catch (err) {
            throw new Error('Request failed: ' + err.message);
        }
    }
}

module.exports = SeriaCAPTCHA;