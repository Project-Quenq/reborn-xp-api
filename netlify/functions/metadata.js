const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function crawl(initial_url) {
    if (!initial_url) return null;
    let target_url = initial_url;
    if (!target_url.toLowerCase().startsWith('https://') && !target_url.toLowerCase().startsWith('http://')) {
        target_url = 'https://' + target_url;
    }
    
    let site = {
        url: target_url,
        final_url: target_url,
        icon: '/images/xp/icons/ApplicationWindow.png',
        icon_data: null,
        name: 'Untitled Page',
        desc: '',
        xframe_restricted: false
    };

    try {
        const response = await axios.get(target_url, {
            headers: { 'User-Agent': USER_AGENT },
            maxRedirects: 5,
            validateStatus: status => status < 400
        });

        const finalUrl = response.request.res ? response.request.res.responseUrl : target_url;
        site.final_url = finalUrl;

        const headers = response.headers;
        const xFrame = headers['x-frame-options'];
        const csp = headers['content-security-policy'];

        if (xFrame) {
            if (['DENY', 'SAMEORIGIN'].includes(xFrame.toUpperCase())) site.xframe_restricted = true;
        }
        
        if (!site.xframe_restricted && csp) {
            if (csp.includes('frame-ancestors') && !csp.includes('frame-ancestors *')) {
                site.xframe_restricted = true;
            }
        }

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;

        const getMeta = (prop) => doc.querySelector(`meta[property="${prop}"]`)?.content || doc.querySelector(`meta[name="${prop}"]`)?.content;

        site.name = getMeta('og:site_name') || getMeta('og:title') || doc.querySelector('title')?.textContent.trim() || new URL(finalUrl).hostname;    
        site.desc = getMeta('og:description') || getMeta('description') || '';

        const iconSelectors = [
            'link[rel="apple-touch-icon"]',
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'meta[property="og:image"]'
        ];

        let iconUrl = null;
        for (const selector of iconSelectors) {
            const el = doc.querySelector(selector);
            if (el && (el.href || el.content)) {
                try {
                    iconUrl = new URL(el.href || el.content, finalUrl).href;
                    break;
                } catch(e) {}
            }
        }

        if (!iconUrl) {
            iconUrl = new URL('/favicon.ico', finalUrl).href;
        }

        if (iconUrl) {
            try {
                const iconResponse = await axios.get(iconUrl, { 
                    responseType: 'arraybuffer',
                    headers: { 'User-Agent': USER_AGENT },
                    timeout: 3000
                });
                
                const contentType = iconResponse.headers['content-type'];
                if (contentType && (contentType.startsWith('image/') || contentType.includes('icon'))) {
                    site.icon = iconUrl;
                    site.icon_data = Buffer.from(iconResponse.data).toString('base64');
                }
            } catch (e) {}
        }

    } catch (error) {
        try { site.name = new URL(target_url).hostname; } catch(e){}
    }
    return site;
}

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, target_url'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    let target_url = event.headers.target_url || event.queryStringParameters?.url;

    if (!target_url && event.body) {
        try {
            const body = JSON.parse(event.body);
            target_url = body.url;
        } catch(e){}
    }

    if (!target_url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'target_url header is required' }),
            headers
        };
    }

    let site = await crawl(target_url);

    return {
        statusCode: 200,
        body: JSON.stringify({ site }),
        headers
    };
};