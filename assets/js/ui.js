/* eBuzz.ai prototype: shared shell, chat engine, cross-tab event bus, helpers */
(function () {
  const EB = (window.EB = {});

  /* ---------- theme (persisted per viewer; safe if storage is blocked) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  EB.store = store;
  /* per-tab demo state (wallet, orders) resets when the tab closes */
  EB.sstore = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const savedTheme = store.get('eb-theme', null);
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  EB.isDark = () => (document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  EB.setTheme = (mode) => {
    document.documentElement.dataset.theme = mode;
    store.set('eb-theme', mode);
    document.querySelectorAll('.theme-seg button').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
  };
  EB.toggleTheme = () => EB.setTheme(EB.isDark() ? 'light' : 'dark');

  /* ---------- helpers ---------- */
  EB.h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.children.length === 1 ? t.content.firstElementChild : t.content; };
  EB.$ = (s, r = document) => r.querySelector(s);
  EB.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  EB.money = (n, d = 2) => (Number(n) < -0.004 ? '-' : '') + '$' + Math.abs(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  EB.k = (n) => n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? '$' + (n / 1e3).toFixed(1) + 'k' : EB.money(n);
  EB.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  EB.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  EB.mmss = (s) => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };

  EB.toast = (msg) => {
    let box = EB.$('.toasts');
    if (!box) { box = EB.h('<div class="toasts" role="status" aria-live="polite"></div>'); document.body.append(box); }
    const t = EB.h(`<div class="toast">${msg}</div>`);
    box.append(t);
    setTimeout(() => t.remove(), 3600);
  };

  /* ---------- icons (24px stroke) ---------- */
  const P = {
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
    play: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><circle cx="15.5" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.8" cy="13.8" r=".9" fill="currentColor"/>',
    wallet: '<path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0 0 4h14a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6"/><circle cx="16.5" cy="13.5" r="1.2" fill="currentColor"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z"/><path d="M15 8a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    boxes: '<rect x="3" y="12" width="8" height="8" rx="1"/><rect x="13" y="12" width="8" height="8" rx="1"/><rect x="8" y="3" width="8" height="8" rx="1"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    ret: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    dollar: '<path d="M12 2v20M17 6.5C17 4.6 14.8 4 12 4S7 5 7 7.5 9.5 10.5 12 11s5 1.6 5 4-2.2 3.5-5 3.5-5-1-5-3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    send: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 19 5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h0"/>',
    home: '<path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/>',
    gavel: '<path d="m14 5 5 5M11 8l5 5M9.5 9.5l-6 6 2 2 6-6M13 3l8 8-3 3-8-8z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 21h8M9 17h6v4H9z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  };
  EB.icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  EB.logo = (size = 30) => `<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 1.8 28.3 8.9v14.2L16 30.2 3.7 23.1V8.9Z" fill="var(--honey)"/>
    <path d="M11 9.5v12.5M11 15.2c1.2-1.9 3-2.8 5-2.8 3 0 5 2.1 5 4.8S19 22 16 22c-2 0-3.8-.9-5-2.8" fill="none" stroke="#1A1200" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="22.6" cy="8.6" r="2.1" fill="#1A1200"/></svg>`;

  /* ---------- cross-tab event bus (open two portals side by side) ---------- */
  const PAGE = Math.random().toString(36).slice(2, 8);
  const handlers = {};
  const deliver = (m) => { if (!m || m.from === PAGE) return; (handlers[m.type] || []).forEach((f) => f(m.data)); (handlers['*'] || []).forEach((f) => f(m.type, m.data)); };
  let ch = null;
  try { ch = new BroadcastChannel('ebuzz-demo'); ch.onmessage = (e) => deliver(e.data); } catch {}
  if (!ch) window.addEventListener('storage', (e) => { if (e.key === 'ebuzz-bus' && e.newValue) { try { deliver(JSON.parse(e.newValue)); } catch {} } });
  EB.bus = {
    on(type, fn) { (handlers[type] ||= []).push(fn); },
    emit(type, data) {
      const m = { type, data, from: PAGE, t: Date.now() };
      if (ch) ch.postMessage(m);
      else { try { localStorage.setItem('ebuzz-bus', JSON.stringify(m)); } catch {} }
    },
  };

  /* ---------- app shell ---------- */
  const PERSONAS = [
    { id: 'customer', label: 'Shopper', href: 'customer.html' },
    { id: 'vendor', label: 'Deal Room · Vendor Mgr', href: 'vendor.html' },
    { id: 'supplier', label: 'Supplier Hub', href: 'supplier.html' },
    { id: 'admin', label: 'Admin', href: 'admin.html' },
    { id: 'agents', label: 'Agent Ops', href: 'agents.html' },
  ];

  EB.shell = function ({ persona, user, rail, onNav, context = '', placeholder = 'Ask anything…', note = '' }) {
    document.body.classList.add('app');
    document.body.dataset.persona = persona;
    document.body.innerHTML = `
      <header class="topbar">
        <a class="brand" href="../index.html" title="eBuzz.ai home">${EB.logo()}<span>eBuzz<b>.ai</b></span></a>
        <nav class="persona-switch" aria-label="Switch persona">${PERSONAS.map((p) => `<a href="${p.href}" class="${p.id === persona ? 'on' : ''}">${p.label}</a>`).join('')}</nav>
        <div class="spacer"></div>
        <button class="sync-chip" id="syncChip" title="Local SQLite database and sync status"><i class="dot"></i><span class="lbl" id="syncLbl">Local DB</span></button>
        <div class="theme-seg" role="group" aria-label="Theme"><button data-mode="light">${EB.icon('sun')}<span class="lbl">Light</span></button><button data-mode="dark">${EB.icon('moon')}<span class="lbl">Dark</span></button></div>
        <button class="icon-btn m-theme" id="themeBtn" title="Toggle dark mode" aria-label="Toggle dark mode">${EB.icon('sun')}</button>
        <button class="icon-btn ctx-toggle" id="ctxBtn" title="Context panel" aria-label="Open context panel">${EB.icon('panel')}</button>
        <div class="user-chip"><div class="avatar ${user.cls || ''}">${user.initials}</div><div class="u-text"><b>${user.name}</b><div class="muted" style="font-size:12px;line-height:1.2">${user.role}</div></div></div>
      </header>
      <div class="shell">
        <nav class="rail" aria-label="Sections">${rail.map((r) => r.sep ? '<div class="rail-sep"></div>' : `<button data-nav="${r.id}" title="${r.label}">${EB.icon(r.icon)}<span>${r.label}</span>${r.badge ? `<i class="badge">${r.badge}</i>` : ''}</button>`).join('')}</nav>
        <main class="main">
          <section class="view on" data-view="chat">
            <div class="scroll" id="chatScroll"><div class="thread" id="thread"></div></div>
            <div class="composer-wrap"><div class="composer-inner">
              <div class="suggest" id="suggest"></div>
              <form class="composer" id="composer">
                <textarea id="input" rows="1" placeholder="${EB.esc(placeholder)}" aria-label="Message"></textarea>
                <button type="button" class="mic" title="Voice (demo)" aria-label="Voice input">${EB.icon('mic')}</button>
                <button class="send" aria-label="Send">${EB.icon('send')}</button>
              </form>
              <div class="composer-note">${note}</div>
            </div></div>
          </section>
        </main>
        <aside class="context" id="context" aria-label="Context">${context}</aside>
      </div>
      <div class="scrim" id="scrim"></div>`;

    EB.$('#themeBtn').onclick = EB.toggleTheme;
    EB.$$('.theme-seg button').forEach((b) => { b.classList.toggle('on', b.dataset.mode === (EB.isDark() ? 'dark' : 'light')); b.onclick = () => EB.setTheme(b.dataset.mode); });
    EB.$('#syncChip').onclick = () => EB.syncView && EB.syncView();
    const ctx = EB.$('#context'), scrim = EB.$('#scrim');
    EB.openContext = () => { ctx.classList.add('on'); scrim.classList.add('on'); };
    EB.closeOverlays = () => { ctx.classList.remove('on'); scrim.classList.remove('on'); EB.$$('.drawer.on,.modal.on').forEach((d) => d.classList.remove('on')); };
    EB.$('#ctxBtn').onclick = EB.openContext;
    scrim.onclick = EB.closeOverlays;
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') EB.closeOverlays(); });

    EB.$$('.rail button').forEach((b) => (b.onclick = () => { EB.setNav(b.dataset.nav); onNav && onNav(b.dataset.nav); }));
    EB.setNav = (id) => EB.$$('.rail button').forEach((b) => b.classList.toggle('on', b.dataset.nav === id));

    const chat = new Chat(EB.$('#thread'), EB.$('#chatScroll'));
    const input = EB.$('#input');
    input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); EB.$('#composer').requestSubmit(); } });
    EB.$('#composer').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim(); if (!v) return;
      input.value = ''; input.style.height = 'auto';
      chat.user(EB.esc(v)); chat.onText && chat.onText(v);
    });
    EB.$('.mic').onclick = () => EB.toast('Voice input is simulated in this prototype');
    return chat;
  };

  /* Show a non-chat view in the main area (Play, Wallet, etc.) */
  EB.view = function (id, html) {
    let v = EB.$(`.view[data-view="${id}"]`);
    if (!v && html !== undefined) { v = EB.h(`<section class="view" data-view="${id}"><div class="scroll"><div class="pad"></div></div></section>`); EB.$('.main').append(v); }
    if (v && html !== undefined) EB.$('.pad', v).innerHTML = html;
    EB.$$('.view').forEach((x) => x.classList.toggle('on', x === v));
    if (v) EB.$('.scroll', v).scrollTop = 0;
    return v;
  };

  EB.setSuggest = (items, handler) => {
    const s = EB.$('#suggest'); s.innerHTML = '';
    items.forEach((it) => { const b = EB.h(`<button class="chip ${it.ai ? 'ai' : ''}">${it.label}</button>`); b.onclick = () => handler(it); s.append(b); });
  };

  EB.drawer = function (title, sub, bodyHtml) {
    let d = EB.$('#drawer');
    if (!d) { d = EB.h(`<div class="drawer" id="drawer" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="card-title" id="drTitle"></div><div class="card-sub" id="drSub"></div></div><button class="icon-btn" aria-label="Close">${EB.icon('x')}</button></div><div class="drawer-body" id="drBody"></div></div>`); document.body.append(d); EB.$('button', d).onclick = EB.closeOverlays; }
    EB.$('#drTitle').innerHTML = title; EB.$('#drSub').innerHTML = sub; EB.$('#drBody').innerHTML = bodyHtml;
    d.classList.add('on'); EB.$('#scrim').classList.add('on');
    return EB.$('#drBody');
  };
  EB.modal = function (html) {
    let m = EB.$('#modal');
    if (!m) { m = EB.h('<div class="modal" id="modal" role="dialog" aria-modal="true"></div>'); document.body.append(m); }
    m.innerHTML = html; m.classList.add('on'); EB.$('#scrim').classList.add('on');
    return m;
  };

  /* ---------- chat engine ---------- */
  class Chat {
    constructor(thread, scroller) { this.thread = thread; this.scroller = scroller; this.queue = Promise.resolve(); }
    scroll() { requestAnimationFrame(() => this.scroller.scrollTo({ top: this.scroller.scrollHeight, behavior: 'smooth' })); }
    user(html) { const m = EB.h(`<div class="msg user"><div class="bubble">${html}</div></div>`); this.thread.append(m); this.scroll(); return m; }
    system(html) { const m = EB.h(`<div class="msg system"><div class="bubble">${html}</div></div>`); this.thread.append(m); this.scroll(); return m; }
    /* bot(): queued so replies always appear in order; parts may be HTML strings or Nodes */
    bot(parts, { delay = 650 } = {}) {
      parts = Array.isArray(parts) ? parts : [parts];
      const p = this.queue.then(async () => {
        const m = EB.h(`<div class="msg bot"><div class="who">${EB.logo(30)}</div><div class="body"><div class="typing"><i></i><i></i><i></i></div></div></div>`);
        this.thread.append(m); this.scroll();
        await EB.sleep(delay);
        const body = EB.$('.body', m); body.innerHTML = '';
        parts.forEach((x) => body.append(typeof x === 'string' ? EB.h(`<div class="bubble">${x}</div>`) : x));
        this.scroll();
        return body;
      });
      this.queue = p.catch(() => {});
      return p;
    }
  }
  EB.Chat = Chat;

  /* ---------- small building blocks ---------- */
  EB.kpis = (items) => `<div class="kpis">${items.map((k) => `<div class="kpi"><div class="l">${k[0]}</div><div class="v">${k[1]}</div>${k[2] ? `<div class="d ${k[3] || ''}">${k[2]}</div>` : ''}</div>`).join('')}</div>`;
  EB.table = (head, rows, opts = {}) => `<div class="table-wrap"><table class="t"><thead><tr>${head.map((h, i) => `<th class="${opts.right && opts.right.includes(i) ? 'r' : ''}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr class="${r.hl ? 'hl' : ''}">${(r.cells || r).map((c, i) => `<td class="${opts.right && opts.right.includes(i) ? 'r' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  EB.aiNote = (html) => `<div class="ai-note">${EB.icon('spark')}<div>${html}</div></div>`;
  EB.bars = (vals, alt = []) => { const m = Math.max(...vals); return `<div class="bars">${vals.map((v, i) => `<i class="${alt.includes(i) ? 'alt' : ''}" style="height:${(v / m) * 100}%" title="${v}"></i>`).join('')}</div>`; };
})();
