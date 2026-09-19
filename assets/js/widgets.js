/* eBuzz.ai: shared widgets. Full-list data table, staff & RBAC manager, data & sync panel. */
(function () {
  const { h, $, $$, icon, money, esc } = EB;

  /* ---------- CSV download (generated locally) ---------- */
  EB.downloadCSV = (name, columns, rows) => {
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [columns.map((c) => q(c.label)).join(','), ...rows.map((r) => columns.map((c) => q(r[c.key])).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  /* ---------- full-list data table: search, filter, period, sort, paging, totals, export ---------- */
  EB.dataTable = function ({ columns, rows, filterKey, searchKeys, pageSize = 15, csv = 'transactions.csv', sortKey = 'date', sortDir = -1, sumKey, sumLabel = 'Total' }) {
    let data = rows, q = '', f = 'All', period = 'all', page = 0;
    const el = h(`<div>
      <div class="dt-bar">
        <label class="dt-search">${icon('search')}<input placeholder="Search…" aria-label="Search"></label>
        <select class="btn sm" data-period aria-label="Period"><option value="all">All time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 12 months</option></select>
        <button class="btn sm" data-csv>${icon('download')} Export CSV</button>
      </div>
      <div class="chips" data-filters style="margin-bottom:12px"></div>
      <div class="table-wrap"><table class="t"><thead><tr></tr></thead><tbody></tbody></table></div>
      <div class="dt-foot"><span data-info></span><span data-sum></span><div class="row"><button class="btn sm" data-prev>‹ Prev</button><button class="btn sm" data-next>Next ›</button></div></div></div>`);
    const view = () => {
      const cut = period === 'all' ? '' : new Date(Date.now() - +period * 864e5).toISOString().slice(0, 10);
      let r = data.filter((x) => (f === 'All' || x[filterKey] === f) && (!cut || (x.date || '') >= cut));
      if (q) r = r.filter((x) => (searchKeys || columns.map((c) => c.key)).some((k) => String(x[k] ?? '').toLowerCase().includes(q)));
      r.sort((a, b) => { const A = a[sortKey], B = b[sortKey]; return (typeof A === 'number' && typeof B === 'number' ? A - B : String(A ?? '').localeCompare(String(B ?? ''))) * sortDir; });
      return r;
    };
    const render = () => {
      if (filterKey) {
        const opts = ['All', ...new Set(data.map((x) => x[filterKey]).filter(Boolean))];
        $('[data-filters]', el).innerHTML = opts.map((o) => `<button class="chip ${o === f ? 'on' : ''}" data-f="${esc(o)}">${esc(o)} <span class="muted">${o === 'All' ? data.length : data.filter((x) => x[filterKey] === o).length}</span></button>`).join('');
        $$('[data-f]', el).forEach((b) => (b.onclick = () => { f = b.dataset.f; page = 0; render(); }));
      }
      $('thead tr', el).innerHTML = columns.map((c) => `<th class="sort ${c.right ? 'r' : ''}" data-k="${c.key}">${c.label}${sortKey === c.key ? (sortDir < 0 ? ' ↓' : ' ↑') : ''}</th>`).join('');
      $$('th[data-k]', el).forEach((th) => (th.onclick = () => { if (sortKey === th.dataset.k) sortDir *= -1; else { sortKey = th.dataset.k; sortDir = -1; } render(); }));
      const r = view(), pages = Math.max(1, Math.ceil(r.length / pageSize));
      page = Math.min(page, pages - 1);
      const slice = r.slice(page * pageSize, page * pageSize + pageSize);
      $('tbody', el).innerHTML = slice.length ? slice.map((x) => `<tr>${columns.map((c) => `<td class="${c.right ? 'r' : ''}">${c.fmt ? c.fmt(x[c.key], x) : esc(x[c.key] ?? '')}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${columns.length}" class="muted" style="text-align:center;padding:20px">No matching records</td></tr>`;
      $('[data-info]', el).textContent = r.length ? `Showing ${page * pageSize + 1}–${Math.min(r.length, (page + 1) * pageSize)} of ${r.length}` : '0 records';
      $('[data-sum]', el).innerHTML = sumKey ? `${sumLabel}: <b class="num" style="color:var(--ink)">${money(r.reduce((a, x) => a + (+x[sumKey] || 0), 0))}</b>` : '';
      $('[data-prev]', el).disabled = page === 0; $('[data-next]', el).disabled = page >= pages - 1;
    };
    $('input', el).oninput = (e) => { q = e.target.value.toLowerCase(); page = 0; render(); };
    $('[data-period]', el).onchange = (e) => { period = e.target.value; page = 0; render(); };
    $('[data-prev]', el).onclick = () => { page--; render(); };
    $('[data-next]', el).onclick = () => { page++; render(); };
    $('[data-csv]', el).onclick = () => { EB.downloadCSV(csv, columns, view()); EB.toast('CSV exported (generated on this device)'); };
    el.update = (rows2) => { data = rows2; render(); };
    render();
    return el;
  };

  /* ---------- staff & role-based access control ---------- */
  EB.rbacView = function ({ staff, roles, perms, lockedRole, territories, onAddStaff, onUpdateStaff, onRemoveStaff, onSaveRoles, orgLabel }) {
    roles = roles.map((r) => ({ ...r, perms: new Set(r.perms) }));
    const el = h(`<div class="stack" style="gap:18px">
      <div class="card"><div class="card-head"><div><div class="card-title">${icon('users')} Staff</div><div class="card-sub">${orgLabel} · names and emails are stored in the encrypted org vault. Only role, scope and status are stored centrally for access checks.</div></div><button class="btn primary" data-add>+ Add staff</button></div><div data-staff></div></div>
      <div class="card"><div class="card-head"><div><div class="card-title">${icon('shield')} Roles & permissions</div><div class="card-sub">Tick what each role may do. The server enforces these rules on every request, and agents act only within the permissions of the person who started them.</div></div><div class="row"><button class="btn sm" data-newrole>+ Role</button><button class="btn sm primary" data-save>Save roles</button></div></div><div class="table-wrap" data-matrix></div></div>
      <div class="card flat"><div class="card-title" style="margin-bottom:8px">Effective access preview</div><div class="row wrap"><select class="btn sm" data-who></select><span class="muted" style="font-size:13px" data-eff></span></div></div>
    </div>`);
    const renderStaff = () => {
      $('[data-staff]', el).innerHTML = EB.table(['Name', 'Email', 'Role', ...(territories ? ['Territory'] : []), 'Active', 'Added', ''], staff.map((s) => [
        `<b>${esc(s.name || '🔒')}</b>`, `<span class="muted">${esc(s.email || '🔒 encrypted')}</span>`,
        `<select class="btn sm" data-role="${s.id}" ${s.role === lockedRole ? 'disabled' : ''}>${roles.map((r) => `<option ${r.name === s.role ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select>`,
        ...(territories ? [`<select class="btn sm" data-terr="${s.id}"><option value="">-</option>${territories.map((t) => `<option ${t === s.territory ? 'selected' : ''}>${t}</option>`).join('')}</select>`] : []),
        `<label class="toggle"><input type="checkbox" data-st="${s.id}" ${s.status === 'active' ? 'checked' : ''} ${s.role === lockedRole ? 'disabled' : ''}><span></span></label>`,
        s.added_at || '', s.role === lockedRole ? '' : `<button class="btn sm ghost danger" data-rm="${s.id}" aria-label="Remove">${icon('x')}</button>`,
      ]), { left: true });
      const upd = async (id, patch) => { const s = staff.find((x) => x.id === id); Object.assign(s, patch); await onUpdateStaff(s); renderEff(); EB.toast('Access updated · synced'); };
      $$('[data-role]', el).forEach((x) => (x.onchange = () => upd(x.dataset.role, { role: x.value })));
      $$('[data-terr]', el).forEach((x) => (x.onchange = () => upd(x.dataset.terr, { territory: x.value })));
      $$('[data-st]', el).forEach((x) => (x.onchange = () => upd(x.dataset.st, { status: x.checked ? 'active' : 'suspended' })));
      $$('[data-rm]', el).forEach((x) => (x.onclick = async () => { const i = staff.findIndex((s) => s.id === x.dataset.rm); const [s] = staff.splice(i, 1); await onRemoveStaff(s); renderStaff(); renderEff(); EB.toast(`${s.name} removed`); }));
    };
    const renderMatrix = () => {
      const groups = [...new Set(perms.map((p) => p.group))];
      $('[data-matrix]', el).innerHTML = `<table class="t rbac"><thead><tr><th>Permission</th>${roles.map((r) => `<th>${esc(r.name)}</th>`).join('')}</tr></thead><tbody>${groups.map((g) => `<tr class="grp"><td colspan="${roles.length + 1}">${g}</td></tr>${perms.filter((p) => p.group === g).map((p) => `<tr><td>${p.label}</td>${roles.map((r, ri) => `<td><input type="checkbox" data-r="${ri}" data-p="${p.key}" ${r.name === lockedRole || r.perms.has(p.key) ? 'checked' : ''} ${r.name === lockedRole ? 'disabled' : ''} aria-label="${esc(r.name)}: ${esc(p.label)}"></td>`).join('')}</tr>`).join('')}`).join('')}</tbody></table>`;
      $$('[data-r]', el).forEach((c) => (c.onchange = () => { const r = roles[+c.dataset.r]; c.checked ? r.perms.add(c.dataset.p) : r.perms.delete(c.dataset.p); renderEff(); }));
    };
    const renderEff = () => {
      const sel = $('[data-who]', el), cur = sel.value;
      sel.innerHTML = staff.map((s) => `<option value="${s.id}">${esc(s.name || s.id)} · ${esc(s.role)}</option>`).join('');
      if (cur) sel.value = cur;
      const s = staff.find((x) => x.id === sel.value) || staff[0]; if (!s) return;
      const r = roles.find((x) => x.name === s.role);
      const list = s.role === lockedRole ? ['everything'] : perms.filter((p) => r && r.perms.has(p.key)).map((p) => p.label);
      $('[data-eff]', el).innerHTML = s.status !== 'active' ? '<span class="tag red">Suspended: no access</span>' : `Can: ${list.join(' · ') || 'nothing yet'}${s.territory ? ` <span class="tag blue">Scope: ${esc(s.territory)}</span>` : ''}`;
    };
    $('[data-who]', el).onchange = renderEff;
    $('[data-save]', el).onclick = async () => { await onSaveRoles(roles.map((r) => ({ ...r, perms: [...r.perms] }))); EB.toast('Roles saved · enforced centrally'); };
    $('[data-newrole]', el).onclick = () => {
      const m = EB.modal(`<h3 style="margin-bottom:12px">New role</h3><label class="field">Role name<input id="rn" placeholder="e.g. Returns Specialist"></label><div class="row" style="margin-top:14px"><button class="btn primary" id="rok">Add role</button><button class="btn ghost" onclick="EB.closeOverlays()">Cancel</button></div>`);
      $('#rok', m).onclick = () => { const n = $('#rn', m).value.trim(); if (!n) return; roles.push({ id: EB.data.id('role'), name: n, perms: new Set() }); EB.closeOverlays(); renderMatrix(); renderStaff(); };
    };
    $('[data-add]', el).onclick = () => {
      const m = EB.modal(`<h3 style="margin-bottom:12px">Add staff member</h3><div class="stack">
        <label class="field">Full name<input id="sn" placeholder="Jane Doe"></label>
        <label class="field">Work email<input id="se" type="email" placeholder="jane@company.com"></label>
        <label class="field">Role<select id="sr">${roles.filter((r) => r.name !== lockedRole).map((r) => `<option>${esc(r.name)}</option>`).join('')}</select></label>
        ${territories ? `<label class="field">Territory (scopes which vendors, customers and cases they can see)<select id="stt"><option value="">-</option>${territories.map((t) => `<option>${t}</option>`).join('')}</select></label>` : ''}
        ${EB.aiNote('They get an invite link and sign in with a passkey. Their name and email are encrypted on this device before sync.')}
        <div class="row"><button class="btn primary" id="sok">Send invite</button><button class="btn ghost" onclick="EB.closeOverlays()">Cancel</button></div></div>`);
      $('#sok', m).onclick = async () => {
        const name = $('#sn', m).value.trim(), email = $('#se', m).value.trim();
        if (!name || !/.+@.+\..+/.test(email)) return EB.toast('Enter a name and a valid email');
        const s = { id: EB.data.id('stf'), name, email, role: $('#sr', m).value, territory: territories ? $('#stt', m).value : undefined, status: 'active', added_at: EB.data.today() };
        staff.push(s); await onAddStaff(s); EB.closeOverlays(); renderStaff(); renderEff(); EB.toast(`Invite sent to ${email}`);
      };
    };
    renderStaff(); renderMatrix(); renderEff();
    return el;
  };

  /* ---------- data & sync panel (opened from the topbar chip) ---------- */
  EB.syncView = async function () {
    const D = EB.data;
    const body = EB.drawer(`${icon('db')} Data & sync`, D.persona ? `${D.deviceLabel(D.device)} · local SQLite ${D.sqlOk ? 'loaded' : '(fallback)'}` : 'Privacy model', '<p class="muted">Loading…</p>');
    if (!D.persona || !D.SCOPES[D.persona].tables.length) {
      body.innerHTML = `<p>This portal doesn't store personal data. Deal Room sessions are anonymised: vendors see a problem, a budget band and an intent score, never who the shopper is.</p>`;
      return;
    }
    const counts = await D.centralCounts();
    const scope = D.SCOPES[D.persona];
    const other = D.device === 'phone' ? 'laptop' : 'phone';
    const defaultSQL = { customer: 'SELECT type, COUNT(*) AS n, ROUND(SUM(amount),2) AS total\nFROM wallet_tx GROUP BY type;', supplier: 'SELECT type, COUNT(*) AS n, ROUND(SUM(net),2) AS net\nFROM sup_tx GROUP BY type ORDER BY net DESC;', admin: 'SELECT type, COUNT(*) AS n, ROUND(SUM(amount),2) AS amount\nFROM plat_tx GROUP BY type;', vendor: 'SELECT kind, status, COUNT(*) AS posts, SUM(likes) AS likes\nFROM feed_posts GROUP BY kind, status;' }[D.persona] || `SELECT name FROM sqlite_master WHERE type='table';`;
    body.innerHTML = `
      <div class="card flat" style="margin-bottom:14px"><div class="row between wrap"><div><b>${D.deviceLabel(D.device)}</b><div class="muted" style="font-size:13px">This device's SQLite database, saved in the browser. It syncs with eBuzz central.</div></div>
        <div class="row wrap"><a class="btn sm primary" href="?device=${other}" target="_blank">Open as ${D.deviceLabel(other)}</a><button class="btn sm" data-pull>Sync now</button></div></div>
        <div style="margin-top:12px">${EB.aiNote(`<b>How your data is split:</b> <span class="cls local">This device only</span> never leaves the device. <span class="cls vault">E2EE vault</span> is encrypted here (AES-256-GCM) and can only be read by your own devices. <span class="cls central">Central</span> is plaintext, and only what's needed for payments, tax, fraud checks and access control.`)}</div></div>
      <div class="stack" style="gap:10px">${scope.tables.map((t) => { const S = D.SCHEMA[t]; return `<div class="card flat" style="padding:12px">
        <div class="row between"><b class="mono" style="font-size:13px">${t}</b><span class="muted" style="font-size:12px">${D.count(t)} local · ${S.localOnly ? 'never synced' : (counts[t] || 0) + ' central'}${scope.readOnly.includes(t) ? ' · read-only here' : ''}</span></div>
        <div class="chips" style="margin:8px 0 6px;gap:4px">${S.cols.map((c) => `<span class="cls ${S.localOnly ? 'local' : (S.central || []).includes(c) ? 'central' : 'vault'}">${c}</span>`).join('')}</div>
        <div class="muted" style="font-size:12.5px">${S.why}</div></div>`; }).join('')}</div>
      <h4 style="margin:18px 0 8px">What the eBuzz cloud actually stores</h4>
      <div class="row wrap" style="margin-bottom:8px"><select class="btn sm" data-ct>${scope.tables.filter((t) => !D.SCHEMA[t].localOnly).map((t) => `<option>${t}</option>`).join('')}</select><span class="muted" style="font-size:12.5px">latest central record, as stored</span></div>
      <pre class="card flat sql-out" data-rec style="white-space:pre-wrap;word-break:break-all;max-height:220px;overflow:auto;margin:0"></pre>
      <h4 style="margin:18px 0 8px">SQL console (runs on this device's SQLite)</h4>
      <textarea class="card flat sql-out" data-q rows="3" style="width:100%;resize:vertical">${defaultSQL}</textarea>
      <div class="row" style="margin:8px 0"><button class="btn sm primary" data-run>Run</button></div><div data-out></div>
      <h4 style="margin:18px 0 8px">Sync log</h4>
      <div class="stack mono" data-log style="gap:4px;font-size:12px"></div>
      <div class="row wrap" style="margin-top:18px"><button class="btn sm" data-resetdev>Wipe this device & restore from central</button><button class="btn sm ghost danger" data-resetall>Reset all demo data</button></div>`;
    const showRec = async () => { const recs = await D.centralSample($('[data-ct]', body).value); const r = recs.sort((a, b) => b.updated - a.updated)[0]; $('[data-rec]', body).textContent = r ? JSON.stringify({ ...r, vault: r.vault ? { iv: r.vault.iv, ct: r.vault.ct.slice(0, 64) + '…(ciphertext)' } : null }, null, 2) : '(no records)'; };
    $('[data-ct]', body).onchange = showRec; showRec();
    const run = () => { try { const res = D.sql($('[data-q]', body).value); $('[data-out]', body).innerHTML = res.length ? EB.table(res[0].columns, res[0].values.slice(0, 50).map((r) => r.map((v) => esc(v ?? '')))) : '<span class="muted">OK · no rows</span>'; } catch (e) { $('[data-out]', body).innerHTML = `<div class="warn-note">${esc(e.message)}</div>`; } };
    $('[data-run]', body).onclick = run; run();
    const renderLog = () => { const l = $('[data-log]', body); if (l) l.innerHTML = D.log.slice(0, 25).map((x) => `<div><span class="muted">${x.t}</span> <span class="cls ${x.kind === 'push' ? 'central' : x.kind === 'pull' ? 'vault' : 'local'}">${x.kind}</span> ${esc(x.msg)}</div>`).join(''); };
    renderLog(); D.on(renderLog);
    $('[data-pull]', body).onclick = async () => { const n = await D.pull(); EB.toast(n ? `Pulled ${n} records` : 'Already up to date'); renderLog(); };
    $('[data-resetdev]', body).onclick = () => D.resetDevice();
    $('[data-resetall]', body).onclick = () => { if (confirm('Reset all demo data on every device and portal in this browser?')) D.resetAll(); };
  };

  /* keep the topbar chip in sync */
  EB.bindSyncChip = () => {
    const D = EB.data, lbl = $('#syncLbl'), chip = $('#syncChip'); if (!lbl) return;
    const set = (busy) => { chip.classList.toggle('busy', busy); lbl.textContent = `${D.deviceLabel(D.device)} · ${busy ? 'syncing…' : 'synced'}`; };
    set(true);
    D.ready.then(() => set(false));
    D.on((e) => { if (e.type === 'log') return; set(true); setTimeout(() => set(false), 500); });
  };
})();
/* portals that keep no personal data still show the chip */
setTimeout(() => { if (!EB.data || !EB.data.persona) { const l = document.getElementById('syncLbl'); if (l) l.textContent = 'No PII stored'; } }, 0);
