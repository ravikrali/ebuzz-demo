/* eBuzz.ai: Agent Ops / COO control tower prototype */
(function () {
  const { h, $, $$, icon, bus, sleep } = EB;

  const FLEET = [
    ['Demand intelligence', [['Problem Radar', 'radar', 'running', 'L3', 18420, 99.1], ['Review Miner', 'search', 'running', 'L3', 52310, 98.7], ['Product Research', 'target', 'running', 'L2', 1240, 97.9]]],
    ['Content', [['Top10 Lists', 'doc', 'approval', 'L1', 14, 96.0], ['Video Studio', 'video', 'approval', 'L1', 9, 94.2], ['Publisher', 'upload', 'idle', 'L2', 22, 100]]],
    ['Supply', [['Supplier Scout & Outreach', 'users', 'approval', 'L1', 180, 97.3], ['Contract Agent', 'file', 'running', 'L1', 12, 99.0], ['Catalog QA', 'shield', 'running', 'L2', 3920, 98.4]]],
    ['Commerce', [['Shopping Concierge', 'chat', 'running', 'L3', 28140, 96.8], ['Negotiation Broker', 'bolt', 'running', 'L3', 4210, 99.6], ['Search-to-Order', 'box', 'running', 'L3', 5186, 99.8]]],
    ['Fulfilment & service', [['Track Shipping', 'truck', 'running', 'L3', 7410, 99.2], ['Returns & Refunds', 'ret', 'running', 'L2', 211, 98.1], ['Customer Service', 'chat', 'running', 'L2', 3380, 91.4]]],
    ['Money', [['Order-to-Cash', 'dollar', 'approval', 'L1', 5186, 99.9], ['FP&A', 'chart', 'running', 'L2', 30, 100], ['Tax', 'gavel', 'running', 'L1', 48, 100]]],
    ['Risk & compliance', [['Fraud & Trust', 'shield', 'running', 'L2', 612, 97.5], ['Legal', 'gavel', 'idle', 'L0', 6, 100], ['Regulatory Watch', 'alert', 'running', 'L1', 41, 100]]],
    ['Growth', [['Game Economy', 'trophy', 'running', 'L2', 284000, 99.9], ['Ad Ops', 'megaphone', 'running', 'L2', 1120, 99.4], ['Vendor Success', 'users', 'running', 'L2', 96, 98.0]]],
  ];
  const ST = { running: ['green', 'Running'], approval: ['honey', 'Needs approval'], idle: ['', 'Idle'], paused: ['red', 'Paused'] };

  const chat = EB.shell({
    persona: 'agents',
    user: { name: 'Sam Patel', role: 'COO · Agent Ops', initials: 'SP' },
    rail: [
      { id: 'fleet', label: 'Fleet', icon: 'cpu' },
      { id: 'approvals', label: 'Approvals', icon: 'check', badge: 4 },
      { id: 'radar', label: 'Radar', icon: 'radar' },
      { id: 'studio', label: 'Studio', icon: 'video' },
      { id: 'outreach', label: 'Outreach', icon: 'users' },
      { id: 'incidents', label: 'Incidents', icon: 'alert' },
      { id: 'policies', label: 'Policies', icon: 'sliders' },
    ],
    placeholder: 'Ask Ops Copilot, e.g. "what needs my approval?"',
    note: 'Every agent action is logged with its inputs, tools and outputs. Autonomy levels: L0 suggest · L1 act with approval · L2 act then notify · L3 autonomous within limits.',
    onNav: (id) => (id === 'fleet' ? fleet() : (EB.view('chat'), chat.user(LABELS[id]), W[id]())),
  });
  EB.setNav('fleet');
  const LABELS = { approvals: 'What needs my approval?', radar: 'What problems are trending?', studio: 'Show the video queue', outreach: 'How is supplier outreach going?', incidents: 'Any incidents?', policies: 'Show autonomy policies' };

  $('#context').innerHTML = `
    <div class="ctx-section"><div class="row between"><h4 style="margin:0">Fleet health</h4><button class="icon-btn ctx-close" onclick="EB.closeOverlays()" aria-label="Close">${icon('x')}</button></div>
      ${EB.kpis([['Agents', '24'], ['Tasks today', '412k'], ['Success', '98.6%'], ['Human hrs saved', '1,930']])}</div>
    <div class="ctx-section"><h4>Spend today</h4><div class="row between" style="font-size:13px"><span>Model inference</span><b>$1,642</b></div><div class="meter v" style="margin:6px 0 10px"><i style="width:55%"></i></div><div class="row between" style="font-size:13px"><span>Video generation</span><b>$388</b></div><div class="meter v" style="margin-top:6px"><i style="width:31%"></i></div><div class="muted" style="font-size:12px;margin-top:8px">$0.39 per order · budget $0.45</div></div>
    <div class="ctx-section"><h4>Event stream <span class="tag green"><i class="dot live"></i></span></h4><div id="ev" class="stack mono" style="gap:5px;font-size:11.5px"></div></div>`;
  const ev = (t) => { const e = $('#ev'); if (!e) return; e.prepend(h(`<div>${new Date().toTimeString().slice(0, 8)} ${t}</div>`)); while (e.children.length > 9) e.lastChild.remove(); };
  const RANDOM = ['Concierge › session resolved (back pain)', 'Negotiation Broker › session closed · 3 offers', 'Catalog QA › 12 SKUs normalised', 'Track Shipping › ETA update sent', 'Fraud & Trust › promo abuse blocked', 'Review Miner › 1,204 reviews summarised', 'Game Economy › pool rebalanced', 'Problem Radar › new cluster: "garage too cold"'];
  setInterval(() => ev(RANDOM[Math.floor(Math.random() * RANDOM.length)]), 2600);
  bus.on('*', (type, d) => { if (type.startsWith('presence')) return; ev(`<b>${type}</b> ${d && d.sid ? '#' + d.sid : ''}${d && d.id && !d.sid ? d.id : ''}`); });

  function fleet() {
    EB.view('fleet', `<div class="row between wrap" style="margin-bottom:16px;gap:10px"><div><h1 style="font-size:28px">Agent fleet</h1><div class="muted">24 agents across 8 domains · every operational process has an owner agent and a human owner</div></div><button class="btn" onclick="document.querySelector('[data-nav=approvals]').click()">${icon('check')} 4 approvals waiting</button></div>
      ${FLEET.map(([dom, agents]) => `<h3 style="font-size:15px;margin:18px 0 10px;color:var(--muted);font-family:var(--font);text-transform:uppercase;letter-spacing:.06em">${dom}</h3>
        <div class="products" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${agents.map(([n, ic, st, lv, tasks, ok]) => `<div class="card" style="padding:14px">
          <div class="row between"><div class="row"><div class="avatar v" style="border-radius:10px">${icon(ic)}</div><b style="font-size:14px">${n}</b></div><span class="tag">${lv}</span></div>
          <div class="row between" style="margin-top:12px;font-size:12.5px"><span class="tag ${ST[st][0]}">${st === 'running' ? '<i class="dot live"></i> ' : ''}${ST[st][1]}</span><span class="muted">${tasks.toLocaleString()} tasks · ${ok}% ok</span></div></div>`).join('')}</div>`).join('')}`);
    $$('.view[data-view=fleet] .avatar svg').forEach((s) => { s.style.width = '17px'; s.style.height = '17px'; });
  }

  const W = {
    async approvals() {
      const c = h(`<div class="card">${[
        ['video', '60-sec video: "Fix WFH back pain for under $300"', 'Video Studio · claims check passed', 'studio'],
        ['doc', 'Top10: "Best white-noise machines for light sleepers (2026)"', 'Top10 Lists · 14 sources · editor review', 'top10'],
        ['users', '38 outreach emails to pet-toy brands', 'Supplier Scout · CAN-SPAM checks passed', 'outreach'],
        ['dollar', 'Weekly payout batch PB-0918: $292,627', 'Order-to-Cash · 1 fraud hold', 'fin'],
      ].map(([ic, t, s, k]) => `<div class="set-row"><div class="row" style="gap:12px"><div class="avatar v" style="border-radius:10px">${icon(ic)}</div><div>${t}<small>${s}</small></div></div><button class="btn sm primary" data-k="${k}">Review</button></div>`).join('')}</div>`);
      $$('.avatar svg', c).forEach((s) => { s.style.width = '17px'; s.style.height = '17px'; });
      await chat.bot(['4 items are waiting for a human decision:', c]);
      $$('[data-k]', c).forEach((b) => (b.onclick = () => { const k = b.dataset.k; if (k === 'studio') W.studio(); else if (k === 'outreach') W.outreach(); else if (k === 'fin') location.href = 'admin.html'; else W.top10(); }));
    },
    async studio() {
      const c = h(`<div class="card"><div class="grid2" style="align-items:start">
        <div style="aspect-ratio:9/16;max-height:360px;border-radius:14px;background:linear-gradient(160deg,#2B1D5C,#F2A000);position:relative;display:grid;place-items:center;color:#fff;overflow:hidden">
          <div style="text-align:center;padding:20px"><div style="font-size:54px">🪑</div><div style="font-family:var(--display);font-size:22px;font-weight:700;line-height:1.1;margin-top:8px">Your back hurts because of THIS</div><div style="font-size:12px;opacity:.85;margin-top:8px">3 fixes · under $300</div></div>
          <div style="position:absolute;bottom:10px;left:10px;right:10px;display:flex;justify-content:space-between;font-size:11px"><span>▶ 0:00 / 1:12</span><span style="background:rgba(0,0,0,.4);padding:2px 6px;border-radius:5px">AI-generated · label on</span></div></div>
        <div class="stack"><div class="card-title">Fix WFH back pain for under $300</div>
          <div class="muted" style="font-size:13px">Script → storyboard → voice → edit by Video Studio · for YouTube Shorts + the Top10 page</div>
          ${[['Health claims check (no medical claims)', 1], ['Products & prices match catalog', 1], ['Music licence', 1], ['AI-content disclosure label', 1], ['Affiliate / sponsorship disclosure', 1], ['Brand safety', 1]].map(([t]) => `<div class="row" style="font-size:13.5px;gap:8px"><span class="up">${icon('check')}</span>${t}</div>`).join('')}
          ${EB.aiNote('Predicted: 48k views in 30 days, 1.9% click-through to the Concierge. Hook tested best of 3 variants.')}
          <label class="field">Notes for the agent (optional)<input placeholder="e.g. shorten the intro to 3 sec"></label>
          <div class="row wrap"><button class="btn primary" data-ok>Approve & publish</button><button class="btn" data-ch>Request changes</button><button class="btn ghost danger" data-rej>Reject</button></div></div></div></div>`);
      $$('svg', c).forEach((s) => { s.style.width = '16px'; s.style.height = '16px'; });
      await chat.bot(['Video waiting for approval (the 1st of 9 today):', c]);
      $('[data-ok]', c).onclick = () => { $$('button', c).forEach((b) => (b.disabled = true)); chat.bot(`${icon('check')} Approved. The Publisher agent is uploading to YouTube (scheduled 6pm ET, when your audience is most active) and embedding it on the Top10 page.`); ev('Publisher › video queued for YouTube'); };
      $('[data-ch]', c).onclick = () => chat.bot('Sent back to Video Studio with your notes. A new cut is usually ready in ~10 min.');
      $('[data-rej]', c).onclick = () => chat.bot('Rejected and logged. I\'ll use this as a negative example for future scripts.');
    },
    async top10() {
      await chat.bot(['Draft Top10 page (editor review required before publishing):', h(`<div class="card"><div class="tag violet" style="margin-bottom:8px">Draft · 1,840 words · 14 sources</div><h3>Best white-noise machines for light sleepers (2026)</h3><p class="muted" style="font-size:13.5px">How we picked: 6,700 verified reviews analysed, 4 units tested hands-on in the eBuzz Lab, return-rate data. We may earn a commission. Rankings aren't for sale.</p><ol style="font-size:14px;line-height:1.7;padding-left:20px"><li><b>Hushly Fan</b>: best overall (real fan, no loop)</li><li><b>CalmTone Speaker</b>: best for travel</li><li><b>…8 more</b></li></ol><div class="row"><button class="btn sm primary" onclick="this.disabled=true;EB.toast('Published to /guides (demo)')">Approve & publish</button><button class="btn sm">Edit</button></div></div>`)]);
    },
    async radar() {
      await chat.bot(['Top rising problems this week (licensed social, forum, search-trend and review data):', h(`<div class="card">${EB.table(['Problem cluster', 'Mentions (7d)', 'Growth', 'Products we carry', 'Action'], [
        ['Tailbone pain when sitting', '18.2k', '<span class="up">+64%</span>', '6', '<span class="tag green">Video queued</span>'],
        ['Garage too cold for home gym', '9.4k', '<span class="up">+58%</span>', '0', '<button class="btn sm ai" data-s>Scout suppliers</button>'],
        ['Standing-desk leg fatigue', '12.9k', '<span class="up">+41%</span>', '4', '<span class="tag">Top10 drafted</span>'],
        ['Dog anxiety during storms', '15.1k', '<span class="up">+37%</span>', '2', '<button class="btn sm ai" data-s>Scout suppliers</button>'],
        ['Laptop neck pain', '21.7k', '<span class="up">+33%</span>', '9', '<span class="tag green">Covered</span>'],
      ], { right: [1, 2, 3] })}</div>`), EB.aiNote('Complaint mining: <b>"mesh sagging after 6 months"</b> is up 3× in reviews of two competing chairs. ErgoMax and Sitwell are unaffected. Worth highlighting in Concierge answers.')]).then((b) => $$('[data-s]', b).forEach((x) => (x.onclick = () => { x.outerHTML = '<span class="tag honey">Scout running…</span>'; ev('Supplier Scout › new search started'); })));
    },
    async outreach() {
      const f = [['Identified', 420], ['Qualified', 260], ['Contacted', 180], ['Replied', 52], ['Calls booked', 21], ['Signed', 9]];
      const c = h(`<div class="card"><div class="card-title" style="margin-bottom:12px">Pet-supplies vertical · supplier pipeline</div>
        ${f.map(([l, v]) => `<div class="row" style="margin:6px 0;gap:10px"><span style="width:110px;font-size:13px">${l}</span><div style="flex:1" class="meter v"><i style="width:${(v / 420) * 100}%"></i></div><b class="num" style="width:40px;text-align:right">${v}</b></div>`).join('')}
        <div class="sep"></div><div class="card-title" style="margin-bottom:6px">Next batch: 38 emails · sample</div>
        <div style="font-size:13.5px;background:var(--surface-2);padding:12px;border-radius:10px;line-height:1.55"><b>To:</b> partnerships@tuffroot.example<br><b>Subject:</b> 15k dog owners asked us about heavy chewers this week<br><br>Hi TuffRoot team, your rubber chew is the most-recommended fix for "dog destroys every toy" in our data (4.7★ across 15k reviews). eBuzz shoppers describe their problem, and brands like yours can send live offers when you're shortlisted. No listing fees; 11% commission only when you win…<br><span class="muted">[unsubscribe link] · [postal address]</span></div>
        <div class="card-foot"><button class="btn primary" data-send>Approve batch of 38</button><button class="btn">Edit template</button></div></div>`);
      await chat.bot(['Supplier Scout & Outreach, this week:', c]);
      $('[data-send]', c).onclick = (e) => { e.target.disabled = true; chat.bot(`${icon('check')} Sending over the next 2 hours (max 20/hour per domain). Replies go to the Vendor Success team with an AI summary.`); ev('Outreach › batch of 38 approved'); };
    },
    async incidents() {
      await chat.bot(['1 incident in the last 7 days, resolved:', h(`<div class="card"><div class="row between wrap"><div class="card-title">INC-0042 · Returns agent refund anomaly</div><span class="tag green">Resolved · 38 min</span></div>
        <div class="stack" style="font-size:13.5px;margin-top:10px">
          <div class="row"><span class="mono muted">09:12</span><span>Guardrail tripped: refund rate 3.1× baseline for one seller</span></div>
          <div class="row"><span class="mono muted">09:12</span><span>Returns agent auto-paused to L0 (suggest-only)</span></div>
          <div class="row"><span class="mono muted">09:31</span><span>Cause: the seller changed their return window in their CSV (30 → 3 days, a typo)</span></div>
          <div class="row"><span class="mono muted">09:50</span><span>Fixed with the seller; agent restored to L2; eval case added</span></div></div>
        ${EB.aiNote('Loss prevented: est. $2,140 in refunds that were outside policy. No customer was affected.')}</div>`)]);
    },
    async policies() {
      await chat.bot(['Autonomy policies (hard limits are enforced in code, not prompts):', h(`<div class="card">${EB.table(['Agent', 'Level', 'Hard limit', 'Escalates to'], [
        ['Returns & Refunds', 'L2', 'Refund ≤ $200; ≤ 2 per customer / 30d', 'CX lead'],
        ['Negotiation Broker', 'L3', 'Never below vendor floor; max 3 rounds; no cross-session price data', 'Marketplace lead'],
        ['Order-to-Cash', 'L1', 'Every payout batch approved by a human', 'Finance'],
        ['Video Studio / Top10', 'L1', 'Nothing published without an editor', 'Content lead'],
        ['Supplier Outreach', 'L1', 'CAN-SPAM; ≤ 20 emails/hr/domain', 'Vendor Success'],
        ['Game Economy', 'L2', 'Prize pool ≤ 40% of Play ad revenue', 'Finance'],
        ['Legal', 'L0', 'Drafts only', 'General counsel'],
      ], { left: true })}</div>`)]);
    },
  };

  chat.onText = (t) => {
    const s = t.toLowerCase();
    const map = [[/approv|waiting|review/, 'approvals'], [/trend|radar|problem/, 'radar'], [/video|studio|youtube/, 'studio'], [/outreach|supplier|vendor|scout/, 'outreach'], [/incident|error|fail/, 'incidents'], [/polic|autonomy|limit/, 'policies'], [/top ?10|blog|guide/, 'top10']];
    const hit = map.find(([r]) => r.test(s));
    if (/fleet|agents|status/.test(s)) { EB.setNav('fleet'); return fleet(); }
    if (hit) return W[hit[1]]();
    chat.bot('I can show approvals, trending problems, the video queue, supplier outreach, incidents or autonomy policies.');
  };

  const summary = h(`<div class="card"><div class="kpis">${FLEET.map(([dom, a]) => { const ap = a.filter((x) => x[2] === 'approval').length; return `<div class="kpi"><div class="l">${dom}</div><div class="v" style="font-size:17px">${a.length} agents</div><div class="d ${ap ? '' : 'up'}" style="${ap ? 'color:var(--honey-ink)' : ''}">${ap ? ap + ' need approval' : 'all healthy'}</div></div>`; }).join('')}</div><div class="card-foot"><button class="btn sm" data-f>${icon('cpu')} Open fleet view</button><button class="btn sm primary" data-a>Review approvals</button></div></div>`);
  $('[data-f]', summary).onclick = () => { EB.setNav('fleet'); fleet(); };
  $('[data-a]', summary).onclick = () => { EB.setNav('approvals'); chat.user(LABELS.approvals); W.approvals(); };
  EB.setNav('');
  chat.bot(['<h2 style="font-size:24px;margin-bottom:6px">Agent Control Tower</h2><p>Hi Sam. 24 agents are running across every operational process. <b>4 items need you</b>: a video, a Top10 page, an outreach batch, and a payout batch.</p>', summary], { delay: 200 });
  EB.setSuggest(Object.entries(LABELS).map(([id, label]) => ({ label, id })), (c) => { EB.setNav(c.id); chat.user(c.label); W[c.id](); });
})();
