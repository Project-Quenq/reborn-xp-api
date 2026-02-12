const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html'
    };

    const query = event.queryStringParameters.q;
    if (!query) return { statusCode: 400, body: 'Missing query', headers };

    try {
        const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(bingUrl, { headers: { 'User-Agent': USER_AGENT } });

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;
        const head = doc.head;

        const base = doc.createElement('base');
        base.href = "https://www.bing.com/";
        if (head.firstChild) head.insertBefore(base, head.firstChild);
        else head.appendChild(base);

        const script = doc.createElement('script');
        script.innerHTML = `
            document.addEventListener('DOMContentLoaded', () => {
                const METADATA_API = 'https://rxpappinstaller.netlify.app/.netlify/functions/metadata';

                async function checkAndNavigate(url) {
                    try {
                        const resp = await fetch(METADATA_API, { headers: { 'target_url': url } });
                        const data = await resp.json();
                        const isRestricted = data.site && data.site.xframe_restricted;

                        window.parent.postMessage({
                            action: 'rebornxp_navigation_request',
                            url: url,
                            isRestricted: isRestricted
                        }, '*');
                    } catch (e) {
                        window.parent.postMessage({
                            action: 'rebornxp_navigation_request',
                            url: url,
                            isRestricted: true
                        }, '*');
                    }
                }

                document.body.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link || !link.href) return;

                    const isBingInternal = link.href.includes('bing.com') || link.getAttribute('href').startsWith('/');

                    if (!isBingInternal && link.href.startsWith('http')) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const originalText = link.innerText;
                        link.innerText = 'Loading...';
                        
                        checkAndNavigate(link.href).finally(() => {
                            link.innerText = originalText;
                        });
                    }
                });

                document.querySelectorAll('a[target="_blank"]').forEach(a => a.removeAttribute('target'));
            });
        `;
        doc.body.appendChild(script);

        return {
            statusCode: 200,
            body: dom.serialize(),
            headers
        };
    } catch (error) {
        return { statusCode: 500, body: 'Proxy Error', headers };
    }
};