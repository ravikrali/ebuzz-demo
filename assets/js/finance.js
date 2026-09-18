/* eBuzz.ai: Finance Manager console prototype */
(function () {
  const { h, $, $$, money, icon, bus } = EB;
  const L = { gmv: 412380, rev: 83610, orders: 5186, ads: 9140, prizes: 3380, playAds: 9140 };

  const chat = EB.shell({
    persona: 'finance',
    user: { name: 'Alex Morgan', role: 'Finance Manager · eBuzz', initials: 'AM', cls: 'b' },
    rail: [
      { id: 'overview', label: 'Overview', icon: 'chart' },
      { id: 'revenue', label: 'Revenue', icon: 'dollar' },
      { id: 'payouts', label: 'Payouts', icon: 'send', badge: 1 },
      { id: 'prizes', label: 'Prize pool', icon: 'trophy' },
      { id: 'recon', label: 'Reconcile', icon: 'check', badge: 3 },
      { id: 'tax', label: 'Tax', icon: 'gavel' },
      { id: 'forecast', label: 'Forecast', icon: 'target' },
    ],
    placeholder: 'Ask Finance Copilot, e.g. "why did take rate drop?"',
    note: 'Money movement is handled by deterministic code with human approval. The AI explains, drafts and flags.',
    onNav: (id) => { EB.view('chat'); chat.user(LABELS[id]); W[id](); },
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
        <button class="chip" data-go="prizes">🎮 Prize-pool cap review (weekly)</button></div></div>`;
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
    return `<svg viewBox="0 0 ${w} ${hgt + 4}" style="width:100%;height:auto;display:block" role="img" aria-label="Daily GMV trend"><polygon points="0,${hgt} ${pts} ${w},${hgt}" fill="var(--honey-soft)"/><polyline points="${pts}" fill="none" stroke="var(--honey-strong)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
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

  chat.onText = (t) => {
    const s = t.toLowerCase();
    const map = [[/payout|batch|transfer/, 'payouts'], [/prize|game|credit/, 'prizes'], [/recon|exception|stripe|ledger/, 'recon'], [/tax|nexus|state/, 'tax'], [/forecast|scenario|model|plan/, 'forecast'], [/revenue|mix|take/, 'revenue'], [/overview|mtd|month|gmv/, 'overview']];
    const hit = map.find(([r]) => r.test(s));
    if (/take rate.*drop|why/.test(s)) return chat.bot('Take rate is actually <b>up 0.4 pts</b> MoM (20.3%). Commission share fell slightly because Deal Room discounts lower the item price, but Boost fees and vendor SaaS more than made up for it.');
    if (hit) { EB.setNav(hit[1]); return W[hit[1]](); }
    chat.bot('I can show the MTD overview, revenue mix, payout batch, prize-pool economics, reconciliation, tax, or run the forecast.');
  };

  ctx();
  chat.bot(['<h2 style="font-size:24px;margin-bottom:6px">Finance Console</h2><p>Morning, Alex. The books are reconciled up to 6:00am. <b>One approval</b> is blocking vendor payouts.</p>'], { delay: 300 });
  W.overview();
  EB.setSuggest(Object.entries(LABELS).map(([id, label]) => ({ label, id })), (c) => { EB.setNav(c.id); chat.user(c.label); W[c.id](); });
})();
