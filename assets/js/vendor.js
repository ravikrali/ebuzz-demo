/* eBuzz.ai: Vendor Manager "Deal Room" prototype (ErgoMax pricing lead) */
(function () {
  const { h, $, $$, money, sleep, icon, bus } = EB;

  const CATALOG = {
    ergomax: { name: 'ErgoMax Pro Lumbar', price: 329, cost: 182, floor: 279 },
    lite: { name: 'ErgoMax Lite', price: 229, cost: 128, floor: 199 },
    foot: { name: 'ErgoMax Footrest', price: 49, cost: 17, floor: 39 },
  };
  const PERKS = [['Free shipping', 14], ['Free lumbar pillow', 6], ['+2-yr warranty', 9]];
  const K = { sessions: 142, offers: 97, won: 37, rev: 18240, disc: 7.4 };
  const sessions = {}; // sid -> {card, data, sku, beat, status}

  const chat = EB.shell({
    persona: 'vendor',
    user: { name: 'Jordan Lee', role: 'Pricing Lead · ErgoMax', initials: 'JL', cls: 'v' },
    rail: [
      { id: 'live', label: 'Deal Room', icon: 'bolt', badge: '' },
      { id: 'rules', label: 'Auto-bid', icon: 'sliders' },
      { id: 'analytics', label: 'Win / Loss', icon: 'chart' },
      { id: 'boost', label: 'Boost', icon: 'megaphone' },
      { id: 'feed', label: 'Buzz Feed', icon: 'feed' },
    ],
    placeholder: 'Ask Deal Copilot, e.g. "why are we losing?" or "create a rule"',
    note: 'You see an anonymised shopper and the price to beat for this session only. Competitor identities and history are never shared.',
    onNav: (id) => (id === 'live' ? EB.view('chat') : id === 'rules' ? rules() : id === 'analytics' ? analytics() : id === 'feed' ? feed() : boost()),
  });
  EB.setNav('live');

  function renderContext() {
    const wr = Math.round((K.won / K.offers) * 100);
    $('#context').innerHTML = `
      <div class="ctx-section"><div class="row between"><h4 style="margin:0">Today · ErgoMax</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
        <div class="kpis" style="grid-template-columns:1fr 1fr;margin-top:10px">
          <div class="kpi"><div class="l">Live sessions</div><div class="v">${K.sessions}</div></div>
          <div class="kpi"><div class="l">Offers sent</div><div class="v">${K.offers}</div></div>
          <div class="kpi"><div class="l">Win rate</div><div class="v">${wr}%</div><div class="d up">+6 pts vs last wk</div></div>
          <div class="kpi"><div class="l">Avg discount</div><div class="v">${K.disc}%</div></div>
          <div class="kpi" style="grid-column:span 2"><div class="l">Revenue won via Deal Room</div><div class="v">${money(K.rev, 0)}</div><div class="d muted">commission 11% billed on won sales only</div></div>
        </div></div>
      <div class="ctx-section"><h4>Guardrails <span class="tag green">enforced</span></h4>
        ${Object.entries(CATALOG).map(([k, c]) => `<div class="set-row"><div>${c.name}<small>List ${money(c.price, 0)} · cost ${money(c.cost, 0)}</small></div><label class="field" style="width:90px">Floor<input type="number" value="${c.floor}" data-floor="${k}"></label></div>`).join('')}
        <div class="set-row"><div>Max discount<small>per offer</small></div><b>20%</b></div>
        <div class="set-row"><div>Max rounds<small>per shopper session</small></div><b>3</b></div></div>
      <div class="ctx-section"><h4>What you can see</h4><div style="font-size:13px" class="stack">
        <div class="row">${icon('check')}<span>Problem, budget band, intent score</span></div>
        <div class="row">${icon('check')}<span>Price to beat & your rank <i>in this session</i></span></div>
        <div class="row muted">${icon('x')}<span>Shopper identity, competitor names, competitor history</span></div></div></div>
      <div class="ctx-section"><h4>Demo tip</h4><p style="font-size:13px;margin:0" class="muted">Open the <a href="customer.html" target="_blank">Shopper portal</a> in another tab and say "my back hurts". The session shows up here live, and your offers go straight to the shopper.</p></div>`;
    $$('[data-floor]').forEach((i) => (i.onchange = () => { CATALOG[i.dataset.floor].floor = +i.value; EB.toast(`Floor for ${CATALOG[i.dataset.floor].name} set to ${money(i.value, 0)}`); }));
  }

  /* ---------- session cards ---------- */
  function upsertSession(d, { real = false, asked = false } = {}) {
    let s = sessions[d.sid];
    const mine = d.items.find((i) => i.vendor === 'ErgoMax') || { id: 'ergomax', price: 329 };
    const others = d.items.filter((i) => i.vendor !== 'ErgoMax').map((i) => (i.offer ?? i.price));
    const beat = others.length ? Math.min(...others) : null;
    const myPrice = mine.offer ?? mine.price;
    const rank = 1 + others.filter((p) => p < myPrice).length;
    if (!s) {
      s = sessions[d.sid] = { data: d, sku: mine.id in CATALOG ? mine.id : 'ergomax', status: 'open', rounds: 0, real };
      s.card = h(`<div class="card" data-sid="${d.sid}"></div>`);
      chat.bot([real ? `${icon('bell')} <b>Live shopper</b> just shortlisted your chair.` : `New session matched to <b>${CATALOG[s.sku].name}</b>:`, s.card], { delay: 350 });
      s.end = Date.now() + 10 * 60000;
      K.sessions++;
    }
    Object.assign(s, { data: d, beat, rank, myPrice, n: d.items.length });
    if (asked && s.status === 'sent' && s.rounds < 3) s.status = 'open';
    if (asked) { s.asked = true; s.end = Math.max(s.end, Date.now() + 5 * 60000); EB.toast(`🔔 Shopper #${d.sid} asked for a better deal`); }
    paint(s); renderContext();
    return s;
  }

  function winProb(s, price, perks) {
    if (s.beat == null) return 0.55;
    const gap = (price - s.beat) / s.beat; // negative = cheaper than best competitor
    const perkBoost = perks.length * 0.08;
    return Math.max(0.05, Math.min(0.92, 0.5 - gap * 2.5 + perkBoost));
  }

  function paint(s) {
    const c = CATALOG[s.sku], d = s.data;
    const rec = Math.max(c.floor, s.beat ? Math.min(c.price, s.beat + 20) : c.price - 25);
    const recPerks = ['Free shipping', 'Free lumbar pillow'];
    const recP = winProb(s, rec, recPerks);
    const margin = (rec - c.cost - 20) / rec;
    s.rec = { price: rec, perks: recPerks };
    s.card.className = 'card' + (s.asked && s.status === 'open' ? ' honey-edge' : '');
    s.card.innerHTML = `
      <div class="card-head"><div><div class="card-title">Shopper #${d.sid} ${s.real ? '<span class="tag green"><i class="dot live"></i> live</span>' : ''} ${s.asked && s.status === 'open' ? '<span class="tag honey">Asked for a better deal</span>' : ''}</div>
        <div class="card-sub">${d.problem} · ${Object.values(d.answers || {}).join(' · ')}</div></div>
        <div style="text-align:right"><div class="timer" data-exp="${s.end}"></div><div class="muted" style="font-size:11.5px">offer window</div></div></div>
      <div class="kpis">
        <div class="kpi"><div class="l">Your product</div><div class="v" style="font-size:16px">${c.name}</div><div class="d muted">now ${money(s.myPrice, 0)}</div></div>
        <div class="kpi"><div class="l">Price to beat</div><div class="v">${s.beat ? money(s.beat, 0) : '-'}</div><div class="d muted">another vendor · anonymised</div></div>
        <div class="kpi"><div class="l">Your rank (price)</div><div class="v">#${s.rank} <span style="font-size:14px" class="muted">of ${s.n}</span></div></div>
        <div class="kpi"><div class="l">Intent score</div><div class="v">${d.intent || 80}</div><div class="d up">high</div></div>
      </div>
      ${s.status === 'open' ? `
      <div style="margin-top:12px">${EB.aiNote(`<b>Suggested:</b> ${money(rec, 0)} + ${recPerks.join(' + ')} · est. win <b>${Math.round(recP * 100)}%</b> · margin after perks <b>${Math.round(margin * 100)}%</b>. Shoppers with back pain value lumbar extras more than a slightly lower price.`)}</div>
      <div class="row wrap" style="margin-top:12px;gap:12px;align-items:flex-end">
        <label class="field" style="width:120px">Offer price<input type="number" value="${rec}" min="1" data-price></label>
        <div class="chips" data-perks>${PERKS.map(([p, cost]) => `<button class="chip ${recPerks.includes(p) ? 'on' : ''}" data-p="${p}">${p} <span class="muted">($${cost})</span></button>`).join('')}</div>
      </div>
      <div class="row between wrap" style="margin-top:10px;gap:10px"><div style="flex:1;min-width:180px"><div class="row between" style="font-size:12.5px"><span>Est. win probability</span><b data-wp></b></div><div class="meter g"><i data-wpm></i></div><div data-warn class="down" style="font-size:12.5px;margin-top:4px"></div></div>
        <div class="row wrap"><button class="btn primary" data-send>${icon('send')} Send offer</button><button class="btn" data-hold>${icon('clock')} Need 5 min</button><button class="btn ghost" data-pass>Pass</button></div></div>`
      : `<div class="${s.status === 'won' ? 'ok-note' : s.status === 'lost' ? 'warn-note' : 'ai-note'}" style="margin-top:12px">${s.statusText}</div>`}`;
    if (s.status !== 'open') return;
    const pr = $('[data-price]', s.card), perksEl = $('[data-perks]', s.card);
    const perks = () => $$('.chip.on', perksEl).map((x) => x.dataset.p);
    const upd = () => {
      const p = +pr.value, wp = winProb(s, p, perks());
      $('[data-wp]', s.card).textContent = Math.round(wp * 100) + '%';
      $('[data-wpm]', s.card).style.width = wp * 100 + '%';
      const below = p < c.floor, over = (c.price - p) / c.price > 0.2;
      $('[data-warn]', s.card).textContent = below ? `Below your floor (${money(c.floor, 0)}). Blocked by guardrail.` : over ? 'More than the 20% max discount. Blocked by guardrail.' : '';
      $('[data-send]', s.card).disabled = below || over;
    };
    pr.oninput = upd;
    $$('.chip', perksEl).forEach((x) => (x.onclick = () => { x.classList.toggle('on'); upd(); }));
    upd();
    $('[data-send]', s.card).onclick = () => sendOffer(s, +pr.value, perks());
    $('[data-hold]', s.card).onclick = () => {
      if (s.held) return EB.toast('You can extend once per session');
      s.held = true; s.end += 5 * 60000; paint(s);
      bus.emit('deal:hold', { sid: s.data.sid, id: 'ergomax', minutes: 5 });
      chat.system(`${icon('clock')} Shopper #${s.data.sid} told you're preparing an offer (5 min)`);
    };
    $('[data-pass]', s.card).onclick = () => { s.status = 'passed'; s.statusText = 'You passed on this session.'; paint(s); bus.emit('deal:pass', { sid: s.data.sid, id: 'ergomax' }); };
  }

  async function sendOffer(s, price, perks) {
    s.rounds++; K.offers++;
    K.disc = +((K.disc * 20 + ((CATALOG[s.sku].price - price) / CATALOG[s.sku].price) * 100) / 21).toFixed(1);
    s.status = 'sent'; s.statusText = `${icon('send')} Offer sent: <b>${money(price, 0)}</b>${perks.length ? ' + ' + perks.join(' + ') : ''}. Waiting for the shopper… (round ${s.rounds} of 3)`;
    s.myPrice = price; paint(s); renderContext();
    if (s.real) bus.emit('deal:offer', { sid: s.data.sid, id: 'ergomax', price, perks });
    else {
      await sleep(4000 + Math.random() * 4000);
      const won = Math.random() < winProb(s, price, perks);
      settle(s, won, price);
    }
  }
  function settle(s, won, price) {
    if (won) { K.won++; K.rev += price; s.status = 'won'; s.statusText = `${icon('trophy')} <b>Won!</b> Shopper #${s.data.sid} bought at ${money(price, 0)}. Order sent to fulfilment; payout T+7 after delivery.`; EB.toast('🎉 Deal won'); }
    else { s.status = 'lost'; s.statusText = `Lost. The shopper chose another offer. ${s.beat ? `Winning price was about ${money(s.beat - 5, 0)}.` : ''} Tip: a bundle performs better than a deeper discount for this problem.`; }
    paint(s); renderContext();
  }

  const ours = (d) => d && d.items && d.items.some((i) => i.vendor === 'ErgoMax');
  bus.on('deal:session', (d) => ours(d) && upsertSession(d, { real: true }));
  bus.on('deal:board', (d) => ours(d) && sessions[d.sid] && upsertSession(d, { real: true }));
  bus.on('deal:request', (d) => { if (!ours(d)) return; upsertSession(d, { real: true, asked: true }); EB.setNav('live'); EB.view('chat'); });
  bus.on('deal:accepted', (d) => { const s = sessions[d.sid]; if (!s) return; settle(s, d.vendor === 'ErgoMax', d.price); });
  bus.on('presence:ping', () => bus.emit('presence:vendor', {}));
  bus.emit('presence:vendor', {});
  bus.emit('deal:sync', {});

  setInterval(() => $$('.timer[data-exp]').forEach((t) => (t.textContent = EB.mmss((+t.dataset.exp - Date.now()) / 1000))), 1000);

  /* simulated background traffic */
  const SIM = [
    { problem: 'Lower back pain · working from home', answers: { b: '$350+', h: '8+ h' }, intent: 91, items: [{ vendor: 'ErgoMax', id: 'ergomax', price: 329 }, { vendor: 'X', price: 349, offer: 309 }, { vendor: 'Y', price: 339 }] },
    { problem: 'Tailbone pain when sitting', answers: { b: 'Under $250' }, intent: 74, items: [{ vendor: 'ErgoMax', id: 'lite', price: 229 }, { vendor: 'X', price: 219 }, { vendor: 'Y', price: 199, offer: 189 }] },
    { problem: 'Feet don\'t reach the floor', answers: { b: 'Under $60' }, intent: 68, items: [{ vendor: 'ErgoMax', id: 'foot', price: 49 }, { vendor: 'X', price: 32 }] },
  ];
  let simI = 0;
  async function simulate() {
    const t = SIM[simI++ % SIM.length];
    const sid = Math.random().toString(36).slice(2, 5).toUpperCase();
    const s = upsertSession({ sid, ...t });
    s.sku = t.items[0].id; paint(s);
    if (simI === 2) { // show an auto-bid handling one on its own
      await sleep(2200);
      s.status = 'sent'; s.statusText = `${icon('spark')} <b>Auto-bid rule #2</b> answered instantly: ${money(215, 0)} + Free shipping. You can still override it.`; K.offers++; paint(s); renderContext();
      setTimeout(() => settle(s, true, 215), 7000);
    }
  }

  /* ---------- Buzz Feed: brand view, promotions & replies ---------- */
  const D = EB.data, BRAND = 'ErgoMax';
  let vf = 'Mentions';
  function feed() {
    const all = EB.feed.list();
    const mine = all.filter((p) => p.author_id === 'brand_ergomax');
    const mentions = all.filter((p) => p.vendor === BRAND && p.author_id !== 'brand_ergomax' && p.status === 'published');
    const avg = mentions.filter((p) => p.rating).reduce((a, p, _, arr) => a + p.rating / arr.length, 0);
    const imp = mine.reduce((a, p) => a + (+p.impressions || 0), 0), clk = mine.reduce((a, p) => a + (+p.clicks || 0), 0);
    const v = EB.view('feed', `<div class="feed-wrap">
      <div><h1 style="font-size:28px">Buzz Feed · ErgoMax</h1><div class="muted">See what shoppers say about you, reply as the brand, and run Sponsored promotions. Every promotion is ad-reviewed by eBuzz before it goes live.</div></div>
      ${EB.kpis([['Mentions', mentions.length], ['Avg rating', avg ? avg.toFixed(1) + '★' : '-'], ['Promo impressions', imp.toLocaleString()], ['Promo CTR', imp ? ((clk / imp) * 100).toFixed(1) + '%' : '-']])}
      <div class="card composer-card"><div class="card-title" style="margin-bottom:10px">${icon('megaphone')} Create a Sponsored promotion</div>
        <div class="grid2"><label class="field">Product<select data-sku><option value="ergomax" data-lp="329">ErgoMax Pro Lumbar ($329)</option><option value="lite" data-lp="229">ErgoMax Lite ($229)</option><option value="foot" data-lp="49">ErgoMax Footrest ($49)</option></select></label>
          <label class="field">Promo price ($)<input type="number" data-price value="299"></label></div>
        <label class="field" style="margin-top:10px">Message<textarea data-text>Working from home? Pro Lumbar's 4-way lumbar support + 12-year warranty. Feed-exclusive price this week.</textarea></label>
        <div class="grid2" style="margin-top:10px"><label class="field">Target problems<div class="chips" data-tg>${['Back pain', 'Posture', 'Tailbone pain', 'Standing desk'].map((t, i) => `<button class="chip ${i < 2 ? 'on' : ''}">${t}</button>`).join('')}</div></label>
          <label class="field">Daily budget ($)<input type="number" data-budget value="150"></label></div>
        <div class="row between wrap" style="margin-top:10px;gap:8px"><span class="muted" style="font-size:12.5px">Labelled "Sponsored" · contextual targeting only (no personal data) · price must respect your floor</span><button class="btn primary" data-submit>Submit for ad review</button></div></div>
      <div class="chips" data-filters>${['Mentions', 'My promotions', 'All posts'].map((f) => `<button class="chip ${f === vf ? 'on' : ''}" data-f="${f}">${f}</button>`).join('')}</div>
      <div class="feed-wrap" data-list style="max-width:none"></div></div>`);
    $$('[data-tg] .chip', v).forEach((c) => (c.onclick = () => c.classList.toggle('on')));
    $$('[data-f]', v).forEach((b) => (b.onclick = () => { vf = b.dataset.f; feed(); }));
    $('[data-submit]', v).onclick = async () => {
      const sel = $('[data-sku]', v), sku = sel.value, list = +sel.selectedOptions[0].dataset.lp, price = +$('[data-price]', v).value;
      if (CATALOG[sku] && price < CATALOG[sku].floor) return EB.toast(`Below your floor (${money(CATALOG[sku].floor, 0)}). Blocked by guardrail.`);
      if (price >= list) return EB.toast('Promo price must be below list price');
      const names = { ergomax: 'ErgoMax Pro Lumbar', lite: 'ErgoMax Lite', foot: 'ErgoMax Footrest' };
      const post = { id: D.id('fp'), author_id: 'brand_ergomax', author: BRAND, avatar: '🪑', kind: 'promo', text: $('[data-text]', v).value.trim(), rating: null, product: names[sku], sku, vendor: BRAND, emoji: sku === 'foot' ? '🦶' : '🪑', promo_price: price, list_price: list, cta: 'Get offer', sponsored: 1, status: 'pending', likes: 0, shares: 0, comments_json: '[]', mod_score: 0.05, mod_flags: '', impressions: 0, clicks: 0, targets: $$('[data-tg] .chip.on', v).map((c) => c.textContent).join(','), incentivized: 0, verified: 0, created_at: new Date().toISOString() };
      await D.put('feed_posts', post);
      EB.bus.emit('feed:promo', { id: post.id });
      EB.toast('Submitted. eBuzz ad review usually takes under 1 hour.');
      vf = 'My promotions'; feed();
    };
    const posts = vf === 'Mentions' ? mentions : vf === 'My promotions' ? mine : all.filter((p) => p.status === 'published');
    EB.feed.render($('[data-list]', v), { posts, ads: vf === 'All posts', cardOpts: { showStats: vf === 'My promotions', commentAs: { name: BRAND, brand: true }, refresh: () => feed() } });
  }

  /* ---------- other views ---------- */
  const RULES = [
    { on: true, name: 'Rank > #1 & intent ≥ 70', sku: 'ErgoMax Pro Lumbar', act: 'Match price to beat + $30, add lumbar pillow', floor: 279 },
    { on: true, name: 'Budget "Under $250" shoppers', sku: 'ErgoMax Lite', act: 'Up to 8% off + free shipping', floor: 199 },
    { on: false, name: 'Shopper asked for a deal, 2nd round', sku: 'All', act: 'Add +2-yr warranty instead of more discount', floor: '-' },
    { on: true, name: 'Low stock (< 20 units)', sku: 'All', act: 'Don\'t discount; perks only', floor: '-' },
  ];
  function rules() {
    const v = EB.view('rules', `<div class="row between wrap" style="margin-bottom:16px"><div><h1 style="font-size:28px">Auto-bid rules</h1><div class="muted">Your agent answers instantly within these rules. You step in only when you want to.</div></div><button class="btn primary" id="newRule">+ New rule</button></div>
      <div class="card">${EB.table(['On', 'When', 'Product', 'Then', 'Floor'], RULES.map((r, i) => [`<label class="toggle"><input type="checkbox" ${r.on ? 'checked' : ''} data-r="${i}"><span></span></label>`, `<b>${r.name}</b>`, r.sku, r.act, typeof r.floor === 'number' ? money(r.floor, 0) : r.floor]), { left: true })}</div>
      <div class="card ai-edge" style="margin-top:16px"><div class="card-title" style="margin-bottom:8px">${icon('spark')} Copilot suggestions from your last 30 days</div>
        <div class="stack" style="font-size:14px">
          <div class="row between wrap"><span>38% of your losses were by <b>less than $15</b>. Add a "+$15 flex" rule for high-intent shoppers → est. +9 wins/week.</span><button class="btn sm ai" data-add>Add rule</button></div>
          <div class="row between wrap"><span>For "sleep & back" shoppers, a <b>free pillow</b> wins more often than $20 off, and costs you $6.</span><button class="btn sm ai" data-add>Add rule</button></div></div></div>`);
    $$('[data-add]', v).forEach((b) => (b.onclick = () => { b.disabled = true; b.textContent = 'Added ✓'; RULES.push({ on: true, name: 'AI: high-intent, lost by < $15', sku: 'ErgoMax Pro Lumbar', act: 'Flex up to $15 more', floor: 279 }); EB.toast('Rule added (demo)'); }));
    $('#newRule', v).onclick = () => { const m = EB.modal(`<h3 style="margin-bottom:12px">New auto-bid rule</h3><div class="stack"><label class="field">Describe it in plain English<textarea rows="3">If a shopper asks for a deal and we're not #1, offer free shipping plus up to 6% off, never below $285.</textarea></label>${EB.aiNote('Copilot will turn this into: <b>when</b> asked_for_deal AND rank > 1 → <b>offer</b> free_shipping + discount ≤ 6% · <b>floor</b> $285')}<div class="row"><button class="btn primary" id="saveR">Create rule</button><button class="btn ghost" onclick="EB.closeOverlays()">Cancel</button></div></div>`); $('#saveR', m).onclick = () => { RULES.push({ on: true, name: 'Asked for deal & not #1', sku: 'All', act: 'Free shipping + ≤ 6% off', floor: 285 }); EB.closeOverlays(); rules(); EB.toast('Rule created'); }; };
  }

  function analytics() {
    const hours = [3, 5, 4, 7, 9, 12, 15, 11, 14, 18, 16, 10];
    EB.view('analytics', `<h1 style="font-size:28px;margin-bottom:16px">Win / Loss</h1>
      ${EB.kpis([['Sessions (30d)', '3,918'], ['Offers', '2,604'], ['Win rate', '36%', '+6 pts', 'up'], ['Avg discount', '7.4%', '−0.8 pts', 'up'], ['Won GMV', '$214k', '+22%', 'up']])}
      <div class="grid2" style="margin-top:16px">
        <div class="card"><div class="card-title" style="margin-bottom:10px">Sessions by hour (today)</div>${EB.bars(hours)}<div class="row between muted" style="font-size:11px;margin-top:4px"><span>8am</span><span>2pm</span><span>7pm</span></div></div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">Why you lost</div>${[['Price gap < $15', 38], ['Competitor had free shipping', 24], ['Shopper wanted a mesh back', 17], ['No response in time', 12], ['Other', 9]].map(([l, v]) => `<div style="margin:8px 0"><div class="row between" style="font-size:13px"><span>${l}</span><b>${v}%</b></div><div class="meter"><i style="width:${v * 2}%"></i></div></div>`).join('')}</div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">Discount vs. win rate</div>${EB.bars([12, 21, 33, 41, 44, 45], [3])}<div class="row between muted" style="font-size:11px;margin-top:4px"><span>0%</span><span>3%</span><span>6%</span><span>9%</span><span>12%</span><span>15%</span></div><p class="muted" style="font-size:13px;margin:8px 0 0">Returns flatten after ~9%. Deeper discounts mostly give away margin.</p></div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">Problem Radar (Pro)</div>${EB.table(['Rising problem', 'Growth'], [['Tailbone pain when sitting', '<span class="up">+64%</span>'], ['Standing desk leg fatigue', '<span class="up">+41%</span>'], ['Neck pain from laptops', '<span class="up">+33%</span>']], { right: [1] })}</div>
      </div>`);
  }

  function boost() {
    EB.view('boost', `<h1 style="font-size:28px;margin-bottom:6px">Deal Boost</h1><p class="muted" style="margin-top:0">Pay to highlight your offer when you're in a shortlist. Boosted offers are always labelled "Sponsored". Ranking by fit doesn't change.</p>
      <div class="grid2"><div class="card"><div class="stack">
        <label class="field">Daily budget <b id="bv">$150</b><input type="range" min="0" max="1000" step="10" value="150" id="br"></label>
        <label class="field">Max cost per boosted view<input type="number" value="0.40" step="0.05"></label>
        <label class="field">Boost only for problems<div class="chips"><button class="chip on">Back pain</button><button class="chip on">Tailbone pain</button><button class="chip">Posture</button><button class="chip">Standing desk</button></div></label>
        <div class="set-row"><div>Boost status<small>Spent $61.20 of $150 today</small></div><label class="toggle"><input type="checkbox" checked><span></span></label></div></div></div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">Shopper preview</div><div class="offer"><div class="avatar v">E</div><div class="o-main"><div class="o-title">ErgoMax: Pro Lumbar <span class="tag">Sponsored</span></div><div class="o-sub">Save $50 · Free shipping · Free lumbar pillow</div></div><div class="o-price">$279</div></div>
        <div class="kpis" style="margin-top:14px">${[['Boosted views', '1,204'], ['Boost win rate', '41%'], ['Cost / win', '$9.80']].map((k) => `<div class="kpi"><div class="l">${k[0]}</div><div class="v">${k[1]}</div></div>`).join('')}</div></div></div>`);
    $('#br').oninput = (e) => ($('#bv').textContent = '$' + e.target.value);
  }

  chat.onText = (t) => {
    const s = t.toLowerCase();
    if (/rule/.test(s)) { chat.bot('Opening your auto-bid rules. I added two suggestions based on last month.'); return setTimeout(() => { EB.setNav('rules'); rules(); }, 700); }
    if (/los|why|win/.test(s)) return chat.bot([`Over the last 30 days you lost <b>64%</b> of sessions. The main reason: <b>price gap under $15</b> (38% of losses). You won 2.1× more often when you added a lumbar pillow than when you gave the same value as a discount.`, h(`<div class="row"><button class="btn sm ai">Create "+$15 flex" rule</button><button class="btn sm">See Win / Loss</button></div>`)]).then((b) => { const bs = $$('button', b); bs[0].onclick = () => { EB.toast('Rule added (demo)'); }; bs[1].onclick = () => { EB.setNav('analytics'); analytics(); }; });
    if (/feed|promo|post|review|mention/.test(s)) { chat.bot('Opening the Buzz Feed: mentions of ErgoMax, your promotions and the promotion builder.'); return setTimeout(() => { EB.setNav('feed'); feed(); }, 500); }
    if (/boost|sponsor/.test(s)) return chat.bot('Deal Boost is spending $61 of $150 today with a 41% win rate on boosted views. Open the <b>Boost</b> tab to change it.');
    chat.bot('I can explain losses, draft auto-bid rules, suggest offers for open sessions, or change your Boost budget. Try "why are we losing?"');
  };

  renderContext();
  D.init({ persona: 'vendor', seed: async (t) => { if (t.includes('feed_posts')) await EB.feed.seed(); } }).then(async () => {
    await EB.feed.seed();
    EB.bindSyncChip();
    D.on((e) => { if (e.type === 'remote' && $('.view.on') && $('.view.on').dataset.view === 'feed') feed(); });
  });
  EB.bus.on('feed:post', (m) => { const p = D.get('feed_posts', m.id); if (p && p.vendor === BRAND && m.status === 'published') EB.toast(`💬 New shopper post mentions ${BRAND}`); });
  chat.bot([`<h2 style="font-size:24px;margin-bottom:6px">Deal Room</h2><p>Good morning, Jordan. <b>${K.sessions}</b> shopper sessions have shortlisted ErgoMax today. Auto-bid handled 71% of them. I'll bring you the ones worth a human look.</p>`, EB.aiNote('Open the <a href="customer.html" target="_blank"><b>Shopper portal</b></a> in a second tab to watch a real shopper → vendor negotiation happen live between the two tabs.')], { delay: 300 });
  EB.setSuggest([{ label: '📉 Why are we losing?', ai: true }, { label: '⚙️ Create an auto-bid rule' }, { label: '📣 How is Boost doing?' }, { label: '💬 What are shoppers posting about us?' }], (c) => { chat.user(c.label); chat.onText(c.label); });
  setTimeout(simulate, 2500);
  setTimeout(simulate, 14000);
  setTimeout(simulate, 32000);
})();
