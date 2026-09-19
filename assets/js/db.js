/* eBuzz.ai: local-first data layer
 *
 * Each device keeps its own SQLite database (sql.js / WebAssembly), saved in IndexedDB.
 * Changes sync through a "central" record store (simulated here with a shared IndexedDB, which
 * would be the eBuzz cloud database in production):
 *   - `central` columns are stored in plaintext: only what the platform needs (settlement,
 *     access control, fraud, tax).
 *   - `private` columns (PII, personal financial details) are encrypted on the device with the
 *     account's vault key (AES-GCM). The central store only ever holds ciphertext; other devices of
 *     the same account decrypt them.
 *   - `localOnly` tables never leave the device.
 * Devices are simulated with ?device=<name>; open another tab with ?device=phone to watch it sync.
 */
(function () {
  const SQL_CDN = 'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/';

  const SCHEMA = {
    // shopper
    profile: { cols: ['id', 'name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'card_label', 'created_at'], central: ['id', 'state', 'created_at'], why: 'State is needed for sales tax; everything else stays on your devices (encrypted in the vault).' },
    prefs: { cols: ['id', 'budget_style', 'delivery', 'values_json', 'avoid', 'offers_opt_in', 'memory_opt_in', 'train_opt_in'], central: ['id', 'offers_opt_in'], why: 'Only the live-offer consent flag is needed centrally.' },
    orders: { cols: ['id', 'user_id', 'date', 'item', 'emoji', 'sku', 'vendor', 'qty', 'list_price', 'price', 'credit', 'tax', 'total', 'status', 'via', 'ship_to'], central: ['id', 'user_id', 'date', 'item', 'sku', 'vendor', 'qty', 'list_price', 'price', 'credit', 'tax', 'total', 'status', 'via'], why: 'Amounts are needed for settlement, commission and tax. The shipping address is shared only with the fulfilling vendor.' },
    wallet_tx: { cols: ['id', 'user_id', 'date', 'type', 'label', 'amount'], central: ['id', 'user_id', 'date', 'type', 'amount'], why: 'The credit ledger is kept centrally to value liability and stop fraud. Labels stay private.' },
    cart: { cols: ['id', 'user_id', 'sku', 'item', 'emoji', 'vendor', 'list_price', 'price', 'qty', 'offer', 'added_at'], central: ['id', 'user_id', 'sku', 'vendor', 'list_price', 'price', 'qty', 'offer', 'added_at'], why: 'The cart syncs so you can finish on another device.' },
    memory: { cols: ['id', 'kind', 'text', 'date'], localOnly: true, why: 'Concierge memory never leaves this device.' },
    // supplier org
    sup_staff: { cols: ['id', 'org', 'name', 'email', 'role', 'status', 'added_at'], central: ['id', 'org', 'role', 'status', 'added_at'], why: 'Role and status are enforced centrally. Staff names and emails live in the org vault.' },
    sup_roles: { cols: ['id', 'org', 'name', 'perms_json'], central: ['id', 'org', 'name', 'perms_json'], why: 'Permissions are enforced server-side.' },
    sup_tx: { cols: ['id', 'org', 'date', 'type', 'ref', 'sku', 'qty', 'gross', 'fees', 'net', 'status'], central: ['id', 'org', 'date', 'type', 'ref', 'sku', 'qty', 'gross', 'fees', 'net', 'status'], why: 'Business ledger. No consumer PII.' },
    // eBuzz admin
    adm_staff: { cols: ['id', 'name', 'email', 'role', 'territory', 'status', 'added_at'], central: ['id', 'role', 'territory', 'status', 'added_at'], why: 'Role and territory scope are enforced centrally.' },
    adm_roles: { cols: ['id', 'name', 'perms_json'], central: ['id', 'name', 'perms_json'], why: 'Permissions are enforced server-side.' },
    config: { cols: ['id', 'json', 'updated_at'], central: ['id', 'json', 'updated_at'], why: 'Platform settings, e.g. win limits.' },
    // Buzz Feed (public by design: shown under a display name, never contact details)
    feed_posts: { cols: ['id', 'author_id', 'author', 'avatar', 'kind', 'text', 'rating', 'product', 'sku', 'vendor', 'emoji', 'promo_price', 'list_price', 'cta', 'sponsored', 'status', 'likes', 'shares', 'comments_json', 'mod_score', 'mod_flags', 'impressions', 'clicks', 'targets', 'incentivized', 'verified', 'created_at'], central: ['id', 'author_id', 'author', 'avatar', 'kind', 'text', 'rating', 'product', 'sku', 'vendor', 'emoji', 'promo_price', 'list_price', 'cta', 'sponsored', 'status', 'likes', 'shares', 'comments_json', 'mod_score', 'mod_flags', 'impressions', 'clicks', 'targets', 'incentivized', 'verified', 'created_at'], why: 'Public posts, shown under the display name the author chooses. No email, address or order details are included; "verified purchase" is a yes/no flag.' },
    plat_tx: { cols: ['id', 'date', 'type', 'party', 'ref', 'amount', 'fee', 'status', 'region'], central: ['id', 'date', 'type', 'party', 'ref', 'amount', 'fee', 'status', 'region'], why: 'Platform ledger. Parties are pseudonymous IDs.' },
  };
  // which tables each portal keeps on-device, and which central records it may read
  const SCOPES = {
    customer: { key: 'acct:maya', tables: ['profile', 'prefs', 'orders', 'wallet_tx', 'cart', 'memory', 'config', 'feed_posts'], readOnly: ['config'], filter: (r) => r.table === 'config' || r.table === 'feed_posts' || r.owner === 'acct:maya' },
    supplier: { key: 'org:sitwell', tables: ['sup_staff', 'sup_roles', 'sup_tx', 'orders'], readOnly: ['orders'], filter: (r) => (r.table === 'orders' ? r.data.vendor === 'Sitwell Home' : r.owner === 'org:sitwell') },
    admin: { key: 'org:ebuzz', tables: ['adm_staff', 'adm_roles', 'config', 'plat_tx', 'orders', 'wallet_tx', 'feed_posts'], readOnly: ['orders', 'wallet_tx'], filter: (r) => ['orders', 'wallet_tx', 'feed_posts'].includes(r.table) || r.owner === 'org:ebuzz' },
    vendor: { key: 'org:ergomax', tables: ['feed_posts', 'config'], readOnly: ['config'], filter: (r) => r.table === 'feed_posts' || r.table === 'config' },
    agents: { key: 'org:ebuzz', tables: ['config'], readOnly: ['config'], filter: (r) => r.table === 'config' },
  };

  /* ---------- tiny IndexedDB helpers ---------- */
  const idb = (name, store) => new Promise((res, rej) => {
    const r = indexedDB.open(name, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(store);
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const tx = (db, store, mode, fn) => new Promise((res, rej) => { const t = db.transaction(store, mode); const s = t.objectStore(store); const out = fn(s); t.oncomplete = () => res(out instanceof IDBRequest ? out.result : out); t.onerror = () => rej(t.error); });

  /* ---------- vault crypto (AES-GCM, key derived from the account's secret) ---------- */
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function vaultKey(secret) {
    const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('ebuzz-vault-v1'), iterations: 100000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function seal(key, obj) { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj))); return { iv: b64(iv), ct: b64(ct) }; }
  async function open(key, v) { try { return JSON.parse(dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(v.iv) }, key, unb64(v.ct)))); } catch { return null; } }

  /* ---------- the store ---------- */
  const D = {
    ready: null, sqlOk: false, persona: null, device: null, log: [], listeners: [],
    SCHEMA, SCOPES,
    deviceLabel: (d) => ({ laptop: '💻 Laptop', phone: '📱 Phone', tablet: '📟 Tablet' }[d] || '🖥️ ' + d),
  };
  let SQLdb = null, fallback = {}, central = null, localIdb = null, key = null, scope = null, saveT = null, keyName = '';
  const log = (kind, msg) => { D.log.unshift({ t: new Date().toTimeString().slice(0, 8), kind, msg }); D.log.length = Math.min(D.log.length, 60); D.listeners.forEach((f) => f({ type: 'log' })); };
  const privCols = (t) => SCHEMA[t].cols.filter((c) => !(SCHEMA[t].central || []).includes(c));

  D.init = function ({ persona, seed }) {
    D.persona = persona;
    D.device = (new URLSearchParams(location.search).get('device') || 'laptop').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'laptop';
    scope = SCOPES[persona];
    keyName = `${persona}@${D.device}`;
    D.ready = (async () => {
      try {
        localIdb = await idb('ebuzz-local', 'files');
        central = await idb('ebuzz-central', 'records');
        key = await vaultKey(scope.key + ':demo-vault-secret');
      } catch (e) { log('warn', 'IndexedDB unavailable; data is kept in memory only'); }
      try {
        await new Promise((res, rej) => { if (window.initSqlJs) return res(); const s = document.createElement('script'); s.src = SQL_CDN + 'sql-wasm.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
        const SQL = await initSqlJs({ locateFile: (f) => SQL_CDN + f });
        const file = localIdb ? await tx(localIdb, 'files', 'readonly', (s) => s.get(keyName)) : null;
        SQLdb = file ? new SQL.Database(file) : new SQL.Database();
        D.sqlOk = true;
        log('info', file && file.length ? `Opened local SQLite (${(file.length / 1024).toFixed(0)} KB) on ${D.deviceLabel(D.device)}` : `Created local SQLite on ${D.deviceLabel(D.device)}`);
      } catch (e) { log('warn', 'SQLite (WASM) could not load; using in-memory fallback'); }
      scope.tables.forEach((t) => {
        if (SQLdb) SQLdb.run(`CREATE TABLE IF NOT EXISTS ${t} (${SCHEMA[t].cols.map((c) => `"${c}" TEXT`).join(', ')}, _updated INTEGER, _origin TEXT, PRIMARY KEY(id))`);
        else fallback[t] = fallback[t] || new Map();
      });
      await D.pull();
      if (seed) {
        const empty = scope.tables.filter((t) => !scope.readOnly.includes(t) && D.count(t) === 0);
        if (empty.length) { await seed(empty); log('info', `Seeded demo data: ${empty.join(', ')}`); }
      }
      persist();
      return D;
    })();
    // other tabs/devices announce changes
    EB.bus.on('sync:changed', async (m) => { if (scope && scope.tables.includes(m.table)) { const n = await D.pull(m.key); if (n) D.listeners.forEach((f) => f({ type: 'remote', table: m.table })); } });
    return D.ready;
  };

  function persist() { if (!SQLdb || !localIdb) return; clearTimeout(saveT); saveT = setTimeout(() => tx(localIdb, 'files', 'readwrite', (s) => s.put(SQLdb.export(), keyName)), 250); }
  const rowObj = (cols, vals) => Object.fromEntries(cols.map((c, i) => [c, vals[i]]));
  const NUMERIC = new Set(['price', 'list_price', 'promo_price', 'total', 'tax', 'credit', 'amount', 'gross', 'fees', 'net', 'fee', 'qty', 'offer', 'rating', 'likes', 'shares', 'mod_score', 'impressions', 'clicks', 'sponsored', 'incentivized', 'verified', '_updated']);
  const cast = (t, r) => { const o = {}; SCHEMA[t].cols.forEach((c) => { const v = r[c]; o[c] = v !== null && v !== undefined && v !== '' && !isNaN(v) && NUMERIC.has(c) ? +v : v ?? null; }); return o; };

  function upsertLocal(t, row, updated, origin) {
    if (SQLdb) {
      const cols = [...SCHEMA[t].cols, '_updated', '_origin'];
      SQLdb.run(`INSERT OR REPLACE INTO ${t} (${cols.map((c) => `"${c}"`).join(',')}) VALUES (${cols.map(() => '?').join(',')})`, [...SCHEMA[t].cols.map((c) => (row[c] === undefined || row[c] === null ? null : String(row[c]))), updated, origin]);
    } else fallback[t].set(row.id, { ...row, _updated: updated, _origin: origin });
  }
  const localUpdated = (t, id) => { if (SQLdb) { const r = SQLdb.exec(`SELECT _updated FROM ${t} WHERE id=?`, [id]); return r.length ? +r[0].values[0][0] : 0; } const x = fallback[t].get(id); return x ? x._updated : 0; };

  /** Read all rows of a table (optionally filtered with a SQL WHERE clause when SQLite is available). */
  D.all = (t, where = '', params = []) => {
    if (!scope || !scope.tables.includes(t)) return [];
    if (SQLdb) { const r = SQLdb.exec(`SELECT * FROM ${t} ${where}`, params); return r.length ? r[0].values.map((v) => cast(t, rowObj(r[0].columns, v))) : []; }
    return [...fallback[t].values()].map((r) => cast(t, r));
  };
  D.get = (t, id) => D.all(t, 'WHERE id=?', [id])[0] || (SQLdb ? null : (fallback[t].get(id) ? cast(t, fallback[t].get(id)) : null));
  D.count = (t) => (SQLdb ? +SQLdb.exec(`SELECT COUNT(*) FROM ${t}`)[0].values[0][0] : fallback[t] ? fallback[t].size : 0);
  D.sql = (q) => { if (!SQLdb) throw new Error('SQLite not loaded'); return SQLdb.exec(q); };
  D.on = (fn) => D.listeners.push(fn);

  /** Write rows locally, then push to the central store (split into plaintext + encrypted vault). */
  D.put = async (t, rows, { silent = false } = {}) => {
    rows = Array.isArray(rows) ? rows : [rows];
    const now = Date.now();
    rows.forEach((r) => upsertLocal(t, r, now, D.device));
    persist();
    if (!SCHEMA[t].localOnly && central) {
      const recs = [];
      for (const r of rows) {
        const data = Object.fromEntries((SCHEMA[t].central || []).map((c) => [c, r[c] ?? null]));
        const priv = Object.fromEntries(privCols(t).map((c) => [c, r[c] ?? null]).filter(([, v]) => v !== null));
        recs.push({ table: t, id: r.id, owner: t === 'config' ? 'org:ebuzz' : scope.key, data, vault: Object.keys(priv).length && key ? await seal(key, priv) : null, updated: now, device: D.device });
      }
      await tx(central, 'records', 'readwrite', (s) => recs.forEach((rec) => s.put(rec, `${rec.table}/${rec.id}`)));
      EB.bus.emit('sync:changed', { key: rows.length === 1 ? `${t}/${rows[0].id}` : null, table: t });
      if (!silent) log('push', `${t}: ${rows.length} row${rows.length > 1 ? 's' : ''} → central${privCols(t).length ? ' (PII encrypted)' : ''}`);
    } else if (!silent && SCHEMA[t].localOnly) log('local', `${t}: ${rows.length} row(s) saved on this device only`);
    D.listeners.forEach((f) => f({ type: 'local', table: t }));
  };
  D.del = async (t, id) => {
    if (SQLdb) SQLdb.run(`DELETE FROM ${t} WHERE id=?`, [id]); else fallback[t].delete(id);
    persist();
    if (!SCHEMA[t].localOnly && central) { await tx(central, 'records', 'readwrite', (s) => s.delete(`${t}/${id}`)); EB.bus.emit('sync:deleted', { key: `${t}/${id}`, table: t, id }); }
    log('push', `${t}: deleted ${id}`);
    D.listeners.forEach((f) => f({ type: 'local', table: t }));
  };
  EB.bus.on('sync:deleted', (m) => { if (scope && scope.tables.includes(m.table)) { if (SQLdb) SQLdb.run(`DELETE FROM ${m.table} WHERE id=?`, [m.id]); else fallback[m.table] && fallback[m.table].delete(m.id); persist(); D.listeners.forEach((f) => f({ type: 'remote', table: m.table })); } });

  /** Pull newer central records into the local SQLite (all in scope, or a single key). */
  D.pull = async (onlyKey) => {
    if (!central) return 0;
    let recs = onlyKey ? [await tx(central, 'records', 'readonly', (s) => s.get(onlyKey))].filter(Boolean) : await tx(central, 'records', 'readonly', (s) => s.getAll());
    recs = recs.filter((r) => scope.tables.includes(r.table) && scope.filter(r));
    let n = 0, locked = 0;
    for (const r of recs) {
      if (r.updated <= localUpdated(r.table, r.id)) continue;
      const priv = r.vault ? (key ? await open(key, r.vault) : null) : {};
      if (r.vault && !priv) locked++;
      upsertLocal(r.table, { ...r.data, ...(priv || {}) }, r.updated, r.device);
      n++;
    }
    if (n) { persist(); log('pull', `${n} record${n > 1 ? 's' : ''} ← central${locked ? ` · ${locked} with encrypted PII this account can't read` : ''}`); }
    return n;
  };

  /** Central store stats (what the eBuzz cloud actually holds). */
  D.centralSample = async (t) => { if (!central) return []; const all = await tx(central, 'records', 'readonly', (s) => s.getAll()); return all.filter((r) => r.table === t && scope.filter(r)); };
  D.centralCounts = async () => { if (!central) return {}; const all = await tx(central, 'records', 'readonly', (s) => s.getAll()); const c = {}; all.forEach((r) => (c[r.table] = (c[r.table] || 0) + 1)); return c; };
  D.resetDevice = async () => { if (localIdb) await tx(localIdb, 'files', 'readwrite', (s) => s.delete(keyName)); location.reload(); };
  D.resetAll = async () => { if (localIdb) await tx(localIdb, 'files', 'readwrite', (s) => s.clear()); if (central) await tx(central, 'records', 'readwrite', (s) => s.clear()); EB.bus.emit('sync:reset', {}); location.reload(); };
  EB.bus.on('sync:reset', () => setTimeout(() => location.reload(), 300));

  /* deterministic pseudo-random for seed data */
  D.rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  D.id = (p) => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  D.today = () => new Date().toISOString().slice(0, 10);
  D.daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

  EB.data = D;
})();
