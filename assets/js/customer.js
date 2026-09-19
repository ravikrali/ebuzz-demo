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

  const D = EB.data;
  const UID = 'u_maya';
  const S = {
    autoApply: true,
    problem: null, answers: {}, offers: {}, sid: null, dealOpen: false, asked: 0,
    vendorOnline: false, points: 1240, view: 'chat',
  };
  const LIMIT_DEFAULTS = { user: { daily: 1, weekly: 4, monthly: 12, plays: 5 }, platform: { daily: 1500, weekly: 9000, monthly: 35000 } };
  const limits = () => { const c = D.get('config', 'win_limits'); try { return c ? JSON.parse(c.json) : LIMIT_DEFAULTS; } catch { return LIMIT_DEFAULTS; } };
  const walletBal = () => +D.all('wallet_tx').reduce((a, x) => a + (+x.amount || 0), 0).toFixed(2);
  const cartRows = () => D.all('cart').sort((a, b) => String(a.added_at).localeCompare(String(b.added_at)));
  const profile = () => D.get('profile', UID) || {};
  const memories = () => D.all('memory').sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const playsKey = () => 'eb-plays-' + D.today();
  const playsLeft = () => Math.max(0, limits().user.plays - EB.sstore.get(playsKey(), 0));
  const allItems = () => (S.problem ? [...PROBLEMS[S.problem].items, ...PROBLEMS[S.problem].more, ...(S.problem === 'back' ? RISERS : [])] : []);
  const CATALOG = () => { const m = {}; [...Object.values(PROBLEMS).flatMap((p) => [...p.items, ...p.more]), ...RISERS, ...EXTRA].forEach((i) => (m[i.id] = m[i.id] || i)); return m; };
  const find = (id) => allItems().find((i) => i.id === id) || CATALOG()[id];
  const eff = (it) => (S.offers[it.id] ? S.offers[it.id].price : it.price);
  const EXTRA = [
    { id: 'remind', name: 'Move-every-45-min reminder', vendor: 'eBuzz (free)', price: 0, rating: 4.8, reviews: 1200, e: '⏰', c: 'g', why: 'Free solution: no purchase needed.', free: true },
    { id: 'cush', name: 'Sitwell Memory Foam Seat Cushion', vendor: 'Sitwell Home', price: 39, rating: 4.5, reviews: 2210, e: '🟫', c: '', why: 'Trending fix for tailbone pain.' },
  ];

  /* ---------------- demo seed (first run on a device with no synced data) ---------------- */
  async function seed(tables) {
    const r = D.rng(42), pick = (a) => a[Math.floor(r() * a.length)];
    if (tables.includes('profile')) await D.put('profile', { id: UID, name: 'Maya Rodriguez', email: 'maya@example.com', phone: '+1 512 555 0142', address: '221 Pine St', city: 'Austin', state: 'TX', zip: '78701', card_label: 'Visa ···· 4242', created_at: D.daysAgo(340) }, { silent: true });
    if (tables.includes('prefs')) await D.put('prefs', { id: UID, budget_style: 'Balanced', delivery: 'Standard', values_json: JSON.stringify(['Sustainable', 'Long warranty']), avoid: 'QuickBuy Basics', offers_opt_in: '1', memory_opt_in: '1', train_opt_in: '0' }, { silent: true });
    if (tables.includes('memory') && D.device === 'laptop') await D.put('memory', [
      ['pref', 'Prefers long warranties over the lowest price'], ['home', 'Works from home 3 days a week'], ['pet', 'Has a large dog (Labrador, "Biscuit")'], ['sleep', 'Light sleeper: street light through the bedroom window'], ['body', 'Height 5\'4" (feet may not reach the floor at a standard desk)'],
    ].map(([kind, text], i) => ({ id: 'mem-' + i, kind, text, date: D.daysAgo(10 + i * 30) })), { silent: true });
    const PAST = [['Hushly Fan White-Noise Machine', '🔊', 'Hushly', 39, 'hush'], ['TuffRoot Rubber Chew', '🦴', 'TuffRoot', 18, 'tuff'], ['LunaDark Blackout Liner', '🌙', 'LunaDark', 29, 'luna2'], ['Lift Monitor Riser', '🖥️', 'DeskLab', 45, 'riser1'], ['BrainyPup Puzzle Feeder L3', '🧩', 'BrainyPup', 34, 'puzzle'], ['Sitwell Memory Foam Seat Cushion', '🟫', 'Sitwell Home', 39, 'cush'], ['Drift Contour Sleep Mask', '😴', 'Drift', 19, 'drift'], ['KnotKing Mega Rope', '🪢', 'KnotKing', 22, 'rope'], ['Arcus Single Monitor Arm', '🖥️', 'Arcus', 79, 'arm'], ['Rocker Footrest', '🦶', 'DeskLab', 32, 'foot'], ['CalmTone Speaker', '🔊', 'CalmTone', 59, 'snooz']];
    const orders = [], tx = [];
    for (let i = 0; i < 26; i++) {
      const [item, emoji, vendor, list, sku] = pick(PAST), day = Math.floor(8 + r() * 330);
      const via = r() < 0.45 ? 'Deal Room' : r() < 0.7 ? 'Concierge' : 'Top10 page';
      const price = via === 'Deal Room' ? +(list * (0.86 + r() * 0.1)).toFixed(2) : list, qty = r() < 0.15 ? 2 : 1;
      const credit = r() < 0.4 ? +Math.min(price * qty * 0.1, 0.5 + r() * 1.5).toFixed(2) : 0, tax = +(price * qty * 0.0825).toFixed(2);
      const id = 'EB-' + (19000 + i * 53);
      const status = r() < 0.08 ? 'Refunded' : 'Delivered';
      orders.push({ id, user_id: UID, date: D.daysAgo(day), item, emoji, sku, vendor, qty, list_price: list, price, credit, tax, total: +(price * qty + tax - credit).toFixed(2), status, via, ship_to: '221 Pine St, Austin TX 78701' });
      if (credit) tx.push({ id: 'W-' + id, user_id: UID, date: D.daysAgo(day), type: 'spend', label: `Used on order ${id}`, amount: -credit });
      if (status === 'Refunded' && credit) tx.push({ id: 'WR-' + id, user_id: UID, date: D.daysAgo(day - 5), type: 'refund', label: `Credits returned: ${id}`, amount: credit });
    }
    for (let i = 0; i < 34; i++) { const d = Math.floor(9 + r() * 320), g = pick(['Buzz Crush', 'Memory Flip']); tx.push({ id: 'G-' + i, user_id: UID, date: D.daysAgo(d), type: 'game', label: `${g}: prize`, amount: pick([0.1, 0.1, 0.25, 0.25, 0.5]) }); }
    tx.push({ id: 'REF-1', user_id: UID, date: D.daysAgo(190), type: 'referral', label: 'Referral bonus (Sam)', amount: 5 }, { id: 'PR-1', user_id: UID, date: D.daysAgo(300), type: 'promo', label: 'Welcome credit', amount: 5 });
    const bal = tx.reduce((a, x) => a + x.amount, 0);
    tx.push({ id: 'EXP-1', user_id: UID, date: D.daysAgo(12), type: 'expired', label: 'Credits expired (60-day rule)', amount: +(3.4 - bal).toFixed(2) });
    if (tables.includes('feed_posts')) await EB.feed.seed();
    if (tables.includes('orders')) await D.put('orders', orders, { silent: true });
    if (tables.includes('wallet_tx')) await D.put('wallet_tx', tx, { silent: true });
  }

  /* ---------------- shell ---------------- */
  const chat = EB.shell({
    persona: 'customer',
    user: { name: 'Maya R.', role: 'Wallet …', initials: 'MR' },
    rail: [
      { id: 'chat', label: 'Concierge', icon: 'chat' },
      { id: 'feed', label: 'Buzz Feed', icon: 'feed' },
      { id: 'dash', label: 'Dashboard', icon: 'grid' },
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
  $('#ctxBtn').innerHTML = `${icon('cart')}`;
  $('#ctxBtn').style.position = 'relative';
  const updWalletChip = () => {
    const u = $('.user-chip .muted'); if (u) u.textContent = `Wallet ${money(walletBal())}`;
    const n = cartRows().reduce((a, x) => a + x.qty, 0);
    $('#ctxBtn').innerHTML = `${icon('cart')}${n ? `<span class="count-badge" style="position:absolute;top:-4px;right:-6px">${n}</span>` : ''}`;
  };

  function nav(id) {
    S.view = id;
    if (id === 'chat') EB.view('chat');
    if (id === 'dash') renderDash();
    if (id === 'feed') renderFeed();
    if (id === 'play') renderPlay();
    if (id === 'wallet') renderWallet();
    if (id === 'orders') renderOrders();
    if (id === 'account') renderAccount();
  }

  /* ---------------- cart ---------------- */
  async function addToCart(it, { quiet = false } = {}) {
    if (it.free) { chat.bot(`${icon('check')} Done. I'll remind you to stand up and stretch every 45 minutes during work hours (9–6). No purchase needed.`); EB.toast('Reminder turned on'); return; }
    const line = cartRows().find((l) => l.sku === it.id);
    const price = eff(it);
    if (line) await D.put('cart', { ...line, qty: line.qty + 1, price: Math.min(line.price, price), offer: S.offers[it.id] ? 1 : line.offer });
    else await D.put('cart', { id: D.id('C'), user_id: UID, sku: it.id, item: it.name, emoji: it.e, vendor: it.vendor, list_price: it.price, price, qty: 1, offer: S.offers[it.id] ? 1 : 0, added_at: new Date().toISOString() });
    if (!quiet) EB.toast(`${it.e} Added to cart${S.offers[it.id] ? ' with live-offer price' : ''}`);
    renderContext();
  }
  const cartTotals = () => {
    const lines = cartRows();
    const sub = lines.reduce((a, l) => a + l.price * l.qty, 0), list = lines.reduce((a, l) => a + l.list_price * l.qty, 0);
    const ship = !lines.length || sub >= 100 ? 0 : 5.99, tax = +(sub * 0.0825).toFixed(2);
    const credit = S.autoApply ? Math.min(walletBal(), +(sub * 0.1).toFixed(2)) : 0;
    return { lines, sub, saved: list - sub, ship, tax, credit, total: +(sub + ship + tax - credit).toFixed(2) };
  };

  /* ---------------- suggestions (context + on-device memory) ---------------- */
  function suggestions() {
    const C = CATALOG(), mem = memories().map((m) => m.text).join(' ').toLowerCase();
    const inCart = new Set(cartRows().map((l) => l.sku));
    const recent = D.all('orders').sort((a, b) => b.date.localeCompare(a.date));
    const bought = (sku) => recent.find((o) => o.sku === sku);
    const out = [];
    const add = (id, why) => { if (C[id] && !inCart.has(id) && !out.find((x) => x.it.id === id)) out.push({ it: C[id], why }); };
    if (S.problem === 'back') {
      bought('riser1') ? add('arm', 'Step 2: you already own a riser, so an arm frees up desk space') : add('riser1', 'Step 2 of your plan');
      add('remind', 'Step 3 of your plan: free');
      if (/5'4/.test(mem)) add('foot', 'Memory: you\'re 5\'4", so your feet may not reach the floor');
      add('backbuddy', 'If you keep your current chair');
    } else if (S.problem === 'sleep') {
      if (bought('hush')) add('luna', `You bought Hushly on ${bought('hush').date}. Now block the light`); else add('hush', 'Masks street noise');
      add('drift', 'For nights away');
    } else if (S.problem === 'pet') {
      if (/labrador|large dog/.test(mem)) add('puzzle', 'Memory: Biscuit is a Labrador. Puzzles tire out smart breeds');
      add('tuff', 'Replaced free if destroyed');
    }
    if (/light sleeper/.test(mem)) add('luna', 'Memory: street light wakes you up');
    if (/labrador|large dog/.test(mem)) add('tuff', 'Memory: for Biscuit, a power-chewer toy');
    add('cush', 'Trending: tailbone pain when sitting (+64%)');
    if (/warrant/.test(mem) && S.problem === 'back') add('ergomax', 'Memory: you prefer long warranties (12-yr)');
    return out.slice(0, 4);
  }

  /* ---------------- right pane: cart & checkout, suggestions, context ---------------- */
  function renderContext() {
    const P = S.problem && PROBLEMS[S.problem];
    const offers = Object.entries(S.offers);
    const T = cartTotals();
    const sug = suggestions();
    const ctx = $('#context');
    ctx.innerHTML = `
      <div class="ctx-pin">
        <div class="row between"><h4 style="margin:0">${icon('cart')} Cart ${T.lines.length ? `<span class="count-badge">${T.lines.reduce((a, l) => a + l.qty, 0)}</span>` : ''}</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
        ${T.lines.length ? `<div style="margin-top:6px">${T.lines.map((l) => `<div class="cart-line"><div class="em">${l.emoji || '📦'}</div><div class="nm"><b>${esc(l.item)}</b><span class="muted">${esc(l.vendor)}</span> ${l.offer ? '<span class="tag green" style="font-size:10.5px">offer</span>' : ''}</div>
            <div style="text-align:right"><div class="num" style="font-weight:700;font-size:13.5px">${money(l.price * l.qty)}</div>${l.list_price > l.price ? `<s class="muted num" style="font-size:11.5px">${money(l.list_price * l.qty)}</s>` : ''}<div class="qty"><button data-dec="${l.id}" aria-label="Decrease">−</button><span>${l.qty}</span><button data-inc="${l.id}" aria-label="Increase">+</button></div></div></div>`).join('')}</div>
          <div class="stack" style="gap:3px;font-size:13px;margin-top:8px">
            <div class="row between"><span>Subtotal</span><span class="num">${money(T.sub)}</span></div>
            ${T.saved > 0 ? `<div class="row between up"><span>Saved with live offers</span><span class="num">−${money(T.saved)}</span></div>` : ''}
            <div class="row between"><span>Shipping</span><span class="num">${T.ship ? money(T.ship) : 'Free'}</span></div>
            <div class="row between"><span>Est. tax</span><span class="num">${money(T.tax)}</span></div>
            <div class="row between"><label class="row" style="gap:6px"><input type="checkbox" id="crTog" ${S.autoApply ? 'checked' : ''}> Game credits</label><span class="num up">−${money(T.credit)}</span></div>
            <div class="row between" style="font-weight:700;font-size:15px"><span>Total</span><span class="num">${money(T.total)}</span></div></div>
          <button class="btn primary block" style="margin-top:10px" id="coBtn">${icon('lock')} Checkout · ${money(T.total)}</button>`
        : `<p class="muted" style="margin:6px 0 0;font-size:13px">Your cart is empty. Add items from the chat. Live-offer prices are kept.</p>`}
      </div>
      <div class="ctx-section">
        <h4>For you <span class="muted" style="text-transform:none;letter-spacing:0;font-weight:500">context + memory</span></h4>
        ${sug.map((s, i) => `<div class="sugg"><div class="em">${s.it.e}</div><div class="nm"><b>${esc(s.it.name)}</b><div class="muted">${s.it.free ? 'Free' : money(eff(s.it), 0)} · ${esc(s.it.vendor)}</div><div class="why">${esc(s.why)}</div></div><button class="btn sm" data-sg="${i}">${s.it.free ? 'Turn on' : '+ Add'}</button></div>`).join('')}
      </div>
      <div class="ctx-section">
        <h4>Current context</h4>
        ${P ? `<div class="ctx-title">${P.title}</div><div class="chips" style="margin-top:10px">${Object.values(S.answers).map((a) => `<span class="tag honey">${a}</span>`).join('')}</div>
          <h4 style="margin-top:14px">Price range <span class="num" id="rangeLbl">up to ${money(S.maxPrice || 350, 0)}</span></h4>
          <input type="range" min="20" max="400" step="5" value="${S.maxPrice || 350}" id="range" aria-label="Maximum price">
          <h4 style="margin-top:14px">Must-haves</h4>
          <div class="chips" id="must">${[...new Set(P.items.flatMap((i) => i.tags || []))].slice(0, 6).map((t, i) => `<button class="chip ${i === 0 ? 'on' : ''}">${t}</button>`).join('')}</div>
          <button class="btn block" style="margin-top:14px" id="browseBtn">${icon('search')} Browse this context only (${allItems().length})</button>`
          : `<p class="muted" style="margin:0;font-size:13.5px">Tell the Concierge what you're trying to solve. Only the filters that matter for your problem will show up here.</p>`}
      </div>
      ${P ? `<div class="ctx-section">
        <h4>Live offers <span class="tag ${S.dealOpen ? 'green' : ''}">${S.dealOpen ? '<i class="dot live"></i> Deal Room open' : 'Closed'}</span></h4>
        ${offers.length ? `<div class="offer-list">${offers.map(([id, o]) => `<div class="offer"><div class="o-main"><div class="o-title">${find(id).vendor}</div><div class="o-sub">${o.perks.join(' · ') || 'Price offer'}</div></div><div><div class="o-price">${money(o.price, 0)}</div><div class="timer" data-exp="${o.exp}"></div></div></div>`).join('')}</div>` : '<p class="muted" style="margin:0;font-size:13.5px">No offers yet. Vendors can send offers while you decide.</p>'}
        <button class="btn block" style="margin-top:12px" id="askBtn2">${icon('bolt')} Ask for a better deal</button></div>` : ''}
      <div class="ctx-section">
        <div class="row between"><div><h4 style="margin:0 0 4px">Wallet</h4><div class="ctx-title num">${money(walletBal())}</div><div class="muted" style="font-size:12px">Game credits · ${playsLeft()} plays left today</div></div><button class="btn sm" data-goplay>${icon('play')} Play</button></div>
      </div>
      <div class="ctx-section"><div class="stack" style="font-size:12.5px;gap:6px">
        <div class="row">${icon('check')}<span>Ranked by fit for <i>your</i> problem, not by ad spend</span></div>
        <div class="row">${icon('lock')}<span>Memory & personal details stay on your devices. <a href="#" data-sync>See what's synced</a></span></div></div></div>`;
    const r = $('#range');
    if (r) r.oninput = () => { S.maxPrice = +r.value; $('#rangeLbl').textContent = 'up to ' + money(r.value, 0); };
    $$('#must .chip').forEach((c) => (c.onclick = () => c.classList.toggle('on')));
    const b = $('#browseBtn'); if (b) b.onclick = browse;
    const a = $('#askBtn2'); if (a) a.onclick = () => { EB.closeOverlays(); EB.view('chat'); EB.setNav('chat'); askDeal(); };
    $$('[data-sg]', ctx).forEach((x) => (x.onclick = () => addToCart(sug[+x.dataset.sg].it)));
    $$('[data-inc]', ctx).forEach((x) => (x.onclick = async () => { const l = D.get('cart', x.dataset.inc); await D.put('cart', { ...l, qty: l.qty + 1 }); renderContext(); }));
    $$('[data-dec]', ctx).forEach((x) => (x.onclick = async () => { const l = D.get('cart', x.dataset.dec); if (l.qty <= 1) await D.del('cart', l.id); else await D.put('cart', { ...l, qty: l.qty - 1 }); renderContext(); }));
    const t = $('#crTog'); if (t) t.onchange = () => { S.autoApply = t.checked; renderContext(); };
    const co = $('#coBtn'); if (co) co.onclick = () => { EB.closeOverlays(); checkout(); };
    $('[data-goplay]', ctx).onclick = () => { EB.closeOverlays(); EB.setNav('play'); nav('play'); };
    $('[data-sync]', ctx).onclick = (e) => { e.preventDefault(); EB.syncView(); };
    updWalletChip();
  }
  const esc = EB.esc;

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
        <div class="actions"><button class="btn sm primary" data-act="buy">${icon('cart')} Add</button><button class="btn sm" data-act="details">Details</button></div>
      </div></div>`);
    paintCard(el, it);
    el.querySelector('[data-act=buy]').onclick = () => addToCart(it);
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
        <button class="btn primary block" id="dBuy">Add to cart · ${money(eff(it), 0)}</button>
      </div>`);
    $('#dBuy', body).onclick = () => { EB.closeOverlays(); addToCart(it); };
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
      wallet: () => chat.bot(`You have <b>${money(walletBal())}</b> in game credits. They're applied automatically at checkout (up to 10% of an order). <a href="#" onclick="document.querySelector('[data-nav=wallet]').click();return false">Open wallet →</a>`),
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
    if (/feed|post|review|story|share/.test(s)) { chat.bot('Opening the <b>Buzz Feed</b>, where you can read real reviews and share your own.'); return setTimeout(() => { EB.setNav('feed'); renderFeed(); }, 600); }
    if (/game|play|win/.test(s)) return route(null, 'play');
    if (/wallet|credit|balance/.test(s)) return route(null, 'wallet');
    if (/track|order|where/.test(s)) { const o = D.all('orders', 'ORDER BY date DESC, id DESC LIMIT 1')[0]; return chat.bot(o ? `Your latest order <b>${o.id}</b> (${esc(o.item)}) is <b>${o.status}</b>. The Track Shipping agent will message you if anything changes.` : "You don't have any orders yet."); }
    if (/cart|checkout|pay/.test(s)) return checkout();
    if (/dashboard|spent|history|transactions/.test(s)) { chat.bot('Opening your dashboard, which has the full transaction list.'); return setTimeout(() => { EB.setNav('dash'); nav('dash'); }, 600); }
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
    const cl = cartRows().find((l) => l.sku === o.id);
    if (cl && o.price < cl.price) D.put('cart', { ...cl, price: o.price, offer: 1 }).then(() => { renderContext(); EB.toast(`Cart updated: ${it.vendor} offer applied`); });
    setStatus(o.id, `<b>${money(o.price, 0)}</b> ${o.perks && o.perks.length ? '+ ' + o.perks.join(' + ') : ''}`);
    repaintAll(); renderContext();
    const saved = it.price - o.price;
    const card = h(`<div class="offer new"><div class="avatar ${it.c === 'v' ? 'v' : it.c === 'g' ? 'g' : ''}">${it.vendor[0]}</div><div class="o-main"><div class="o-title">${it.vendor}: ${it.name}</div><div class="o-sub">${[`Save ${money(saved, 0)}`, ...(o.perks || [])].join(' · ')} · <span class="timer" data-exp="${S.offers[o.id].exp}"></span></div></div><div class="o-price">${money(o.price, 0)}</div><button class="btn sm primary">Accept</button></div>`);
    $('button', card).onclick = () => addToCart(it);
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

  /* ---------------- checkout (whole cart) ---------------- */
  async function checkout() {
    EB.view('chat'); EB.setNav('chat');
    if (!cartRows().length) return chat.bot('Your cart is empty. Add something from a shortlist or from the "For you" suggestions on the right.');
    const pr = profile();
    const card = h(`<div class="card"><div class="card-head"><div class="card-title">${icon('lock')} Checkout</div><span class="tag">Card handled by payment partner · never stored by eBuzz</span></div>
      <div data-lines></div><div class="sep"></div><div class="stack" style="gap:6px;font-size:14px" data-sum></div>
      <div class="set-row"><div>Use game credits<small>Up to 10% of the order · balance ${money(walletBal())}</small></div><label class="toggle"><input type="checkbox" ${S.autoApply ? 'checked' : ''} data-cr><span></span></label></div>
      <div class="row wrap" style="font-size:13px;gap:14px"><span>${icon('home')} ${esc(pr.address || '')}, ${esc(pr.city || '')} ${esc(pr.state || '')}</span><span>💳 ${esc(pr.card_label || '')}</span><span class="tag violet">${icon('lock')} address shared only with the shipping vendor</span></div>
      <div class="card-foot"><button class="btn primary" data-place>Place order</button><button class="btn ghost" data-cancel>Keep shopping</button></div></div>`);
    const paint = () => {
      const T = cartTotals();
      $('[data-lines]', card).innerHTML = T.lines.map((l) => `<div class="row" style="gap:12px;padding:6px 0"><div class="em" style="width:42px;height:42px;border-radius:10px;display:grid;place-items:center;font-size:22px;background:var(--surface-2)">${l.emoji}</div><div style="flex:1"><b>${esc(l.item)}</b> ${l.qty > 1 ? `×${l.qty}` : ''}<div class="muted" style="font-size:12.5px">Sold & shipped by ${esc(l.vendor)} · arrives Tue, Sep 23 ${l.offer ? '<span class="tag green">live offer</span>' : ''}</div></div><div class="num" style="text-align:right">${l.list_price > l.price ? `<s class="muted">${money(l.list_price * l.qty)}</s><br>` : ''}${money(l.price * l.qty)}</div></div>`).join('');
      $('[data-sum]', card).innerHTML = `
        <div class="row between"><span>Subtotal</span><span class="num">${money(T.sub)}</span></div>
        ${T.saved > 0 ? `<div class="row between up"><span>Saved with live offers</span><span class="num">−${money(T.saved)}</span></div>` : ''}
        <div class="row between"><span>Shipping</span><span class="num">${T.ship ? money(T.ship) : 'Free'}</span></div>
        <div class="row between"><span>Est. tax (${esc(pr.state || '')})</span><span class="num">${money(T.tax)}</span></div>
        ${T.credit ? `<div class="row between up"><span>Game credits</span><span class="num">−${money(T.credit)}</span></div>` : ''}
        <div class="row between" style="font-weight:700;font-size:16px"><span>Total</span><span class="num">${money(T.total)}</span></div>`;
    };
    await chat.bot([`Here's your checkout for ${cartRows().length} item${cartRows().length > 1 ? 's' : ''}. Live-offer prices are locked in:`, card]);
    paint();
    $('[data-cr]', card).onchange = (e) => { S.autoApply = e.target.checked; paint(); renderContext(); };
    $('[data-cancel]', card).onclick = () => { card.style.opacity = .5; $$('button,input', card).forEach((b) => (b.disabled = true)); };
    $('[data-place]', card).onclick = async () => {
      $$('button,input', card).forEach((b) => (b.disabled = true));
      const T = cartTotals(), ids = [], today = D.today();
      let creditLeft = T.credit;
      const rows = T.lines.map((l, i) => {
        const id = 'EB-' + Math.floor(20500 + Math.random() * 9000); ids.push(id);
        const share = i === T.lines.length - 1 ? creditLeft : +(T.credit * (l.price * l.qty) / T.sub).toFixed(2); creditLeft = +(creditLeft - share).toFixed(2);
        const tax = +(l.price * l.qty * 0.0825).toFixed(2);
        return { id, user_id: UID, date: today, item: l.item, emoji: l.emoji, sku: l.sku, vendor: l.vendor, qty: l.qty, list_price: l.list_price, price: l.price, credit: share, tax, total: +(l.price * l.qty + tax - share).toFixed(2), status: 'Confirmed', via: l.offer ? 'Deal Room' : 'Concierge', ship_to: `${pr.address}, ${pr.city} ${pr.state} ${pr.zip}` };
      });
      await D.put('orders', rows);
      if (T.credit) await D.put('wallet_tx', { id: D.id('W'), user_id: UID, date: today, type: 'spend', label: `Used on ${ids.join(', ')}`, amount: -T.credit });
      for (const l of T.lines) await D.del('cart', l.id);
      rows.forEach((o) => { bus.emit('order:placed', { id: o.id, vendor: o.vendor, item: o.item, gmv: o.price * o.qty, total: o.total, credit: o.credit, offer: o.via === 'Deal Room', sid: S.sid }); bus.emit('deal:accepted', { sid: S.sid, id: o.sku, vendor: o.vendor, price: o.price }); });
      S.dealOpen = false; renderContext();
      const pts = Math.round(T.sub);
      await chat.bot([`<div class="ok-note">${icon('check')} ${rows.length > 1 ? `${rows.length} orders` : 'Order'} <b>${ids.join(', ')}</b> placed: ${money(T.total)}.${T.credit ? ` You used ${money(T.credit)} in game credits.` : ''}${T.saved > 0 ? ` You saved ${money(T.saved)} with live offers.` : ''}</div>`, `The <b>Track Shipping</b> agent will keep you posted here. You earned <b>+${pts} Buzz points</b> 🍯. Every order is also listed in your <a href="#" data-dash>Dashboard</a>. ${S.problem === 'back' ? 'Want to finish <b>Step 2</b> of your plan (monitor riser)?' : ''}`]).then((b) => { const d = $('[data-dash]', b); if (d) d.onclick = (e) => { e.preventDefault(); EB.setNav('dash'); nav('dash'); }; });
      EB.setSuggest([{ label: '⭐ Review it on the Buzz Feed', go: 'review' }, { label: '🖥️ Yes, show monitor risers', go: 'risers' }, { label: '📦 Track my order', go: 'track' }, { label: '🎮 Play to win more credits', go: 'play' }, { label: '🆕 Different problem', go: 'reset' }], (c2) => (c2.go === 'track' ? (chat.user(c2.label), chat.onText('track')) : c2.go === 'review' ? (EB.setNav('feed'), renderFeed({ compose: 'review', product: rows[0].item })) : route(c2.label, c2.go)));
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
      <div class="card flat" style="margin-top:18px"><div class="row between wrap" style="gap:12px"><div><b>${playsLeft()} of ${limits().user.plays} plays left today</b><div class="muted" style="font-size:13px">Win limits keep it fun and the prize pool fair. Credits expire after 60 days and can cover up to 10% of an order.</div></div><button class="btn sm" id="rules">Official rules & odds</button></div>
        <div class="grid2" style="grid-template-columns:repeat(3,1fr);margin-top:12px">${winUsage().map((u) => `<div><div class="row between" style="font-size:12.5px"><span>${u.label} win limit</span><b class="num">${money(u.used)} / ${money(u.cap)}</b></div><div class="meter ${u.used >= u.cap ? 'r' : 'g'}"><i style="width:${Math.min(100, (u.used / u.cap) * 100)}%"></i></div></div>`).join('')}</div></div>
      <div id="gameArea"></div>`);
    const games = [
      { id: 'crush', name: 'Buzz Crush', e: '🍯', c: '', d: 'Match 3 in 15 moves. Score 1,500+ to win credits.', prize: 'Up to $1.00', live: true },
      { id: 'memory', name: 'Memory Flip', e: '🃏', c: 'v', d: 'Find all 6 pairs in as few flips as you can.', prize: 'Up to $0.50', live: true },
      { id: 'quiz', name: '60-sec Product Quiz', e: '❓', c: 'g', d: 'Know your stuff? Answer fast for bonus credits.', prize: 'Up to $0.75', live: false },
      { id: 'streak', name: 'Daily Streak', e: '🔥', c: 'b', d: 'Play 7 days in a row: $1 bonus credit.', prize: 'Day 4 of 7', live: false },
    ];
    games.forEach((g) => {
      const el = h(`<div class="product"><div class="img ${g.c}">${g.e}</div><div class="info"><div class="name">${g.name}</div><div class="vendor">${g.d}</div><div class="row between" style="margin-top:6px"><span class="tag honey">${g.prize}</span>${g.live ? '<button class="btn sm primary">Play</button>' : '<span class="tag">Coming soon</span>'}</div></div></div>`);
      const b = $('button', el); if (b) b.onclick = () => (playsLeft() <= 0 ? EB.toast('Daily play limit reached. Come back tomorrow!') : g.id === 'crush' ? crush() : memory());
      $('#games', v).append(el);
    });
    $('#rules', v).onclick = () => EB.modal(`<h3>Official rules (summary)</h3><ul style="padding-left:18px;line-height:1.65;font-size:14px"><li><b>No purchase necessary</b> to play or win. A purchase does not improve your chances.</li><li>Buzz Crush and Memory Flip are <b>games of skill</b>. Credits depend on your score, not luck.</li><li>Prizes are eBuzz store credits (no cash value), valid 60 days, max 10% of an order.</li><li>Open to US residents 18+. Void where prohibited.</li><li>Win limits per player: ${money(limits().user.daily)}/day, ${money(limits().user.weekly)}/week, ${money(limits().user.monthly)}/month; ${limits().user.plays} plays/day. Set by eBuzz Admin.</li><li>Daily prize pool = 40% of that day's Play-zone ad revenue. When it runs out, games stay free to play but pay no credits until the next day.</li><li>Bots, multiple accounts and automation are not allowed.</li></ul><button class="btn primary" onclick="EB.closeOverlays()">Close</button>`);
  }
  setInterval(() => { pool = Math.max(0, pool - Math.random() * 0.6); const p = $('#pool'); if (p) p.textContent = money(pool); }, 2500);

  /* win limits (daily / weekly / monthly), configured centrally in the Admin portal */
  function winUsage() {
    const L = limits().user, wins = D.all('wallet_tx').filter((x) => x.type === 'game' && x.amount > 0);
    const since = (d) => wins.filter((x) => x.date >= d).reduce((a, x) => a + x.amount, 0);
    const monthStart = D.today().slice(0, 8) + '01';
    return [{ label: 'Daily', used: since(D.today()), cap: L.daily }, { label: 'Weekly', used: since(D.daysAgo(6)), cap: L.weekly }, { label: 'Monthly', used: since(monthStart), cap: L.monthly }];
  }
  function award(amount, label) {
    EB.sstore.set(playsKey(), EB.sstore.get(playsKey(), 0) + 1);
    const room = Math.max(0, Math.min(...winUsage().map((u) => u.cap - u.used)));
    const granted = +Math.min(amount, room).toFixed(2);
    const hit = winUsage().find((u) => u.cap - u.used <= amount);
    if (granted > 0) {
      D.put('wallet_tx', { id: D.id('G'), user_id: UID, date: D.today(), type: 'game', label, amount: granted }).then(() => { renderContext(); });
      pool -= granted; bus.emit('game:prize', { amount: granted });
    }
    const note = amount > granted ? `Your ${hit ? hit.label.toLowerCase() : ''} win limit (${money(hit ? hit.cap : 0)}) is reached${granted ? `, so only ${money(granted)} was added` : ''}. Games stay free to play.` : '';
    return { granted, note };
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
      const won = score >= 8000 ? 1 : score >= 5000 ? 0.5 : score >= 3000 ? 0.25 : score >= 1500 ? 0.1 : 0;
      const { granted: prize, note } = award(won, `Buzz Crush: ${score} pts`);
      EB.modal(`<div style="text-align:center"><div style="font-size:54px">${prize ? '🏆' : '🍯'}</div><h2>${prize ? `You won ${money(prize)}!` : won ? 'Limit reached' : 'So close!'}</h2><p class="muted">Score ${score}. ${prize ? 'Credits added to your wallet and applied automatically at your next checkout.' : won ? '' : 'Score 1,500+ to win credits. Try again.'} ${note}</p><div class="row" style="justify-content:center"><button class="btn primary" onclick="EB.closeOverlays()">Nice</button></div><p class="muted" style="font-size:11.5px;margin-top:12px">Prize funded by Play-zone advertising · Skill game · No purchase necessary</p></div>`);
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
              const won = flips <= 16 ? 0.5 : flips <= 22 ? 0.25 : flips <= 30 ? 0.1 : 0;
              const { granted: prize, note } = award(won, `Memory Flip: ${flips} flips`);
              EB.modal(`<div style="text-align:center"><div style="font-size:54px">${prize ? '🏆' : '🃏'}</div><h2>${prize ? `+${money(prize)} credits` : 'All pairs found!'}</h2><p class="muted">${flips} flips. ${note}</p><button class="btn primary" onclick="EB.closeOverlays()">Done</button></div>`);
              renderContext();
            }
          }
        };
        g.append(c);
      });
    };
    draw();
  }

  /* ---------------- Buzz Feed (social) ---------------- */
  let feedFilter = 'For you';
  function renderFeed(opt = {}) {
    S.view = 'feed';
    const me = { id: UID, name: (profile().name || 'Maya R.').replace(/^(\S+)\s+(\S).*$/, '$1 $2.'), avatar: '👩🏽‍💼' };
    const bought = [...new Map(D.all('orders').filter((o) => o.status !== 'Refunded').map((o) => [o.item, o])).values()];
    const v = EB.view('feed', `
      <div class="feed-wrap">
        <div class="row between wrap" style="gap:10px"><div><h1 style="font-size:28px">Buzz Feed</h1><div class="muted">Real reviews, stories and tips from shoppers solving the same problems. Share yours anywhere.</div></div></div>
        <div class="card composer-card">
          <div class="row" style="gap:10px;margin-bottom:10px"><div class="post-av">${me.avatar}</div><div class="seg" data-kind>${['Review', 'Story', 'Tip', 'Question'].map((k) => `<button class="${(opt.compose || 'review') === k.toLowerCase() ? 'on' : ''}" data-k="${k.toLowerCase()}">${k}</button>`).join('')}</div></div>
          <div data-review class="row wrap" style="gap:10px;margin-bottom:8px"><div class="star-in" data-stars>${[1, 2, 3, 4, 5].map((n) => `<button data-n="${n}" class="${n <= 5 ? 'on' : ''}" aria-label="${n} stars">★</button>`).join('')}</div>
            <select class="btn sm" data-prod aria-label="Product"><option value="">Choose a product you bought…</option>${bought.map((o) => `<option value="${esc(o.item)}" ${opt.product === o.item ? 'selected' : ''}>${esc(o.emoji || '')} ${esc(o.item)}</option>`).join('')}</select></div>
          <textarea data-text placeholder="What worked, what didn't? Your experience helps others."></textarea>
          <div class="row between wrap" style="margin-top:8px;gap:8px">
            <div class="row wrap" style="gap:12px;font-size:13px"><span class="row" style="gap:4px">Photo: ${['', '📸', '🪑', '🌙', '🐕'].map((e) => `<button class="chip ${e === '' ? 'on' : ''}" data-emo="${e}" style="padding:3px 9px">${e || 'none'}</button>`).join('')}</span>
              <label class="row" style="gap:6px" title="FTC rules: disclose if you got anything in return"><input type="checkbox" data-inc> I received this product free or was paid</label></div>
            <button class="btn primary" data-post>Post</button></div>
          <div class="muted" style="font-size:11.5px;margin-top:6px">Posts are public under your display name <b>${esc(me.name)}</b>. The AI moderator checks for spam and undisclosed incentives. <a href="#" data-guide>Community guidelines</a></div>
        </div>
        <div class="chips" data-filters>${['For you', 'Reviews', 'Stories', 'Tips & questions', 'Deals', 'My posts'].map((f) => `<button class="chip ${f === feedFilter ? 'on' : ''}" data-f="${f}">${f}</button>`).join('')}</div>
        <div class="feed-wrap" data-list style="max-width:none"></div>
      </div>`);
    let kind = opt.compose || 'review', stars = 5, emo = '';
    const syncKind = () => { $('[data-review]', v).style.display = kind === 'review' ? '' : 'none'; };
    syncKind();
    $$('[data-kind] button', v).forEach((b) => (b.onclick = () => { $$('[data-kind] button', v).forEach((x) => x.classList.remove('on')); b.classList.add('on'); kind = b.dataset.k; syncKind(); }));
    $$('[data-stars] button', v).forEach((b) => (b.onclick = () => { stars = +b.dataset.n; $$('[data-stars] button', v).forEach((x) => x.classList.toggle('on', +x.dataset.n <= stars)); }));
    $$('[data-emo]', v).forEach((b) => (b.onclick = () => { $$('[data-emo]', v).forEach((x) => x.classList.remove('on')); b.classList.add('on'); emo = b.dataset.emo; }));
    $('[data-guide]', v).onclick = (e) => { e.preventDefault(); EB.modal(`<h3>Community guidelines</h3><ul style="padding-left:18px;line-height:1.7;font-size:14px"><li>Share honest experiences. Reviews from purchases are marked "Verified".</li><li>Disclose anything you received for a post (free product, payment, credits).</li><li>No spam, off-platform selling, harassment or personal information.</li><li>Vendors can reply as their brand but can't edit or remove reviews.</li><li>Sponsored posts and ads are always labelled.</li></ul><button class="btn primary" onclick="EB.closeOverlays()">OK</button>`); };
    $$('[data-f]', v).forEach((b) => (b.onclick = () => { feedFilter = b.dataset.f; renderFeed(); }));
    $('[data-post]', v).onclick = async () => {
      const text = $('[data-text]', v).value.trim();
      if (text.length < 10) return EB.toast('Write at least a sentence');
      const prodName = kind === 'review' ? $('[data-prod]', v).value : '';
      if (kind === 'review' && !prodName) return EB.toast('Choose the product you are reviewing');
      const o = bought.find((x) => x.item === prodName);
      const inc = $('[data-inc]', v).checked ? 1 : 0;
      const m = EB.feed.moderate(text, inc);
      const post = { id: D.id('fp'), author_id: UID, author: me.name, avatar: me.avatar, kind, text, rating: kind === 'review' ? stars : null, product: o ? o.item : '', sku: o ? o.sku : '', vendor: o ? o.vendor : '', emoji: emo || (o && o.emoji) || '', promo_price: null, list_price: null, cta: '', sponsored: 0, status: m.flags.length ? 'flagged' : 'published', likes: 0, shares: 0, comments_json: '[]', mod_score: m.score, mod_flags: m.flags.join(','), impressions: 0, clicks: 0, targets: '', incentivized: inc, verified: o ? 1 : 0, created_at: new Date().toISOString() };
      await D.put('feed_posts', post);
      EB.bus.emit('feed:post', { id: post.id, status: post.status });
      if (post.status === 'flagged') EB.toast('Posted. It\'s held for a quick review because: ' + m.flags.join(', '));
      else { EB.toast('Posted to the Buzz Feed 🎉 +20 Buzz points'); EB.feed.share(post); }
      feedFilter = 'My posts'; renderFeed();
    };
    const all = EB.feed.list();
    const visible = all.filter((p) => p.status === 'published' || (p.author_id === UID && p.status !== 'removed'));
    const f = feedFilter;
    const posts = visible.filter((p) => f === 'For you' || (f === 'Reviews' && p.kind === 'review') || (f === 'Stories' && p.kind === 'story') || (f === 'Tips & questions' && ['tip', 'question'].includes(p.kind)) || (f === 'Deals' && p.kind === 'promo') || (f === 'My posts' && p.author_id === UID));
    const list = $('[data-list]', v);
    EB.feed.render(list, { posts, ads: f !== 'My posts', cardOpts: { commentAs: { name: me.name }, refresh: () => renderFeed(), onShop: (p) => {
      const it = find(p.sku) || CATALOG()[p.sku];
      if (!it) return EB.toast('Product not available');
      if (p.kind === 'promo') { S.offers[it.id] = { price: p.promo_price, perks: ['Feed promo'], exp: Date.now() + 15 * 60000 }; addToCart(it); EB.toast(`${it.e} Feed offer applied: ${money(p.promo_price, 0)}`); }
      else details(it);
    } } });
    if (opt.highlight) { const el = $(`[data-post="${opt.highlight}"]`, v); if (el) { el.classList.add('hl'); setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); } }
    if (opt.compose) $('[data-text]', v).focus();
  }

  /* ---------------- Dashboard (full lists live here, not in the chat) ---------------- */
  const TX_TYPES = { order: 'Order', game: 'Game win', referral: 'Referral', promo: 'Promo credit', spend: 'Credits used', refund: 'Credits refunded', expired: 'Credits expired' };
  function allTx() {
    const orders = D.all('orders').map((o) => ({ date: o.date, type: o.status === 'Refunded' ? 'Refund' : 'Order', desc: `${o.emoji || ''} ${o.item}${o.qty > 1 ? ' ×' + o.qty : ''}`, vendor: o.vendor, via: o.via, ref: o.id, amount: o.status === 'Refunded' ? 0 : -o.total, saved: Math.max(0, (o.list_price - o.price) * o.qty), status: o.status }));
    const credits = D.all('wallet_tx').map((w) => ({ date: w.date, type: TX_TYPES[w.type] || w.type, desc: w.label || '', vendor: '-', via: 'Wallet', ref: w.id, amount: w.amount, saved: 0, status: 'Posted', credit: true }));
    return [...orders, ...credits];
  }
  function renderDash() {
    const orders = D.all('orders'), wtx = D.all('wallet_tx'), live = orders.filter((o) => o.status !== 'Refunded');
    const spent = live.reduce((a, o) => a + o.total, 0), saved = live.reduce((a, o) => a + Math.max(0, (o.list_price - o.price) * o.qty), 0);
    const earned = wtx.filter((x) => x.amount > 0 && x.type !== 'refund').reduce((a, x) => a + x.amount, 0), used = -wtx.filter((x) => x.type === 'spend').reduce((a, x) => a + x.amount, 0);
    const deal = live.filter((o) => o.via === 'Deal Room');
    const months = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (11 - i)); return d.toISOString().slice(0, 7); });
    const byMonth = months.map((m) => live.filter((o) => o.date.startsWith(m)).reduce((a, o) => a + o.total, 0));
    const vendors = Object.entries(live.reduce((a, o) => ((a[o.vendor] = (a[o.vendor] || 0) + o.total), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const v = EB.view('dash', `
      <div class="row between wrap" style="margin-bottom:16px;gap:10px"><div><h1 style="font-size:28px">Your dashboard</h1><div class="muted">Everything you've bought, saved and won. Computed on this device from your local database.</div></div><button class="btn sm" data-sync>${icon('db')} Data & devices</button></div>
      ${EB.kpis([['Total spent', money(spent, 0), `${live.length} orders`], ['Saved with live offers', money(saved, 0), `${deal.length} Deal Room orders`, 'up'], ['Avg saving (Deal Room)', (deal.length ? (deal.reduce((a, o) => a + (o.list_price - o.price) / o.list_price, 0) / deal.length) * 100 : 0).toFixed(1) + '%'], ['Credits earned', money(earned), `${wtx.filter((x) => x.type === 'game').length} game wins`], ['Credits used', money(used)], ['Wallet balance', money(walletBal()), `${playsLeft()} plays left today`], ['Buzz points', S.points.toLocaleString(), 'Gold at 2,000'], ['Avg order', money(live.length ? spent / live.length : 0)]])}
      <div class="grid2" style="margin-top:16px">
        <div class="card"><div class="card-title" style="margin-bottom:10px">Spend by month</div>${EB.bars(byMonth.map((x) => x || 0.01))}<div class="row between muted" style="font-size:11px;margin-top:4px"><span>${months[0]}</span><span>${months[11]}</span></div></div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">Top vendors</div>${vendors.map(([n, t]) => `<div style="margin:8px 0"><div class="row between" style="font-size:13px"><span>${esc(n)}</span><b class="num">${money(t, 0)}</b></div><div class="meter"><i style="width:${(t / vendors[0][1]) * 100}%"></i></div></div>`).join('')}</div>
      </div>
      <div class="card" style="margin-top:16px"><div class="card-head"><div class="card-title">All transactions</div><span class="muted" style="font-size:13px">Orders, refunds and every wallet movement</span></div><div data-table></div></div>`);
    const tbl = EB.dataTable({
      rows: allTx(), filterKey: 'type', csv: 'ebuzz-my-transactions.csv', sumKey: 'amount', sumLabel: 'Net',
      columns: [
        { key: 'date', label: 'Date' },
        { key: 'type', label: 'Type', fmt: (t) => `<span class="tag ${t === 'Order' ? '' : t === 'Game win' ? 'honey' : t === 'Refund' || t === 'Credits refunded' ? 'blue' : t === 'Credits expired' ? 'red' : 'green'}">${t}</span>` },
        { key: 'desc', label: 'Description' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'via', label: 'Channel' },
        { key: 'ref', label: 'Ref', fmt: (x) => `<span class="mono muted" style="font-size:12px">${esc(x)}</span>` },
        { key: 'saved', label: 'Saved', right: true, fmt: (x) => (x ? `<span class="up">${money(x)}</span>` : '') },
        { key: 'amount', label: 'Amount', right: true, fmt: (x, r) => `<span class="num ${x > 0 ? 'up' : ''}">${x > 0 ? '+' : x < 0 ? '−' : ''}${money(Math.abs(x))}</span>` },
      ],
    });
    $('[data-table]', v).append(tbl);
    $('[data-sync]', v).onclick = () => EB.syncView();
  }

  /* ---------------- Wallet / Orders / Account ---------------- */
  function renderWallet() {
    const wtx = D.all('wallet_tx').sort((a, b) => b.date.localeCompare(a.date));
    const monthStart = D.today().slice(0, 8) + '01';
    const month = wtx.filter((x) => x.date >= monthStart && x.amount > 0);
    EB.view('wallet', `
      <h1 style="font-size:28px;margin-bottom:16px">Wallet</h1>
      <div class="card honey-edge"><div class="row between wrap" style="gap:16px">
        <div><div class="muted" style="font-weight:600;font-size:13px">AVAILABLE CREDITS</div><div style="font-family:var(--display);font-size:44px;font-weight:700" class="num">${money(walletBal())}</div><div class="muted" style="font-size:13px">Credits expire 60 days after you earn them</div></div>
        <div class="stack" style="min-width:220px"><div class="set-row" style="border:0;padding:0"><div>Auto-apply at checkout<small>Up to 10% of each order</small></div><label class="toggle"><input type="checkbox" ${S.autoApply ? 'checked' : ''} id="aa"><span></span></label></div><button class="btn primary" data-play>${icon('play')} Win more credits</button></div>
      </div></div>
      <div class="kpis" style="margin:16px 0">${[['Earned this month', money(month.reduce((a, x) => a + x.amount, 0)), `${month.length} credits`], ...winUsage().map((u) => [`${u.label} win limit`, `${money(u.used)} / ${money(u.cap)}`, u.used >= u.cap ? 'limit reached' : 'available'])].map((k) => `<div class="kpi"><div class="l">${k[0]}</div><div class="v">${k[1]}</div><div class="d muted">${k[2]}</div></div>`).join('')}</div>
      <div class="card"><div class="card-head"><div class="card-title">Recent activity</div><button class="btn sm" data-all>Full history in Dashboard →</button></div>${EB.table(['Date', 'Activity', 'Amount'], wtx.slice(0, 8).map((x) => [x.date, esc(x.label || x.type), `<span class="${x.amount > 0 ? 'up' : ''}">${x.amount > 0 ? '+' : '−'}${money(Math.abs(x.amount))}</span>`]), { right: [2] })}</div>
      <div class="card flat" style="margin-top:16px"><div class="card-title" style="margin-bottom:6px">How credits work</div><p class="muted" style="margin:0;font-size:14px">Credits come from games (paid for by ads), referrals and promotions. They have no cash value, expire 60 days after you earn them, and can cover up to 10% of any order. Win limits are set by eBuzz so the prize pool stays fair.</p></div>`);
    $('#aa').onchange = (e) => { S.autoApply = e.target.checked; renderContext(); };
    $('[data-play]').onclick = () => { EB.setNav('play'); nav('play'); };
    $('[data-all]').onclick = () => { EB.setNav('dash'); nav('dash'); };
  }

  function renderOrders() {
    const list = D.all('orders', 'ORDER BY date DESC, id DESC LIMIT 6');
    const steps = ['Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
    EB.view('orders', `<div class="row between wrap" style="margin-bottom:16px"><h1 style="font-size:28px">Recent orders</h1><button class="btn sm" data-all>All ${D.count('orders')} orders in Dashboard →</button></div><div class="stack" style="gap:14px">${list.map((o) => {
      const at = o.status === 'Refunded' ? -1 : steps.indexOf(o.status);
      return `<div class="card"><div class="row between wrap"><div class="row"><div class="em" style="width:52px;height:52px;border-radius:12px;display:grid;place-items:center;font-size:26px;background:var(--surface-2)">${o.emoji || '📦'}</div><div><b>${esc(o.item)}</b>${o.qty > 1 ? ' ×' + o.qty : ''}<div class="muted" style="font-size:13px">${o.id} · ${esc(o.vendor)} · ${o.date} · ${money(o.total)}${o.via === 'Deal Room' ? ' · <span class="tag green">Deal Room</span>' : ''}</div></div></div><span class="tag ${o.status === 'Delivered' ? 'green' : o.status === 'Refunded' ? 'blue' : 'honey'}">${o.status}</span></div>
      ${o.status === 'Refunded' ? '' : `<div class="row" style="gap:4px;margin-top:14px">${steps.map((s, i) => `<div style="flex:1"><div class="meter ${i <= at ? 'g' : ''}"><i style="width:${i <= at ? 100 : 0}%"></i></div><div style="font-size:11px;margin-top:4px" class="${i <= at ? '' : 'muted'}">${s}</div></div>`).join('')}</div>`}
      <div class="card-foot"><button class="btn sm" onclick="EB.toast('Track Shipping agent: on schedule')">${icon('truck')} Track</button><button class="btn sm" onclick="EB.toast('Returns agent: prepaid label created (demo)')">${icon('ret')} Return</button><button class="btn sm ghost" onclick="EB.toast('Opening support chat…')">Get help</button></div></div>`;
    }).join('')}</div>`);
    $('[data-all]').onclick = () => { EB.setNav('dash'); nav('dash'); };
  }

  function renderAccount() {
    const p = profile(), pf = D.get('prefs', UID) || {}, vals = (() => { try { return JSON.parse(pf.values_json || '[]'); } catch { return []; } })();
    const lockTag = `<span class="cls vault" title="Encrypted on your device; eBuzz servers only store ciphertext">${icon('lock')} E2EE</span>`;
    const v = EB.view('account', `
      <h1 style="font-size:28px;margin-bottom:6px">Account & preferences</h1>
      <p class="muted" style="margin:0 0 16px">Your personal details live in the SQLite database on your devices. They sync end-to-end encrypted: eBuzz can't read them. Only your state (for sales tax) is stored centrally.</p>
      <div class="grid2">
        <div class="card"><div class="card-head"><div class="card-title">Profile</div>${lockTag}</div>
          <div class="stack" data-profile>
            <label class="field">Name<input data-f="name" value="${esc(p.name || '')}"></label>
            <label class="field">Email<input data-f="email" value="${esc(p.email || '')}"></label>
            <label class="field">Phone<input data-f="phone" value="${esc(p.phone || '')}"></label>
            <label class="field">Street address<input data-f="address" value="${esc(p.address || '')}"></label>
            <div class="grid2" style="grid-template-columns:2fr 1fr 1fr"><label class="field">City<input data-f="city" value="${esc(p.city || '')}"></label><label class="field">State <span class="cls central">central</span><input data-f="state" value="${esc(p.state || '')}" maxlength="2"></label><label class="field">ZIP<input data-f="zip" value="${esc(p.zip || '')}"></label></div>
            <div class="row between" style="font-size:14px"><span>💳 ${esc(p.card_label || '')} <span class="muted">(token held by payment partner)</span></span><button class="btn sm primary" data-save>Save</button></div></div></div>
        <div class="card"><div class="card-head"><div class="card-title">Shopping preferences</div>${lockTag}</div>
          <div class="stack">
            <div><div class="field" style="margin-bottom:6px">Budget style</div><div class="seg" data-seg="budget_style">${['Value', 'Balanced', 'Premium'].map((x) => `<button class="${pf.budget_style === x ? 'on' : ''}">${x}</button>`).join('')}</div></div>
            <div><div class="field" style="margin-bottom:6px">Delivery speed</div><div class="seg" data-seg="delivery">${['Standard', 'Fast', 'Fastest'].map((x) => `<button class="${pf.delivery === x ? 'on' : ''}">${x}</button>`).join('')}</div></div>
            <div><div class="field" style="margin-bottom:6px">Values</div><div class="chips" data-multi>${['Sustainable', 'Small brands', 'Long warranty', 'Made in USA'].map((x) => `<button class="chip ${vals.includes(x) ? 'on' : ''}">${x}</button>`).join('')}</div></div>
            <label class="field">Brands to avoid<input data-avoid value="${esc(pf.avoid || '')}"></label>
          </div></div>
        <div class="card"><div class="card-head"><div class="card-title">What eBuzz remembers</div><span class="cls local">${icon('lock')} this device only</span></div>
          <p class="muted" style="margin:0 0 8px;font-size:13px">The Concierge uses these memories to personalise suggestions. They never leave your device.</p>
          <div data-mem></div>
          <div class="row" style="margin-top:10px"><input class="btn sm" style="flex:1;text-align:left;border-radius:10px" placeholder="Add something, e.g. 'allergic to wool'" data-newmem><button class="btn sm" data-addmem>Add</button></div></div>
        <div class="card"><div class="card-head"><div class="card-title">Privacy, devices & consent</div></div>
          ${[['offers_opt_in', 'Personalised live offers', 'Vendors see your problem and budget band, never your identity. (Stored centrally as a consent flag.)'], ['memory_opt_in', 'Remember my conversations', 'On this device only'], ['train_opt_in', 'Use my data to improve models', 'Off by default']].map(([k, a, b]) => `<div class="set-row"><div>${a}<small>${b}</small></div><label class="toggle"><input type="checkbox" data-pref="${k}" ${pf[k] === '1' ? 'checked' : ''}><span></span></label></div>`).join('')}
          <div class="card-foot"><button class="btn sm primary" data-sync>${icon('db')} Data & devices</button><button class="btn sm" data-export>Download my data</button><button class="btn sm danger ghost" onclick="EB.toast('Account deletion requires confirmation by email (demo)')">Delete account</button></div></div>
      </div>`);
    const renderMem = () => { $('[data-mem]', v).innerHTML = memories().map((m) => `<div class="set-row"><span style="font-size:13.5px">${esc(m.text)}</span><button class="btn sm ghost danger" data-delmem="${m.id}" aria-label="Forget">${icon('x')}</button></div>`).join('') || '<p class="muted">Nothing remembered.</p>'; $$('[data-delmem]', v).forEach((b) => (b.onclick = async () => { await D.del('memory', b.dataset.delmem); renderMem(); renderContext(); EB.toast('Forgotten'); })); };
    renderMem();
    const savePrefs = async () => { const cur = D.get('prefs', UID) || { id: UID }; const patch = { ...cur, values_json: JSON.stringify($$('[data-multi] .chip.on', v).map((c) => c.textContent)), avoid: $('[data-avoid]', v).value }; $$('[data-seg]', v).forEach((s) => (patch[s.dataset.seg] = ($('button.on', s) || {}).textContent)); $$('[data-pref]', v).forEach((c) => (patch[c.dataset.pref] = c.checked ? '1' : '0')); await D.put('prefs', patch); EB.toast('Preferences saved · synced to your devices (encrypted)'); };
    $$('[data-seg]', v).forEach((s) => $$('button', s).forEach((b) => (b.onclick = () => { $$('button', s).forEach((x) => x.classList.remove('on')); b.classList.add('on'); savePrefs(); })));
    $$('[data-multi] .chip', v).forEach((c) => (c.onclick = () => { c.classList.toggle('on'); savePrefs(); }));
    $$('[data-pref]', v).forEach((c) => (c.onchange = savePrefs));
    $('[data-avoid]', v).onchange = savePrefs;
    $('[data-save]', v).onclick = async () => { const np = { ...profile() }; $$('[data-f]', v).forEach((i) => (np[i.dataset.f] = i.value.trim())); await D.put('profile', np); EB.toast('Profile saved · encrypted before sync'); };
    $('[data-addmem]', v).onclick = async () => { const t = $('[data-newmem]', v).value.trim(); if (!t) return; await D.put('memory', { id: D.id('mem'), kind: 'note', text: t, date: D.today() }); $('[data-newmem]', v).value = ''; renderMem(); renderContext(); };
    $('[data-sync]', v).onclick = () => EB.syncView();
    $('[data-export]', v).onclick = () => { const blob = { profile: profile(), prefs: D.get('prefs', UID), orders: D.all('orders'), wallet: D.all('wallet_tx'), memory: memories() }; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: 'application/json' })); a.download = 'my-ebuzz-data.json'; a.click(); EB.toast('Exported from this device'); };
  }

  /* ---------------- boot: open the local SQLite, pull from central, then start ---------------- */
  EB.bindSyncChip && D.init({ persona: 'customer', seed }).then(() => {
    EB.bindSyncChip();
    renderContext();
    const hello = h(`<div class="card flat" style="background:var(--surface-2);border:0"><div class="row between wrap" style="gap:10px"><div style="font-size:14px">🍯 You have <b>${money(walletBal())}</b> in credits · <b>${playsLeft()}</b> free plays today${cartRows().length ? ` · <b>${cartRows().length}</b> item(s) in your cart` : ''}</div><button class="btn sm" onclick="document.querySelector('[data-nav=play]').click()">${icon('play')} Play & Win</button></div></div>`);
    chat.bot([`<h2 style="font-size:24px;margin-bottom:6px">Hi ${esc((profile().name || 'there').split(' ')[0])} 👋</h2><p>What are you trying to <b>solve</b> today? Describe the problem in your own words. I'll suggest a fix, shortlist the best products, and get vendors to compete for your order.</p>`, hello], { delay: 400 });
    suggestDefault();
    if (location.hash === '#play') { EB.setNav('play'); renderPlay(); }
    if (location.hash === '#dash') { EB.setNav('dash'); renderDash(); }
    if (location.hash === '#feed') { EB.setNav('feed'); renderFeed(); }
    const deep = location.hash.match(/^#post=([\w-]+)/);
    if (deep) { EB.setNav('feed'); renderFeed({ highlight: deep[1] }); }
    // another device (or the Admin portal changing win limits) updated synced data
    D.on((e) => { if (e.type !== 'remote') return; renderContext(); if (['dash', 'wallet', 'orders', 'account', 'play', 'feed'].includes(S.view)) nav(S.view); });
  });
})();
