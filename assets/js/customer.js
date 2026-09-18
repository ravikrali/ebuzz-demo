/* eBuzz.ai: Customer (Shopper) portal prototype */
(function () {
  const { h, $, $$, money, sleep, icon, bus } = EB;

  /* ---------------- data ---------------- */
  const PROBLEMS = {
    back: {
      title: 'Lower back pain · working from home',
      short: 'Back pain · WFH',
      intro: "Sorry to hear that. Back pain from desk work is really common, and usually fixable. Three quick questions so I don't waste your time:",
      questions: [
        ['Budget for a chair', ['Under $150', '$150–350', '$350+'], 1],
        ['Your desk', ['Fixed height', 'Standing desk'], 0],
        ['Hours sitting / day', ['4–6 h', '8+ h'], 1],
      ],
      plan: [
        ['Support the lower back', 'A chair with <u>adjustable</u> lumbar support. It matters more than price. (Step 1: your shortlist below)'],
        ['Screen at eye level', 'A monitor riser stops you leaning forward. It\'s cheap and makes a big difference.'],
        ['Move every 45 minutes', 'Free: I can remind you through eBuzz notifications. No purchase needed.'],
      ],
      evidence: 'Based on 14,200 verified reviews, 3 physiotherapy guides and return-rate data.',
      items: [
        { id: 'ergomax', name: 'ErgoMax Pro Lumbar', vendor: 'ErgoMax', price: 329, rating: 4.7, reviews: 3120, e: '🪑', c: '', why: 'Most adjustable lumbar (4-way). Lowest return rate for back pain.', tags: ['Adjustable lumbar', '4D armrests', 'Mesh back', '12-yr warranty'] },
        { id: 'chairco', name: 'ChairCo Flex Mesh', vendor: 'ChairCo', price: 289, rating: 4.5, reviews: 5480, e: '💺', c: 'v', why: 'Coolest for 8+ h days. Lumbar is adjustable in height only.', tags: ['Adjustable lumbar', 'Mesh back', '30-day returns'] },
        { id: 'sitwell', name: 'Sitwell Aria', vendor: 'Sitwell Home', price: 259, rating: 4.4, reviews: 1910, e: '🪑', c: 'g', why: 'Best value. Firm cushion, good for shorter people (5\'0"–5\'9").', tags: ['Adjustable lumbar', 'Firm seat', '60-day returns'] },
      ],
      more: [
        { id: 'posturo', name: 'Posturo Air', vendor: 'Posturo', price: 219, rating: 4.2, reviews: 880, e: '🪑', c: 'b', why: 'Budget pick with fixed lumbar.' },
        { id: 'kinetic', name: 'Kinetic K2', vendor: 'Kinetic', price: 349, rating: 4.6, reviews: 2210, e: '💺', c: '', why: 'Best for tall users (6\'1"+).' },
        { id: 'nook', name: 'Nook Task Chair', vendor: 'Nook & Co', price: 179, rating: 4.1, reviews: 640, e: '🪑', c: 'v', why: 'Small spaces; armless.' },
        { id: 'backbuddy', name: 'BackBuddy Lumbar Cushion', vendor: 'BackBuddy', price: 39, rating: 4.3, reviews: 9120, e: '🎗️', c: 'g', why: 'Adds support to a chair you already own.' },
        { id: 'riser1', name: 'Lift Monitor Riser', vendor: 'DeskLab', price: 45, rating: 4.6, reviews: 4300, e: '🖥️', c: 'b', why: 'Step 2 of your plan. 3 heights.' },
        { id: 'foot', name: 'Rocker Footrest', vendor: 'DeskLab', price: 32, rating: 4.4, reviews: 2100, e: '🦶', c: '', why: 'Helps if your feet don\'t reach the floor.' },
      ],
    },
    sleep: {
      title: "Can't sleep · bright & noisy bedroom",
      short: 'Sleep · light & noise',
      intro: 'Let\'s fix your sleep environment. A couple of quick questions:',
      questions: [
        ['What wakes you up?', ['Street light', 'Noise', 'Both'], 2],
        ['Budget for the whole fix', ['Under $75', '$75–150', '$150+'], 1],
      ],
      plan: [
        ['Block the light', 'Blackout curtains that fit edge to edge (most people buy them too narrow).'],
        ['Mask the noise', 'A white-noise machine with real fan sound, not a looped recording.'],
        ['Backup for travel', 'A contoured sleep mask for nights away.'],
      ],
      evidence: 'Based on 9,800 reviews and sleep-clinic guidance on light and noise.',
      items: [
        { id: 'luna', name: 'LunaDark Thermal Blackout (2 panels)', vendor: 'LunaDark', price: 49, rating: 4.6, reviews: 12040, e: '🌙', c: 'v', why: 'Blocks 99% of light; measure the window + 8" each side.', tags: ['100% blackout', 'Thermal'] },
        { id: 'hush', name: 'Hushly Fan White-Noise Machine', vendor: 'Hushly', price: 39, rating: 4.5, reviews: 6710, e: '🔊', c: 'b', why: 'Real fan, 20 sound levels, no loop gap.', tags: ['Real fan', 'No looping'] },
        { id: 'drift', name: 'Drift Contour Sleep Mask', vendor: 'Drift', price: 19, rating: 4.4, reviews: 3300, e: '😴', c: 'g', why: 'Doesn\'t press on eyelids.', tags: ['Contoured', 'Washable'] },
      ],
      more: [
        { id: 'luna2', name: 'LunaDark Blackout Liner', vendor: 'LunaDark', price: 29, rating: 4.3, reviews: 2100, e: '🌙', c: 'v', why: 'Adds blackout to your existing curtains.' },
        { id: 'snooz', name: 'CalmTone Speaker', vendor: 'CalmTone', price: 59, rating: 4.2, reviews: 900, e: '🔊', c: '', why: 'Bluetooth + sleep sounds.' },
      ],
    },
    pet: {
      title: 'Dog destroys every toy',
      short: 'Pet · heavy chewer',
      intro: 'Ha, a power chewer! A few quick questions:',
      questions: [
        ['Dog size', ['Small', 'Medium', 'Large'], 2],
        ['Chewing style', ['Shreds plush', 'Crushes rubber', 'Everything'], 2],
      ],
      plan: [
        ['Use toys built for power chewers', 'Natural rubber or nylon, rated for large breeds.'],
        ['Make them work for food', 'Puzzle feeders tire dogs out mentally, which reduces destructive chewing.'],
        ['Rotate toys every few days', 'Novelty keeps interest high. Free tip, no purchase needed.'],
      ],
      evidence: 'Based on 21,000 reviews filtered for large breeds.',
      items: [
        { id: 'tuff', name: 'TuffRoot Rubber Chew', vendor: 'TuffRoot', price: 18, rating: 4.7, reviews: 15200, e: '🦴', c: '', why: 'Natural rubber. Replaced free if destroyed in 90 days.', tags: ['Power-chewer rated'] },
        { id: 'puzzle', name: 'BrainyPup Puzzle Feeder L3', vendor: 'BrainyPup', price: 34, rating: 4.5, reviews: 4100, e: '🧩', c: 'v', why: 'Level-3 difficulty for smart breeds.', tags: ['Dishwasher safe'] },
        { id: 'rope', name: 'KnotKing Mega Rope', vendor: 'KnotKing', price: 22, rating: 4.3, reviews: 2800, e: '🪢', c: 'g', why: 'For tug. Cotton-poly, flosses teeth.', tags: ['Large breed'] },
      ],
      more: [{ id: 'nylon', name: 'NyloBone Max', vendor: 'Nylo', price: 16, rating: 4.4, reviews: 7000, e: '🦴', c: 'b', why: 'Budget nylon chew.' }],
    },
  };
  const RISERS = [
    { id: 'riser1', name: 'Lift Monitor Riser', vendor: 'DeskLab', price: 45, rating: 4.6, reviews: 4300, e: '🖥️', c: 'b', why: '3 heights, bamboo, fits 2 monitors.' },
    { id: 'arm', name: 'Arcus Single Monitor Arm', vendor: 'Arcus', price: 79, rating: 4.5, reviews: 2650, e: '🖥️', c: 'v', why: 'Full height + depth adjust. Frees desk space.' },
  ];

  const S = {
    wallet: EB.sstore.get('eb-wallet', 3.4),
    history: EB.sstore.get('eb-wallet-h', [
      { d: 'Sep 16', t: 'Buzz Crush: Level win', a: 0.5 },
      { d: 'Sep 14', t: 'Memory Flip: Perfect round', a: 0.25 },
      { d: 'Sep 12', t: 'Referral bonus (Sam)', a: 5 },
      { d: 'Sep 10', t: 'Used on order #EB-20481', a: -2.35 },
    ]),
    autoApply: true,
    problem: null, answers: {}, offers: {}, sid: null, dealOpen: false, asked: 0,
    vendorOnline: false, orders: EB.sstore.get('eb-orders', []),
    plays: EB.sstore.get('eb-plays', 5), points: 1240,
  };
  const saveWallet = () => { EB.sstore.set('eb-wallet', S.wallet); EB.sstore.set('eb-wallet-h', S.history); };
  const allItems = () => (S.problem ? [...PROBLEMS[S.problem].items, ...PROBLEMS[S.problem].more, ...(S.problem === 'back' ? RISERS : [])] : []);
  const find = (id) => allItems().find((i) => i.id === id);
  const eff = (it) => (S.offers[it.id] ? S.offers[it.id].price : it.price);

  /* ---------------- shell ---------------- */
  const chat = EB.shell({
    persona: 'customer',
    user: { name: 'Maya R.', role: `Wallet ${money(S.wallet)}`, initials: 'MR' },
    rail: [
      { id: 'chat', label: 'Concierge', icon: 'chat' },
      { id: 'play', label: 'Play & Win', icon: 'play', badge: 'NEW' },
      { id: 'wallet', label: 'Wallet', icon: 'wallet' },
      { id: 'orders', label: 'Orders', icon: 'box' },
      { id: 'account', label: 'Account', icon: 'user' },
    ],
    placeholder: 'Describe a problem, or what you\'re looking for…',
    note: 'eBuzz Concierge is an AI. Offers from vendors are personalised to this session and labelled. Sponsored items are always marked.',
    onNav: nav,
  });
  EB.setNav('chat');
  const updWalletChip = () => { const u = $('.user-chip .muted'); if (u) u.textContent = `Wallet ${money(S.wallet)}`; };

  function nav(id) {
    if (id === 'chat') EB.view('chat');
    if (id === 'play') renderPlay();
    if (id === 'wallet') renderWallet();
    if (id === 'orders') renderOrders();
    if (id === 'account') renderAccount();
  }

  /* ---------------- context panel ---------------- */
  function renderContext() {
    const P = S.problem && PROBLEMS[S.problem];
    const offers = Object.entries(S.offers);
    const ctx = $('#context');
    ctx.innerHTML = `
      <div class="ctx-section">
        <div class="row between"><h4 style="margin:0">Current context</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
        ${P ? `<div class="ctx-title" style="margin-top:8px">${P.title}</div>
          <div class="chips" style="margin-top:10px">${Object.values(S.answers).map((a) => `<span class="tag honey">${a}</span>`).join('')}</div>`
          : `<p class="muted" style="margin:8px 0 0">Tell the Concierge what you're trying to solve. Filters and options will show up here, only the ones that matter for your problem.</p>`}
      </div>
      ${P ? `
      <div class="ctx-section">
        <h4>Price range <span class="num" id="rangeLbl">up to ${money(S.maxPrice || 350, 0)}</span></h4>
        <input type="range" min="20" max="400" step="5" value="${S.maxPrice || 350}" id="range" aria-label="Maximum price">
        <h4 style="margin-top:14px">Must-haves</h4>
        <div class="chips" id="must">${[...new Set(P.items.flatMap((i) => i.tags || []))].slice(0, 6).map((t, i) => `<button class="chip ${i === 0 ? 'on' : ''}">${t}</button>`).join('')}</div>
        <button class="btn block" style="margin-top:14px" id="browseBtn">${icon('search')} Browse this context only (${allItems().length})</button>
      </div>
      <div class="ctx-section">
        <h4>Live offers <span class="tag ${S.dealOpen ? 'green' : ''}">${S.dealOpen ? '<i class="dot live"></i> Deal Room open' : 'Closed'}</span></h4>
        ${offers.length ? `<div class="offer-list">${offers.map(([id, o]) => `<div class="offer"><div class="o-main"><div class="o-title">${find(id).vendor}</div><div class="o-sub">${o.perks.join(' · ') || 'Price offer'}</div></div><div><div class="o-price">${money(o.price, 0)}</div><div class="timer" data-exp="${o.exp}"></div></div></div>`).join('')}</div>` : '<p class="muted" style="margin:0;font-size:13.5px">No offers yet. Vendors can send offers while you decide.</p>'}
        <button class="btn primary block" style="margin-top:12px" id="askBtn2">${icon('bolt')} Ask for a better deal</button>
      </div>` : ''}
      <div class="ctx-section">
        <h4>Wallet</h4>
        <div class="row between"><div><div class="ctx-title num">${money(S.wallet)}</div><div class="muted" style="font-size:12.5px">Game credits · auto-applied at checkout</div></div><button class="btn sm" onclick="EB.setNav('play');document.querySelector('[data-nav=play]').click()">${icon('play')} Play</button></div>
      </div>
      <div class="ctx-section">
        <h4>Honest AI</h4>
        <div style="font-size:13px" class="stack">
          <div class="row">${icon('check')}<span>Ranked by fit for <i>your</i> problem, not by ad spend</span></div>
          <div class="row">${icon('check')}<span>Sponsored items in this shortlist: <b>0</b></span></div>
          <div class="row">${icon('check')}<span>Offers are personalised to this session and expire</span></div>
        </div>
      </div>`;
    const r = $('#range');
    if (r) r.oninput = () => { S.maxPrice = +r.value; $('#rangeLbl').textContent = 'up to ' + money(r.value, 0); };
    $$('#must .chip').forEach((c) => (c.onclick = () => c.classList.toggle('on')));
    const b = $('#browseBtn'); if (b) b.onclick = browse;
    const a = $('#askBtn2'); if (a) a.onclick = () => { EB.closeOverlays(); EB.view('chat'); EB.setNav('chat'); askDeal(); };
  }

  /* ---------------- product cards ---------------- */
  function productCard(it, { compact = false } = {}) {
    const o = S.offers[it.id];
    const el = h(`<div class="product" data-pid="${it.id}">
      <div class="img ${it.c}">${it.e}</div>
      <div class="corner"></div>
      <div class="info">
        <div class="name">${it.name}</div>
        <div class="vendor">${it.vendor} · <span class="stars">★</span> ${it.rating} (${it.reviews.toLocaleString()})</div>
        <div class="price"></div>
        ${compact ? '' : `<div class="why"><b>Why:</b> ${it.why}</div>`}
        <div class="actions"><button class="btn sm primary" data-act="buy">Buy</button><button class="btn sm" data-act="details">Details</button></div>
      </div></div>`);
    paintCard(el, it);
    el.querySelector('[data-act=buy]').onclick = () => checkout(it);
    el.querySelector('[data-act=details]').onclick = () => details(it);
    return el;
  }
  function paintCard(el, it) {
    const o = S.offers[it.id];
    $('.price', el).innerHTML = o ? `<b>${money(o.price, 0)}</b><s>${money(it.price, 0)}</s><span class="tag green">−${money(it.price - o.price, 0)}</span>` : `<b>${money(it.price, 0)}</b>`;
    $('.corner', el).innerHTML = o ? `<span class="tag honey">${icon('bolt')} Live offer</span>` : '';
  }
  const repaintAll = () => { $$('.product[data-pid]').forEach((el) => { const it = find(el.dataset.pid); if (it) paintCard(el, it); }); markBest(); };
  function markBest() {
    if (!S.problem) return;
    const items = PROBLEMS[S.problem].items;
    if (S.problem !== 'back') return; // "best deal" only meaningful when comparing substitutes
    const best = items.reduce((a, b) => (eff(a) <= eff(b) ? a : b));
    $$('.product[data-pid]').forEach((el) => el.classList.toggle('best', Object.keys(S.offers).length > 0 && el.dataset.pid === best.id));
  }

  function details(it) {
    const body = EB.drawer(it.name, `${it.vendor} · ★ ${it.rating} · ${it.reviews.toLocaleString()} reviews`, `
      <div class="product" style="border:0"><div class="img ${it.c}" style="font-size:90px;border-radius:14px">${it.e}</div></div>
      <div class="stack" style="margin-top:16px">
        ${EB.aiNote(`<b>Review summary (AI):</b> People with back pain praise the ${it.tags ? it.tags[0].toLowerCase() : 'support'}. The most common complaint is assembly time (~25 min). 4% return rate, below the category's 7%.`)}
        <div class="card flat"><div class="card-title" style="margin-bottom:8px">Fit for your problem</div>
          ${[['Lumbar support', 92], ['Comfort for 8+ h', 84], ['Value for money', 71]].map(([l, v]) => `<div style="margin:8px 0"><div class="row between" style="font-size:13px"><span>${l}</span><b>${v}</b></div><div class="meter g"><i style="width:${v}%"></i></div></div>`).join('')}
        </div>
        <div class="card flat"><div class="card-title" style="margin-bottom:6px">Delivery & returns</div><div class="muted" style="font-size:14px">Ships from ${it.vendor} in 1–2 days · Free returns within 30 days · Sold by ${it.vendor}, a verified eBuzz seller</div></div>
        <button class="btn primary block" id="dBuy">Buy for ${money(eff(it), 0)}</button>
      </div>`);
    $('#dBuy', body).onclick = () => { EB.closeOverlays(); checkout(it); };
  }

  function browse() {
    const P = PROBLEMS[S.problem];
    const max = S.maxPrice || 400;
    const list = allItems().filter((i) => i.price <= max);
    const body = EB.drawer(`Browse: ${P.short}`, `Only items that solve <b>${P.title.toLowerCase()}</b> · ${list.length} results · up to ${money(max, 0)}`, `
      <div class="chips" style="margin-bottom:14px"><span class="tag honey">${P.short}</span>${Object.values(S.answers).map((a) => `<span class="tag">${a}</span>`).join('')}<span class="tag">≤ ${money(max, 0)}</span></div>
      <div class="products" id="brGrid"></div>
      <p class="muted" style="font-size:12.5px;margin-top:16px">eBuzz doesn't show an endless catalog. Browsing is limited to your current problem. Start a new chat to explore something else.</p>`);
    list.forEach((it) => $('#brGrid', body).append(productCard(it, { compact: true })));
  }

  /* ---------------- conversation ---------------- */
  const welcomeChips = [
    { label: '😣 My back hurts after working from home', go: 'back' },
    { label: '🌙 I can\'t sleep, my room is too bright & noisy', go: 'sleep' },
    { label: '🐕 My dog destroys every toy', go: 'pet' },
    { label: '🎮 Play a quick game to win credits', go: 'play' },
    { label: '💰 What\'s in my wallet?', go: 'wallet' },
  ];
  function suggestDefault() {
    if (!S.problem) return EB.setSuggest(welcomeChips, (c) => route(c.label, c.go));
    const s = [{ label: '⚡ Ask for a better deal', go: 'deal' }, { label: '🔎 Browse this context', go: 'browse' }];
    if (S.problem === 'back') s.push({ label: '🖥️ Also show monitor risers', go: 'risers' });
    s.push({ label: '⚖️ Compare side by side', go: 'compare', ai: true }, { label: '🆕 Different problem', go: 'reset' });
    EB.setSuggest(s, (c) => route(c.label, c.go));
  }

  function route(label, go) {
    if (label) chat.user(label);
    ({
      back: () => startProblem('back'), sleep: () => startProblem('sleep'), pet: () => startProblem('pet'),
      play: () => { chat.bot('Opening <b>Play & Win</b>. Good luck! 🍯'); setTimeout(() => { EB.setNav('play'); renderPlay(); }, 900); },
      wallet: () => chat.bot(`You have <b>${money(S.wallet)}</b> in game credits. They're applied automatically at checkout (up to 10% of an order). <a href="#" onclick="document.querySelector('[data-nav=wallet]').click();return false">Open wallet →</a>`),
      deal: askDeal, browse: () => { browse(); chat.bot('Opened the browse drawer, filtered to your problem only.'); },
      risers: showRisers, compare: compare,
      reset: () => { S.problem = null; S.offers = {}; S.dealOpen = false; S.answers = {}; renderContext(); chat.bot('Sure. What else can I help you solve?'); suggestDefault(); },
    }[go] || (() => {}))();
  }

  chat.onText = (t) => {
    const s = t.toLowerCase();
    if (/back|chair|posture|desk|lumbar/.test(s)) return startProblem('back');
    if (/sleep|bright|noise|noisy|insomnia|curtain/.test(s)) return startProblem('sleep');
    if (/dog|puppy|chew|pet/.test(s)) return startProblem('pet');
    if (/discount|deal|cheaper|lower|offer|price/.test(s)) return askDeal();
    if (/riser|monitor|screen/.test(s) && S.problem === 'back') return showRisers();
    if (/compare|difference|vs/.test(s)) return compare();
    if (/game|play|win/.test(s)) return route(null, 'play');
    if (/wallet|credit|balance/.test(s)) return route(null, 'wallet');
    if (/track|order|where/.test(s)) return chat.bot(S.orders.length ? `Your latest order <b>${S.orders[0].id}</b> is <b>${S.orders[0].status}</b>. The Track Shipping agent will message you if anything changes.` : "You don't have any open orders. Once you buy, I'll track it here and warn you about delays.");
    if (/return|refund/.test(s)) return chat.bot('I can start a return for any order within its return window. The Returns agent will make a prepaid label and refund you when the carrier scans it. (Demo)');
    chat.bot(`I'm a prototype, so I know a few problems in depth right now. Try one of these, or just describe what's going on in your own words.`);
    EB.setSuggest(welcomeChips, (c) => route(c.label, c.go));
  };

  async function startProblem(key) {
    S.problem = key; S.offers = {}; S.answers = {}; S.dealOpen = false; S.maxPrice = key === 'back' ? 350 : 150;
    S.sid = Math.random().toString(36).slice(2, 5).toUpperCase();
    const P = PROBLEMS[key];
    renderContext();
    const q = h(`<div class="card"><div class="stack" style="gap:14px">${P.questions.map(([l, opts, def], qi) => `
      <div><div style="font-size:13px;font-weight:700;margin-bottom:7px">${l}</div>
      <div class="chips" data-q="${qi}">${opts.map((o, i) => `<button class="chip ${i === def ? 'on' : ''}">${o}</button>`).join('')}</div></div>`).join('')}
      <div class="row wrap"><button class="btn primary" id="planBtn">Show my plan</button><button class="btn ghost" id="skipBtn">Skip, use my saved preferences</button></div></div></div>`);
    $$('[data-q]', q).forEach((g) => $$('.chip', g).forEach((c) => (c.onclick = () => { $$('.chip', g).forEach((x) => x.classList.remove('on')); c.classList.add('on'); })));
    await chat.bot([P.intro, q]);
    EB.setSuggest([], () => {});
    const go = () => {
      P.questions.forEach(([l], qi) => (S.answers[l] = $(`[data-q="${qi}"] .chip.on`, q).textContent));
      $$('button', q).forEach((b) => (b.disabled = true));
      chat.user(Object.values(S.answers).join(' · '));
      showPlan();
    };
    $('#planBtn', q).onclick = go; $('#skipBtn', q).onclick = go;
  }

  async function showPlan() {
    const P = PROBLEMS[S.problem];
    renderContext();
    const plan = h(`<div class="card honey-edge"><div class="card-head"><div class="card-title">${icon('target')} Your ${P.plan.length}-step fix</div><span class="tag violet">${icon('spark')} AI plan</span></div>
      <div class="plan-steps">${P.plan.map(([a, b]) => `<div class="plan-step"><div><b>${a}</b><span>${b}</span></div></div>`).join('')}</div>
      <div class="card-sub" style="margin-top:12px">${P.evidence} <a href="#" class="why-link">How I ranked these</a></div></div>`);
    $('.why-link', plan).onclick = (e) => { e.preventDefault(); EB.modal(`<h3>How the Concierge ranks products</h3><ol style="padding-left:18px;line-height:1.7"><li>Fit for your stated problem & answers (45%)</li><li>Verified review sentiment for people with the same problem (25%)</li><li>Return & defect rates (15%)</li><li>Price vs. value in your budget (15%)</li></ol><p class="muted">Vendor ad spend is <b>not</b> a ranking factor. Sponsored items appear separately and are labelled "Sponsored".</p><button class="btn primary" onclick="EB.closeOverlays()">Got it</button>`); };
    await chat.bot(['Here\'s what I\'d do, in order of impact:', plan], { delay: 1100 });
    const grid = h('<div class="products"></div>');
    P.items.forEach((it) => grid.append(productCard(it)));
    const live = h(`<div class="row wrap" style="gap:8px"><span class="tag green"><i class="dot live"></i> Deal Room open</span><span class="muted" style="font-size:13px">These ${P.items.length} vendors can send you private offers for the next 15 minutes. You can also ask them for a better deal.</span></div>`);
    const askB = h(`<div class="row wrap"><button class="btn primary">${icon('bolt')} Ask for a better deal</button><button class="btn">${icon('search')} See more like this</button></div>`);
    askB.children[0].onclick = () => { chat.user('Can I get a better deal?'); askDeal(); };
    askB.children[1].onclick = browse;
    await chat.bot([S.problem === 'back' ? '<b>Step 1: your chair shortlist.</b> All three have adjustable lumbar support and fit your budget:' : '<b>Your shortlist</b>. Together these solve it:', grid, live, askB], { delay: 900 });
    S.dealOpen = true; renderContext(); suggestDefault();
    bus.emit('deal:session', sessionPayload());
    // a vendor reacts on its own (auto-bid rule) a few seconds later
    setTimeout(() => {
      const it = P.items[1];
      if (!S.offers[it.id] && S.problem) receiveOffer({ sid: S.sid, id: it.id, price: it.price - (S.problem === 'back' ? 20 : 4), perks: ['Free shipping'], note: 'auto-bid', proactive: true });
    }, 4200);
  }

  function sessionPayload() {
    const P = PROBLEMS[S.problem];
    return { sid: S.sid, problem: P.title, answers: S.answers, intent: 86, items: P.items.map((i) => ({ id: i.id, vendor: i.vendor, name: i.name, price: i.price, offer: S.offers[i.id] ? S.offers[i.id].price : null })) };
  }

  async function showRisers() {
    const grid = h('<div class="products"></div>');
    RISERS.forEach((it) => grid.append(productCard(it)));
    await chat.bot(['<b>Step 2: screen at eye level.</b> The top of your screen should be at or slightly below eye height:', grid]);
  }

  async function compare() {
    if (!S.problem) return chat.bot('Tell me the problem first and I\'ll compare the best options.');
    const items = PROBLEMS[S.problem].items;
    const rows = items.map((i) => [`<b>${i.name}</b><div class="muted" style="font-size:12px">${i.vendor}</div>`, money(eff(i), 0) + (S.offers[i.id] ? ' <span class="tag green">offer</span>' : ''), '★ ' + i.rating, (i.tags || []).slice(0, 2).join(', '), i.why]);
    await chat.bot(['Side by side, with live offers included:', h(EB.table(['Product', 'Price', 'Rating', 'Key features', 'Best for'], rows, { left: true })), EB.aiNote(S.problem === 'back' ? 'If lower-back support is your top priority, <b>ErgoMax</b> is worth the extra. If you run warm or sit 8+ hours, <b>ChairCo</b>. Tightest budget: <b>Sitwell</b>.' : 'Buy them together. Each one fixes a different part of the problem.')]);
  }

  /* ---------------- Deal Room (shopper side) ---------------- */
  let dealCard = null;
  async function askDeal() {
    if (!S.problem || !S.dealOpen) return chat.bot('Deals open once you have a shortlist. Tell me what you\'re trying to solve first.');
    if (S.asked >= 3) return chat.bot('You\'ve used your 3 deal requests for today. Vendors can still send you offers on their own.');
    S.asked++;
    const P = PROBLEMS[S.problem];
    dealCard = h(`<div class="card honey-edge"><div class="card-head"><div class="card-title">${icon('bolt')} Deal request sent</div><span class="tag">${3 - S.asked} of 3 requests left today</span></div>
      <div id="dealRows">${P.items.map((i) => `<div class="status-row" data-v="${i.id}"><span class="s-name">${i.vendor}</span><span class="s-text muted">Notified…</span><span class="s-meta"></span></div>`).join('')}</div>
      <div class="card-sub" style="margin-top:10px">Keep chatting while they respond. I'll tell you when offers arrive. Vendors only see your problem and budget band, never your name.</div></div>`);
    await chat.bot(['Asking the vendors now. Most reply in under 2 minutes. ⚡', dealCard], { delay: 500 });
    bus.emit('deal:request', sessionPayload());
    // simulated responses (ErgoMax waits for a real vendor if the Deal Room tab is open)
    const [a, b, c] = P.items;
    setTimeout(() => setStatus(c.id, 'Replied instantly (auto-bid)'), 900);
    setTimeout(() => receiveOffer({ sid: S.sid, id: c.id, price: c.price - Math.round(c.price * 0.08), perks: [], note: 'auto' }), 1300);
    setTimeout(() => { setStatus(b.id, 'Replied'); receiveOffer({ sid: S.sid, id: b.id, price: Math.min(eff(b), b.price - Math.round(b.price * 0.1)), perks: ['Free shipping', '2-yr warranty'] }); }, 5200);
    if (a.vendor === 'ErgoMax' && S.vendorOnline) {
      setStatus(a.id, 'Notified. A person is reviewing it in the Deal Room', 'live');
    } else {
      setTimeout(() => holdFrom(a.id, 5), 2600);
      setTimeout(() => { if (!S.offers[a.id] || S.offers[a.id].price > a.price - 40) receiveOffer({ sid: S.sid, id: a.id, price: a.price - Math.round(a.price * 0.12), perks: ['Free shipping', 'Free lumbar pillow'] }); }, 16000);
    }
  }
  function setStatus(id, text, cls = '') {
    const row = dealCard && $(`[data-v="${id}"]`, dealCard); if (!row) return;
    $('.s-text', row).innerHTML = cls === 'live' ? `<i class="dot live" style="color:var(--green)"></i> ${text}` : text;
    $('.s-text', row).classList.toggle('muted', false);
  }
  function holdFrom(id, minutes) {
    const it = find(id); if (!it) return;
    const end = Date.now() + minutes * 60000;
    setStatus(id, `Asked for ${minutes} min ⏳ <span class="timer" data-exp="${end}"></span>`);
    chat.system(`${icon('clock')} ${it.vendor} asked for ${minutes} minutes to prepare an offer`);
  }
  function receiveOffer(o) {
    if (o.sid && o.sid !== S.sid) return;
    const it = find(o.id); if (!it) return;
    const prev = S.offers[o.id];
    S.offers[o.id] = { price: o.price, perks: o.perks || [], exp: Date.now() + 15 * 60000 };
    setStatus(o.id, `<b>${money(o.price, 0)}</b> ${o.perks && o.perks.length ? '+ ' + o.perks.join(' + ') : ''}`);
    repaintAll(); renderContext();
    const saved = it.price - o.price;
    const card = h(`<div class="offer new"><div class="avatar ${it.c === 'v' ? 'v' : it.c === 'g' ? 'g' : ''}">${it.vendor[0]}</div><div class="o-main"><div class="o-title">${it.vendor}: ${it.name}</div><div class="o-sub">${[`Save ${money(saved, 0)}`, ...(o.perks || [])].join(' · ')} · <span class="timer" data-exp="${S.offers[o.id].exp}"></span></div></div><div class="o-price">${money(o.price, 0)}</div><button class="btn sm primary">Accept</button></div>`);
    $('button', card).onclick = () => checkout(it);
    chat.bot([`${icon('bell')} ${o.proactive ? `<b>${it.vendor}</b> noticed you're deciding and sent a private offer:` : prev ? `<b>${it.vendor}</b> improved its offer:` : `New offer from <b>${it.vendor}</b>:`}`, card], { delay: 300 });
    bus.emit('deal:board', sessionPayload());
  }
  // live countdowns
  setInterval(() => $$('.timer[data-exp]').forEach((t) => (t.textContent = EB.mmss((+t.dataset.exp - Date.now()) / 1000) + ' left')), 1000);

  // messages from a Deal Room tab (vendor persona) open in the same browser
  bus.on('presence:vendor', () => { S.vendorOnline = true; });
  bus.emit('presence:ping', { from: 'customer' });
  bus.on('presence:ping', () => {});
  bus.on('deal:offer', (o) => { S.vendorOnline = true; receiveOffer(o); });
  bus.on('deal:hold', (o) => { if (o.sid === S.sid) holdFrom(o.id, o.minutes || 5); });
  bus.on('deal:pass', (o) => { if (o.sid === S.sid) setStatus(o.id, 'Passed on this one'); });
  bus.on('deal:sync', () => { if (S.dealOpen) bus.emit('deal:session', sessionPayload()); });

  /* ---------------- checkout ---------------- */
  async function checkout(it) {
    EB.view('chat'); EB.setNav('chat');
    const price = eff(it), ship = S.offers[it.id] && S.offers[it.id].perks.includes('Free shipping') ? 0 : it.price > 100 ? 0 : 5.99;
    const credit = () => (S.autoApply ? Math.min(S.wallet, +(price * 0.1).toFixed(2)) : 0);
    const tax = +(price * 0.0725).toFixed(2);
    const card = h(`<div class="card"><div class="card-head"><div class="card-title">${icon('box')} Checkout</div><span class="tag">Secure · processed by payment partner</span></div>
      <div class="row" style="gap:12px"><div class="product" style="width:64px;border:0"><div class="img ${it.c}" style="font-size:30px;border-radius:10px">${it.e}</div></div><div style="flex:1"><b>${it.name}</b><div class="muted" style="font-size:13px">Sold & shipped by ${it.vendor} · arrives Tue, Sep 23</div></div></div>
      <div class="sep"></div>
      <div class="stack" style="gap:6px;font-size:14px" id="lines"></div>
      <div class="set-row"><div>Use game credits<small>Up to 10% of the order · balance ${money(S.wallet)}</small></div><label class="toggle"><input type="checkbox" ${S.autoApply ? 'checked' : ''} id="cr"><span></span></label></div>
      <div class="row wrap" style="font-size:13px;gap:14px"><span>${icon('home')} Home · 221 Pine St, Austin TX</span><span>💳 Visa ···· 4242</span></div>
      <div class="card-foot"><button class="btn primary" id="place">Place order</button><button class="btn ghost" id="cancel">Not yet</button></div></div>`);
    const lines = () => {
      const c = credit();
      $('#lines', card).innerHTML = `
        <div class="row between"><span>Item${S.offers[it.id] ? ` <span class="tag green">live offer</span>` : ''}</span><span class="num">${S.offers[it.id] ? `<s class="muted">${money(it.price)}</s> ` : ''}${money(price)}</span></div>
        <div class="row between"><span>Shipping</span><span class="num">${ship ? money(ship) : 'Free'}</span></div>
        <div class="row between"><span>Est. tax</span><span class="num">${money(tax)}</span></div>
        ${c ? `<div class="row between" style="color:var(--green)"><span>Game credits</span><span class="num">−${money(c)}</span></div>` : ''}
        <div class="row between" style="font-weight:700;font-size:16px"><span>Total</span><span class="num">${money(price + ship + tax - c)}</span></div>`;
    };
    await chat.bot([S.offers[it.id] ? `Great choice. Your <b>${it.vendor}</b> offer is locked in for this checkout.` : 'Here\'s your checkout:', card]);
    lines();
    $('#cr', card).onchange = (e) => { S.autoApply = e.target.checked; lines(); };
    $('#cancel', card).onclick = () => { card.style.opacity = .5; $$('button', card).forEach((b) => (b.disabled = true)); chat.bot('No problem. Your offers stay valid until their timers run out.'); };
    $('#place', card).onclick = async () => {
      $$('button,input', card).forEach((b) => (b.disabled = true));
      const c = credit(), total = +(price + ship + tax - c).toFixed(2);
      if (c) { S.wallet = +(S.wallet - c).toFixed(2); S.history.unshift({ d: 'Today', t: `Used on ${it.name}`, a: -c }); saveWallet(); updWalletChip(); }
      const id = 'EB-' + Math.floor(20500 + Math.random() * 400);
      S.orders.unshift({ id, name: it.name, e: it.e, c: it.c, vendor: it.vendor, total, status: 'Confirmed', date: 'Today' });
      EB.sstore.set('eb-orders', S.orders);
      bus.emit('order:placed', { id, vendor: it.vendor, item: it.name, gmv: price, total, credit: c, offer: !!S.offers[it.id], sid: S.sid });
      bus.emit('deal:accepted', { sid: S.sid, id: it.id, vendor: it.vendor, price });
      S.dealOpen = false; renderContext();
      await chat.bot([`<div class="ok-note">${icon('check')} Order <b>${id}</b> placed: ${money(total)}. ${c ? `You used ${money(c)} in game credits.` : ''}</div>`, `The <b>Track Shipping</b> agent will keep you posted here. You also earned <b>+${Math.round(price)} Buzz points</b> 🍯. ${S.problem === 'back' ? 'Want to finish <b>Step 2</b> of your plan (monitor riser)?' : ''}`]);
      EB.setSuggest([{ label: '🖥️ Yes, show monitor risers', go: 'risers' }, { label: '📦 Track my order', go: 'track' }, { label: '🎮 Play to win more credits', go: 'play' }, { label: '🆕 Different problem', go: 'reset' }], (c2) => (c2.go === 'track' ? (chat.user(c2.label), chat.onText('track')) : route(c2.label, c2.go)));
    };
  }

  /* ---------------- Play & Win ---------------- */
  let pool = 1284.6;
  function renderPlay() {
    const v = EB.view('play', `
      <div class="row between wrap" style="gap:12px;margin-bottom:16px">
        <div><h1 style="font-size:28px">Play & Win</h1><div class="muted">Short skill games. Win store credits you can use on any order. Paid for by our sponsors.</div></div>
        <div class="card flat" style="padding:10px 14px"><div class="muted" style="font-size:12px;font-weight:600">TODAY'S PRIZE POOL · AD-FUNDED</div><div class="row" style="gap:8px"><b class="num" style="font-family:var(--display);font-size:22px" id="pool">${money(pool)}</b><span class="tag green"><i class="dot live"></i> live</span></div></div>
      </div>
      <div class="sponsor" style="margin-bottom:16px"><span class="sp-label">Sponsored</span><span style="font-size:22px">🪑</span><div style="flex:1"><b>Sitwell Aria</b>: sit better, live better. Beat level 3 to unlock <b>15% off</b>.</div><button class="btn sm">Learn more</button></div>
      <div class="products" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))" id="games"></div>
      <div class="card flat" style="margin-top:18px"><div class="row between wrap"><div><b>${S.plays} of 5 plays left today</b><div class="muted" style="font-size:13px">We cap daily plays to keep it fun. Credits expire after 60 days and can cover up to 10% of an order.</div></div><button class="btn sm" id="rules">Official rules & odds</button></div></div>
      <div id="gameArea"></div>`);
    const games = [
      { id: 'crush', name: 'Buzz Crush', e: '🍯', c: '', d: 'Match 3 in 15 moves. Score 1,500+ to win credits.', prize: 'Up to $1.00', live: true },
      { id: 'memory', name: 'Memory Flip', e: '🃏', c: 'v', d: 'Find all 6 pairs in as few flips as you can.', prize: 'Up to $0.50', live: true },
      { id: 'quiz', name: '60-sec Product Quiz', e: '❓', c: 'g', d: 'Know your stuff? Answer fast for bonus credits.', prize: 'Up to $0.75', live: false },
      { id: 'streak', name: 'Daily Streak', e: '🔥', c: 'b', d: 'Play 7 days in a row: $1 bonus credit.', prize: 'Day 4 of 7', live: false },
    ];
    games.forEach((g) => {
      const el = h(`<div class="product"><div class="img ${g.c}">${g.e}</div><div class="info"><div class="name">${g.name}</div><div class="vendor">${g.d}</div><div class="row between" style="margin-top:6px"><span class="tag honey">${g.prize}</span>${g.live ? '<button class="btn sm primary">Play</button>' : '<span class="tag">Coming soon</span>'}</div></div></div>`);
      const b = $('button', el); if (b) b.onclick = () => (S.plays <= 0 ? EB.toast('Daily limit reached. Come back tomorrow!') : g.id === 'crush' ? crush() : memory());
      $('#games', v).append(el);
    });
    $('#rules', v).onclick = () => EB.modal(`<h3>Official rules (summary)</h3><ul style="padding-left:18px;line-height:1.65;font-size:14px"><li><b>No purchase necessary</b> to play or win. A purchase does not improve your chances.</li><li>Buzz Crush and Memory Flip are <b>games of skill</b>. Credits depend on your score, not luck.</li><li>Prizes are eBuzz store credits (no cash value), valid 60 days, max 10% of an order.</li><li>Open to US residents 18+. Void where prohibited.</li><li>Daily prize pool = 40% of that day's Play-zone ad revenue. When it runs out, games stay free to play but pay no credits until the next day.</li><li>Bots, multiple accounts and automation are not allowed.</li></ul><button class="btn primary" onclick="EB.closeOverlays()">Close</button>`);
  }
  setInterval(() => { pool = Math.max(0, pool - Math.random() * 0.6); const p = $('#pool'); if (p) p.textContent = money(pool); }, 2500);

  function award(amount, label) {
    S.plays = Math.max(0, S.plays - 1); EB.sstore.set('eb-plays', S.plays);
    if (amount > 0) { S.wallet = +(S.wallet + amount).toFixed(2); S.history.unshift({ d: 'Today', t: label, a: amount }); saveWallet(); updWalletChip(); pool -= amount; bus.emit('game:prize', { amount }); }
  }

  function crush() {
    const N = 7, T = ['🍯', '🐝', '🌼', '🍋', '🫐'];
    let b = [], sel = null, moves = 15, score = 0, busy = false, adUsed = false;
    const area = $('#gameArea');
    area.innerHTML = `<div class="card" style="margin-top:18px"><div class="card-head"><div class="card-title">🍯 Buzz Crush</div><div class="row" style="gap:14px"><span>Moves <b id="mv" class="num">15</b></span><span>Score <b id="sc" class="num">0</b></span><button class="btn sm" id="adBtn">▶ +5 moves (watch sponsor)</button></div></div>
      <div class="meter" style="margin-bottom:6px"><i id="prog" style="width:0"></i></div>
      <div class="row between muted" style="font-size:11.5px;margin-bottom:12px"><span>1,500 · $0.10</span><span>3,000 · $0.25</span><span>5,000 · $0.50</span><span>8,000 · $1.00</span></div>
      <div id="board" style="display:grid;grid-template-columns:repeat(${N},1fr);gap:5px;max-width:420px;margin:0 auto;touch-action:manipulation"></div>
      <p class="muted" style="text-align:center;font-size:13px;margin:12px 0 0">Tap a tile, then an adjacent tile to swap. Match 3+ in a row.</p></div>`;
    area.scrollIntoView({ behavior: 'smooth' });
    const rnd = () => T[Math.floor(Math.random() * T.length)];
    for (let i = 0; i < N * N; i++) { let t; do { t = rnd(); } while ((i % N >= 2 && b[i - 1] === t && b[i - 2] === t) || (i >= 2 * N && b[i - N] === t && b[i - 2 * N] === t)); b.push(t); }
    const board = $('#board');
    const draw = (hl = []) => {
      board.innerHTML = '';
      b.forEach((t, i) => {
        const c = h(`<button aria-label="tile ${t}" style="aspect-ratio:1;border-radius:10px;border:1px solid var(--line);background:${sel === i ? 'var(--honey-soft)' : 'var(--surface-2)'};font-size:clamp(18px,5vw,28px);display:grid;place-items:center;transition:transform .15s;${hl.includes(i) ? 'transform:scale(.3);opacity:.2' : ''}${sel === i ? ';outline:2px solid var(--honey-strong)' : ''}">${t || ''}</button>`);
        c.onclick = () => tap(i); board.append(c);
      });
      $('#mv').textContent = moves; $('#sc').textContent = score;
      $('#prog').style.width = Math.min(100, (score / 8000) * 100) + '%';
    };
    const matches = () => {
      const m = new Set();
      for (let r = 0; r < N; r++) for (let c = 0; c < N - 2; c++) { const i = r * N + c; if (b[i] && b[i] === b[i + 1] && b[i] === b[i + 2]) [i, i + 1, i + 2].forEach((x) => m.add(x)); }
      for (let c = 0; c < N; c++) for (let r = 0; r < N - 2; r++) { const i = r * N + c; if (b[i] && b[i] === b[i + N] && b[i] === b[i + 2 * N]) [i, i + N, i + 2 * N].forEach((x) => m.add(x)); }
      return [...m];
    };
    const swap = (x, y) => ([b[x], b[y]] = [b[y], b[x]]);
    async function tap(i) {
      if (busy || moves <= 0) return;
      if (sel === null) { sel = i; return draw(); }
      const adj = Math.abs(sel - i) === N || (Math.abs(sel - i) === 1 && Math.floor(sel / N) === Math.floor(i / N));
      if (!adj) { sel = i; return draw(); }
      busy = true; const a = sel; sel = null; swap(a, i); draw();
      if (!matches().length) { await sleep(220); swap(a, i); draw(); busy = false; return; }
      moves--; let combo = 1, m;
      while ((m = matches()).length) {
        draw(m); await sleep(230);
        score += m.length * 20 * combo; m.forEach((x) => (b[x] = null));
        for (let c = 0; c < N; c++) { const col = []; for (let r = N - 1; r >= 0; r--) if (b[r * N + c]) col.push(b[r * N + c]); for (let r = N - 1, k = 0; r >= 0; r--, k++) b[r * N + c] = col[k] || rnd(); }
        draw(); await sleep(180); combo++;
      }
      busy = false;
      if (moves <= 0) end();
    }
    function end() {
      const prize = score >= 8000 ? 1 : score >= 5000 ? 0.5 : score >= 3000 ? 0.25 : score >= 1500 ? 0.1 : 0;
      award(prize, `Buzz Crush: ${score} pts`);
      EB.modal(`<div style="text-align:center"><div style="font-size:54px">${prize ? '🏆' : '🍯'}</div><h2>${prize ? `You won ${money(prize)}!` : 'So close!'}</h2><p class="muted">Score ${score}. ${prize ? 'Credits added to your wallet and applied automatically at your next checkout.' : 'Score 1,500+ to win credits. Try again.'}</p><div class="row" style="justify-content:center"><button class="btn primary" onclick="EB.closeOverlays()">Nice</button></div><p class="muted" style="font-size:11.5px;margin-top:12px">Prize funded by Play-zone advertising · Skill game · No purchase necessary</p></div>`);
      renderContext();
    }
    $('#adBtn').onclick = async () => {
      if (adUsed) return EB.toast('One sponsor bonus per game');
      adUsed = true;
      const m = EB.modal(`<div style="text-align:center"><span class="sp-label" style="font-size:10.5px;font-weight:700;letter-spacing:.08em;border:1px solid var(--line);padding:1px 6px;border-radius:5px">SPONSORED</span><div style="font-size:70px;margin:12px 0">🔊</div><h3>Hushly: sleep like you mean it</h3><p class="muted">Real-fan white noise. 20 levels. No loop gaps.</p><div class="meter" style="margin:14px 0"><i id="adp" style="width:0"></i></div><div class="muted" id="adt">Reward in 5s…</div></div>`);
      for (let s = 5; s > 0; s--) { $('#adp', m).style.width = ((5 - s + 1) / 5) * 100 + '%'; $('#adt', m).textContent = `Reward in ${s}s… (15s in production)`; await sleep(1000); }
      EB.closeOverlays(); moves += 5; draw(); EB.toast('+5 moves 🎉 Thanks for supporting the prize pool');
      bus.emit('ad:view', { cpm: 18 });
    };
    draw();
  }

  function memory() {
    const icons = ['🪑', '🌙', '🦴', '🔊', '🍯', '🧩'];
    const cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
    let open = [], done = new Set(), flips = 0, lock = false;
    const area = $('#gameArea');
    area.innerHTML = `<div class="card" style="margin-top:18px"><div class="card-head"><div class="card-title">🃏 Memory Flip</div><span>Flips <b id="fl" class="num">0</b> · ≤16 flips: $0.50 · ≤22: $0.25 · ≤30: $0.10</span></div><div id="mem" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:380px;margin:0 auto"></div></div>`;
    area.scrollIntoView({ behavior: 'smooth' });
    const draw = () => {
      const g = $('#mem'); g.innerHTML = '';
      cards.forEach((e, i) => {
        const up = open.includes(i) || done.has(i);
        const c = h(`<button style="aspect-ratio:1;border-radius:12px;border:1px solid var(--line);font-size:30px;background:${up ? 'var(--surface)' : 'var(--honey)'};${done.has(i) ? 'opacity:.55' : ''}">${up ? e : ''}</button>`);
        c.onclick = async () => {
          if (lock || up) return;
          open.push(i); flips++; $('#fl').textContent = flips; draw();
          if (open.length === 2) {
            lock = true; await sleep(600);
            if (cards[open[0]] === cards[open[1]]) open.forEach((x) => done.add(x));
            open = []; lock = false; draw();
            if (done.size === cards.length) {
              const prize = flips <= 16 ? 0.5 : flips <= 22 ? 0.25 : flips <= 30 ? 0.1 : 0;
              award(prize, `Memory Flip: ${flips} flips`);
              EB.modal(`<div style="text-align:center"><div style="font-size:54px">${prize ? '🏆' : '🃏'}</div><h2>${prize ? `+${money(prize)} credits` : 'All pairs found!'}</h2><p class="muted">${flips} flips.</p><button class="btn primary" onclick="EB.closeOverlays()">Done</button></div>`);
              renderContext();
            }
          }
        };
        g.append(c);
      });
    };
    draw();
  }

  /* ---------------- Wallet / Orders / Account ---------------- */
  function renderWallet() {
    EB.view('wallet', `
      <h1 style="font-size:28px;margin-bottom:16px">Wallet</h1>
      <div class="card honey-edge"><div class="row between wrap" style="gap:16px">
        <div><div class="muted" style="font-weight:600;font-size:13px">AVAILABLE CREDITS</div><div style="font-family:var(--display);font-size:44px;font-weight:700" class="num">${money(S.wallet)}</div><div class="muted" style="font-size:13px">+ $0.50 pending (referral) · $1.10 expires Oct 30</div></div>
        <div class="stack" style="min-width:220px"><div class="set-row" style="border:0;padding:0"><div>Auto-apply at checkout<small>Up to 10% of each order</small></div><label class="toggle"><input type="checkbox" ${S.autoApply ? 'checked' : ''} id="aa"><span></span></label></div><button class="btn primary" onclick="document.querySelector('[data-nav=play]').click()">${icon('play')} Win more credits</button></div>
      </div></div>
      <div class="kpis" style="margin:16px 0">${[['Buzz points', S.points.toLocaleString(), 'Gold at 2,000'], ['Earned this month', '$6.85', 'from 11 games + 1 referral'], ['Saved with live offers', '$84.00', 'across 3 orders']].map((k) => `<div class="kpi"><div class="l">${k[0]}</div><div class="v">${k[1]}</div><div class="d muted">${k[2]}</div></div>`).join('')}</div>
      <div class="card"><div class="card-title" style="margin-bottom:12px">History</div>${EB.table(['Date', 'Activity', 'Amount'], S.history.map((x) => [x.d, x.t, `<span class="${x.a > 0 ? 'up' : ''}">${x.a > 0 ? '+' : '−'}${money(Math.abs(x.a))}</span>`]), { right: [2] })}</div>
      <div class="card flat" style="margin-top:16px"><div class="card-title" style="margin-bottom:6px">How credits work</div><p class="muted" style="margin:0;font-size:14px">Credits come from games (paid for by ads), referrals and promotions. They have no cash value, expire 60 days after you earn them, and can cover up to 10% of any order. Refunded orders return credits to your wallet.</p></div>`);
    $('#aa').onchange = (e) => (S.autoApply = e.target.checked);
  }

  function renderOrders() {
    const demo = [{ id: 'EB-20481', name: 'Hushly Fan White-Noise Machine', e: '🔊', c: 'b', vendor: 'Hushly', total: 38.9, status: 'Delivered', date: 'Sep 10' }];
    const list = [...S.orders, ...demo];
    const steps = ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
    EB.view('orders', `<h1 style="font-size:28px;margin-bottom:16px">Orders</h1><div class="stack" style="gap:14px">${list.map((o) => {
      const at = steps.indexOf(o.status);
      return `<div class="card"><div class="row between wrap"><div class="row"><div class="product" style="width:56px;border:0"><div class="img ${o.c}" style="font-size:26px;border-radius:10px">${o.e}</div></div><div><b>${o.name}</b><div class="muted" style="font-size:13px">${o.id} · ${o.vendor} · ${o.date} · ${money(o.total)}</div></div></div><span class="tag ${o.status === 'Delivered' ? 'green' : 'honey'}">${o.status}</span></div>
      <div class="row" style="gap:4px;margin-top:14px">${steps.map((s, i) => `<div style="flex:1"><div class="meter ${i <= at ? 'g' : ''}"><i style="width:${i <= at ? 100 : 0}%"></i></div><div style="font-size:11px;margin-top:4px" class="${i <= at ? '' : 'muted'}">${s}</div></div>`).join('')}</div>
      <div class="card-foot"><button class="btn sm" onclick="EB.toast('Track Shipping agent: on schedule, ETA Tue Sep 23')">${icon('truck')} Track</button><button class="btn sm" onclick="EB.toast('Returns agent: prepaid label emailed (demo)')">${icon('ret')} Return</button><button class="btn sm ghost" onclick="EB.toast('Opening support chat…')">Get help</button></div></div>`;
    }).join('')}</div>`);
  }

  function renderAccount() {
    EB.view('account', `
      <h1 style="font-size:28px;margin-bottom:16px">Account & preferences</h1>
      <div class="grid2">
        <div class="card"><div class="card-title" style="margin-bottom:12px">Profile</div>
          <div class="stack"><label class="field">Name<input value="Maya Rodriguez"></label><label class="field">Email<input value="maya@example.com"></label>
          <label class="field">Default address<select><option>Home · 221 Pine St, Austin TX</option><option>Work · 500 Congress Ave</option></select></label>
          <div class="row between" style="font-size:14px"><span>💳 Visa ···· 4242 <span class="muted">(stored by payment partner)</span></span><button class="btn sm ghost">Manage</button></div></div></div>
        <div class="card"><div class="card-title" style="margin-bottom:12px">Shopping preferences</div>
          <div class="stack">
            <div><div class="field" style="margin-bottom:6px">Budget style</div><div class="seg" data-seg><button>Value</button><button class="on">Balanced</button><button>Premium</button></div></div>
            <div><div class="field" style="margin-bottom:6px">Delivery speed</div><div class="seg" data-seg><button class="on">Standard</button><button>Fast</button><button>Fastest</button></div></div>
            <div><div class="field" style="margin-bottom:6px">Values</div><div class="chips" data-multi><button class="chip on">Sustainable</button><button class="chip">Small brands</button><button class="chip on">Long warranty</button><button class="chip">Made in USA</button></div></div>
            <label class="field">Brands to avoid<input placeholder="e.g. BrandX" value="QuickBuy Basics"></label>
          </div></div>
        <div class="card"><div class="card-title" style="margin-bottom:6px">Deals & notifications</div>
          ${[['Live offers while I\'m deciding', 'Vendors can send private offers during a session', true], ['Price-drop alerts', 'For items you saved', true], ['Daily game reminder', 'Off by default: we don\'t nag', false], ['Email receipts', '', true]].map(([a, b, on]) => `<div class="set-row"><div>${a}<small>${b}</small></div><label class="toggle"><input type="checkbox" ${on ? 'checked' : ''}><span></span></label></div>`).join('')}</div>
        <div class="card"><div class="card-title" style="margin-bottom:6px">Privacy & AI</div>
          ${[['Personalised offers', 'Uses your problem, budget band and history. Vendors never see your identity.', true], ['Remember my conversations', 'Improves recommendations. Delete any time.', true], ['Use my data to train models', 'Off by default', false]].map(([a, b, on]) => `<div class="set-row"><div>${a}<small>${b}</small></div><label class="toggle"><input type="checkbox" ${on ? 'checked' : ''}><span></span></label></div>`).join('')}
          <div class="card-foot"><button class="btn sm">Download my data</button><button class="btn sm danger ghost">Delete account</button></div></div>
      </div>`);
    $$('[data-seg]').forEach((s) => $$('button', s).forEach((b) => (b.onclick = () => { $$('button', s).forEach((x) => x.classList.remove('on')); b.classList.add('on'); })));
    $$('[data-multi] .chip').forEach((c) => (c.onclick = () => c.classList.toggle('on')));
  }

  /* ---------------- boot ---------------- */
  renderContext();
  const hello = h(`<div class="card flat" style="background:var(--surface-2);border:0"><div class="row between wrap" style="gap:10px"><div style="font-size:14px">🍯 You have <b>${money(S.wallet)}</b> in credits · <b>${S.plays}</b> free plays today</div><button class="btn sm" onclick="document.querySelector('[data-nav=play]').click()">${icon('play')} Play & Win</button></div></div>`);
  chat.bot(['<h2 style="font-size:24px;margin-bottom:6px">Hi Maya 👋</h2><p>What are you trying to <b>solve</b> today? Describe the problem in your own words. I\'ll suggest a fix, shortlist the best products, and get vendors to compete for your order.</p>', hello], { delay: 400 });
  suggestDefault();
  if (location.hash === '#play') { EB.setNav('play'); renderPlay(); }
})();
