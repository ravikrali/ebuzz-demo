/* eBuzz.ai: Supplier Hub prototype (Sitwell Home Co. operations admin) */
(function () {
  const { h, $, $$, money, sleep, icon } = EB;

  const chat = EB.shell({
    persona: 'supplier',
    user: { name: 'Priya Shah', role: 'Ops Admin · Sitwell Home Co.', initials: 'PS', cls: 'g' },
    rail: [
      { id: 'board', label: 'Dashboard', icon: 'grid' },
      { id: 'dash', label: 'Copilot', icon: 'chat' },
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
    onNav: (id) => (id === 'board' ? board() : id === 'team' ? team() : (EB.view('chat'), ask(LABELS[id], id))),
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
      await D.put('sup_tx', rows, { silent: true });
    }
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
      <div class="card" style="margin-top:16px"><div class="card-head"><div class="card-title">All transactions</div><span class="muted" style="font-size:13px">New eBuzz orders sync in live</span></div><div data-t></div></div>`);
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

  D.init({ persona: 'supplier', seed }).then(() => {
    EB.bindSyncChip();
    D.on((e) => { if (e.type === 'remote') { const cur = $('.view.on'); if (cur && cur.dataset.view === 'board') board(); } });
  });
  EB.bus.on('order:placed', (o) => { if (o.vendor === 'Sitwell Home') { chat.system(`${icon('bell')} New eBuzz order ${o.id}: ${EB.esc(o.item)} · ${money(o.gmv)}`); EB.toast('🛒 New order synced'); } });

  chat.bot([`<h2 style="font-size:24px;margin-bottom:6px">Supplier Hub</h2><p>Hi Priya. I'm your Supplier Copilot. Here's what's happening at <b>Sitwell Home Co.</b> Full lists live in the <a href="#" onclick="document.querySelector('[data-nav=board]').click();return false">Dashboard</a>.</p>`], { delay: 300 });
  W.dash();
  EB.setSuggest([...Object.entries(LABELS).map(([id, label]) => ({ label, id })), { label: 'Add a staff member', id: 'team' }], (c) => { if (c.id === 'team') { EB.setNav('team'); return team(); } EB.setNav(c.id); ask(c.label, c.id); });
})();
