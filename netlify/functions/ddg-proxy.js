const axios = require('axios');
const { JSDOM } = require('jsdom');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.handler = async function(event) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

    const targetUrl = event.queryStringParameters.url;
    if (!targetUrl) return { statusCode: 400, body: 'URL parameter is required.', headers };

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': USER_AGENT },
            responseType: 'arraybuffer'
        });

        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('text/html')) {
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': contentType },
                body: Buffer.from(response.data).toString('base64'),
                isBase64Encoded: true
            };
        }

        const html = response.data.toString('utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        const urlObj = new URL(targetUrl);

        const base = doc.createElement('base');
        base.href = urlObj.origin;
        doc.head.prepend(base);

        doc.querySelectorAll('a[target="_blank"]').forEach(a => a.removeAttribute('target'));

        doc.querySelectorAll('[crossorigin]').forEach(el => el.removeAttribute('crossorigin'));
        doc.querySelectorAll('[integrity]').forEach(el => el.removeAttribute('integrity'));

        const fixCorsScript = doc.createElement('script');
        fixCorsScript.innerHTML = `
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName, options) {
                const el = originalCreateElement.call(document, tagName, options);
                if (tagName.toLowerCase() === 'script') {
                    const originalSetAttribute = el.setAttribute;
                    el.setAttribute = function(name, value) {
                        if (name.toLowerCase() === 'crossorigin' || name.toLowerCase() === 'integrity') return;
                        originalSetAttribute.call(el, name, value);
                    };
                    Object.defineProperty(el, 'crossOrigin', {
                        set: function() {},
                        get: function() { return null; }
                    });
                }
                return el;
            };
        `;
        doc.head.prepend(fixCorsScript);

        const script = doc.createElement('script');
        script.src = `https://reborn-xp-api.netlify.app/.netlify/functions/interceptor`;
        doc.body.appendChild(script);

        return {
            statusCode: 200,
            body: dom.serialize(),
            headers: { ...headers, 'Content-Type': 'text/html' }
        };

    } catch (error) {
        return { statusCode: 500, body: `Error: ${error.message}`, headers };
    }
};