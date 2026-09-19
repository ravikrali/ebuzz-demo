/* eBuzz.ai: Buzz Feed (social feed shared by the Shopper, Vendor and Admin portals).
 * Content: shopper reviews, ratings, stories, tips & questions; vendor promotions (Sponsored);
 * banner ads from ad networks (Google Ad Manager, Microsoft Advertising, direct-sold).
 * Posts are public by design and sync through the same local-SQLite → central layer (table feed_posts). */
(function () {
  const { h, $, $$, esc, money, icon } = EB;
  const D = () => EB.data;
  const F = (EB.feed = {});

  /* ---------- seed content (deterministic ids so every portal seeds the same posts) ---------- */
  const ago = (hrs) => new Date(Date.now() - hrs * 36e5).toISOString();
  const base = { rating: null, product: '', sku: '', vendor: '', emoji: '', promo_price: null, list_price: null, cta: '', sponsored: 0, status: 'published', likes: 0, shares: 0, comments_json: '[]', mod_score: 0.02, mod_flags: '', impressions: 0, clicks: 0, targets: '', incentivized: 0, verified: 0 };
  const SEED = [
    { id: 'fp-01', author_id: 'u_3fa21', author: 'Jordan K.', avatar: '🧔', kind: 'review', text: 'Three weeks with the ErgoMax Pro Lumbar and my lower-back ache after work is basically gone. Setting the lumbar height took 10 minutes, and it was worth it.', rating: 5, product: 'ErgoMax Pro Lumbar', sku: 'ergomax', vendor: 'ErgoMax', emoji: '🪑', likes: 128, shares: 14, verified: 1, created_at: ago(5), comments_json: JSON.stringify([{ by: 'Priya D.', text: 'Did you get it through the Deal Room?' }, { by: 'Jordan K.', text: 'Yes! Got $50 off + a free lumbar pillow.' }, { by: 'ErgoMax', brand: 1, text: 'Thanks Jordan! Glad the lumbar tuning helped 🙌' }]) },
    { id: 'fp-02', author_id: 'u_77c10', author: 'Aisha M.', avatar: '👩🏽', kind: 'story', text: 'Small win: we fixed our 4-year-old\'s sleep with blackout curtains + white noise. The Concierge built the whole plan in 2 minutes and Hushly sent a live offer while I was deciding 😴', product: 'Hushly Fan White-Noise Machine', sku: 'hush', vendor: 'Hushly', emoji: '🌙', likes: 342, shares: 51, verified: 1, created_at: ago(9) },
    { id: 'fp-03', author_id: 'brand_ergomax', author: 'ErgoMax', avatar: '🪑', kind: 'promo', sponsored: 1, text: 'Back pain from WFH? Our Pro Lumbar has 4-way lumbar support and a 12-year warranty. Feed-exclusive: free lumbar pillow this week.', product: 'ErgoMax Pro Lumbar', sku: 'ergomax', vendor: 'ErgoMax', emoji: '🪑', promo_price: 299, list_price: 329, cta: 'Get offer', likes: 61, impressions: 18420, clicks: 736, targets: 'Back pain,Posture', created_at: ago(20) },
    { id: 'fp-04', author_id: 'u_19be4', author: 'Marco T.', avatar: '👨🏻', kind: 'tip', text: 'Tip for heavy chewers: rotate 3 toys every few days. Our Lab ignores anything he sees every day. TuffRoot replaced one he destroyed, no questions asked.', product: 'TuffRoot Rubber Chew', sku: 'tuff', vendor: 'TuffRoot', emoji: '🦴', likes: 97, shares: 8, verified: 1, created_at: ago(26) },
    { id: 'fp-05', author_id: 'u_a0c33', author: 'Hannah L.', avatar: '👩🏼', kind: 'question', text: 'Anyone tried a standing desk mat for leg fatigue? Is thicker always better?', likes: 23, created_at: ago(30), comments_json: JSON.stringify([{ by: 'Sam P.', text: 'Contoured ones helped me more than just thick ones.' }]) },
    { id: 'fp-06', author_id: 'u_5d8e1', author: 'Chris B.', avatar: '🧑🏾', kind: 'review', text: 'Sitwell Aria is firm, which I wanted, but it runs small if you\'re over 6\'. Great value for shorter folks.', rating: 4, product: 'Sitwell Aria', sku: 'sitwell', vendor: 'Sitwell Home', emoji: '🪑', likes: 44, shares: 3, verified: 1, created_at: ago(40) },
    { id: 'fp-07', author_id: 'brand_hushly', author: 'Hushly', avatar: '🔊', kind: 'promo', sponsored: 1, text: 'Real fan, not a looped recording. 20 sound levels for light sleepers.', product: 'Hushly Fan White-Noise Machine', sku: 'hush', vendor: 'Hushly', emoji: '🔊', promo_price: 34, list_price: 39, cta: 'Get offer', likes: 18, impressions: 9210, clicks: 301, targets: 'Sleep', created_at: ago(44) },
    { id: 'fp-08', author_id: 'u_c2f90', author: 'Olivia R.', avatar: '👩🏻‍🦰', kind: 'review', text: 'LunaDark blocks basically all the street light. Measure 8" wider than your window like the Concierge said!', rating: 5, product: 'LunaDark Thermal Blackout (2 panels)', sku: 'luna', vendor: 'LunaDark', emoji: '🌙', likes: 76, shares: 9, verified: 1, incentivized: 1, created_at: ago(60) },
    { id: 'fp-09', author_id: 'u_bad01', author: 'deals_4u_now', avatar: '🤑', kind: 'tip', text: 'Cheapest chairs anywhere!!! DM me on WhatsApp for 70% off, link in bio', likes: 0, status: 'flagged', mod_score: 0.94, mod_flags: 'Spam,Off-platform sales', created_at: ago(2) },
    { id: 'fp-10', author_id: 'u_bad02', author: 'Kevin S.', avatar: '🙂', kind: 'review', text: 'Best chair ever, 5 stars! (got it free from the brand for posting this)', rating: 5, product: 'ChairCo Flex Mesh', sku: 'chairco', vendor: 'ChairCo', emoji: '💺', status: 'flagged', mod_score: 0.71, mod_flags: 'Undisclosed incentive', created_at: ago(3) },
    { id: 'fp-11', author_id: 'brand_lunadark', author: 'LunaDark', avatar: '🌙', kind: 'promo', sponsored: 1, text: 'Fall sale: 2-panel thermal blackout set. Blocks 99% of light.', product: 'LunaDark Thermal Blackout (2 panels)', sku: 'luna', vendor: 'LunaDark', emoji: '🌙', promo_price: 42, list_price: 49, cta: 'Get offer', status: 'pending', targets: 'Sleep', created_at: ago(1) },
  ].map((p) => ({ ...base, ...p }));
  F.seed = () => D().put('feed_posts', SEED, { silent: true });

  /* ---------- ad settings (Admin-controlled, synced via config) ---------- */
  F.AD_DEFAULTS = { interval: 4, networks: { google: true, microsoft: true, direct: true }, cap: 6, blocked: ['Gambling', 'Alcohol', 'Political'], contextualOnly: true };
  F.adConfig = () => { try { const c = D().get('config', 'feed_ads'); return c ? { ...F.AD_DEFAULTS, ...JSON.parse(c.json) } : F.AD_DEFAULTS; } catch { return F.AD_DEFAULTS; } };
  const CREATIVES = {
    google: [['Nimbus Mattress', 'Sleep cooler tonight. 100-night trial.', '🛏️', 'Google Ad Manager'], ['Fernwood Coffee', 'Your WFH mornings, upgraded.', '☕', 'Google Ad Manager']],
    microsoft: [['Contoso Cloud PC', 'Your desktop, anywhere. Try free for 30 days.', '💻', 'Microsoft Advertising'], ['Northwind Travel', 'Weekend getaways from $199.', '✈️', 'Microsoft Advertising']],
    direct: [['Sitwell Home', 'Beat Buzz Crush level 3 → 15% off the Aria.', '🎮', 'eBuzz direct']],
  };
  F.banner = (i) => {
    const cfg = F.adConfig();
    const pool = Object.entries(CREATIVES).filter(([k]) => cfg.networks[k]).flatMap(([, v]) => v);
    if (!pool.length) return null;
    const [brand, line, e, net] = pool[i % pool.length];
    const el = h(`<div class="ad-slot" role="complementary" aria-label="Advertisement"><div class="row between" style="margin-bottom:8px"><span class="sp-label">Ad · ${esc(net)}</span><button class="ad-why" title="Why this ad?">ⓘ</button></div><div class="row" style="gap:14px"><div class="ad-art">${e}</div><div style="flex:1;min-width:0"><b>${esc(brand)}</b><div class="muted" style="font-size:13.5px">${esc(line)}</div></div><button class="btn sm">Learn more</button></div></div>`);
    $('.ad-why', el).onclick = () => EB.modal(`<h3>Why am I seeing this ad?</h3><p class="muted">It was selected <b>contextually</b> for this feed section (home, sleep &amp; WFH). eBuzz doesn't share your identity, purchases or conversations with ad networks. Ads pay for Play &amp; Win prizes and keep eBuzz free.</p><p class="muted" style="font-size:13px">Served by ${esc(net)} · frequency-capped at ${cfg.cap}/day · blocked categories: ${cfg.blocked.join(', ')}</p><button class="btn primary" onclick="EB.closeOverlays()">Got it</button>`);
    $('.btn.sm', el).onclick = () => EB.toast('Ad click (demo): the advertiser\'s site would open in a new tab');
    return el;
  };

  /* ---------- sharing ---------- */
  const postUrl = (p) => `${location.origin}${location.pathname.replace(/[^/]*$/, '')}customer.html#post=${p.id}`.replace('/app/app/', '/app/');
  const caption = (p) => `${p.kind === 'review' && p.rating ? '★'.repeat(p.rating) + ' ' : ''}${p.text.slice(0, 180)}${p.text.length > 180 ? '…' : ''} #eBuzz`;
  const bumpShares = (p) => D().put('feed_posts', { ...p, shares: (+p.shares || 0) + 1 }, { silent: true });
  const copy = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
  F.share = (p) => {
    const url = postUrl(p), text = caption(p);
    const m = EB.modal(`<h3 style="margin-bottom:4px">Share this post</h3><p class="muted" style="margin-top:0;font-size:13.5px">Only the post and your display name are shared, never your email or purchase details.</p>
      <div class="share-grid">
        <button data-s="tiktok"><span class="sh tt">♪</span>TikTok</button>
        <button data-s="instagram"><span class="sh ig">◎</span>Instagram</button>
        <button data-s="facebook"><span class="sh fb">f</span>Facebook</button>
        <button data-s="x"><span class="sh xx">𝕏</span>X</button>
        <button data-s="copy"><span class="sh cp">🔗</span>Copy link</button>
        ${navigator.share ? '<button data-s="native"><span class="sh cp">⋯</span>More apps</button>' : ''}
      </div>
      <div class="card flat" style="margin-top:14px;padding:12px"><div class="muted" style="font-size:12px;margin-bottom:4px">Preview</div><div style="font-size:13.5px">${esc(text)}</div><div class="mono muted" style="font-size:11.5px;margin-top:6px;word-break:break-all">${esc(url)}</div></div>
      <div class="row" style="margin-top:14px"><button class="btn sm" data-s="story">⤓ Story image (9:16) for TikTok / Instagram</button><button class="btn sm ghost" onclick="EB.closeOverlays()">Close</button></div>`);
    $$('[data-s]', m).forEach((b) => (b.onclick = async () => {
      const s = b.dataset.s;
      if (s === 'x') window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener');
      else if (s === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener');
      else if (s === 'native') { try { await navigator.share({ title: 'eBuzz', text, url }); } catch { return; } }
      else if (s === 'story') { F.storyImage(p); }
      else { const ok = await copy(`${text}\n${url}`); EB.toast(s === 'copy' ? (ok ? 'Link copied' : 'Copy failed. Select the link above') : `Caption & link copied. Paste them in ${s === 'tiktok' ? 'TikTok' : 'Instagram'}, or use the story image`); }
      bumpShares(p); EB.bus.emit('feed:share', { id: p.id, network: s });
    }));
  };
  /* 1080×1920 story card rendered on the device (no upload) */
  F.storyImage = (p) => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1080, 1920); g.addColorStop(0, '#2B1D5C'); g.addColorStop(1, '#F2A000');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1920);
    x.fillStyle = '#fff'; x.font = '700 64px system-ui'; x.fillText('eBuzz', 90, 160);
    x.font = '220px system-ui'; x.fillText(p.emoji || '🍯', 90, 520);
    if (p.rating) { x.font = '80px system-ui'; x.fillStyle = '#FFD166'; x.fillText('★'.repeat(p.rating), 90, 680); x.fillStyle = '#fff'; }
    x.font = '600 58px system-ui';
    const words = p.text.split(' '); let line = '', y = 820;
    for (const w of words) { if (x.measureText(line + w).width > 900) { x.fillText(line, 90, y); line = ''; y += 76; if (y > 1560) break; } line += w + ' '; }
    if (y <= 1560) x.fillText(line, 90, y);
    x.font = '500 44px system-ui'; x.fillText(`- ${p.author}${p.product ? ' · ' + p.product : ''}`.slice(0, 48), 90, 1700);
    x.font = '500 38px system-ui'; x.globalAlpha = 0.85; x.fillText('Solve it on eBuzz.ai', 90, 1800);
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = `ebuzz-story-${p.id}.png`; a.click();
    EB.toast('Story image created on your device');
  };

  /* ---------- AI moderation (simulated classifier; real system = moderation agent + human review) ---------- */
  F.moderate = (text, incentivized) => {
    const t = text.toLowerCase(), flags = [];
    if (/whatsapp|telegram|dm me|link in bio|https?:\/\//.test(t)) flags.push('Off-platform sales');
    if (/!!!|70% off|cheapest/.test(t)) flags.push('Spam');
    if (/free from the brand|paid me|got it free/.test(t) && !incentivized) flags.push('Undisclosed incentive');
    if (/idiot|stupid|hate you/.test(t)) flags.push('Harassment');
    return { score: flags.length ? Math.min(0.99, 0.55 + flags.length * 0.2) : 0.03, flags };
  };

  /* ---------- post card ---------- */
  const timeAgo = (iso) => { const m = Math.max(1, Math.round((Date.now() - new Date(iso)) / 6e4)); return m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`; };
  const liked = () => EB.sstore.get('eb-liked', {});
  F.card = (p, o = {}) => {
    const cm = (() => { try { return JSON.parse(p.comments_json || '[]'); } catch { return []; } })();
    const isPromo = p.kind === 'promo';
    const kindTag = { review: 'Review', story: 'Story', tip: 'Tip', question: 'Question', promo: 'Promotion' }[p.kind] || p.kind;
    const el = h(`<article class="post ${isPromo ? 'promo' : ''} ${p.status !== 'published' ? 'dim' : ''}" data-post="${p.id}">
      <header class="row" style="gap:10px"><div class="post-av">${p.avatar || '🙂'}</div>
        <div style="flex:1;min-width:0"><div class="row wrap" style="gap:6px"><b>${esc(p.author)}</b>${p.author_id.startsWith('brand_') ? '<span class="tag blue">Brand</span>' : ''}${+p.verified ? '<span class="tag green">✓ Verified purchase</span>' : ''}${+p.incentivized ? '<span class="tag">Received product free</span>' : ''}${isPromo ? '<span class="tag honey">Sponsored</span>' : ''}</div>
        <div class="muted" style="font-size:12px">${kindTag} · ${timeAgo(p.created_at)}${p.status !== 'published' ? ` · <b style="color:var(--red)">${p.status === 'pending' ? 'Pending ad review' : p.status === 'flagged' ? 'Held for moderation' : 'Removed'}</b>` : ''}</div></div>
        ${o.moderation ? `<span class="tag ${p.mod_score > 0.5 ? 'red' : 'green'}" title="AI moderation risk score">risk ${Math.round(p.mod_score * 100)}</span>` : `<button class="icon-btn" data-report title="Report" aria-label="Report post" style="width:30px;height:30px">⚑</button>`}</header>
      ${p.rating ? `<div class="stars" style="font-size:16px;margin-top:8px">${'★'.repeat(p.rating)}<span class="muted">${'★'.repeat(5 - p.rating)}</span></div>` : ''}
      <p class="post-text">${esc(p.text)}</p>
      ${p.product ? `<div class="post-prod"><div class="post-art">${p.emoji || '📦'}</div><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(p.product)}</b><div class="muted" style="font-size:12px">${esc(p.vendor)}${isPromo && p.promo_price ? ` · <b style="color:var(--green)">${money(p.promo_price, 0)}</b> <s>${money(p.list_price, 0)}</s>` : ''}</div></div>${o.onShop && p.sku ? `<button class="btn sm ${isPromo ? 'primary' : ''}" data-shop>${isPromo ? esc(p.cta || 'Get offer') : 'View'}</button>` : ''}</div>` : ''}
      ${p.mod_flags && o.moderation ? `<div class="warn-note" style="margin-top:8px;font-size:12.5px">AI flags: ${esc(p.mod_flags)}</div>` : ''}
      ${isPromo && o.showStats ? `<div class="kpis" style="margin-top:10px;grid-template-columns:repeat(4,1fr)"><div class="kpi"><div class="l">Impressions</div><div class="v" style="font-size:16px">${(+p.impressions).toLocaleString()}</div></div><div class="kpi"><div class="l">Clicks</div><div class="v" style="font-size:16px">${(+p.clicks).toLocaleString()}</div></div><div class="kpi"><div class="l">CTR</div><div class="v" style="font-size:16px">${p.impressions ? ((p.clicks / p.impressions) * 100).toFixed(1) : '0.0'}%</div></div><div class="kpi"><div class="l">Targets</div><div class="v" style="font-size:12.5px">${esc(p.targets || '-')}</div></div></div>` : ''}
      <footer class="post-actions"><button data-like class="${liked()[p.id] ? 'on' : ''}">♥ <span>${p.likes || 0}</span></button><button data-cm>💬 ${cm.length}</button><button data-share>↗ Share · ${p.shares || 0}</button>${o.extra ? o.extra(p) : ''}</footer>
      <div class="post-comments" hidden>${cm.map((c) => `<div class="cm"><b>${esc(c.by)}</b>${c.brand ? ' <span class="tag blue">Brand</span>' : ''} ${esc(c.text)}</div>`).join('')}
        ${o.commentAs ? `<div class="row" style="margin-top:6px"><input class="btn sm" style="flex:1;text-align:left;border-radius:10px" placeholder="${o.commentAs.brand ? 'Reply as ' + esc(o.commentAs.name) + '…' : 'Add a comment…'}"><button class="btn sm primary" data-send>Post</button></div>` : ''}</div>
    </article>`);
    const save = (patch) => D().put('feed_posts', { ...p, ...patch });
    $('[data-like]', el).onclick = async () => { const L = liked(); const on = !L[p.id]; L[p.id] = on; EB.sstore.set('eb-liked', L); await save({ likes: Math.max(0, (+p.likes || 0) + (on ? 1 : -1)) }); o.refresh && o.refresh(); };
    $('[data-cm]', el).onclick = () => { const c = $('.post-comments', el); c.hidden = !c.hidden; };
    $('[data-share]', el).onclick = () => F.share(p);
    const rep = $('[data-report]', el); if (rep) rep.onclick = async () => { await save({ status: 'flagged', mod_flags: [p.mod_flags, 'Reported by user'].filter(Boolean).join(','), mod_score: Math.max(+p.mod_score, 0.5) }); EB.toast('Thanks. Our moderation team will review it.'); o.refresh && o.refresh(); };
    const shop = $('[data-shop]', el); if (shop) shop.onclick = () => { save({ clicks: (+p.clicks || 0) + 1 }); o.onShop(p); };
    const send = $('[data-send]', el); if (send) send.onclick = async () => { const i = $('input', el); if (!i.value.trim()) return; cm.push({ by: o.commentAs.name, brand: o.commentAs.brand ? 1 : 0, text: i.value.trim() }); await save({ comments_json: JSON.stringify(cm) }); o.refresh && o.refresh(); };
    if (o.bind) o.bind(el, p, save);
    return el;
  };

  /* ---------- feed view (list + ads + filters) ---------- */
  F.list = () => D().all('feed_posts').sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  F.render = (container, { posts, cardOpts, ads = true }) => {
    container.innerHTML = '';
    const cfg = F.adConfig(); let adN = 0;
    posts.forEach((p, i) => {
      container.append(F.card(p, cardOpts));
      if (ads && (i + 1) % cfg.interval === 0 && adN < cfg.cap) { const b = F.banner(adN++); if (b) container.append(b); }
    });
    if (!posts.length) container.append(h('<p class="muted" style="text-align:center;padding:30px">Nothing here yet.</p>'));
  };
})();
