const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        
        if (url.pathname === '/metadata') {
            return handleMetadata(request);
        }
        if (url.pathname === '/aol-proxy') {
            return handleAolProxy(request);
        }

        return new Response('Not Found', { status: 404 });
    },
};

async function handleMetadata(request) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, target_url'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    let targetUrlStr = request.headers.get('target_url') || new URL(request.url).searchParams.get('url');
    
    if (!targetUrlStr && request.method === 'POST') {
        try {
            const body = await request.json();
            targetUrlStr = body.url;
        } catch(e){}
    }

    if (!targetUrlStr) {
        return new Response(JSON.stringify({ error: 'target_url header is required' }), { status: 400, headers: corsHeaders });
    }

    let targetUrl = targetUrlStr;
    if (!targetUrl.toLowerCase().startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }
    
    let site = {
        url: targetUrl,
        final_url: targetUrl,
        icon: '/images/xp/icons/ApplicationWindow.png',
        icon_data: null,
        name: 'Untitled Page',
        desc: '',
        xframe_restricted: false
    };

    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': USER_AGENT },
            redirect: 'follow'
        });

        site.final_url = response.url;
        const xFrame = response.headers.get('x-frame-options');
        const csp = response.headers.get('content-security-policy');

        if (xFrame && ['DENY', 'SAMEORIGIN'].includes(xFrame.toUpperCase())) site.xframe_restricted = true;
        if (csp && csp.includes('frame-ancestors') && !csp.includes('frame-ancestors *')) site.xframe_restricted = true;

        let foundTitle = "";
        let metaTitle = "";
        let siteName = "";
        let ogIcon = "";
        let relIcon = "";
        let appleIcon = "";
        let shortcutIcon = "";

        const rewriter = new HTMLRewriter()
            .on('title', { text(t) { foundTitle += t.text; } })
            .on('meta[property="og:site_name"]', { element(el) { siteName = el.getAttribute('content'); } })
            .on('meta[property="og:title"], meta[name="og:title"]', { element(el) { metaTitle = el.getAttribute('content'); } })
            .on('meta[property="og:description"], meta[name="description"]', { element(el) { site.desc = el.getAttribute('content') || site.desc; } })
            .on('link[rel="apple-touch-icon"]', { element(el) { appleIcon = el.getAttribute('href'); } })
            .on('link[rel="icon"]', { element(el) { relIcon = el.getAttribute('href'); } })
            .on('link[rel="shortcut icon"]', { element(el) { shortcutIcon = el.getAttribute('href'); } })
            .on('meta[property="og:image"]', { element(el) { ogIcon = el.getAttribute('content'); } });

        await rewriter.transform(response).text();

        site.name = siteName || metaTitle || foundTitle.trim() || new URL(site.final_url).hostname;

        let iconUrl = appleIcon || relIcon || shortcutIcon || ogIcon;
        if (iconUrl) {
            iconUrl = new URL(iconUrl, site.final_url).href;
        } else {
            iconUrl = new URL('/favicon.ico', site.final_url).href;
        }

        if (iconUrl) {
            try {
                const iconRes = await fetch(iconUrl, { headers: { 'User-Agent': USER_AGENT } });
                const contentType = iconRes.headers.get('content-type');
                if (iconRes.ok && (contentType.startsWith('image/') || contentType.includes('icon'))) {
                    const iconBuffer = await iconRes.arrayBuffer();
                    site.icon = iconUrl;
                    site.icon_data = btoa(String.fromCharCode(...new Uint8Array(iconBuffer)));
                }
            } catch (e) {}
        }

    } catch (error) {
        try { site.name = new URL(targetUrl).hostname; } catch(e){}
    }

    return new Response(JSON.stringify({ site }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
}

async function handleAolProxy(request) {
    const url = new URL(request.url);
    let targetUrl = url.searchParams.get('url');
    if (!targetUrl) return new Response('URL parameter is required.', { status: 400 });

    // Swap search.aol.com/aol with search.yahoo.com
    if (targetUrl.includes('search.aol.com/aol/')) {
        targetUrl = targetUrl.replace('search.aol.com/aol/', 'search.yahoo.com/');
    }

    const aolResponse = await fetch(targetUrl, { headers: { 'User-Agent': USER_AGENT } });
    const targetUrlObj = new URL(targetUrl);

    const qooqleHeader = `
        <style>
            #qooqle-results-navbar { background: #ffffff; padding: 8px 15px; font-family: "MS Gothic", monospace; display: flex; align-items: center; }
            #q-logo { width: 100px; cursor: pointer; margin-right: 20px; }
            .q-form-container { display: flex; align-items: center; gap: 5px; }
            .q-input { width: 350px; height: 22px; border: 2px solid; border-top-color: #808080; border-left-color: #808080; border-right-color: #d0d0d0; border-bottom-color: #d0d0d0; box-shadow: inset 1px 1px #404040, inset -1px -1px #ffffff; background-color: #ffffff; padding: 2px 5px; font-family: "MS Gothic", monospace; font-size: 12px; outline: none; }
            .q-btn { background-color: #c0c0c0; border: 2px solid; border-top-color: #ffffff; border-left-color: #ffffff; border-right-color: #808080; border-bottom-color: #808080; padding: 0 10px; height: 28px; font-family: "MS Gothic", monospace; font-size: 12px; color: #000; cursor: pointer; text-align: center; display: flex; align-items: center; }
            .q-btn:hover { border-top-color: #808080; border-left-color: #808080; border-right-color: #ffffff; border-bottom-color: #ffffff; box-shadow: inset 1px 1px #404040, inset -1px -1px #ffffff; }
        </style>
        <div id="qooqle-results-navbar">
            <img src="https://xp.quenq.com/res/sites/iexplore/logo.png" id="q-logo" alt="Qooqle">
            <div class="q-form-container">
                <input type="text" id="q-search-input" class="q-input" value="${targetUrlObj.searchParams.get('q')?.replace(/"/g, '&quot;') || ''}">
                <button id="q-search-btn" class="q-btn">Search</button>
            </div>
        </div>
        <script>
            (function() {
                const input = document.getElementById('q-search-input');
                const btn = document.getElementById('q-search-btn');
                const logo = document.getElementById('q-logo');
                const performSearch = () => { if (input.value.trim()) window.parent.postMessage({ action: 'search', query: input.value.trim() }, '*'); };
                btn.onclick = performSearch;
                input.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };
                logo.onclick = () => window.parent.postMessage({ action: 'navigate_to', url: 'about:home' }, '*');
            })();
        <\/script>
    `;

    const rewriter = new HTMLRewriter()
        .on('head', { element(el) { el.prepend(`<base href="${targetUrlObj.origin}">`, { html: true }); } })
        .on('body', { element(el) { el.prepend(qooqleHeader, { html: true }); } })
        .on('header, footer, #header, #ft_wrapper, #ybar, .mag-glass, #ys, #topbar, #sticky-hd', { element(el) { el.remove(); } })
        .on('a', {
            element(el) {
                const href = el.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
                try {
                    const absoluteUrl = new URL(href, targetUrlObj.href).href;
                    el.setAttribute('href', 'javascript:void(0);');
                    el.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); window.parent.postMessage({ action: 'navigate_to', url: ${JSON.stringify(absoluteUrl)} }, '*');`);
                    el.removeAttribute('target');
                } catch(e){}
            }
        });
        
    const transformedResponse = rewriter.transform(aolResponse);

    return new Response(transformedResponse.body, {
        headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' }
    });
}