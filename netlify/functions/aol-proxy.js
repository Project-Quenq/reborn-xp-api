const axios = require('axios');
const { JSDOM } = require('jsdom');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 5.1; rv:52.0) Gecko/20100101 Firefox/52.0';

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

        // Determine Search Type and Query
        const urlObj = new URL(targetUrl);
        const query = urlObj.searchParams.get('q') || '';
        let searchType = 'web';
        if (targetUrl.includes('/image')) searchType = 'images';
        if (targetUrl.includes('/video')) searchType = 'videos';

        // 1. Inject Base URL
        const base = doc.createElement('base');
        base.href = urlObj.origin;
        doc.head.prepend(base);

        // 2. Remove Original AOL UI
        const selectorsToRemove = ['#sticky-hd', 'header', '#ft_wrapper', 'footer', '.mag-glass', '#ybar'];
        selectorsToRemove.forEach(s => {
            const el = doc.querySelector(s);
            if (el) el.remove();
        });

        // 3. Inject Custom Qooqle Results Header
        const qooqleHeader = doc.createElement('div');
        qooqleHeader.id = 'qooqle-results-header';
        qooqleHeader.innerHTML = `
            <style>
                #qooqle-results-header {
                    background: #f1f1f1;
                    border-bottom: 1px solid #808080;
                    padding: 10px;
                    font-family: "MS Gothic", monospace;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    position: sticky;
                    top: 0;
                    z-index: 999999;
                }
                #qooqle-results-header img { cursor: pointer; }
                .q-search-box { display: flex; flex-direction: column; gap: 5px; flex-grow: 1; }
                .q-tabs { display: flex; gap: 5px; }
                .q-tab { 
                    font-size: 12px; padding: 2px 8px; cursor: pointer; 
                    border: 1px solid transparent; text-decoration: none; color: #000;
                }
                .q-tab.active { 
                    background: #fff; border: 1px solid #808080; border-bottom: 1px solid #fff; 
                    font-weight: bold; position: relative; bottom: -1px;
                }
                .q-input-group { display: flex; gap: 5px; }
                .q-input-group input { 
                    width: 300px; height: 20px; border: 2px solid; 
                    border-top-color: #808080; border-left-color: #808080; 
                    border-right-color: #d0d0d0; border-bottom-color: #d0d0d0;
                }
                .q-input-group button {
                    background: #c0c0c0; border: 2px solid; border-top-color: #fff; 
                    border-left-color: #fff; border-right-color: #808080; border-bottom-color: #808080;
                    font-size: 11px; cursor: pointer;
                }
            </style>
            <img src="https://rebornxp.com/res/sites/iexplore/logo.png" width="80" id="q-logo-home">
            <div class="q-search-box">
                <div class="q-tabs">
                    <a class="q-tab ${searchType === 'web' ? 'active' : ''}" data-type="web">Web</a>
                    <a class="q-tab ${searchType === 'images' ? 'active' : ''}" data-type="images">Images</a>
                    <a class="q-tab ${searchType === 'videos' ? 'active' : ''}" data-type="videos">Videos</a>
                </div>
                <div class="q-input-group">
                    <input type="text" id="q-inner-search" value="${query}">
                    <button id="q-inner-btn">Search</button>
                </div>
            </div>
            <script>
                (function() {
                    const sendSearch = (type, q) => {
                        window.parent.postMessage({ action: 'search', query: q, type: type }, '*');
                    };
                    document.getElementById('q-inner-btn').onclick = () => {
                        const q = document.getElementById('q-inner-search').value;
                        const activeType = document.querySelector('.q-tab.active').dataset.type;
                        sendSearch(activeType, q);
                    };
                    document.getElementById('q-inner-search').onkeypress = (e) => {
                        if(e.key === 'Enter') document.getElementById('q-inner-btn').click();
                    };
                    document.querySelectorAll('.q-tab').forEach(t => {
                        t.onclick = () => sendSearch(t.dataset.type, document.getElementById('q-inner-search').value);
                    });
                    document.getElementById('q-logo-home').onclick = () => {
                        window.parent.postMessage({ action: 'navigate_to', url: 'about:home' }, '*');
                    };
                })();
            </script>
        `;
        doc.body.prepend(qooqleHeader);

        // 4. Inject Interceptor Script
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