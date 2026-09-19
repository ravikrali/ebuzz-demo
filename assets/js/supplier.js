/* eBuzz.ai: Supplier Hub prototype (Sitwell Home Co. operations admin) */
(function () {
  const { h, $, $$, money, sleep, icon } = EB;

  const chat = EB.shell({
    persona: 'supplier',
    user: { name: 'Priya Shah', role: 'Ops Admin · Sitwell Home Co.', initials: 'PS', cls: 'g' },
    rail: [
      { id: 'board', label: 'Dashboard', icon: 'grid' },
      { id: 'dash', label: 'Copilot', icon: 'chat' },
      { id: 'feed', label: 'Buzz Feed', icon: 'feed', badge: 1 },
      { id: 'ads', label: 'Ads & promos', icon: 'megaphone' },
      { id: 'page', label: 'Landing page', icon: 'home' },
      { id: 'contracts', label: 'Contracts', icon: 'file', badge: 1 },
      { id: 'skus', label: 'SKU upload', icon: 'upload' },
      { id: 'inventory', label: 'Inventory', icon: 'boxes' },
      { id: 'orders', label: 'Orders', icon: 'truck', badge: 4 },
      { id: 'payouts', label: 'Payouts', icon: 'dollar' },
      { id: 'compliance', label: 'Compliance', icon: 'shield' },
      { id: 'team', label: 'Team & access', icon: 'users' },
    ],
    placeholder: 'Ask Supplier Copilot, e.g. "upload new SKUs" or "what needs my attention?"',
    note: 'Supplier Copilot drafts and checks. You approve anything that changes contracts, prices or money.',
    onNav: (id) => (VIEWS[id] ? VIEWS[id]() : (EB.view('chat'), ask(LABELS[id], id))),
  });
  EB.setNav('dash');
  const LABELS = { dash: 'Give me today\'s overview', contracts: 'Show my contracts', skus: 'I want to upload new SKUs', inventory: 'How is my inventory?', orders: 'Which orders need action?', returns: 'Show open returns', payouts: 'When is my next payout?', compliance: 'Am I compliant?' };

  $('#context').innerHTML = `
    <div class="ctx-section"><div class="row between"><h4 style="margin:0">Store health</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
      <div class="row" style="gap:14px;margin-top:10px"><div style="width:74px;height:74px;border-radius:50%;background:conic-gradient(var(--green) 0 88%, var(--surface-3) 0);display:grid;place-items:center"><div style="width:58px;height:58px;border-radius:50%;background:var(--surface);display:grid;place-items:center;font-family:var(--display);font-weight:700;font-size:20px">88</div></div>
      <div style="font-size:13px"><b>Good standing</b><div class="muted">Top 20% of home-office sellers</div></div></div>
      ${[['On-time shipping', 97, 'g'], ['Catalog quality', 91, 'g'], ['Deal response rate', 74, ''], ['Return rate (lower is better)', 6, 'r']].map(([l, v, c]) => `<div style="margin-top:10px"><div class="row between" style="font-size:12.5px"><span>${l}</span><b>${v}%</b></div><div class="meter ${c}"><i style="width:${v}%"></i></div></div>`).join('')}
    </div>
    <div class="ctx-section"><h4>Needs attention</h4><div class="stack" style="font-size:13.5px">
      <button class="chip" data-go="contracts">📝 Deal Room addendum awaiting signature</button>
      <button class="chip" data-go="orders">🚚 4 orders must ship today</button>
      <button class="chip" data-go="compliance">⚠️ Insurance certificate expires in 21 days</button>
      <button class="chip" data-go="inventory">📦 Aria Charcoal: 9 days of stock</button></div></div>
    <div class="ctx-section"><h4>Account</h4><div style="font-size:13px" class="stack"><div class="row between"><span>Plan</span><span class="tag violet">Deal Room Pro</span></div><div class="row between"><span>Commission</span><b>11%</b></div><div class="row between"><span>Payout schedule</span><b>Weekly · T+7</b></div><div class="row between"><span>Seller verification (INFORM)</span><span class="tag green">Verified</span></div></div></div>`;
  $$('[data-go]').forEach((b) => (b.onclick = () => { EB.closeOverlays(); EB.setNav(b.dataset.go); EB.view('chat'); ask(LABELS[b.dataset.go], b.dataset.go); }));

  /* ---------- widgets ---------- */
  const W = {
    async dash() {
      await chat.bot([`Here's your overview for <b>Thu, Sep 18</b>:`, h(`<div class="card">${EB.kpis([['GMV (30d)', '$84.2k', '+18%', 'up'], ['Orders (30d)', '312', '+11%', 'up'], ['Deal Room wins', '96', '38% win rate'], ['Pending payout', '$12,480', 'Tue Sep 23'], ['Active SKUs', '44', '3 low stock'], ['Avg rating', '4.4★', '1,910 reviews']])}</div>`),
        EB.aiNote('<b>Three things today:</b> sign the Deal Room addendum (2 min), ship 4 orders before 5pm, and reorder Aria Charcoal. Want me to draft the purchase order?')]);
    },
    async contracts() {
      const rows = [
        ['Master Seller Agreement', 'v3.2', '<span class="tag green">Signed</span>', 'Jan 12, 2026', ''],
        ['Deal Room Addendum', 'v1.4', '<span class="tag honey">Needs signature</span>', '-', '<button class="btn sm primary" data-sign>Review & sign</button>'],
        ['Promotional Co-funding (Q4)', 'draft', '<span class="tag blue">Draft from eBuzz</span>', '-', '<button class="btn sm" data-view>Review</button>'],
        ['Data Processing Agreement', 'v2.0', '<span class="tag green">Signed</span>', 'Jan 12, 2026', ''],
        ['Brand-sponsored Game Level', 'draft', '<span class="tag">Optional</span>', '-', '<button class="btn sm" data-view>Review</button>'],
      ];
      const card = h(`<div class="card">${EB.table(['Agreement', 'Version', 'Status', 'Signed', ''], rows, { left: true })}</div>`);
      await chat.bot(['Your agreements with eBuzz:', card]);
      $$('[data-view]', card).forEach((b) => (b.onclick = () => EB.toast('Opening draft (demo)')));
      $('[data-sign]', card).onclick = () => {
        const m = EB.modal(`<h3 style="margin-bottom:4px">Deal Room Addendum v1.4</h3><p class="muted" style="margin-top:0">8 pages · Plain-English summary by Contract Agent</p>
          ${EB.aiNote(`<b>Key terms</b><ul style="margin:6px 0 0;padding-left:18px"><li>Commission stays <b>11%</b>, charged only on won Deal Room sales</li><li><b>You</b> set floor prices; eBuzz can't offer below them</li><li>Offers are private to one shopper and expire in 15 min</li><li>You won't see competitor identities; eBuzz won't share your offers with competitors</li><li>Deal Boost is optional, billed per boosted view</li></ul>`)}
          <div class="warn-note" style="margin-top:10px"><b>Changed since v1.3:</b> offer validity reduced from 30 to 15 min (§4.2).</div>
          <label class="field" style="margin-top:14px">Type your full name to sign<input id="sig" placeholder="Priya Shah"></label>
          <div class="row" style="margin-top:14px"><button class="btn primary" id="doSign">Sign agreement</button><button class="btn ghost" onclick="EB.closeOverlays()">Cancel</button></div>`);
        $('#doSign', m).onclick = () => {
          if ($('#sig', m).value.trim().length < 3) return EB.toast('Please type your name to sign');
          EB.closeOverlays();
          const tr = $('[data-sign]', card).closest('tr');
          tr.children[2].innerHTML = '<span class="tag green">Signed</span>'; tr.children[3].textContent = 'Today'; tr.children[4].innerHTML = '';
          chat.bot(`${icon('check')} Signed. A countersigned PDF is in <b>Contracts</b> and was emailed to you. Deal Room Pro features are now fully active.`);
          const b = $('[data-nav=contracts] .badge'); if (b) b.remove();
        };
      };
    },
    async skus() {
      const card = h(`<div class="card"><div class="card-head"><div class="card-title">${icon('upload')} Add products</div><a class="btn sm ghost" href="#" onclick="EB.toast('Template downloaded (demo)');return false">Download CSV template</a></div>
        <div id="drop" style="border:2px dashed var(--line);border-radius:14px;padding:26px;text-align:center;cursor:pointer" tabindex="0" role="button">
          <div style="font-size:34px">📄</div><b>Drop a CSV or XLSX here</b><div class="muted" style="font-size:13px">or click to use the sample file <code>sitwell_fall_2026.csv</code> (48 rows)</div></div>
        <div class="row wrap" style="margin-top:12px"><span class="muted" style="font-size:13px">Or connect:</span><button class="btn sm">Shopify</button><button class="btn sm">Amazon Seller Central</button><button class="btn sm">Google Merchant feed</button></div>
        <div id="upl"></div></div>`);
      await chat.bot(['Sure. Upload a file or connect a store. Catalog QA Agent will check every row and fix what it safely can.', card]);
      const go = async () => {
        const u = $('#upl', card); $('#drop', card).style.display = 'none';
        u.innerHTML = `<div style="margin-top:14px"><div class="row between" style="font-size:13px"><span id="st">Uploading sitwell_fall_2026.csv…</span><b id="pc">0%</b></div><div class="meter v"><i id="pb" style="width:0"></i></div></div>`;
        const steps = ['Uploading…', 'Mapping columns to eBuzz schema…', 'Checking images & titles…', 'Checking compliance fields (Prop 65, CPSC)…', 'Matching products to problems…'];
        for (let i = 0; i <= 100; i += 4) { $('#pb', u).style.width = i + '%'; $('#pc', u).textContent = i + '%'; $('#st', u).textContent = steps[Math.min(4, Math.floor(i / 21))]; await sleep(55); }
        u.innerHTML = `<div class="kpis" style="margin-top:14px">${[['Rows', '48'], ['Ready', '44'], ['AI-fixed', '3'], ['Need you', '1']].map((k, i) => `<div class="kpi"><div class="l">${k[0]}</div><div class="v ${i === 2 ? '' : i === 3 ? 'down' : ''}">${k[1]}</div></div>`).join('')}</div>
          <div style="margin-top:12px">${EB.table(['SKU', 'Title', 'Price', 'Stock', 'Result'], [
            ['SW-ARIA-CH', 'Sitwell Aria Ergonomic Chair, Charcoal', '$259', '42', '<span class="tag green">Ready</span>'],
            ['SW-ARIA-SG', 'Sitwell Aria Ergonomic Chair, Sage', '$259', '30', '<span class="tag violet">AI-fixed: color "sage grn" → Sage</span>'],
            ['SW-CUSH-01', 'Sitwell Memory Foam Seat Cushion', '$39', '210', '<span class="tag violet">AI-fixed: title shortened to 80 chars</span>'],
            ['SW-FOOT-02', 'Sitwell Rocking Footrest', '$34', '96', '<span class="tag violet">AI-fixed: category → Home Office › Ergonomics</span>'],
            { hl: true, cells: ['SW-LAMP-07', 'Sitwell Task Lamp LED', '$49', '60', '<span class="tag red">Missing Prop 65 warning field</span> <button class="btn sm" data-fix>Fix</button>'] },
          ], { right: [2, 3] })}</div>
          ${EB.aiNote('Matched these SKUs to <b>7 trending problems</b>, including "tailbone pain when sitting" (+64% this month). Your new seat cushion will show up for those shoppers.')}
          <div class="card-foot"><button class="btn primary" data-pub>Publish 47 SKUs</button><button class="btn ghost">Review all 48</button></div>`;
        $('[data-fix]', u).onclick = (e) => { const m = EB.modal(`<h3>Prop 65 warning: SW-LAMP-07</h3><p class="muted">California requires a warning if the product contains listed chemicals above safe-harbor levels. Your supplier spec sheet mentions a <b>PVC cord</b>.</p><label class="field">Warning required?<select id="p65"><option>Yes: add standard warning text</option><option>No: product tested below thresholds (upload lab report)</option></select></label><div class="row" style="margin-top:14px"><button class="btn primary" id="okP">Save</button></div>`); $('#okP', m).onclick = () => { EB.closeOverlays(); const tr = e.target.closest('tr'); tr.classList.remove('hl'); tr.lastElementChild.innerHTML = '<span class="tag green">Ready</span>'; $('[data-pub]', u).textContent = 'Publish 48 SKUs'; }; };
        $('[data-pub]', u).onclick = (e) => { e.target.disabled = true; chat.bot(`${icon('check')} Published. New SKUs are live in eBuzz search and eligible for the Deal Room. I set <b>starter floor prices at 88% of list</b>; change them in Inventory.`); };
      };
      $('#drop', card).onclick = go; $('#drop', card).onkeydown = (e) => e.key === 'Enter' && go();
    },
    async inventory() {
      const rows = [
        ['SW-ARIA-CH', 'Aria, Charcoal', '42', '9 days', '$228', '<span class="tag red">Reorder</span>'],
        ['SW-ARIA-SG', 'Aria, Sage', '30', '21 days', '$228', '<span class="tag green">OK</span>'],
        ['SW-CUSH-01', 'Seat Cushion', '210', '64 days', '$33', '<span class="tag green">OK</span>'],
        ['SW-FOOT-02', 'Rocking Footrest', '96', '38 days', '$29', '<span class="tag green">OK</span>'],
        ['SW-ARIA-BL', 'Aria, Black', '4', '2 days', '$228', '<span class="tag red">Critical</span>'],
      ];
      const c = h(`<div class="card">${EB.table(['SKU', 'Product', 'Stock', 'Cover', 'Floor', 'Status'], rows, { right: [2, 4] })}<div class="card-foot"><button class="btn sm primary" data-po>Draft reorder PO</button><button class="btn sm" data-pause>Pause Deal Room discounts on low stock</button></div></div>`);
      await chat.bot(['Inventory synced 4 min ago from your warehouse system:', c, EB.aiNote('<b>Aria Black</b> sells ~2/day and runs out in 2 days. I suggest pausing discounts on it so the Deal Room doesn\'t sell out stock you\'d sell at full price anyway.')]);
      $('[data-po]', c).onclick = () => chat.bot(h(`<div class="card"><div class="card-title" style="margin-bottom:8px">Draft PO #PO-1182 → Guangzhou Seating Ltd.</div>${EB.table(['SKU', 'Qty', 'Unit', 'Total'], [['SW-ARIA-CH', '120', '$96', '$11,520'], ['SW-ARIA-BL', '150', '$96', '$14,400']], { right: [1, 2, 3] })}<div class="card-foot"><button class="btn sm primary" onclick="this.disabled=true;EB.toast('PO sent to supplier (demo)')">Approve & send</button><span class="muted" style="font-size:12.5px">ETA 32 days · stock-out risk covered by safety stock</span></div></div>`));
      $('[data-pause]', c).onclick = (e) => { e.target.disabled = true; EB.toast('Discounts paused for SKUs under 10 days of cover'); };
    },
    async orders() {
      const c = h(`<div class="card">${EB.table(['Order', 'Item', 'Via', 'Ship by', ''], [
        ['EB-20571', 'Aria, Charcoal', '<span class="tag honey">Deal Room</span>', '<b class="down">Today 5pm</b>', '<button class="btn sm" data-l>Buy label</button>'],
        ['EB-20569', 'Seat Cushion ×2', 'Concierge', '<b class="down">Today 5pm</b>', '<button class="btn sm" data-l>Buy label</button>'],
        ['EB-20566', 'Aria, Sage', '<span class="tag honey">Deal Room</span>', '<b class="down">Today 5pm</b>', '<button class="btn sm" data-l>Buy label</button>'],
        ['EB-20560', 'Rocking Footrest', 'Top10 page', '<b class="down">Today 5pm</b>', '<button class="btn sm" data-l>Buy label</button>'],
        ['EB-20544', 'Aria, Charcoal', 'Concierge', 'Shipped', '<span class="tag green">In transit</span>'],
      ], { left: true })}<div class="card-foot"><button class="btn sm primary" data-all>Buy all 4 labels (UPS Ground, $58.40)</button></div></div>`);
      await chat.bot(['4 orders must ship today to keep your on-time rate at 97%:', c]);
      const lab = (b) => { b.closest('td').innerHTML = '<span class="tag green">Label ✓</span>'; };
      $$('[data-l]', c).forEach((b) => (b.onclick = () => lab(b)));
      $('[data-all]', c).onclick = (e) => { $$('[data-l]', c).forEach(lab); e.target.disabled = true; EB.toast('4 labels created · pickup booked 3:30pm'); };
    },
    async returns() {
      const c = h(`<div class="card">${EB.table(['Return', 'Item', 'Reason', 'AI recommendation', ''], [
        ['R-3391', 'Aria, Sage', '"Too firm for me"', 'Approve: within 60 days, resell as new', '<button class="btn sm" data-ok>Approve</button>'],
        ['R-3388', 'Seat Cushion', '"Arrived damaged" + photo', 'Refund, no return needed (item worth less than return shipping)', '<button class="btn sm" data-ok>Approve</button>'],
      ], { left: true })}</div>`);
      await chat.bot(['2 open returns. Returns Agent handled 11 others automatically this week within your policy.', c]);
      $$('[data-ok]', c).forEach((b) => (b.onclick = () => (b.closest('td').innerHTML = '<span class="tag green">Approved</span>')));
    },
    async payouts() {
      await chat.bot(['Your next payout is <b>Tue, Sep 23</b>:', h(`<div class="card">${EB.table(['Line', 'Amount'], [['Gross sales (delivered, T+7)', '$15,210.00'], ['eBuzz commission (11%)', '−$1,673.10'], ['Deal Boost fees', '−$412.80'], ['Refunds & returns', '−$518.10'], ['Game-level sponsorship', '−$126.00'], { hl: true, cells: ['<b>Net payout</b>', '<b>$12,480.00</b>'] }], { right: [1] })}<div class="card-foot"><span class="muted" style="font-size:13px">To Chase ···· 7781 via Stripe Connect · 1099-K issued in January</span></div></div>`)]);
    },
    async compliance() {
      await chat.bot(['Compliance checklist (checked daily by the Regulatory Watch Agent):', h(`<div class="card">${[
        ['W-9 tax form', 'green', 'On file'], ['INFORM Consumers Act verification', 'green', 'Verified Jan 12'], ['Product liability insurance certificate', 'honey', 'Expires Oct 9: upload the renewal'],
        ['CPSC / children\'s product certificates', 'green', 'Not applicable to your catalog'], ['Prop 65 warnings', 'green', 'Complete (after SKU fix)'], ['Recalls on your products', 'green', 'None found (checked CPSC today)'],
      ].map(([a, c, b]) => `<div class="set-row"><div>${a}<small>${b}</small></div><span class="tag ${c}">${c === 'green' ? 'OK' : 'Action'}</span></div>`).join('')}<div class="card-foot"><button class="btn sm primary" onclick="EB.toast('Upload dialog (demo)')">${icon('upload')} Upload insurance renewal</button></div></div>`)]);
    },
  };

  function ask(label, id) { chat.user(label); W[id](); }
  chat.onText = (t) => {
    const s = t.toLowerCase();
    if (/staff|team|role|access|permission|rbac/.test(s)) { chat.bot('Opening Team & access.'); return setTimeout(() => { EB.setNav('team'); team(); }, 500); }
    if (/dashboard|transactions|ledger|all orders/.test(s)) { chat.bot('Opening your dashboard with the full transaction list.'); return setTimeout(() => { EB.setNav('board'); board(); }, 500); }
    const go = (id, msg) => { chat.bot(msg); setTimeout(() => { EB.setNav(id); VIEWS[id](); }, 500); };
    if (/review|feed|repl|rating|comment/.test(s)) return go('feed', 'Opening the Buzz Feed with the reviews that need a reply.');
    if (/\bads?\b|advert|promot|sponsor|boost|campaign|banner/.test(s)) return go('ads', 'Opening Ads & promotions.');
    if (/landing|store ?page|storefront|my page|website/.test(s)) return go('page', 'Opening your landing page builder.');
    const map = [[/contract|sign|agreement/, 'contracts'], [/sku|upload|catalog|product/, 'skus'], [/inventor|stock|reorder/, 'inventory'], [/order|ship|label/, 'orders'], [/return|refund/, 'returns'], [/payout|paid|money|payment/, 'payouts'], [/complian|insurance|prop|tax form/, 'compliance'], [/overview|today|attention|summary/, 'dash']];
    const hit = map.find(([r]) => r.test(s));
    if (hit) { EB.setNav(hit[1]); return W[hit[1]](); }
    chat.bot('I can help with contracts, SKU uploads, inventory, orders, returns, payouts and compliance. What do you need?');
  };

  /* ---------------- data: local SQLite for the org, synced with central ---------------- */
  const D = EB.data, ORG = 'sitwell', esc = EB.esc;
  const PERMS = [
    { group: 'Catalog', key: 'catalog.view', label: 'View catalog & inventory' }, { group: 'Catalog', key: 'catalog.edit', label: 'Edit products & stock' }, { group: 'Catalog', key: 'catalog.upload', label: 'Bulk SKU upload' },
    { group: 'Pricing & Deal Room', key: 'pricing.floors', label: 'Set floor prices' }, { group: 'Pricing & Deal Room', key: 'deal.respond', label: 'Send live offers' }, { group: 'Pricing & Deal Room', key: 'deal.boost', label: 'Manage Deal Boost budget' },
    { group: 'Orders', key: 'orders.view', label: 'View orders' }, { group: 'Orders', key: 'orders.fulfil', label: 'Buy labels & ship' }, { group: 'Orders', key: 'returns.approve', label: 'Approve returns' },
    { group: 'Money', key: 'payouts.view', label: 'View payouts & statements' }, { group: 'Money', key: 'payouts.bank', label: 'Change payout bank account' },
    { group: 'Legal & compliance', key: 'contracts.sign', label: 'Sign agreements' }, { group: 'Legal & compliance', key: 'compliance.docs', label: 'Upload compliance documents' },
    { group: 'Administration', key: 'staff.manage', label: 'Manage staff & roles' },
  ];
  const ROLE_SEED = [
    ['Owner', PERMS.map((p) => p.key)],
    ['Ops Admin', ['catalog.view', 'catalog.edit', 'catalog.upload', 'orders.view', 'orders.fulfil', 'returns.approve', 'payouts.view', 'contracts.sign', 'compliance.docs', 'staff.manage']],
    ['Catalog Manager', ['catalog.view', 'catalog.edit', 'catalog.upload', 'orders.view']],
    ['Pricing Manager', ['catalog.view', 'pricing.floors', 'deal.respond', 'deal.boost', 'orders.view']],
    ['Fulfilment', ['catalog.view', 'orders.view', 'orders.fulfil', 'returns.approve']],
    ['Finance Viewer', ['orders.view', 'payouts.view']],
  ];
  async function seed(tables) {
    const r = D.rng(7), pick = (a) => a[Math.floor(r() * a.length)];
    if (tables.includes('sup_roles')) await D.put('sup_roles', ROLE_SEED.map(([name, perms], i) => ({ id: 'srole-' + i, org: ORG, name, perms_json: JSON.stringify(perms) })), { silent: true });
    if (tables.includes('sup_staff')) await D.put('sup_staff', [
      ['Dana Whitfield', 'dana@sitwellhome.example', 'Owner'], ['Priya Shah', 'priya@sitwellhome.example', 'Ops Admin'], ['Marcus Lee', 'marcus@sitwellhome.example', 'Catalog Manager'],
      ['Elena Ruiz', 'elena@sitwellhome.example', 'Pricing Manager'], ['Tom Becker', 'tom@sitwellhome.example', 'Fulfilment'], ['Grace Kim', 'grace@sitwellhome.example', 'Finance Viewer'],
    ].map(([name, email, role], i) => ({ id: 'sstf-' + i, org: ORG, name, email, role, status: 'active', added_at: D.daysAgo(300 - i * 40) })), { silent: true });
    if (tables.includes('sup_tx')) {
      const SKUS = [['SW-ARIA-CH', 259], ['SW-ARIA-SG', 259], ['SW-ARIA-BL', 259], ['SW-CUSH-01', 39], ['SW-FOOT-02', 34]];
      const rows = [];
      for (let i = 0; i < 150; i++) {
        const day = Math.floor(r() * 180), [sku, list] = pick(SKUS), qty = r() < 0.12 ? 2 : 1;
        const deal = r() < 0.4, price = deal ? Math.round(list * (0.86 + r() * 0.1)) : list, gross = price * qty, fees = +(gross * 0.11).toFixed(2);
        rows.push({ id: 'ST-' + (5000 + i), org: ORG, date: D.daysAgo(day), type: deal ? 'Order · Deal Room' : 'Order', ref: 'EB-' + (18000 + i * 7), sku, qty, gross, fees: -fees, net: +(gross - fees).toFixed(2), status: day < 3 ? 'To ship' : day < 10 ? 'In transit' : 'Settled' });
        if (r() < 0.07) rows.push({ id: 'SR-' + (5000 + i), org: ORG, date: D.daysAgo(Math.max(0, day - 6)), type: 'Refund', ref: 'R-' + (3000 + i), sku, qty, gross: -gross, fees: +fees, net: -(gross - fees), status: 'Settled' });
      }
      for (let w = 1; w <= 25; w++) rows.push({ id: 'SP-' + w, org: ORG, date: D.daysAgo(w * 7 - 2), type: 'Payout', ref: 'PB-' + (900 + w), sku: '', qty: '', gross: 0, fees: 0, net: -Math.round(8000 + r() * 7000), status: 'Paid' });
      for (let m = 0; m < 6; m++) { const f = Math.round(300 + r() * 200); rows.push({ id: 'SB-' + m, org: ORG, date: D.daysAgo(m * 30 + 1), type: 'Boost fee', ref: 'BST-' + m, sku: '', qty: '', gross: 0, fees: -f, net: -f, status: 'Invoiced' }); }
      rows.push({ id: 'SA-1', org: ORG, date: D.daysAgo(12), type: 'Ad spend', ref: 'CMP-101', sku: 'SW-ARIA-CH', qty: '', gross: 0, fees: -420, net: -420, status: 'Invoiced' });
      await D.put('sup_tx', rows, { silent: true });
    }
    if (tables.includes('sup_ads')) await D.put('sup_ads', [
      { id: 'CMP-101', org: ORG, type: 'Sponsored feed post', name: 'Aria + free cushion', product: 'Sitwell Aria', targets: 'Back pain,Tailbone pain', budget: 600, bid: 12, spend: 420, impressions: 11240, clicks: 402, start: D.daysAgo(12), end: D.daysAgo(-2), status: 'active', post_id: 'fp-16', note: '', created_at: D.daysAgo(13) },
      { id: 'CMP-102', org: ORG, type: 'Direct banner', name: 'Buzz Crush level 3 → 15% off', product: 'Sitwell Aria', targets: 'Play & Win', budget: 300, bid: 8, spend: 188, impressions: 23500, clicks: 290, start: D.daysAgo(20), end: D.daysAgo(-10), status: 'active', post_id: '', note: '', created_at: D.daysAgo(21) },
      { id: 'CMP-099', org: ORG, type: 'Deal Boost', name: 'Back-to-school boost', product: 'All products', targets: 'Back pain', budget: 500, bid: 0.9, spend: 500, impressions: 8800, clicks: 555, start: D.daysAgo(48), end: D.daysAgo(28), status: 'ended', post_id: '', note: '', created_at: D.daysAgo(49) },
    ], { silent: true });
    if (tables.includes('sup_pages')) await D.put('sup_pages', PAGE_SEED, { silent: true });
    if (tables.includes('feed_posts')) await EB.feed.seed();
  }
  const ledger = () => {
    const SKU_MAP = { sitwell: 'SW-ARIA-CH', cush: 'SW-CUSH-01' };
    const live = D.all('orders').map((o) => ({ id: o.id, date: o.date, type: o.via === 'Deal Room' ? 'Order · Deal Room' : 'Order', ref: o.id, sku: SKU_MAP[o.sku] || o.sku, qty: o.qty, gross: o.price * o.qty, fees: -+(o.price * o.qty * 0.11).toFixed(2), net: +(o.price * o.qty * 0.89).toFixed(2), status: o.status === 'Confirmed' ? 'To ship' : o.status, live: o.status === 'Confirmed' }));
    return [...live, ...D.all('sup_tx')];
  };

  function board() {
    const L = ledger(), orders = L.filter((x) => String(x.type).startsWith('Order')), last30 = orders.filter((x) => x.date >= D.daysAgo(30));
    const gmv30 = last30.reduce((a, x) => a + x.gross, 0), refunds = L.filter((x) => x.type === 'Refund');
    const deal = last30.filter((x) => x.type.includes('Deal')), payouts = L.filter((x) => x.type === 'Payout');
    const days = Array.from({ length: 30 }, (_, i) => D.daysAgo(29 - i)), daily = days.map((d) => orders.filter((x) => x.date === d).reduce((a, x) => a + x.gross, 0) || 0.01);
    const bySku = Object.entries(orders.reduce((a, x) => ((a[x.sku] = (a[x.sku] || 0) + x.gross), a), {})).sort((a, b) => b[1] - a[1]);
    const v = EB.view('board', `
      <div class="row between wrap" style="margin-bottom:16px;gap:10px"><div><h1 style="font-size:28px">Supplier dashboard</h1><div class="muted">Sitwell Home Co. · every order, refund, fee and payout. Consumer PII is never shown: shipping addresses are released per order through a fulfilment token.</div></div><button class="btn sm" data-sync>${icon('db')} Data & sync</button></div>
      ${EB.kpis([['GMV (30d)', money(gmv30, 0), `${last30.length} orders`], ['Net after fees (30d)', money(last30.reduce((a, x) => a + x.net, 0), 0)], ['Deal Room share', Math.round((deal.length / Math.max(1, last30.length)) * 100) + '%', `${deal.length} orders`], ['To ship now', String(L.filter((x) => x.status === 'To ship').length), 'ship by 5pm', 'down'], ['Refund rate', ((refunds.length / Math.max(1, orders.length)) * 100).toFixed(1) + '%'], ['Paid out (all time)', money(-payouts.reduce((a, x) => a + x.net, 0), 0), `${payouts.length} payouts`]])}
      <div class="grid2" style="margin-top:16px">
        <div class="card"><div class="card-title" style="margin-bottom:10px">Daily GMV · last 30 days</div>${EB.bars(daily)}</div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">GMV by SKU (all time)</div>${bySku.map(([k, t]) => `<div style="margin:8px 0"><div class="row between" style="font-size:13px"><span class="mono">${esc(k)}</span><b class="num">${money(t, 0)}</b></div><div class="meter"><i style="width:${(t / bySku[0][1]) * 100}%"></i></div></div>`).join('')}</div>
      </div>
      ${growthCards()}
      <div class="card" style="margin-top:16px"><div class="card-head"><div class="card-title">All transactions</div><span class="muted" style="font-size:13px">New eBuzz orders sync in live</span></div><div data-t></div></div>`);
    $$('[data-goto]', v).forEach((b) => (b.onclick = () => { EB.setNav(b.dataset.goto); VIEWS[b.dataset.goto](b.dataset.arg ? { buy: b.dataset.arg } : undefined); }));
    const t = EB.dataTable({ rows: L, filterKey: 'type', csv: 'sitwell-transactions.csv', sumKey: 'net', sumLabel: 'Net', columns: [
      { key: 'date', label: 'Date' }, { key: 'type', label: 'Type', fmt: (x, r) => `<span class="tag ${x.startsWith('Order') ? (x.includes('Deal') ? 'honey' : '') : x === 'Refund' ? 'red' : x === 'Payout' ? 'green' : 'blue'}">${x}</span>${r.live ? ' <span class="tag green"><i class="dot live"></i> new</span>' : ''}` },
      { key: 'ref', label: 'Ref', fmt: (x) => `<span class="mono" style="font-size:12px">${esc(x)}</span>` }, { key: 'sku', label: 'SKU', fmt: (x) => `<span class="mono" style="font-size:12px">${esc(x || '')}</span>` }, { key: 'qty', label: 'Qty', right: true },
      { key: 'gross', label: 'Gross', right: true, fmt: (x) => (x ? money(x) : '') }, { key: 'fees', label: 'Fees', right: true, fmt: (x) => (x ? money(x) : '') }, { key: 'net', label: 'Net', right: true, fmt: (x) => `<b class="num ${x < 0 ? 'down' : ''}">${money(x)}</b>` },
      { key: 'status', label: 'Status', fmt: (x) => `<span class="tag ${x === 'To ship' ? 'red' : x === 'In transit' || x === 'Confirmed' ? 'honey' : 'green'}">${x}</span>` },
    ] });
    $('[data-t]', v).append(t);
    $('[data-sync]', v).onclick = () => EB.syncView();
  }

  function team() {
    const v = EB.view('team', `<h1 style="font-size:28px;margin-bottom:4px">Team & access</h1><p class="muted" style="margin:0 0 16px">Add staff and control exactly what each role can do in the Supplier Hub and Deal Room.</p><div data-r></div>`);
    const staff = D.all('sup_staff').sort((a, b) => String(a.added_at).localeCompare(String(b.added_at)));
    const roles = D.all('sup_roles').sort((a, b) => a.id.localeCompare(b.id)).map((r) => ({ id: r.id, name: r.name, perms: JSON.parse(r.perms_json || '[]') }));
    $('[data-r]', v).append(EB.rbacView({
      staff, roles, perms: PERMS, lockedRole: 'Owner', orgLabel: 'Sitwell Home Co.',
      onAddStaff: (s) => D.put('sup_staff', { ...s, org: ORG }),
      onUpdateStaff: (s) => D.put('sup_staff', { ...s, org: ORG }),
      onRemoveStaff: (s) => D.del('sup_staff', s.id),
      onSaveRoles: (rs) => D.put('sup_roles', rs.map((r) => ({ id: r.id, org: ORG, name: r.name, perms_json: JSON.stringify(r.perms) }))),
    }));
  }


  /* ======================= Buzz Feed, ads & landing page (supplier growth tools) ======================= */
  const BRAND = 'Sitwell Home', BRAND_ID = 'brand_sitwell';
  const MY_PRODUCTS = [
    { id: 'sitwell', name: 'Sitwell Aria', e: '🪑', price: 259, blurb: 'Firm ergonomic task chair with adjustable lumbar. Best for 5\'0"–5\'9".' },
    { id: 'cush', name: 'Sitwell Memory Foam Seat Cushion', e: '🟫', price: 39, blurb: 'Pressure-relief cushion for tailbone pain.' },
    { id: 'swfoot', name: 'Sitwell Footrest', e: '🦶', price: 34, blurb: 'Rocking footrest for shorter sitters.' },
  ];
  const PAGE_SEED = { id: 'page-sitwell', org: ORG, vendor: BRAND, slug: 'sitwell-home', logo: '🪑', theme: '#2F7D5B', headline: 'Comfort that fits smaller spaces and shorter frames', tagline: 'Ergonomic seating for home offices, designed in Portland since 2014.', about: 'Sitwell Home Co. makes firm, supportive seating for people who are tired of chairs built for 6-footers. Every chair is tested for 8-hour days by our in-house physio.', products_json: JSON.stringify(MY_PRODUCTS.slice(0, 2)), services_json: JSON.stringify([{ name: 'White-glove assembly', desc: 'We deliver, assemble and take the packaging away.', price: 49 }, { name: 'Free 15-min ergonomic video fit', desc: 'A physio helps you set chair height and lumbar.', price: 0 }]), policies_json: JSON.stringify({ shipping: 'Ships in 1–2 days from Portland, OR', returns: '60-day free returns', warranty: '5-year frame warranty' }), status: 'published', views: 1843, updated_at: new Date(Date.now() - 6 * 864e5).toISOString() };
  const AD_PRODUCTS = [
    { type: 'Sponsored feed post', ic: '📣', price: '$12 CPM', unit: 'CPM', bid: 12, desc: 'A labelled Sponsored post in the Buzz Feed with your offer price and a "Get offer" button.', review: true },
    { type: 'Direct banner', ic: '🖼️', price: '$8 CPM', unit: 'CPM', bid: 8, desc: 'Banner slot served as "Ad · eBuzz direct" in feeds and the Play & Win zone.', review: true },
    { type: 'Deal Boost', ic: '⚡', price: '$0.90 CPC', unit: 'CPC', bid: 0.9, desc: 'Priority in Deal Room shortlists where you already qualify on fit. Never changes the ranking order.', review: false },
    { type: 'Top10 list placement', ic: '🔟', price: '$150 / week', unit: 'week', bid: 150, desc: 'A labelled Sponsored slot under an eBuzz Top10 list for a matching problem.', review: true },
    { type: 'Sponsored game level', ic: '🎮', price: '$400 / week', unit: 'week', bid: 400, desc: 'A branded Buzz Crush level. Winners get a coupon for your product.', review: true },
    { type: 'Store spotlight', ic: '🏬', price: '$10 CPM', unit: 'CPM', bid: 10, desc: 'A feed card that sends shoppers to your landing page.', review: true },
  ];
  const TARGETS = ['Back pain', 'Tailbone pain', 'Posture', 'Small spaces', 'Standing desk', 'Play & Win'];

  function mine() {
    const all = EB.feed.list();
    const reviews = all.filter((p) => p.vendor === BRAND && p.author_id !== BRAND_ID && p.status === 'published');
    return { all, reviews, needs: reviews.filter((p) => ['review', 'question', 'story', 'tip'].includes(p.kind) && !EB.feed.brandReplied(p, BRAND)), promos: all.filter((p) => p.author_id === BRAND_ID) };
  }
  const setBadge = () => { const b = $('[data-nav=feed] .badge'); if (!b) return; const n = mine().needs.length; b.textContent = n; b.style.display = n ? '' : 'none'; };
  const draftReply = (p) => p.rating && p.rating <= 3
    ? `Hi ${p.author.split(' ')[0]}, thanks for the honest review. Memory foam softens slightly in the first 2–3 weeks and then settles. If it keeps flattening, message us and we'll replace it free under our 60-day promise.`
    : `Thanks so much, ${p.author.split(' ')[0]}! 🙌 Really glad the ${p.product || 'product'} is working for you. Tip: re-check your seat height after a week as the foam settles.`;

  function growthCards() {
    const M = mine(), ads = D.all('sup_ads'), act = ads.filter((a) => a.status === 'active'), pg = D.get('sup_pages', 'page-sitwell');
    const spend = ads.filter((a) => a.start >= D.daysAgo(30) || a.status === 'active').reduce((a, x) => a + (+x.spend || 0), 0);
    const rated = M.reviews.filter((p) => p.rating), avg = rated.length ? rated.reduce((a, p) => a + p.rating, 0) / rated.length : 0;
    return `<div class="grid3" style="margin-top:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
      <div class="card"><div class="card-head"><div class="card-title">${icon('feed')} Buzz Feed</div>${M.needs.length ? `<span class="tag red">${M.needs.length} need a reply</span>` : '<span class="tag green">All answered</span>'}</div>
        <div class="muted" style="font-size:13.5px">${M.reviews.length} shopper posts about Sitwell · avg ${avg ? avg.toFixed(1) + '★' : '-'}</div><div class="row wrap" style="margin-top:10px"><button class="btn sm primary" data-goto="feed">Reply to reviews</button></div></div>
      <div class="card"><div class="card-head"><div class="card-title">${icon('megaphone')} Promotions & ads</div><span class="tag ${act.length ? 'green' : ''}">${act.length} active</span></div>
        <div class="muted" style="font-size:13.5px">${money(spend, 0)} spent (30d) · ${ads.filter((a) => a.status === 'pending review').length} in eBuzz ad review</div><div class="row wrap" style="margin-top:10px"><button class="btn sm primary" data-goto="ads" data-arg="Sponsored feed post">Buy a promotion</button><button class="btn sm" data-goto="ads">Manage</button></div></div>
      <div class="card"><div class="card-head"><div class="card-title">${icon('home')} Landing page</div><span class="tag ${pg && pg.status === 'published' ? 'green' : ''}">${pg ? (pg.status === 'published' ? 'Published' : 'Draft') : 'Not created'}</span></div>
        <div class="muted" style="font-size:13.5px">${pg ? `${(+pg.views || 0).toLocaleString()} shopper visits · products & services storefront` : 'Create your own storefront page'}</div><div class="row wrap" style="margin-top:10px"><button class="btn sm primary" data-goto="page">${pg ? 'Edit page' : 'Create page'}</button></div></div>
    </div>`;
  }

  let sf = 'Needs reply';
  function supFeed() {
    const M = mine();
    const rated = M.reviews.filter((p) => p.rating), avg = rated.length ? rated.reduce((a, p) => a + p.rating, 0) / rated.length : 0;
    const replied = M.reviews.length - M.needs.length;
    const v = EB.view('feed', `<div class="feed-wrap">
      <div class="row between wrap" style="gap:10px"><div><h1 style="font-size:28px">Buzz Feed · Sitwell Home</h1><div class="muted">Reply publicly to shopper reviews of the products you sold. You can reply as the brand, but you can't edit or remove reviews.</div></div><button class="btn sm" data-goads>${icon('megaphone')} Promote a post</button></div>
      ${EB.kpis([['Reviews & mentions', M.reviews.length], ['Avg rating', avg ? avg.toFixed(1) + '★' : '-'], ['Need a reply', M.needs.length, 'reply within 24h', M.needs.length ? 'down' : ''], ['Response rate', M.reviews.length ? Math.round((replied / M.reviews.length) * 100) + '%' : '-']])}
      ${EB.aiNote('<b>Reply tips:</b> thank the reviewer, answer the specific issue, and offer a fix in public. Replies are checked by the Moderation agent (no discounts in exchange for changing a rating, no personal data).')}
      <div class="chips" data-filters>${[['Needs reply', M.needs.length], ['My product reviews', M.reviews.length], ['My promotions', M.promos.length], ['All posts', '']].map(([f, n]) => `<button class="chip ${f === sf ? 'on' : ''}" data-f="${f}">${f} ${n !== '' ? `<span class="muted">${n}</span>` : ''}</button>`).join('')}</div>
      <div class="feed-wrap" data-list style="max-width:none"></div></div>`);
    $$('[data-f]', v).forEach((b) => (b.onclick = () => { sf = b.dataset.f; supFeed(); }));
    $('[data-goads]', v).onclick = () => { EB.setNav('ads'); ads({ buy: 'Sponsored feed post' }); };
    const posts = sf === 'Needs reply' ? M.needs : sf === 'My product reviews' ? M.reviews : sf === 'My promotions' ? M.promos : M.all.filter((p) => p.status === 'published');
    EB.feed.render($('[data-list]', v), { posts, ads: sf === 'All posts', cardOpts: { showStats: sf === 'My promotions', noReport: true, commentAs: { name: BRAND, brand: true }, refresh: () => { supFeed(); setBadge(); },
      extra: (p) => (p.vendor === BRAND && p.author_id !== BRAND_ID ? '<button data-draft>✨ Draft reply</button>' : ''),
      bind: (el, p) => { const d = $('[data-draft]', el); if (d) d.onclick = () => { $('.post-comments', el).hidden = false; const i = $('.post-comments input', el); i.value = draftReply(p); i.focus(); EB.toast('Draft ready. Edit it, then press Post'); }; } } });
    if (sf === 'Needs reply' && !M.needs.length) $('[data-list]', v).innerHTML = '<p class="muted" style="text-align:center;padding:30px">🎉 Every review has a reply.</p>';
    setBadge();
  }

  function ads(opt = {}) {
    const rows = D.all('sup_ads').sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    const posts = Object.fromEntries(EB.feed.list().map((p) => [p.id, p]));
    const status = (a) => (a.post_id && posts[a.post_id] && a.status === 'pending review' && posts[a.post_id].status === 'published' ? 'active' : a.status);
    const act = rows.filter((a) => status(a) === 'active'), imp = rows.reduce((a, x) => a + (+x.impressions || 0), 0), clk = rows.reduce((a, x) => a + (+x.clicks || 0), 0), spent = rows.reduce((a, x) => a + (+x.spend || 0), 0);
    const v = EB.view('ads', `
      <div class="row between wrap" style="gap:10px;margin-bottom:14px"><div><h1 style="font-size:28px">Ads & promotions</h1><div class="muted">Buy self-serve promotions across eBuzz. Everything is labelled "Sponsored" or "Ad", targeted by problem (never personal data), and ad-reviewed before it goes live.</div></div></div>
      ${EB.kpis([['Active campaigns', act.length], ['Spend (all)', money(spent, 0)], ['Impressions', imp.toLocaleString()], ['Clicks', clk.toLocaleString(), imp ? ((clk / imp) * 100).toFixed(1) + '% CTR' : ''], ['Est. attributed sales', money(clk * 0.041 * 250, 0), '4.1% click→order', 'up']])}
      <h3 style="margin:18px 0 10px">Buy a promotion</h3>
      <div class="adprod-grid">${AD_PRODUCTS.map((a, i) => `<div class="adprod"><div class="ic">${a.ic}</div><b>${a.type}</b><div class="muted" style="font-size:13px;flex:1">${a.desc}</div><div class="row between"><span class="price">${a.price}</span><button class="btn sm primary" data-buy="${i}">Buy</button></div></div>`).join('')}</div>
      <div class="card" style="margin-top:18px"><div class="card-head"><div class="card-title">My campaigns</div><span class="muted" style="font-size:13px">Billed from your payouts · invoices in the Dashboard</span></div><div data-t></div></div>`);
    const t = EB.dataTable({ rows: rows.map((a) => ({ ...a, status: status(a), ctr: a.impressions ? +((a.clicks / a.impressions) * 100).toFixed(1) : 0 })), filterKey: 'status', csv: 'sitwell-campaigns.csv', sumKey: 'spend', sumLabel: 'Spend', columns: [
      { key: 'id', label: 'ID', fmt: (x) => `<span class="mono" style="font-size:12px">${esc(x)}</span>` }, { key: 'type', label: 'Type' }, { key: 'name', label: 'Campaign', fmt: (x, r) => `<b>${esc(x)}</b><div class="muted" style="font-size:12px">${esc(r.product)} · ${esc(r.targets)}</div>` },
      { key: 'budget', label: 'Budget', right: true, fmt: (x) => money(x, 0) }, { key: 'spend', label: 'Spent', right: true, fmt: (x) => money(x, 0) }, { key: 'impressions', label: 'Impr.', right: true, fmt: (x) => (+x).toLocaleString() }, { key: 'ctr', label: 'CTR', right: true, fmt: (x) => x + '%' },
      { key: 'end', label: 'Ends' }, { key: 'status', label: 'Status', fmt: (x, r) => `<span class="tag ${x === 'active' ? 'green' : x === 'pending review' ? 'honey' : x === 'rejected' ? 'red' : ''}">${x}</span>${r.note ? `<div class="muted" style="font-size:11.5px">${esc(r.note)}</div>` : ''}${['active', 'paused'].includes(x) ? ` <button class="btn sm ghost" data-pause="${r.id}">${x === 'active' ? 'Pause' : 'Resume'}</button>` : ''}` },
    ] });
    $('[data-t]', v).append(t);
    v.onclick = async (e) => { const b = e.target.closest('[data-pause]'); if (!b) return; const a = D.get('sup_ads', b.dataset.pause); await D.put('sup_ads', { ...a, status: a.status === 'active' ? 'paused' : 'active' }); EB.toast(a.status === 'active' ? 'Campaign paused' : 'Campaign resumed'); ads(); };
    $$('[data-buy]', v).forEach((b) => (b.onclick = () => buy(AD_PRODUCTS[+b.dataset.buy])));
    if (opt.buy) buy(AD_PRODUCTS.find((a) => a.type === opt.buy));
  }

  function buy(A) {
    const post = ['Sponsored feed post', 'Store spotlight'].includes(A.type);
    const m = EB.modal(`<h3 style="margin-bottom:4px">${A.ic} ${A.type}</h3><p class="muted" style="margin-top:0;font-size:13.5px">${A.desc}</p>
      <div class="grid2"><label class="field">Campaign name<input data-n value="${A.type === 'Store spotlight' ? 'Visit the Sitwell store' : 'Fall comfort offer'}"></label>
        <label class="field">Product<select data-p>${MY_PRODUCTS.map((x, i) => `<option value="${i}">${esc(x.name)} (${money(x.price, 0)})</option>`).join('')}<option value="all">All products</option></select></label></div>
      ${post ? `<label class="field" style="margin-top:10px">Post text<textarea data-txt rows="3">${A.type === 'Store spotlight' ? 'Chairs built for real people. Browse our full range, assembly service and free ergonomic fit.' : 'Firm lumbar support, 60-day free returns. Buzz Feed readers save this week.'}</textarea></label>` : ''}
      <div class="grid2" style="margin-top:10px">${A.type === 'Sponsored feed post' ? '<label class="field">Promo price ($)<input type="number" data-pp value="239"></label>' : '<span></span>'}<label class="field">Duration (days)<input type="number" data-d min="1" max="60" value="14"></label></div>
      <label class="field" style="margin-top:10px">Target problems (contextual)<div class="chips" data-tg>${TARGETS.map((x, i) => `<button class="chip ${i < 2 ? 'on' : ''}">${x}</button>`).join('')}</div></label>
      <div class="grid2" style="margin-top:10px"><label class="field">Total budget ($)<input type="number" data-b min="50" value="500"></label><label class="field">Bid (${A.unit})<input type="number" step="0.1" data-bid value="${A.bid}"></label></div>
      <div class="card flat" style="margin-top:12px;padding:12px;font-size:13.5px" data-est></div>
      <div class="row between wrap" style="margin-top:12px;gap:8px"><span class="muted" style="font-size:12px">Charged only as it's delivered, deducted from payouts. ${A.review ? 'eBuzz ad review usually takes under 1 hour.' : 'Starts right away.'}</span><div class="row"><button class="btn ghost" onclick="EB.closeOverlays()">Cancel</button><button class="btn primary" data-go>Buy promotion</button></div></div>`);
    $$('[data-tg] .chip', m).forEach((c) => (c.onclick = () => { c.classList.toggle('on'); est(); }));
    const est = () => { const b = +$('[data-b]', m).value || 0, bid = +$('[data-bid]', m).value || 1, d = +$('[data-d]', m).value || 1;
      const reach = A.unit === 'CPM' ? Math.round((b / bid) * 1000) : A.unit === 'CPC' ? Math.round((b / bid) / 0.06) : Math.round(d / 7 * 9000);
      const floor = A.unit === 'week' ? Math.ceil(d / 7) * bid : 0;
      $('[data-est]', m).innerHTML = `<b>Estimate:</b> ~${reach.toLocaleString()} impressions · ~${Math.round(reach * 0.035).toLocaleString()} clicks · ~${Math.round(reach * 0.035 * 0.041)} orders over ${d} days${floor > b ? `<div class="warn-note" style="margin-top:6px">Minimum for ${d} days is ${money(floor, 0)}.</div>` : ''}`; };
    $$('input', m).forEach((i) => (i.oninput = est)); est();
    $('[data-go]', m).onclick = async () => {
      const pi = $('[data-p]', m).value, prod = pi === 'all' ? { name: 'All products', id: '', e: '🪑', price: 0 } : MY_PRODUCTS[+pi];
      const budget = +$('[data-b]', m).value, d = +$('[data-d]', m).value, targets = $$('[data-tg] .chip.on', m).map((c) => c.textContent).join(',');
      if (budget < 50) return EB.toast('Minimum budget is $50');
      if (!targets) return EB.toast('Pick at least one target problem');
      const pp = $('[data-pp]', m) ? +$('[data-pp]', m).value : null;
      if (pp !== null && (pp >= prod.price || pp < prod.price * 0.7)) return EB.toast(`Promo price must be below ${money(prod.price, 0)} and within your 30% floor`);
      const id = 'CMP-' + (200 + D.count('sup_ads')), now = new Date().toISOString();
      let post_id = '';
      if (post) {
        post_id = D.id('fp');
        await D.put('feed_posts', { id: post_id, author_id: BRAND_ID, author: BRAND, avatar: '🪑', kind: 'promo', text: $('[data-txt]', m).value.trim(), rating: null, product: prod.name, sku: prod.id, vendor: BRAND, emoji: prod.e, promo_price: pp, list_price: pp ? prod.price : null, cta: A.type === 'Store spotlight' ? 'Visit store' : 'Get offer', sponsored: 1, status: 'pending', likes: 0, shares: 0, comments_json: '[]', mod_score: 0.05, mod_flags: '', impressions: 0, clicks: 0, targets, incentivized: 0, verified: 0, resolution: '', created_at: now });
        EB.bus.emit('feed:promo', { id: post_id });
      }
      await D.put('sup_ads', { id, org: ORG, type: A.type, name: $('[data-n]', m).value.trim() || A.type, product: prod.name, targets, budget, bid: +$('[data-bid]', m).value, spend: 0, impressions: 0, clicks: 0, start: D.today(), end: D.daysAgo(-d), status: A.review ? 'pending review' : 'active', post_id, note: '', created_at: now });
      EB.closeOverlays();
      EB.toast(A.review ? `${id} submitted for eBuzz ad review` : `${id} is live`);
      EB.setNav('ads'); ads();
    };
  }

  function pageBuilder() {
    const J = (x, d) => { try { return JSON.parse(x || 'null') ?? d; } catch { return d; } };
    let pg = { ...(D.get('sup_pages', 'page-sitwell') || { ...PAGE_SEED, status: 'draft', views: 0 }) };
    let prods = J(pg.products_json, []), svcs = J(pg.services_json, []), pol = J(pg.policies_json, {});
    const reviews = mine().reviews.filter((p) => ['review', 'story', 'tip'].includes(p.kind));
    const v = EB.view('page', `
      <div class="row between wrap" style="gap:10px;margin-bottom:14px"><div><h1 style="font-size:28px">Landing page</h1><div class="muted">Build your own storefront of products and services. Shoppers open it from your name anywhere on eBuzz (product lists, cards, the Buzz Feed).</div></div>
        <div class="row wrap" style="gap:8px"><span class="tag ${pg.status === 'published' ? 'green' : ''}" data-st>${pg.status === 'published' ? 'Published' : 'Draft'}</span><a class="btn sm" href="customer.html#vendor=${encodeURIComponent(BRAND)}" target="_blank" rel="noopener">View as shopper ↗</a><button class="btn sm" data-draft>Save draft</button><button class="btn sm primary" data-pub>Publish</button></div></div>
      ${EB.kpis([['Visits', (+pg.views || 0).toLocaleString()], ['Products', prods.length], ['Services', svcs.length], ['Last updated', String(pg.updated_at || '').slice(0, 10) || '-']])}
      <div class="builder" style="margin-top:16px">
        <div class="card" data-form>
          <div class="card-title" style="margin-bottom:10px">Brand</div>
          <div class="grid2"><label class="field">Logo (emoji)<input data-k="logo" value="${esc(pg.logo)}" maxlength="4"></label><label class="field">Brand colour<input type="color" data-k="theme" value="${esc(pg.theme)}" style="height:38px;padding:3px"></label></div>
          <label class="field">Headline<input data-k="headline" value="${esc(pg.headline)}" maxlength="80"></label>
          <label class="field">Tagline<input data-k="tagline" value="${esc(pg.tagline)}" maxlength="120"></label>
          <label class="field">About us<textarea data-k="about" rows="3">${esc(pg.about)}</textarea></label>
          <div class="row between" style="margin:14px 0 8px"><div class="card-title">Products</div><select class="btn sm" data-addp><option value="">+ Add product…</option>${MY_PRODUCTS.map((x, i) => `<option value="${i}">${esc(x.name)}</option>`).join('')}</select></div><div data-plist></div>
          <div class="row between" style="margin:14px 0 8px"><div class="card-title">Services</div><button class="btn sm" data-adds>+ Add service</button></div><div data-slist></div>
          <div class="card-title" style="margin:14px 0 8px">Policies</div>
          <label class="field">Shipping<input data-pol="shipping" value="${esc(pol.shipping || '')}"></label>
          <label class="field">Returns<input data-pol="returns" value="${esc(pol.returns || '')}"></label>
          <label class="field">Warranty<input data-pol="warranty" value="${esc(pol.warranty || '')}"></label>
          ${EB.aiNote('<b>Before publishing</b>, the Listing QA agent checks that prices match your catalog, claims are supported (no medical cures), and nothing collects shopper contact details off-platform.')}
        </div>
        <div class="builder-prev"><div class="muted" style="font-size:12px;margin-bottom:6px">Live preview (what shoppers see)</div><div data-preview></div></div>
      </div>`);
    const rep = (arr, kind) => arr.map((x, i) => `<div class="rep"><input data-${kind}="${i}" data-f="name" value="${esc(x.name)}" placeholder="Name"><input type="number" data-${kind}="${i}" data-f="price" value="${esc(x.price)}" placeholder="Price"><textarea class="full" rows="2" data-${kind}="${i}" data-f="${kind === 'p' ? 'blurb' : 'desc'}" placeholder="Short description">${esc(kind === 'p' ? x.blurb || '' : x.desc || '')}</textarea><button class="btn sm ghost full" data-rm${kind}="${i}" style="justify-self:start;color:var(--red)">Remove</button></div>`).join('') || '<p class="muted" style="font-size:13px;margin:0">None yet.</p>';
    const draw = () => {
      pg = { ...pg, products_json: JSON.stringify(prods), services_json: JSON.stringify(svcs), policies_json: JSON.stringify(pol) };
      const pr = $('[data-preview]', v); pr.innerHTML = ''; pr.append(EB.storePage(pg, { reviews, preview: true }));
    };
    const lists = () => {
      $('[data-plist]', v).innerHTML = rep(prods, 'p'); $('[data-slist]', v).innerHTML = rep(svcs, 's');
      $$('[data-p],[data-s]', v).forEach((i) => (i.oninput = () => { const arr = i.dataset.p !== undefined ? prods : svcs, idx = +(i.dataset.p ?? i.dataset.s); arr[idx][i.dataset.f] = i.dataset.f === 'price' ? +i.value : i.value; draw(); }));
      $$('[data-rmp]', v).forEach((b) => (b.onclick = () => { prods.splice(+b.dataset.rmp, 1); lists(); draw(); }));
      $$('[data-rms]', v).forEach((b) => (b.onclick = () => { svcs.splice(+b.dataset.rms, 1); lists(); draw(); }));
    };
    $$('[data-k]', v).forEach((i) => (i.oninput = () => { pg[i.dataset.k] = i.value; draw(); }));
    $$('[data-pol]', v).forEach((i) => (i.oninput = () => { pol[i.dataset.pol] = i.value; draw(); }));
    $('[data-addp]', v).onchange = (e) => { const x = MY_PRODUCTS[+e.target.value]; e.target.value = ''; if (!x) return; if (prods.some((p) => p.id === x.id)) return EB.toast('Already on your page'); prods.push({ ...x }); lists(); draw(); };
    $('[data-adds]', v).onclick = () => { svcs.push({ name: 'New service', desc: '', price: 0 }); lists(); draw(); };
    const save = async (status) => {
      const bad = prods.find((p) => { const c = MY_PRODUCTS.find((x) => x.id === p.id); return c && +p.price > c.price; });
      if (status === 'published' && bad) return EB.toast(`Listing QA: ${bad.name} is priced above its catalog price (${money(MY_PRODUCTS.find((x) => x.id === bad.id).price, 0)})`);
      if (status === 'published' && /cure|guarantee[sd]? to fix|whatsapp|call me/i.test([pg.headline, pg.tagline, pg.about, ...svcs.map((x) => x.desc)].join(' '))) return EB.toast('Listing QA: remove medical claims or off-platform contact requests before publishing');
      pg = { ...pg, status, updated_at: new Date().toISOString() }; draw();
      await D.put('sup_pages', pg);
      $('[data-st]', v).className = 'tag ' + (status === 'published' ? 'green' : ''); $('[data-st]', v).textContent = status === 'published' ? 'Published' : 'Draft';
      EB.toast(status === 'published' ? 'Published: shoppers see the new page right away' : 'Draft saved (only you can see it)');
    };
    $('[data-draft]', v).onclick = () => save('draft');
    $('[data-pub]', v).onclick = () => save('published');
    lists(); draw();
  }

  const VIEWS = { board, team, feed: supFeed, ads, page: pageBuilder };

  D.init({ persona: 'supplier', seed }).then(async () => {
    await EB.feed.seed();
    EB.bindSyncChip(); setBadge();
    D.on((e) => { if (e.type !== 'remote') return; setBadge(); const cur = $('.view.on'), id = cur && cur.dataset.view; if (id === 'board') board(); if (id === 'feed' && e.table === 'feed_posts') supFeed(); if (id === 'ads' && ['sup_ads', 'feed_posts'].includes(e.table) && !$('.modal')) ads(); });
    if (location.hash === '#feed') { EB.setNav('feed'); supFeed(); }
    if (location.hash === '#ads') { EB.setNav('ads'); ads(); }
    if (location.hash === '#page') { EB.setNav('page'); pageBuilder(); }
  });
  EB.bus.on('feed:post', () => setTimeout(setBadge, 400));
  EB.bus.on('order:placed', (o) => { if (o.vendor === 'Sitwell Home') { chat.system(`${icon('bell')} New eBuzz order ${o.id}: ${EB.esc(o.item)} · ${money(o.gmv)}`); EB.toast('🛒 New order synced'); } });

  chat.bot([`<h2 style="font-size:24px;margin-bottom:6px">Supplier Hub</h2><p>Hi Priya. I'm your Supplier Copilot. Here's what's happening at <b>Sitwell Home Co.</b> Full lists live in the <a href="#" onclick="document.querySelector('[data-nav=board]').click();return false">Dashboard</a>.</p>`], { delay: 300 });
  W.dash();
  EB.setSuggest([...Object.entries(LABELS).map(([id, label]) => ({ label, id })), { label: 'Reply to customer reviews', id: 'feed' }, { label: 'Buy a promotion', id: 'ads' }, { label: 'Edit my landing page', id: 'page' }, { label: 'Add a staff member', id: 'team' }], (c) => { if (VIEWS[c.id]) { EB.setNav(c.id); return VIEWS[c.id](); } EB.setNav(c.id); ask(c.label, c.id); });
})();
