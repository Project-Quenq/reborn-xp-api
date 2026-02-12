const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html'
    };

    const q = event.queryStringParameters.q;
    let targetUrl = event.queryStringParameters.url;

    if (q) {
        targetUrl = `https://search.aol.com/aol/search?q=${encodeURIComponent(q)}`;
    } else if (!targetUrl) {
        targetUrl = 'https://search.aol.com/';
    }

    try {
        const urlObj = new URL(targetUrl);
        if (!urlObj.hostname.endsWith('aol.com')) {
            return { statusCode: 403, body: 'Access Denied: This proxy only handles AOL Search.', headers };
        }
    } catch (e) {
        return { statusCode: 400, body: 'Invalid URL', headers };
    }

    try {
        const response = await axios.get(targetUrl, { 
            headers: { 'User-Agent': USER_AGENT },
            validateStatus: () => true 
        });

        const dom = new JSDOM(response.data);
        const doc = dom.window.document;
        const head = doc.head;

        const base = doc.createElement('base');
        base.href = "https://search.aol.com/";
        if (head.firstChild) head.insertBefore(base, head.firstChild);
        else head.appendChild(base);

        const script = doc.createElement('script');
        script.innerHTML = `
            document.addEventListener('DOMContentLoaded', () => {
                const METADATA_API = 'https://rxpappinstaller.netlify.app/.netlify/functions/metadata';
                const PROXY_ENDPOINT = window.location.origin + window.location.pathname;

                window.parent.postMessage({
                    action: 'rebornxp_address_update',
                    url: '${targetUrl}'
                }, '*');

                async function checkSecurityAndNavigate(url) {
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

                    const href = link.href;
                    const isAolInternal = href.includes('search.aol.com') || href.includes('aol.com');

                    e.preventDefault();
                    e.stopPropagation();

                    if (isAolInternal) {
                        const newProxyUrl = PROXY_ENDPOINT + '?url=' + encodeURIComponent(href);
                        window.location.href = newProxyUrl;
                    } else {
                        const originalText = link.innerText;
                        link.innerText = 'Loading...';
                        
                        checkSecurityAndNavigate(href).finally(() => {
                            link.innerText = originalText;
                        });
                    }
                });
            });
        `;
        doc.body.appendChild(script);

        return {
            statusCode: 200,
            body: dom.serialize(),
            headers
        };
    } catch (error) {
        return { statusCode: 500, body: 'Proxy Error: ' + error.message, headers };
    }
};