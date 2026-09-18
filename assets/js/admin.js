/* eBuzz.ai: Admin console prototype (finance, win limits, staff & RBAC) */
(function () {
  const { h, $, $$, money, icon, bus } = EB;
  const L = { gmv: 412380, rev: 83610, orders: 5186, ads: 9140, prizes: 3380, playAds: 9140 };

  const chat = EB.shell({
    persona: 'admin',
    user: { name: 'Alex Morgan', role: 'Super Admin · eBuzz', initials: 'AM', cls: 'b' },
    rail: [
      { id: 'board', label: 'Dashboard', icon: 'grid' },
      { id: 'overview', label: 'Copilot', icon: 'chat' },
      { id: 'payouts', label: 'Payouts', icon: 'send', badge: 1 },
      { id: 'limits', label: 'Win limits', icon: 'trophy' },
      { id: 'recon', label: 'Reconcile', icon: 'check', badge: 3 },
      { id: 'staff', label: 'Staff & access', icon: 'users' },
      { id: 'forecast', label: 'Forecast', icon: 'target' },
    ],
    placeholder: 'Ask Admin Copilot, e.g. "change win limits" or "add a territory manager"',
    note: 'Money movement is handled by deterministic code with human approval. The AI explains, drafts and flags.',
    onNav: (id) => (id === 'board' ? board() : id === 'limits' ? winLimits() : id === 'staff' ? staffView() : (EB.view('chat'), chat.user(LABELS[id]), W[id]())),
  });
  EB.setNav('overview');
  const LABELS = { overview: 'Month-to-date overview', revenue: 'Break down revenue', payouts: 'Show this week\'s payout batch', prizes: 'How is the game prize pool?', recon: 'Any reconciliation exceptions?', tax: 'Sales tax status', forecast: 'Update the forecast' };

  function ctx() {
    $('#context').innerHTML = `
      <div class="ctx-section"><div class="row between"><h4 style="margin:0">Cash & runway</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
        <div class="ctx-title num" style="margin-top:8px">$3.21M</div><div class="muted" style="font-size:13px">Operating cash · 16.4 months runway at current burn ($196k/mo)</div>
        <div class="meter g" style="margin-top:8px"><i style="width:68%"></i></div></div>
      <div class="ctx-section"><h4>Live ledger <span class="tag green"><i class="dot live"></i> streaming</span></h4>
        <div class="kpis" style="grid-template-columns:1fr 1fr"><div class="kpi"><div class="l">GMV MTD</div><div class="v" id="lg">${EB.k(L.gmv)}</div></div><div class="kpi"><div class="l">Net revenue MTD</div><div class="v" id="lr">${EB.k(L.rev)}</div></div></div>
        <div id="feed" class="stack" style="gap:6px;margin-top:10px;font-size:12.5px"></div></div>
      <div class="ctx-section"><h4>Approvals waiting</h4><div class="stack" style="font-size:13.5px">
        <button class="chip" data-go="payouts">💸 Weekly payout batch: $301,420</button>
        <button class="chip" data-go="recon">🧾 3 reconciliation exceptions</button>
        <button class="chip" data-go="prizes">🎮 Prize-pool cap review (weekly)</button>
        <button class="chip" data-lim>🏆 Daily / weekly / monthly win limits</button></div></div>`;
    const lim = $('[data-lim]'); if (lim) lim.onclick = () => { EB.closeOverlays(); EB.setNav('limits'); winLimits(); };
    $$('[data-go]').forEach((b) => (b.onclick = () => { EB.closeOverlays(); EB.setNav(b.dataset.go); chat.user(LABELS[b.dataset.go]); W[b.dataset.go](); }));
  }
  const feed = (txt) => { const f = $('#feed'); if (!f) return; f.prepend(h(`<div class="row between"><span>${txt}</span><span class="muted">now</span></div>`)); while (f.children.length > 6) f.lastChild.remove(); $('#lg').textContent = EB.k(L.gmv); $('#lr').textContent = EB.k(L.rev); };

  // live events from other tabs + background simulation
  bus.on('order:placed', (o) => { L.gmv += o.gmv; L.rev += o.gmv * 0.115; L.orders++; feed(`🛒 <b>${o.id}</b> ${money(o.gmv, 0)} · ${o.vendor}${o.offer ? ' · Deal Room' : ''}`); EB.toast(`New order ${o.id}: commission ${money(o.gmv * 0.11)}`); });
  bus.on('game:prize', (p) => { L.prizes += p.amount; feed(`🎮 Prize credit issued ${money(p.amount)}`); });
  bus.on('ad:view', () => { L.ads += 0.018; feed('📺 Rewarded ad view +$0.018'); });
  setInterval(() => { const g = 30 + Math.random() * 280; L.gmv += g; L.rev += g * 0.2; L.orders++; feed(`🛒 order ${money(g, 0)}`); }, 6000);

  function lineChart(vals, w = 560, hgt = 150) {
    const max = Math.max(...vals) * 1.1, step = w / (vals.length - 1);
    const pts = vals.map((v, i) => `${(i * step).toFixed(1)},${(hgt - (v / max) * hgt).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${w} ${hgt + 4}" style="width:100%;height:auto;display:block" role="img" aria-label="Daily GMV trend"><polygon points="0,${hgt} ${pts} ${w},${hgt}" fill="var(--accent-soft)"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  }
  const daily = Array.from({ length: 18 }, (_, i) => 16000 + i * 620 + Math.sin(i * 1.3) * 2600 + (i % 7 === 5 ? 3800 : 0));

  const W = {
    async overview() {
      await chat.bot(['September month-to-date (18 days):', h(`<div class="card">${EB.kpis([['GMV', EB.k(L.gmv), '+21% MoM', 'up'], ['Net revenue', EB.k(L.rev), '+24% MoM', 'up'], ['Take rate', '20.3%', '+0.4 pts', 'up'], ['Orders', L.orders.toLocaleString(), 'AOV $79.50'], ['Contribution / order', '$6.94', 'target $7.26'], ['EBITDA MTD', '−$118k', 'better than plan by $22k', 'up']])}
        <div style="margin-top:14px"><div class="row between" style="font-size:13px;margin-bottom:6px"><b>Daily GMV</b><span class="muted">Sep 1–18</span></div>${lineChart(daily)}</div></div>`),
        EB.aiNote('Deal Room orders are <b>46% of GMV</b> and convert 1.6× better, but give away an average discount of 7.4%. Take rate is holding because vendors pay for it through Boost fees, not eBuzz.')]);
    },
    async revenue() {
      const mix = [['Commission', 54.2, 'var(--honey)'], ['Deal Boost / sponsored', 19.8, 'var(--violet)'], ['Play-zone ads', 10.9, 'var(--green)'], ['Vendor SaaS', 11.3, 'var(--blue)'], ['Affiliate', 3.8, 'var(--muted)']];
      await chat.bot(['Net revenue mix, month to date:', h(`<div class="card"><div style="display:flex;height:26px;border-radius:8px;overflow:hidden;gap:2px">${mix.map(([l, v, c]) => `<i title="${l} ${v}%" style="width:${v}%;background:${c}"></i>`).join('')}</div>
        <div style="margin-top:12px">${EB.table(['Stream', 'MTD', 'Share', 'vs plan'], mix.map(([l, v, c]) => [`<span class="dot" style="color:${c}"></span> ${l}`, money((L.rev * v) / 100, 0), v + '%', v > 15 ? '<span class="up">+6%</span>' : '<span class="muted">on plan</span>']), { right: [1, 2, 3] })}</div></div>`)]);
    },
    async payouts() {
      const c = h(`<div class="card"><div class="card-head"><div class="card-title">Batch PB-0918 · 214 vendors</div><span class="tag honey">Needs approval</span></div>
        ${EB.table(['Vendor', 'Gross', 'Commission', 'Refunds', 'Net', 'Flag'], [
          ['ErgoMax', '$48,120', '−$5,293', '−$1,110', '$41,717', '<span class="tag green">OK</span>'],
          ['Sitwell Home Co.', '$15,210', '−$1,673', '−$518', '$12,480', '<span class="tag green">OK</span>'],
          ['LunaDark', '$22,940', '−$2,523', '−$402', '$19,915', '<span class="tag green">OK</span>'],
          { hl: true, cells: ['QuickNest (new)', '$9,880', '−$1,087', '$0', '$8,793', '<span class="tag red">Hold: Fraud & Trust</span>'] },
          ['+210 more', '$268,560', '−$29,541', '−$9,784', '$229,235', ''],
        ], { right: [1, 2, 3, 4] })}
        ${EB.aiNote('<b>Hold suggested on QuickNest:</b> 41 orders in 6 days from a brand-new seller, 38% shipped with tracking numbers that haven\'t been scanned. Recommend holding for 7 days (policy §6.3) and releasing the rest.')}
        <div class="card-foot"><button class="btn primary" data-ap>Approve $292,627 (hold QuickNest)</button><button class="btn" data-all>Approve all $301,420</button></div></div>`);
      await chat.bot(['Weekly payout batch, prepared by the Order-to-Cash Agent:', c]);
      $('[data-ap]', c).onclick = (e) => { $$('button', c).forEach((b) => (b.disabled = true)); chat.bot(`${icon('check')} Approved. 213 transfers queued with Stripe Connect for tomorrow 9am. QuickNest is held and their account manager has been notified.`); const b = $('[data-nav=payouts] .badge'); if (b) b.remove(); };
      $('[data-all]', c).onclick = () => EB.toast('Policy requires a second approver to override a Fraud & Trust hold');
    },
    async prizes() {
      const ratio = L.prizes / L.playAds;
      const c = h(`<div class="card"><div class="card-head"><div class="card-title">🎮 Play & Win economics · MTD</div><span class="tag ${ratio < 0.4 ? 'green' : 'red'}">${ratio < 0.4 ? 'Within cap' : 'Over cap'}</span></div>
        ${EB.kpis([['Play-zone ad revenue', money(L.playAds, 0)], ['Prize credits issued', money(L.prizes, 0)], ['Credits redeemed', '$2,210', '65% redemption'], ['Game sessions', '284k', 'eCPM $17.40']])}
        <div style="margin-top:14px"><div class="row between" style="font-size:13px"><span>Prize pool ÷ ad revenue</span><b>${Math.round(ratio * 100)}% of 40% cap</b></div><div class="meter ${ratio < 0.4 ? 'g' : 'r'}"><i style="width:${Math.min(100, ratio * 250)}%"></i></div></div>
        <label class="field" style="margin-top:14px">Daily prize-pool cap (% of Play ad revenue) <b id="capv">40%</b><input type="range" min="20" max="60" value="40" id="cap"></label>
        <div class="muted" style="font-size:12.5px" id="capn">At 40%: est. D30 retention lift +7.2 pts · net Play margin 60%</div>
        <div class="card-foot"><span class="tag">Deferred revenue liability (unredeemed credits): $4,860</span></div></div>`);
      await chat.bot(['Game prize pool, governed automatically by the Game Economy Agent:', c]);
      $('#cap', c).oninput = (e) => { const v = +e.target.value; $('#capv', c).textContent = v + '%'; $('#capn', c).textContent = `At ${v}%: est. D30 retention lift +${(v * 0.18).toFixed(1)} pts · net Play margin ${100 - v}%${v > 45 ? ' ⚠️ above the plan guardrail' : ''}`; };
    },
    async recon() {
      const c = h(`<div class="card">${EB.kpis([['Transactions matched', '99.7%'], ['Stripe ↔ ledger', '$412,380 ↔ $412,151'], ['Open exceptions', '3']])}
        <div style="margin-top:12px">${EB.table(['Exception', 'Amount', 'AI explanation', ''], [
          ['Refund without return scan', '$129.00', 'Customer-service refund on a damaged item (photo attached). Within policy (≤ $200).', '<button class="btn sm" data-ok>Accept</button>'],
          ['Duplicate capture', '$64.90', 'Payment retry after a 3DS timeout captured twice. Auto-refund already started.', '<button class="btn sm" data-ok>Accept</button>'],
          ['FX difference (CAD test order)', '$35.10', 'Settlement currency mismatch. Book to FX gain/loss account 7810.', '<button class="btn sm" data-ok>Post JE</button>'],
        ], { right: [1] })}</div></div>`);
      await chat.bot(['Daily reconciliation (Order-to-Cash Agent) found 3 exceptions, $229 total:', c]);
      $$('[data-ok]', c).forEach((b) => (b.onclick = () => (b.closest('td').innerHTML = '<span class="tag green">Resolved</span>')));
    },
    async tax() {
      await chat.bot(['Marketplace-facilitator sales tax: eBuzz collects and remits on vendors\' behalf.', h(`<div class="card">${EB.table(['State', 'Taxable sales MTD', 'Collected', 'Filing due', 'Status'], [['Texas', '$61,240', '$5,052', 'Oct 20', '<span class="tag green">On track</span>'], ['California', '$88,910', '$6,446', 'Oct 31', '<span class="tag green">On track</span>'], ['New York', '$41,030', '$3,641', 'Sep 20', '<span class="tag honey">File in 2 days</span>'], ['Florida', '$37,700', '$2,639', 'Oct 20', '<span class="tag green">On track</span>']], { right: [1, 2] })}<div class="card-foot"><span class="muted" style="font-size:13px">Nexus monitoring: Colorado will hit its threshold in ~6 weeks. Registration drafted.</span></div></div>`)]);
    },
    async forecast() {
      const c = h(`<div class="card"><div class="grid2">
        <label class="field">Deal Room conversion lift <b id="lv">+35%</b><input type="range" min="0" max="80" value="35" id="lift"></label>
        <label class="field">Blended commission <b id="tv">11.5%</b><input type="range" min="8" max="15" step="0.5" value="11.5" id="take"></label>
        <label class="field">Marketing spend (Y3) <b id="mv">$14M</b><input type="range" min="6" max="30" value="14" id="mkt"></label>
        <label class="field">Play ad revenue / MAU <b id="av">$3.00</b><input type="range" min="1" max="6" step="0.25" value="3" id="arpu"></label></div>
        <div id="fo" style="margin-top:14px"></div></div>`);
      await chat.bot(['Year-3 scenario model (base case from the business plan). Move the drivers:', c]);
      const calc = () => {
        const lift = +$('#lift', c).value, take = +$('#take', c).value, mkt = +$('#mkt', c).value, arpu = +$('#arpu', c).value;
        const gmv = 164 * (1 + (lift - 35) / 100 * 0.55) * (1 + (mkt - 14) / 14 * 0.35);
        const rev = gmv * take / 100 + gmv * 0.03 + 1.6 * arpu + 3.13 + 1.5;
        const ebitda = rev * 0.66 - mkt - 11.4 - 3.0 - (gmv - 164) * 0.012;
        $('#lv', c).textContent = '+' + lift + '%'; $('#tv', c).textContent = take + '%'; $('#mv', c).textContent = '$' + mkt + 'M'; $('#av', c).textContent = money(arpu);
        $('#fo', c).innerHTML = EB.kpis([['Y3 GMV', '$' + gmv.toFixed(0) + 'M'], ['Y3 revenue', '$' + rev.toFixed(1) + 'M'], ['Y3 EBITDA', (ebitda < 0 ? '−$' : '$') + Math.abs(ebitda).toFixed(1) + 'M', '', ebitda < 0 ? 'down' : 'up'], ['Take rate', ((rev / gmv) * 100).toFixed(1) + '%']]);
      };
      $$('input', c).forEach((i) => (i.oninput = calc)); calc();
    },
  };

  /* ---------------- Admin data: local SQLite cache of central platform data ---------------- */
  const D = EB.data, esc = EB.esc;
  const LIMIT_DEFAULTS = { user: { daily: 1, weekly: 4, monthly: 12, plays: 5 }, platform: { daily: 1500, weekly: 9000, monthly: 35000 } };
  const limits = () => { const c = D.get('config', 'win_limits'); try { return c ? JSON.parse(c.json) : LIMIT_DEFAULTS; } catch { return LIMIT_DEFAULTS; } };
  const TERRITORIES = ['US-West', 'US-Central', 'US-South', 'US-Northeast', 'Canada'];
  const PERMS = [
    { group: 'Dashboards', key: 'reports.view', label: 'View dashboards & transactions' }, { group: 'Dashboards', key: 'reports.export', label: 'Export CSV' },
    { group: 'Money', key: 'payouts.approve', label: 'Approve payout batches' }, { group: 'Money', key: 'refunds.small', label: 'Issue refunds ≤ $200' }, { group: 'Money', key: 'refunds.large', label: 'Issue refunds > $200' }, { group: 'Money', key: 'limits.edit', label: 'Edit win limits & prize pool' },
    { group: 'Vendors (territory-scoped)', key: 'vendors.view', label: 'View vendors in territory' }, { group: 'Vendors (territory-scoped)', key: 'vendors.onboard', label: 'Onboard & sign vendors' }, { group: 'Vendors (territory-scoped)', key: 'vendors.suspend', label: 'Suspend vendors' },
    { group: 'Customers', key: 'cases.handle', label: 'Handle support cases' }, { group: 'Customers', key: 'credits.goodwill', label: 'Grant goodwill credits ≤ $10' }, { group: 'Customers', key: 'orders.modify', label: 'Cancel / modify orders' },
    { group: 'Platform', key: 'content.approve', label: 'Approve AI content (videos, Top10)' }, { group: 'Platform', key: 'agents.policies', label: 'Change agent autonomy policies' }, { group: 'Platform', key: 'staff.manage', label: 'Manage staff & roles' },
  ];
  const ROLE_SEED = [
    ['Super Admin', PERMS.map((p) => p.key)],
    ['Finance Manager', ['reports.view', 'reports.export', 'payouts.approve', 'refunds.small', 'refunds.large', 'limits.edit']],
    ['Territory Manager', ['reports.view', 'vendors.view', 'vendors.onboard', 'vendors.suspend', 'cases.handle']],
    ['Customer Service Associate', ['cases.handle', 'refunds.small', 'credits.goodwill', 'orders.modify']],
    ['Content Editor', ['content.approve']],
    ['Compliance Officer', ['reports.view', 'reports.export', 'vendors.view', 'vendors.suspend', 'agents.policies']],
  ];
  async function seed(tables) {
    const r = D.rng(99), pick = (a) => a[Math.floor(r() * a.length)];
    if (tables.includes('config')) await D.put('config', { id: 'win_limits', json: JSON.stringify(LIMIT_DEFAULTS), updated_at: new Date().toISOString() }, { silent: true });
    if (tables.includes('adm_roles')) await D.put('adm_roles', ROLE_SEED.map(([name, perms], i) => ({ id: 'arole-' + i, name, perms_json: JSON.stringify(perms) })), { silent: true });
    if (tables.includes('adm_staff')) await D.put('adm_staff', [
      ['Alex Morgan', 'alex@ebuzz.example', 'Super Admin', ''], ['Jamie Chen', 'jamie@ebuzz.example', 'Finance Manager', ''],
      ['Rosa Alvarez', 'rosa@ebuzz.example', 'Territory Manager', 'US-South'], ['Ben Okafor', 'ben@ebuzz.example', 'Territory Manager', 'US-Northeast'], ['Kira Novak', 'kira@ebuzz.example', 'Territory Manager', 'US-West'],
      ['Luis Ortega', 'luis@ebuzz.example', 'Customer Service Associate', 'US-South'], ['Aisha Grant', 'aisha@ebuzz.example', 'Customer Service Associate', 'US-Central'], ['Noah Price', 'noah@ebuzz.example', 'Content Editor', ''],
    ].map(([name, email, role, territory], i) => ({ id: 'astf-' + i, name, email, role, territory, status: 'active', added_at: D.daysAgo(400 - i * 35) })), { silent: true });
    if (tables.includes('plat_tx')) {
      const VEND = ['ErgoMax', 'ChairCo', 'Sitwell Home', 'LunaDark', 'Hushly', 'TuffRoot', 'BrainyPup', 'DeskLab', 'Arcus', 'Drift'];
      const user = () => 'u_' + Math.floor(r() * 0xfffff).toString(16).padStart(5, '0');
      const rows = [];
      for (let i = 0; i < 720; i++) {
        const day = Math.floor(r() * 120), region = pick(TERRITORIES.slice(0, 4)), amt = Math.round(20 + r() * 320);
        rows.push({ id: 'PT-O' + i, date: D.daysAgo(day), type: r() < 0.45 ? 'Order · Deal Room' : 'Order', party: user(), ref: 'EB-' + (15000 + i * 11), amount: amt, fee: +(amt * 0.115).toFixed(2), status: day < 7 ? 'Captured' : 'Settled', region });
        if (r() < 0.06) rows.push({ id: 'PT-R' + i, date: D.daysAgo(Math.max(0, day - 5)), type: 'Refund', party: user(), ref: 'R-' + (2000 + i), amount: -amt, fee: -(amt * 0.115).toFixed(2), status: 'Settled', region });
      }
      for (let w = 1; w <= 17; w++) VEND.forEach((v, j) => { if (r() < 0.6) rows.push({ id: `PT-P${w}-${j}`, date: D.daysAgo(w * 7 - 2), type: 'Vendor payout', party: v, ref: 'PB-' + (900 + w), amount: -Math.round(200 + r() * 1500), fee: 0, status: 'Paid', region: pick(TERRITORIES.slice(0, 4)) }); });
      for (let d = 0; d < 120; d += 1) { if (d % 3) continue; rows.push({ id: 'PT-A' + d, date: D.daysAgo(d), type: 'Ad revenue', party: pick(['AdMob', 'AppLovin', 'Brand: Hushly', 'Brand: Sitwell']), ref: 'AD-' + d, amount: 0, fee: Math.round(40 + r() * 60), status: 'Accrued', region: 'All' }); }
      for (let i = 0; i < 90; i++) { const a = pick([0.1, 0.25, 0.5, 1]); rows.push({ id: 'PT-G' + i, date: D.daysAgo(Math.floor(r() * 120)), type: 'Game prize', party: user(), ref: 'GP-' + i, amount: -a, fee: -a, status: 'Credited', region: pick(TERRITORIES.slice(0, 4)) }); }
      for (let m = 0; m < 4; m++) VEND.forEach((v, j) => rows.push({ id: `PT-S${m}-${j}`, date: D.daysAgo(m * 30 + 2), type: 'Vendor SaaS', party: v, ref: 'INV-' + m + j, amount: 0, fee: j % 3 ? 49 : 149, status: 'Paid', region: 'All' }));
      rows.forEach((x) => { if (x.type === 'Ad revenue' || x.type === 'Vendor SaaS') x.amount = x.fee; });
      await D.put('plat_tx', rows, { silent: true });
    }
  }
  const pseudo = (id) => 'u_' + String(id).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16).slice(0, 5);
  const ledger = () => {
    const live = D.all('orders').map((o) => ({ id: o.id, date: o.date, type: o.via === 'Deal Room' ? 'Order · Deal Room' : 'Order', party: pseudo(o.user_id), ref: o.id, amount: +(o.price * o.qty).toFixed(2), fee: +(o.price * o.qty * 0.115).toFixed(2), status: o.status === 'Confirmed' ? 'Captured' : o.status, region: 'US-South', live: o.status === 'Confirmed' }));
    const prizes = D.all('wallet_tx').filter((w) => w.type === 'game' && w.date >= D.daysAgo(3)).map((w) => ({ id: w.id, date: w.date, type: 'Game prize', party: pseudo(w.user_id), ref: w.id, amount: -w.amount, fee: -w.amount, status: 'Credited', region: 'US-South', live: true }));
    return [...live, ...prizes, ...D.all('plat_tx')];
  };

  function board() {
    const Lg = ledger(), orders = Lg.filter((x) => String(x.type).startsWith('Order')), m30 = orders.filter((x) => x.date >= D.daysAgo(30));
    const gmv = m30.reduce((a, x) => a + x.amount, 0), fee = Lg.filter((x) => x.date >= D.daysAgo(30)).reduce((a, x) => a + (+x.fee || 0), 0);
    const prizes30 = -Lg.filter((x) => x.type === 'Game prize' && x.date >= D.daysAgo(30)).reduce((a, x) => a + x.amount, 0);
    const ads30 = Lg.filter((x) => x.type === 'Ad revenue' && x.date >= D.daysAgo(30)).reduce((a, x) => a + x.fee, 0);
    const byRegion = TERRITORIES.slice(0, 4).map((t) => [t, m30.filter((x) => x.region === t).reduce((a, x) => a + x.amount, 0)]);
    const days = Array.from({ length: 30 }, (_, i) => D.daysAgo(29 - i)), daily = days.map((d) => orders.filter((x) => x.date === d).reduce((a, x) => a + x.amount, 0) || 0.01);
    const v = EB.view('board', `
      <div class="row between wrap" style="margin-bottom:16px;gap:10px"><div><h1 style="font-size:28px">Admin dashboard</h1><div class="muted">Platform-wide, from central data. Customers appear as pseudonymous IDs: names, emails and addresses are end-to-end encrypted on their devices and can't be read here.</div></div><button class="btn sm" data-sync>${icon('db')} Data & sync</button></div>
      ${EB.kpis([['GMV (30d)', money(gmv, 0), `${m30.length} orders`], ['Net revenue (30d)', money(fee, 0), 'commission + ads + SaaS − prizes'], ['Take rate', ((fee / Math.max(1, gmv)) * 100).toFixed(1) + '%', 'all revenue ÷ GMV'], ['Deal Room share', Math.round((m30.filter((x) => x.type.includes('Deal')).length / Math.max(1, m30.length)) * 100) + '%'], ['Play ad revenue (30d)', money(ads30, 0)], ['Prizes issued (30d)', money(prizes30), `${Math.round((prizes30 / Math.max(1, ads30)) * 100)}% of ad revenue`], ['Staff', String(D.count('adm_staff')), `${D.all('adm_staff').filter((s) => s.role === 'Territory Manager').length} territory managers`], ['Refunds (30d)', String(Lg.filter((x) => x.type === 'Refund' && x.date >= D.daysAgo(30)).length)]])}
      <div class="grid2" style="margin-top:16px">
        <div class="card"><div class="card-title" style="margin-bottom:10px">Daily GMV · last 30 days</div>${EB.bars(daily)}</div>
        <div class="card"><div class="card-title" style="margin-bottom:10px">GMV by territory (30d)</div>${byRegion.map(([t, x]) => `<div style="margin:8px 0"><div class="row between" style="font-size:13px"><span>${t}</span><b class="num">${money(x, 0)}</b></div><div class="meter"><i style="width:${(x / Math.max(...byRegion.map((b) => b[1]), 1)) * 100}%"></i></div></div>`).join('')}</div>
      </div>
      <div class="card" style="margin-top:16px"><div class="card-head"><div class="card-title">All platform transactions</div><span class="muted" style="font-size:13px">Orders, refunds, payouts, ads, prizes and SaaS · live</span></div><div data-t></div></div>`);
    const t = EB.dataTable({ rows: Lg, filterKey: 'type', csv: 'ebuzz-platform-transactions.csv', sumKey: 'fee', sumLabel: 'eBuzz revenue', searchKeys: ['party', 'ref', 'type', 'region', 'status'], columns: [
      { key: 'date', label: 'Date' },
      { key: 'type', label: 'Type', fmt: (x, r) => `<span class="tag ${x.startsWith('Order') ? (x.includes('Deal') ? 'honey' : '') : x === 'Refund' ? 'red' : x === 'Vendor payout' ? 'green' : x === 'Game prize' ? 'violet' : 'blue'}">${x}</span>${r.live ? ' <span class="tag green"><i class="dot live"></i> new</span>' : ''}` },
      { key: 'party', label: 'Party', fmt: (x) => (String(x).startsWith('u_') ? `<span class="mono" style="font-size:12px">${esc(x)}</span> <span class="pii-lock" title="Customer PII is not stored centrally">${icon('lock')}</span>` : esc(x)) },
      { key: 'ref', label: 'Ref', fmt: (x) => `<span class="mono" style="font-size:12px">${esc(x)}</span>` },
      { key: 'region', label: 'Territory' },
      { key: 'amount', label: 'Amount', right: true, fmt: (x) => `<span class="num ${x < 0 ? 'down' : ''}">${money(x)}</span>` },
      { key: 'fee', label: 'eBuzz rev.', right: true, fmt: (x) => `<b class="num">${money(x)}</b>` },
      { key: 'status', label: 'Status' },
    ] });
    $('[data-t]', v).append(t);
    $('[data-sync]', v).onclick = () => EB.syncView();
  }

  function winLimits() {
    const Lm = limits();
    const prizes = ledger().filter((x) => x.type === 'Game prize');
    const since = (d) => -prizes.filter((x) => x.date >= d).reduce((a, x) => a + x.amount, 0);
    const monthStart = D.today().slice(0, 8) + '01';
    const use = [['Daily', since(D.today()), Lm.platform.daily], ['Weekly', since(D.daysAgo(6)), Lm.platform.weekly], ['Monthly', since(monthStart), Lm.platform.monthly]];
    const f = (k, sub, val, step = 0.25) => `<label class="field">${k}<input type="number" min="0" step="${step}" value="${val}" data-l="${sub}"></label>`;
    const v = EB.view('limits', `
      <h1 style="font-size:28px;margin-bottom:4px">Play & Win limits</h1><p class="muted" style="margin:0 0 16px">Caps on game winnings keep the prize pool within ad revenue and discourage compulsive play. Changes sync to every shopper device right away.</p>
      <div class="grid2">
        <div class="card"><div class="card-title" style="margin-bottom:12px">${icon('user')} Per-player limits</div>
          <div class="grid2">${f('Daily win limit ($)', 'user.daily', Lm.user.daily)}${f('Weekly win limit ($)', 'user.weekly', Lm.user.weekly)}${f('Monthly win limit ($)', 'user.monthly', Lm.user.monthly)}${f('Plays per day', 'user.plays', Lm.user.plays, 1)}</div>
          <p class="muted" style="font-size:12.5px;margin:10px 0 0">A prize that would go over a limit is reduced to the remaining room. Games stay free to play.</p></div>
        <div class="card"><div class="card-title" style="margin-bottom:12px">${icon('trophy')} Platform prize-pool caps</div>
          <div class="grid2">${f('Daily cap ($)', 'platform.daily', Lm.platform.daily, 50)}${f('Weekly cap ($)', 'platform.weekly', Lm.platform.weekly, 100)}${f('Monthly cap ($)', 'platform.monthly', Lm.platform.monthly, 500)}</div>
          <p class="muted" style="font-size:12.5px;margin:10px 0 0">Also bounded by the 40% share of Play-zone ad revenue.</p></div>
      </div>
      <div class="card" style="margin-top:16px"><div class="card-title" style="margin-bottom:10px">Usage against platform caps</div>
        ${use.map(([l, u, c]) => `<div style="margin:10px 0"><div class="row between" style="font-size:13px"><span>${l}</span><b class="num">${money(u)} / ${money(c, 0)}</b></div><div class="meter ${u / c > 0.9 ? 'r' : 'g'}"><i style="width:${Math.min(100, (u / c) * 100)}%"></i></div></div>`).join('')}</div>
      <div class="row" style="margin-top:16px"><button class="btn primary" data-save>Save & publish limits</button><span class="muted" style="font-size:13px" data-upd>Last updated ${esc((D.get('config', 'win_limits') || {}).updated_at || 'never').slice(0, 16).replace('T', ' ')}</span></div>`);
    $('[data-save]', v).onclick = async () => {
      const n = JSON.parse(JSON.stringify(Lm));
      $$('[data-l]', v).forEach((i) => { const [a, b] = i.dataset.l.split('.'); n[a][b] = Math.max(0, +i.value); });
      if (n.user.daily > n.user.weekly || n.user.weekly > n.user.monthly) return EB.toast('Daily ≤ weekly ≤ monthly, please');
      await D.put('config', { id: 'win_limits', json: JSON.stringify(n), updated_at: new Date().toISOString() });
      EB.toast('Limits published: shopper devices update right away');
      winLimits();
    };
  }

  function staffView() {
    const v = EB.view('staff', `<h1 style="font-size:28px;margin-bottom:4px">Staff & access</h1><p class="muted" style="margin:0 0 16px">Add Territory Managers, Customer Service Associates and other staff, and set what each role can do. Territory scopes which vendors, customers and cases a person can see.</p><div data-r></div>`);
    const staff = D.all('adm_staff').sort((a, b) => String(a.added_at).localeCompare(String(b.added_at)));
    const roles = D.all('adm_roles').sort((a, b) => a.id.localeCompare(b.id)).map((r) => ({ id: r.id, name: r.name, perms: JSON.parse(r.perms_json || '[]') }));
    $('[data-r]', v).append(EB.rbacView({
      staff, roles, perms: PERMS, lockedRole: 'Super Admin', territories: TERRITORIES, orgLabel: 'eBuzz staff',
      onAddStaff: (s) => D.put('adm_staff', s), onUpdateStaff: (s) => D.put('adm_staff', s), onRemoveStaff: (s) => D.del('adm_staff', s.id),
      onSaveRoles: (rs) => D.put('adm_roles', rs.map((r) => ({ id: r.id, name: r.name, perms_json: JSON.stringify(r.perms) }))),
    }));
  }

  chat.onText = (t) => {
    const s = t.toLowerCase();
    if (/limit|cap/.test(s)) { EB.setNav('limits'); return winLimits(); }
    if (/staff|territory|associate|role|access|rbac|permission/.test(s)) { EB.setNav('staff'); return staffView(); }
    if (/dashboard|all transactions|ledger/.test(s)) { EB.setNav('board'); return board(); }
    const map = [[/payout|batch|transfer/, 'payouts'], [/prize|game|credit/, 'prizes'], [/recon|exception|stripe/, 'recon'], [/tax|nexus|state/, 'tax'], [/forecast|scenario|model|plan/, 'forecast'], [/revenue|mix|take/, 'revenue'], [/overview|mtd|month|gmv/, 'overview']];
    const hit = map.find(([r]) => r.test(s));
    if (/take rate.*drop|why/.test(s)) return chat.bot('Take rate is actually <b>up 0.4 pts</b> MoM (20.3%). Commission share fell slightly because Deal Room discounts lower the item price, but Boost fees and vendor SaaS more than made up for it.');
    if (hit) { EB.setNav(hit[1]); return W[hit[1]](); }
    chat.bot('I can open the dashboard, win limits, staff & access, payouts, prize-pool economics, reconciliation, tax or the forecast.');
  };

  ctx();
  D.init({ persona: 'admin', seed }).then(() => {
    EB.bindSyncChip();
    D.on((e) => { if (e.type !== 'remote') return; const cur = $('.view.on'); if (cur && cur.dataset.view === 'board') board(); });
  });
  chat.bot(['<h2 style="font-size:24px;margin-bottom:6px">Admin Console</h2><p>Morning, Alex. The books are reconciled up to 6:00am. <b>One approval</b> is blocking vendor payouts. Full lists are in the <a href="#" onclick="document.querySelector(\'[data-nav=board]\').click();return false">Dashboard</a>.</p>'], { delay: 300 });
  W.overview();
  EB.setSuggest([...Object.entries(LABELS).map(([id, label]) => ({ label, id })), { label: 'Change win limits', id: 'limits' }, { label: 'Add a Territory Manager', id: 'staff' }], (c) => { if (c.id === 'limits') { EB.setNav('limits'); return winLimits(); } if (c.id === 'staff') { EB.setNav('staff'); return staffView(); } EB.setNav(c.id); chat.user(c.label); W[c.id](); });
})();
