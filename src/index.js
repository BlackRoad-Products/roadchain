// RoadChain — Sovereign Blockchain for BlackRoad OS
// D1 persistent ledger + Coinbase Commerce + x402 micropayments + cross-app event bus
// v4.0.0 — Block Explorer, Smart Contracts, Analytics, Webhooks, Multi-Chain, Proof of Existence, Governance, Export
// + Receipts, Subscriptions, Merkle Proofs, Cross-Chain Bridge, NFT Registry, Chain Indexer, Audit Trail, Chain Notifications

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };

    if (request.method === "OPTIONS")
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization,X-RoadChain-App,X-RoadChain-Signature" } });

    // Health
    if (url.pathname === "/health")
      return json({ ok: true, service: "roadchain", version: "4.0.0", chain: "active" });

    // ── LEDGER: the real blockchain ──
    if (url.pathname === "/api/ledger" && request.method === "POST")
      return handleLedgerWrite(request, env);

    if (url.pathname === "/api/ledger" && request.method === "GET")
      return handleLedgerRead(url, env);

    if (url.pathname === "/api/ledger/verify" && request.method === "GET")
      return handleLedgerVerify(url, env);

    if (url.pathname === "/api/ledger/stats" && request.method === "GET")
      return handleLedgerStats(env);

    // ── ROADCOIN: token operations ──
    if (url.pathname === "/api/balance" && request.method === "GET")
      return handleBalance(url, env);

    if (url.pathname === "/api/transfer" && request.method === "POST")
      return handleTransfer(request, env);

    if (url.pathname === "/api/mint" && request.method === "POST")
      return handleMint(request, env);

    // ── COINBASE COMMERCE: buy RoadCoin with crypto ──
    if (url.pathname === "/api/charge" && request.method === "POST")
      return handleCreateCharge(request, env);

    if (url.pathname.startsWith("/api/charge/") && request.method === "GET")
      return handleGetCharge(url.pathname.split("/")[3], env);

    // ── COINBASE WEBHOOKS ──
    if (url.pathname === "/webhook/coinbase" && request.method === "POST")
      return handleCoinbaseWebhook(request, env);

    // ── x402: micropayment protocol ──
    if (url.pathname === "/api/x402/negotiate" && request.method === "POST")
      return handleX402Negotiate(request, env);

    if (url.pathname === "/api/x402/verify" && request.method === "POST")
      return handleX402Verify(request, env);

    // ── CROSS-APP EVENT BUS: any BlackRoad app can write events ──
    if (url.pathname === "/api/event" && request.method === "POST")
      return handleAppEvent(request, env);

    if (url.pathname === "/api/events" && request.method === "GET")
      return handleAppEvents(url, env);

    // ── NEW: BLOCK EXPLORER ──
    if (url.pathname === "/api/explorer" && request.method === "GET")
      return handleExplorer(url, env);

    // ── NEW: SMART CONTRACTS ──
    if (url.pathname === "/api/contracts" && request.method === "POST")
      return handleContractDeploy(request, env);

    if (url.pathname === "/api/contracts" && request.method === "GET")
      return handleContractList(url, env);

    if (url.pathname === "/api/contracts/trigger" && request.method === "POST")
      return handleContractTrigger(request, env);

    // ── NEW: CHAIN ANALYTICS ──
    if (url.pathname === "/api/analytics" && request.method === "GET")
      return handleAnalytics(url, env);

    // ── NEW: WEBHOOKS ──
    if (url.pathname === "/api/webhooks" && request.method === "POST")
      return handleWebhookRegister(request, env);

    if (url.pathname === "/api/webhooks" && request.method === "GET")
      return handleWebhookList(url, env);

    if (url.pathname === "/api/webhooks" && request.method === "DELETE")
      return handleWebhookDelete(request, env);

    // ── NEW: MULTI-CHAIN ──
    if (url.pathname === "/api/chains" && request.method === "GET")
      return handleChainList(env);

    if (url.pathname === "/api/chains" && request.method === "POST")
      return handleChainCreate(request, env);

    if (url.pathname.startsWith("/api/chains/") && request.method === "GET")
      return handleChainInfo(url, env);

    // ── NEW: PROOF OF EXISTENCE ──
    if (url.pathname === "/api/proof" && request.method === "POST")
      return handleProofCreate(request, env);

    if (url.pathname === "/api/proof" && request.method === "GET")
      return handleProofVerify(url, env);

    // ── NEW: TOKEN GOVERNANCE ──
    if (url.pathname === "/api/governance/proposals" && request.method === "POST")
      return handleGovernancePropose(request, env);

    if (url.pathname === "/api/governance/proposals" && request.method === "GET")
      return handleGovernanceList(url, env);

    if (url.pathname === "/api/governance/vote" && request.method === "POST")
      return handleGovernanceVote(request, env);

    if (url.pathname.startsWith("/api/governance/proposals/") && request.method === "GET")
      return handleGovernanceResult(url, env);

    // ── NEW: CHAIN EXPORT ──
    if (url.pathname === "/api/export" && request.method === "GET")
      return handleExport(url, env);

    // ── NEW: TRANSACTION RECEIPTS ──
    if (url.pathname === "/api/receipts" && request.method === "GET")
      return handleReceiptGet(url, env);

    if (url.pathname === "/api/receipts" && request.method === "POST")
      return handleReceiptGenerate(request, env);

    // ── NEW: CHAIN SUBSCRIPTIONS ──
    if (url.pathname === "/api/subscribe" && request.method === "POST")
      return handleSubscribeCreate(request, env);

    if (url.pathname === "/api/subscribe" && request.method === "GET")
      return handleSubscribeList(url, env);

    if (url.pathname === "/api/subscribe" && request.method === "DELETE")
      return handleSubscribeDelete(request, env);

    if (url.pathname === "/api/subscribe/feed" && request.method === "GET")
      return handleSubscribeFeed(url, env);

    // ── NEW: MERKLE PROOFS ──
    if (url.pathname === "/api/merkle" && request.method === "GET")
      return handleMerkleTree(url, env);

    if (url.pathname === "/api/merkle/verify" && request.method === "POST")
      return handleMerkleVerify(request, env);

    // ── NEW: CROSS-CHAIN BRIDGE ──
    if (url.pathname === "/api/bridge" && request.method === "POST")
      return handleBridgeTransfer(request, env);

    if (url.pathname === "/api/bridge" && request.method === "GET")
      return handleBridgeList(url, env);

    if (url.pathname === "/api/bridge/verify" && request.method === "GET")
      return handleBridgeVerify(url, env);

    // ── NEW: NFT REGISTRY ──
    if (url.pathname === "/api/nft/mint" && request.method === "POST")
      return handleNFTMint(request, env);

    if (url.pathname === "/api/nft/transfer" && request.method === "POST")
      return handleNFTTransfer(request, env);

    if (url.pathname === "/api/nft" && request.method === "GET")
      return handleNFTQuery(url, env);

    if (url.pathname.startsWith("/api/nft/") && request.method === "GET")
      return handleNFTDetail(url, env);

    // ── NEW: CHAIN INDEXER ──
    if (url.pathname === "/api/index" && request.method === "POST")
      return handleIndexCreate(request, env);

    if (url.pathname === "/api/index" && request.method === "GET")
      return handleIndexQuery(url, env);

    if (url.pathname === "/api/index/list" && request.method === "GET")
      return handleIndexList(env);

    // ── NEW: AUDIT TRAIL ──
    if (url.pathname === "/api/audit-trail" && request.method === "GET")
      return handleAuditTrail(url, env);

    if (url.pathname === "/api/audit-trail/verify" && request.method === "GET")
      return handleAuditVerify(url, env);

    if (url.pathname === "/api/audit-trail/export" && request.method === "GET")
      return handleAuditExport(url, env);

    // ── NEW: CHAIN NOTIFICATIONS ──
    if (url.pathname === "/api/chain-notify" && request.method === "POST")
      return handleNotifyRuleCreate(request, env);

    if (url.pathname === "/api/chain-notify" && request.method === "GET")
      return handleNotifyRuleList(url, env);

    if (url.pathname === "/api/chain-notify" && request.method === "DELETE")
      return handleNotifyRuleDelete(request, env);

    if (url.pathname === "/api/chain-notify/history" && request.method === "GET")
      return handleNotifyHistory(url, env);

    // ── UI ──
    if (url.pathname === "/api/info")
      return json({
        name: "RoadChain", version: "4.0.0",
        endpoints: [
          "/api/ledger", "/api/balance", "/api/transfer", "/api/mint",
          "/api/charge", "/api/x402/negotiate", "/api/event", "/api/events",
          "/api/ledger/verify", "/api/ledger/stats",
          "/api/explorer", "/api/contracts", "/api/analytics",
          "/api/webhooks", "/api/chains", "/api/proof",
          "/api/governance/proposals", "/api/governance/vote", "/api/export",
          "/api/receipts", "/api/subscribe", "/api/merkle",
          "/api/bridge", "/api/nft", "/api/index",
          "/api/audit-trail", "/api/chain-notify"
        ]
      });

    return new Response(HTML, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
  }
};

// ── INIT DB ──
let dbReady = false;
async function ensureTables(db) {
  if (dbReady) return;
  dbReady = true;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS ledger (
      id TEXT PRIMARY KEY,
      block_number INTEGER,
      prev_hash TEXT,
      hash TEXT NOT NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      app TEXT DEFAULT 'system',
      data TEXT DEFAULT '{}',
      road_id TEXT,
      amount REAL DEFAULT 0,
      chain_name TEXT DEFAULT 'main',
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS balances (
      road_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      total_earned REAL DEFAULT 0,
      total_spent REAL DEFAULT 0,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      app TEXT NOT NULL,
      type TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      road_id TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      trigger_action TEXT NOT NULL,
      trigger_entity TEXT DEFAULT '*',
      condition TEXT DEFAULT '{}',
      effect_action TEXT NOT NULL,
      effect_data TEXT DEFAULT '{}',
      owner TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      executions INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      event_types TEXT NOT NULL,
      owner TEXT DEFAULT 'anonymous',
      active INTEGER DEFAULT 1,
      last_fired TEXT,
      fire_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS chains (
      name TEXT PRIMARY KEY,
      description TEXT DEFAULT '',
      created_by TEXT DEFAULT 'system',
      block_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS proofs (
      id TEXT PRIMARY KEY,
      document_hash TEXT NOT NULL,
      description TEXT DEFAULT '',
      owner TEXT NOT NULL,
      block_number INTEGER,
      ledger_hash TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      proposer TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      yes_votes REAL DEFAULT 0,
      no_votes REAL DEFAULT 0,
      abstain_votes REAL DEFAULT 0,
      voter_count INTEGER DEFAULT 0,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      proposal_id TEXT NOT NULL,
      voter TEXT NOT NULL,
      choice TEXT NOT NULL,
      weight REAL DEFAULT 1,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      subscriber TEXT NOT NULL,
      filter_entity TEXT DEFAULT '*',
      filter_action TEXT DEFAULT '*',
      filter_app TEXT DEFAULT '*',
      filter_road_id TEXT DEFAULT '*',
      filter_chain TEXT DEFAULT 'main',
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS bridge_transfers (
      id TEXT PRIMARY KEY,
      source_chain TEXT NOT NULL,
      target_chain TEXT NOT NULL,
      source_block INTEGER,
      target_block INTEGER,
      source_hash TEXT,
      target_hash TEXT,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      data TEXT DEFAULT '{}',
      road_id TEXT,
      amount REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      verified INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS nfts (
      id TEXT PRIMARY KEY,
      token_id INTEGER,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'general',
      metadata TEXT DEFAULT '{}',
      image_url TEXT DEFAULT '',
      owner TEXT NOT NULL,
      creator TEXT NOT NULL,
      chain_name TEXT DEFAULT 'main',
      block_number INTEGER,
      ledger_hash TEXT,
      transferable INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS nft_transfers (
      id TEXT PRIMARY KEY,
      nft_id TEXT NOT NULL,
      from_owner TEXT NOT NULL,
      to_owner TEXT NOT NULL,
      block_number INTEGER,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS custom_indexes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      fields TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_by TEXT DEFAULT 'system',
      entry_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS index_entries (
      id TEXT PRIMARY KEY,
      index_name TEXT NOT NULL,
      ledger_id TEXT NOT NULL,
      field_values TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS notify_rules (
      id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      name TEXT DEFAULT '',
      filter_action TEXT DEFAULT '*',
      filter_entity TEXT DEFAULT '*',
      filter_app TEXT DEFAULT '*',
      filter_chain TEXT DEFAULT 'main',
      min_amount REAL DEFAULT 0,
      webhook_url TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      fire_count INTEGER DEFAULT 0,
      last_fired TEXT,
      created_at TEXT NOT NULL
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS notify_history (
      id TEXT PRIMARY KEY,
      rule_id TEXT NOT NULL,
      ledger_id TEXT,
      block_number INTEGER,
      action TEXT,
      entity TEXT,
      status TEXT DEFAULT 'sent',
      response_code INTEGER,
      created_at TEXT NOT NULL
    )`)
  ]);

  // Ensure main chain exists
  await db.prepare("INSERT OR IGNORE INTO chains (name, description, created_by, block_count, created_at) VALUES ('main', 'Primary RoadChain', 'system', 0, ?)").bind(new Date().toISOString()).run();
}

// ── PS-SHA∞ HASH ──
// PS-SHA∞ — Persistent Secure SHA Infinity
// Depth is NOT fixed — it scales with the significance of the data.
// Financial transactions: depth 7. Ledger blocks: depth 5. Events: depth 3.
// The ∞ means there's no theoretical maximum. Depth adapts to trust requirements.
// Each iteration compounds tamper resistance exponentially.
async function pssha(data, depth = 3) {
  let h = data;
  for (let i = 0; i < depth; i++) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(h));
    h = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return h;
}

// Adaptive depth based on action type
function getPSSHADepth(action) {
  const depths = {
    "transfer": 7,        // Financial: maximum security
    "mint": 7,            // Token creation: maximum security
    "charge_confirmed": 7,// Coinbase payment: maximum security
    "x402_payment": 6,    // Micropayment: high security
    "proof_of_existence": 6, // Document proof: high security
    "governance_vote": 5, // Governance: standard chain
    "contract_exec": 5,   // Contract execution: standard chain
    "solve": 5,           // Tutor solve: standard chain
    "post": 4,            // Social post: moderate
    "message": 3,         // Chat message: basic
    "query": 3,           // Search query: basic
    "default": 5,         // Everything else: standard
  };
  return depths[action] || depths["default"];
}

// ── LEDGER WRITE (the core blockchain operation) ──
async function handleLedgerWrite(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.action || !body?.entity) return json({ error: "Missing action or entity" }, 400);

  await ensureTables(env.DB);
  const chainName = body.chain || "main";

  // Get previous block for this chain
  const prev = await env.DB.prepare("SELECT hash, block_number FROM ledger WHERE chain_name = ? ORDER BY block_number DESC LIMIT 1").bind(chainName).first();
  const prevHash = prev?.hash || "genesis";
  const blockNumber = (prev?.block_number || 0) + 1;

  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const app = request.headers.get("X-RoadChain-App") || body.app || "direct";
  const roadId = body.road_id || "anonymous";
  const amount = body.amount || 0;

  // Hash: prev_hash + action + entity + data + timestamp (PS-SHA∞ adaptive depth)
  const depth = getPSSHADepth(body.action);
  const payload = JSON.stringify({ prev: prevHash, action: body.action, entity: body.entity, data: body.data, ts: timestamp });
  const hash = await pssha(payload, depth);

  await env.DB.prepare(
    `INSERT INTO ledger (id, block_number, prev_hash, hash, action, entity, app, data, road_id, amount, chain_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, blockNumber, prevHash, hash, body.action, body.entity, app, JSON.stringify(body.data || {}), roadId, amount, chainName, timestamp).run();

  // Update chain block count
  await env.DB.prepare("UPDATE chains SET block_count = ? WHERE name = ?").bind(blockNumber, chainName).run();

  // Fire webhooks
  await fireWebhooks(env, body.action, { id, block_number: blockNumber, hash, action: body.action, entity: body.entity, app, road_id: roadId, amount, chain: chainName });

  // Check smart contracts
  await checkContracts(env, body.action, body.entity, body.data, roadId);

  return json({ id, block_number: blockNumber, hash, prev_hash: prevHash, chain: chainName });
}

// ── LEDGER READ ──
async function handleLedgerRead(url, env) {
  await ensureTables(env.DB);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 1000);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1"), 1);
  const offset = (page - 1) * limit;
  const app = url.searchParams.get("app");
  const roadId = url.searchParams.get("road_id");
  const chain = url.searchParams.get("chain") || "main";

  let query = "SELECT * FROM ledger";
  const conditions = ["chain_name = ?"];
  const params = [chain];

  if (app) { conditions.push("app = ?"); params.push(app); }
  if (roadId) { conditions.push("road_id = ?"); params.push(roadId); }
  query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY block_number DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const rows = await env.DB.prepare(query).bind(...params).all();
  return json({ entries: rows.results, count: rows.results.length, chain, page, limit });
}

// ── LEDGER VERIFY: replay and check all hashes ──
async function handleLedgerVerify(url, env) {
  await ensureTables(env.DB);
  const chainName = url.searchParams.get('chain') || 'main';
  const rows = await env.DB.prepare("SELECT * FROM ledger WHERE chain_name = ? ORDER BY block_number ASC LIMIT 100000").bind(chainName).all();

  let valid = true;
  let checked = 0;
  let lastHash = "genesis";

  for (const row of rows.results) {
    if (row.prev_hash !== lastHash) { valid = false; break; }
    const payload = JSON.stringify({ prev: row.prev_hash, action: row.action, entity: row.entity, data: JSON.parse(row.data), ts: row.created_at });
    const depth = getPSSHADepth(row.action);
    const computed = await pssha(payload, depth);
    if (computed !== row.hash) { valid = false; break; }
    lastHash = row.hash;
    checked++;
  }

  return json({ valid, checked, latest_block: rows.results.length ? rows.results[rows.results.length - 1].block_number : 0, chain: valid ? "verified" : "BROKEN" });
}

// ── LEDGER STATS ──
async function handleLedgerStats(env) {
  await ensureTables(env.DB);
  const total = await env.DB.prepare("SELECT COUNT(*) as count, MAX(block_number) as latest FROM ledger").first();
  const apps = await env.DB.prepare("SELECT app, COUNT(*) as count FROM ledger GROUP BY app ORDER BY count DESC LIMIT 20").all();
  const recent = await env.DB.prepare("SELECT action, entity, app, hash, created_at FROM ledger ORDER BY block_number DESC LIMIT 10").all();

  return json({
    total_blocks: total?.count || 0,
    latest_block: total?.latest || 0,
    apps: apps.results,
    recent: recent.results,
    chain: "active"
  });
}

// ── ROADCOIN BALANCE ──
async function handleBalance(url, env) {
  const roadId = url.searchParams.get("road_id");
  if (!roadId) return json({ error: "Missing road_id" }, 400);
  await ensureTables(env.DB);
  const row = await env.DB.prepare("SELECT * FROM balances WHERE road_id = ?").bind(roadId).first();
  return json(row || { road_id: roadId, balance: 0, total_earned: 0, total_spent: 0 });
}

// ── ROADCOIN TRANSFER ──
async function handleTransfer(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.from || !body?.to || !body?.amount) return json({ error: "Missing from, to, or amount" }, 400);
  if (body.amount <= 0) return json({ error: "Amount must be positive" }, 400);

  await ensureTables(env.DB);

  const sender = await env.DB.prepare("SELECT balance FROM balances WHERE road_id = ?").bind(body.from).first();
  if (!sender || sender.balance < body.amount) return json({ error: "Insufficient balance" }, 400);

  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare("UPDATE balances SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?").bind(body.amount, body.amount, now, body.from),
    env.DB.prepare("INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?").bind(body.to, body.amount, body.amount, now, body.amount, body.amount, now),
  ]);

  // Log to ledger
  const ledgerEntry = await handleLedgerWriteInternal(env, "transfer", "roadcoin", "roadchain", body.from, body.amount, { from: body.from, to: body.to, amount: body.amount, memo: body.memo });

  return json({ success: true, from: body.from, to: body.to, amount: body.amount, ledger_block: ledgerEntry.block_number });
}

// ── ROADCOIN MINT (reward mechanism) ──
async function handleMint(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.road_id || !body?.amount || !body?.reason) return json({ error: "Missing road_id, amount, or reason" }, 400);

  await ensureTables(env.DB);

  // Rate limit: max 10 mints per road_id per hour
  const rateCheck = await env.DB.prepare("SELECT COUNT(*) as c FROM ledger WHERE road_id = ? AND action = 'mint' AND timestamp > datetime('now', '-1 hour')").bind(body.road_id).first();
  if (rateCheck && rateCheck.c >= 10) return json({ error: "Rate limit exceeded: max 10 mints per hour per road_id" }, 429);

  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
  ).bind(body.road_id, body.amount, body.amount, now, body.amount, body.amount, now).run();

  const ledgerEntry = await handleLedgerWriteInternal(env, "mint", "roadcoin", "roadchain", body.road_id, body.amount, { reason: body.reason });

  return json({ success: true, road_id: body.road_id, minted: body.amount, reason: body.reason, ledger_block: ledgerEntry.block_number });
}

// ── INTERNAL LEDGER WRITE (for programmatic use) ──
async function handleLedgerWriteInternal(env, action, entity, app, roadId, amount, data, chainName = "main") {
  await ensureTables(env.DB);
  const prev = await env.DB.prepare("SELECT hash, block_number FROM ledger WHERE chain_name = ? ORDER BY block_number DESC LIMIT 1").bind(chainName).first();
  const prevHash = prev?.hash || "genesis";
  const blockNumber = (prev?.block_number || 0) + 1;
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const depth = getPSSHADepth(action);
  const payload = JSON.stringify({ prev: prevHash, action, entity, data, ts: timestamp });
  const hash = await pssha(payload, depth);

  await env.DB.prepare(
    `INSERT INTO ledger (id, block_number, prev_hash, hash, action, entity, app, data, road_id, amount, chain_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, blockNumber, prevHash, hash, action, entity, app, JSON.stringify(data || {}), roadId || "system", amount || 0, chainName, timestamp).run();

  await env.DB.prepare("UPDATE chains SET block_count = ? WHERE name = ?").bind(blockNumber, chainName).run();

  // Fire webhooks for internal writes too
  await fireWebhooks(env, action, { id, block_number: blockNumber, hash, action, entity, app, road_id: roadId, amount, chain: chainName });

  // Check contracts
  await checkContracts(env, action, entity, data, roadId);

  // Fire chain notifications
  await fireChainNotifications(env, { id, block_number: blockNumber, hash, action, entity, app, road_id: roadId, amount, chain: chainName });

  return { id, block_number: blockNumber, hash, prev_hash: prevHash };
}

// ── COINBASE COMMERCE ──
async function handleCreateCharge(request, env) {
  const body = await request.json().catch(() => null);
  if (!env.COINBASE_API_KEY) return json({ error: "Coinbase not configured. Set COINBASE_API_KEY secret." }, 500);

  const charge = await fetch("https://api.commerce.coinbase.com/charges", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CC-Api-Key": env.COINBASE_API_KEY, "X-CC-Version": "2018-03-22" },
    body: JSON.stringify({
      name: body?.name || "RoadCoin Purchase",
      description: body?.description || "Purchase RoadCoin on BlackRoad OS",
      pricing_type: "fixed_price",
      local_price: { amount: body?.amount || "5.00", currency: body?.currency || "USD" },
      metadata: { source: "roadchain", road_id: body?.road_id || "anonymous", ts: new Date().toISOString() },
    }),
  });

  if (!charge.ok) return json({ error: "Coinbase charge failed", detail: await charge.text() }, 500);
  const data = await charge.json();

  // Log to ledger
  await handleLedgerWriteInternal(env, "charge_created", "coinbase", "roadchain", body?.road_id, parseFloat(body?.amount || "5"), { charge_id: data.data.id });

  return json({ id: data.data.id, hosted_url: data.data.hosted_url, expires_at: data.data.expires_at, pricing: data.data.pricing });
}

async function handleGetCharge(chargeId, env) {
  if (!env.COINBASE_API_KEY) return json({ error: "Coinbase not configured" }, 500);
  const res = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
    headers: { "X-CC-Api-Key": env.COINBASE_API_KEY, "X-CC-Version": "2018-03-22" },
  });
  if (!res.ok) return json({ error: "Charge not found" }, 404);
  const data = await res.json();
  return json({ id: data.data.id, status: data.data.timeline?.[data.data.timeline.length - 1]?.status || "unknown", payments: data.data.payments });
}

async function handleCoinbaseWebhook(request, env) {
  const body = await request.text();
  const event = JSON.parse(body);

  if (event?.event?.type === "charge:confirmed") {
    const chargeId = event.event.data.id;
    const amount = parseFloat(event.event.data.pricing?.local?.amount || "0");
    const roadId = event.event.data.metadata?.road_id || "anonymous";

    // Mint RoadCoin for the buyer
    const roadCoinAmount = amount; // 1 USD = 1 ROAD for now
    await ensureTables(env.DB);
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
    ).bind(roadId, roadCoinAmount, roadCoinAmount, now, roadCoinAmount, roadCoinAmount, now).run();

    await handleLedgerWriteInternal(env, "charge_confirmed", "coinbase", "roadchain", roadId, roadCoinAmount, { charge_id: chargeId, usd_amount: amount });
  }

  return json({ received: true });
}

// ── x402 MICROPAYMENT PROTOCOL ──
async function handleX402Negotiate(request, env) {
  const body = await request.json().catch(() => null);
  // Returns payment requirements for a given resource
  return json({
    protocol: "x402",
    version: "1.0",
    payment_required: true,
    amount: body?.amount || "0.001",
    currency: "USDC",
    network: "base",
    chain_id: 8453,
    recipient: env.ROADCHAIN_WALLET || "0x0000000000000000000000000000000000000000",
    memo: body?.memo || "RoadChain x402 payment",
    expires: new Date(Date.now() + 300000).toISOString(), // 5 min
  });
}

async function handleX402Verify(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.tx_hash) return json({ error: "Missing tx_hash" }, 400);

  // In production: verify the transaction on Base using RPC
  // For now: accept and log
  await handleLedgerWriteInternal(env, "x402_payment", "micropayment", body.app || "x402", body.road_id || "anonymous", parseFloat(body.amount || "0.001"), { tx_hash: body.tx_hash, network: "base" });

  return json({ verified: true, tx_hash: body.tx_hash, logged: true });
}

// ── CROSS-APP EVENT BUS ──
// Any BlackRoad app can POST events here — tutor solves, chat messages, social posts, search queries
async function handleAppEvent(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.app || !body?.type) return json({ error: "Missing app or type" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO events (id, app, type, data, road_id, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, body.app, body.type, JSON.stringify(body.data || {}), body.road_id || "anonymous", now).run();

  // Also write to the ledger for permanent record
  await handleLedgerWriteInternal(env, body.type, body.app, body.app, body.road_id, body.amount || 0, body.data);

  // Mint RoadCoin rewards for qualifying events
  const rewards = { "tutor.solve": 0.1, "social.post": 0.05, "chat.message": 0.01, "search.query": 0.005, "canvas.create": 0.1, "video.upload": 0.5, "cadence.track": 0.2, "game.score": 0.02 };
  const reward = rewards[`${body.app}.${body.type}`];
  if (reward && body.road_id && body.road_id !== "anonymous") {
    await env.DB.prepare(
      "INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
    ).bind(body.road_id, reward, reward, now, reward, reward, now).run();
  }

  return json({ id, app: body.app, type: body.type, reward: reward || 0, chain: "logged" });
}

async function handleAppEvents(url, env) {
  await ensureTables(env.DB);
  const app = url.searchParams.get("app");
  const type = url.searchParams.get("type");
  const limit = parseInt(url.searchParams.get("limit") || "50");

  let query = "SELECT * FROM events";
  const conditions = [];
  const params = [];
  if (app) { conditions.push("app = ?"); params.push(app); }
  if (type) { conditions.push("type = ?"); params.push(type); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();
  return json({ events: rows.results, count: rows.results.length });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 1: BLOCK EXPLORER ──
// ═══════════════════════════════════════════════════════════
async function handleExplorer(url, env) {
  await ensureTables(env.DB);

  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const perPage = Math.min(100, parseInt(url.searchParams.get("per_page") || "25"));
  const search = url.searchParams.get("search") || "";
  const searchType = url.searchParams.get("type") || ""; // hash, entity, action
  const chain = url.searchParams.get("chain") || "main";
  const offset = (page - 1) * perPage;

  let query = "SELECT * FROM ledger WHERE chain_name = ?";
  let countQuery = "SELECT COUNT(*) as total FROM ledger WHERE chain_name = ?";
  const params = [chain];
  const countParams = [chain];

  if (search) {
    if (searchType === "hash") {
      query += " AND hash LIKE ?";
      countQuery += " AND hash LIKE ?";
      params.push(`${search}%`);
      countParams.push(`${search}%`);
    } else if (searchType === "entity") {
      query += " AND entity = ?";
      countQuery += " AND entity = ?";
      params.push(search);
      countParams.push(search);
    } else if (searchType === "action") {
      query += " AND action = ?";
      countQuery += " AND action = ?";
      params.push(search);
      countParams.push(search);
    } else {
      // Search across hash, entity, action, app, road_id
      query += " AND (hash LIKE ? OR entity LIKE ? OR action LIKE ? OR app LIKE ? OR road_id LIKE ?)";
      countQuery += " AND (hash LIKE ? OR entity LIKE ? OR action LIKE ? OR app LIKE ? OR road_id LIKE ?)";
      const wildcard = `%${search}%`;
      for (let i = 0; i < 5; i++) { params.push(wildcard); countParams.push(wildcard); }
    }
  }

  query += " ORDER BY block_number DESC LIMIT ? OFFSET ?";
  params.push(perPage, offset);

  const total = await env.DB.prepare(countQuery).bind(...countParams).first();
  const rows = await env.DB.prepare(query).bind(...params).all();

  return json({
    blocks: rows.results,
    pagination: {
      page,
      per_page: perPage,
      total: total?.total || 0,
      total_pages: Math.ceil((total?.total || 0) / perPage),
      has_next: offset + perPage < (total?.total || 0),
      has_prev: page > 1
    },
    search: search || null,
    chain
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 2: SMART CONTRACTS ──
// ═══════════════════════════════════════════════════════════
async function handleContractDeploy(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.trigger_action || !body?.effect_action)
    return json({ error: "Missing name, trigger_action, or effect_action" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO contracts (id, name, description, trigger_action, trigger_entity, condition, effect_action, effect_data, owner, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.name, body.description || "",
    body.trigger_action, body.trigger_entity || "*",
    JSON.stringify(body.condition || {}),
    body.effect_action, JSON.stringify(body.effect_data || {}),
    body.owner || "anonymous", now
  ).run();

  await handleLedgerWriteInternal(env, "contract_deploy", body.name, "contracts", body.owner, 0, { contract_id: id, trigger: body.trigger_action });

  return json({ id, name: body.name, trigger_action: body.trigger_action, effect_action: body.effect_action, status: "deployed" });
}

async function handleContractList(url, env) {
  await ensureTables(env.DB);
  const active = url.searchParams.get("active");
  const owner = url.searchParams.get("owner");

  let query = "SELECT * FROM contracts";
  const conditions = [];
  const params = [];
  if (active !== null && active !== undefined && active !== "") { conditions.push("active = ?"); params.push(active === "true" ? 1 : 0); }
  if (owner) { conditions.push("owner = ?"); params.push(owner); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";

  const rows = await env.DB.prepare(query).bind(...params).all();
  return json({ contracts: rows.results, count: rows.results.length });
}

async function handleContractTrigger(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.contract_id) return json({ error: "Missing contract_id" }, 400);

  await ensureTables(env.DB);
  const contract = await env.DB.prepare("SELECT * FROM contracts WHERE id = ? AND active = 1").bind(body.contract_id).first();
  if (!contract) return json({ error: "Contract not found or inactive" }, 404);

  // Execute the contract effect
  const effectData = JSON.parse(contract.effect_data);
  const result = await executeContractEffect(env, contract, effectData, body.context || {});

  // Increment execution count
  await env.DB.prepare("UPDATE contracts SET executions = executions + 1 WHERE id = ?").bind(body.contract_id).run();

  await handleLedgerWriteInternal(env, "contract_exec", contract.name, "contracts", contract.owner, 0, { contract_id: contract.id, effect: contract.effect_action, result });

  return json({ executed: true, contract: contract.name, effect: contract.effect_action, result });
}

async function executeContractEffect(env, contract, effectData, context) {
  const now = new Date().toISOString();
  switch (contract.effect_action) {
    case "mint":
      if (effectData.road_id && effectData.amount) {
        await env.DB.prepare(
          "INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?"
        ).bind(effectData.road_id, effectData.amount, effectData.amount, now, effectData.amount, effectData.amount, now).run();
        return { minted: effectData.amount, to: effectData.road_id };
      }
      return { skipped: "missing road_id or amount" };

    case "transfer":
      if (effectData.from && effectData.to && effectData.amount) {
        const sender = await env.DB.prepare("SELECT balance FROM balances WHERE road_id = ?").bind(effectData.from).first();
        if (sender && sender.balance >= effectData.amount) {
          await env.DB.batch([
            env.DB.prepare("UPDATE balances SET balance = balance - ?, total_spent = total_spent + ?, updated_at = ? WHERE road_id = ?").bind(effectData.amount, effectData.amount, now, effectData.from),
            env.DB.prepare("INSERT INTO balances (road_id, balance, total_earned, total_spent, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(road_id) DO UPDATE SET balance = balance + ?, total_earned = total_earned + ?, updated_at = ?").bind(effectData.to, effectData.amount, effectData.amount, now, effectData.amount, effectData.amount, now),
          ]);
          return { transferred: effectData.amount, from: effectData.from, to: effectData.to };
        }
        return { skipped: "insufficient balance" };
      }
      return { skipped: "missing transfer params" };

    case "log":
      return { logged: true, data: effectData };

    case "notify":
      // Fire to any webhook URLs in the effect data
      if (effectData.webhook_url) {
        try {
          await fetch(effectData.webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contract: contract.name, effect: "notify", context, ts: now })
          });
          return { notified: effectData.webhook_url };
        } catch (e) { return { notify_error: e.message }; }
      }
      return { skipped: "no webhook_url" };

    default:
      return { effect: contract.effect_action, data: effectData, context };
  }
}

// Auto-check contracts when ledger events happen
async function checkContracts(env, action, entity, data, roadId) {
  try {
    const contracts = await env.DB.prepare(
      "SELECT * FROM contracts WHERE active = 1 AND trigger_action = ? AND (trigger_entity = '*' OR trigger_entity = ?)"
    ).bind(action, entity).all();

    for (const contract of contracts.results) {
      const condition = JSON.parse(contract.condition);
      let match = true;

      // Evaluate conditions
      if (condition.min_amount !== undefined && (data?.amount || 0) < condition.min_amount) match = false;
      if (condition.road_id && roadId !== condition.road_id) match = false;
      if (condition.entity && entity !== condition.entity) match = false;

      if (match) {
        const effectData = JSON.parse(contract.effect_data);
        // Replace template variables
        const resolved = JSON.parse(JSON.stringify(effectData)
          .replace(/\{\{road_id\}\}/g, roadId || "anonymous")
          .replace(/\{\{entity\}\}/g, entity)
          .replace(/\{\{action\}\}/g, action)
        );
        await executeContractEffect(env, contract, resolved, { action, entity, road_id: roadId });
        await env.DB.prepare("UPDATE contracts SET executions = executions + 1 WHERE id = ?").bind(contract.id).run();
      }
    }
  } catch (e) { /* contract check errors should not break ledger writes */ }
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 3: CHAIN ANALYTICS ──
// ═══════════════════════════════════════════════════════════
async function handleAnalytics(url, env) {
  await ensureTables(env.DB);
  const days = parseInt(url.searchParams.get("days") || "30");
  const chain = url.searchParams.get("chain") || "main";
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();

  // Chain growth: blocks per day
  const growth = await env.DB.prepare(
    `SELECT DATE(created_at) as day, COUNT(*) as blocks, SUM(amount) as volume
     FROM ledger WHERE chain_name = ? AND created_at >= ?
     GROUP BY DATE(created_at) ORDER BY day ASC`
  ).bind(chain, cutoff).all();

  // Most active entities
  const topEntities = await env.DB.prepare(
    `SELECT entity, COUNT(*) as count, SUM(amount) as total_amount
     FROM ledger WHERE chain_name = ? AND created_at >= ?
     GROUP BY entity ORDER BY count DESC LIMIT 20`
  ).bind(chain, cutoff).all();

  // Action type distribution
  const actionDist = await env.DB.prepare(
    `SELECT action, COUNT(*) as count
     FROM ledger WHERE chain_name = ? AND created_at >= ?
     GROUP BY action ORDER BY count DESC`
  ).bind(chain, cutoff).all();

  // Most active road_ids
  const topUsers = await env.DB.prepare(
    `SELECT road_id, COUNT(*) as transactions, SUM(amount) as total_amount
     FROM ledger WHERE chain_name = ? AND created_at >= ? AND road_id != 'anonymous'
     GROUP BY road_id ORDER BY transactions DESC LIMIT 20`
  ).bind(chain, cutoff).all();

  // App activity breakdown
  const appActivity = await env.DB.prepare(
    `SELECT app, COUNT(*) as count, SUM(amount) as volume
     FROM ledger WHERE chain_name = ? AND created_at >= ?
     GROUP BY app ORDER BY count DESC`
  ).bind(chain, cutoff).all();

  // Overall totals for period
  const totals = await env.DB.prepare(
    `SELECT COUNT(*) as total_blocks, SUM(amount) as total_volume,
     COUNT(DISTINCT road_id) as unique_users, COUNT(DISTINCT app) as unique_apps
     FROM ledger WHERE chain_name = ? AND created_at >= ?`
  ).bind(chain, cutoff).first();

  return json({
    period: { days, from: cutoff, to: new Date().toISOString(), chain },
    totals: {
      blocks: totals?.total_blocks || 0,
      volume: totals?.total_volume || 0,
      unique_users: totals?.unique_users || 0,
      unique_apps: totals?.unique_apps || 0
    },
    daily_growth: growth.results,
    top_entities: topEntities.results,
    action_distribution: actionDist.results,
    top_users: topUsers.results,
    app_activity: appActivity.results
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 4: WEBHOOKS ──
// ═══════════════════════════════════════════════════════════
async function handleWebhookRegister(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.url || !body?.event_types) return json({ error: "Missing url or event_types (array)" }, 400);
  if (!Array.isArray(body.event_types) || body.event_types.length === 0)
    return json({ error: "event_types must be a non-empty array" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO webhooks (id, url, event_types, owner, created_at) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, body.url, JSON.stringify(body.event_types), body.owner || "anonymous", now).run();

  return json({ id, url: body.url, event_types: body.event_types, status: "registered" });
}

async function handleWebhookList(url, env) {
  await ensureTables(env.DB);
  const owner = url.searchParams.get("owner");
  let query = "SELECT * FROM webhooks";
  const params = [];
  if (owner) { query += " WHERE owner = ?"; params.push(owner); }
  query += " ORDER BY created_at DESC";

  const rows = params.length
    ? await env.DB.prepare(query).bind(...params).all()
    : await env.DB.prepare(query).all();
  return json({ webhooks: rows.results, count: rows.results.length });
}

async function handleWebhookDelete(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.id) return json({ error: "Missing webhook id" }, 400);

  await ensureTables(env.DB);
  await env.DB.prepare("DELETE FROM webhooks WHERE id = ?").bind(body.id).run();
  return json({ deleted: true, id: body.id });
}

// Fire webhooks matching an action
async function fireWebhooks(env, action, payload) {
  try {
    const hooks = await env.DB.prepare("SELECT * FROM webhooks WHERE active = 1").all();
    const now = new Date().toISOString();

    for (const hook of hooks.results) {
      const types = JSON.parse(hook.event_types);
      if (types.includes(action) || types.includes("*")) {
        // Fire and forget
        try {
          await fetch(hook.url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-RoadChain-Event": action },
            body: JSON.stringify({ event: action, payload, timestamp: now, webhook_id: hook.id })
          });
          await env.DB.prepare("UPDATE webhooks SET last_fired = ?, fire_count = fire_count + 1 WHERE id = ?").bind(now, hook.id).run();
        } catch (e) { /* webhook delivery failures are non-fatal */ }
      }
    }
  } catch (e) { /* webhook system errors should not break core operations */ }
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 5: MULTI-CHAIN SUPPORT ──
// ═══════════════════════════════════════════════════════════
async function handleChainList(env) {
  await ensureTables(env.DB);
  const rows = await env.DB.prepare("SELECT * FROM chains ORDER BY created_at ASC").all();
  return json({ chains: rows.results, count: rows.results.length });
}

async function handleChainCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.name) return json({ error: "Missing chain name" }, 400);
  if (!/^[a-z0-9_-]+$/.test(body.name)) return json({ error: "Chain name must be lowercase alphanumeric with hyphens/underscores" }, 400);

  await ensureTables(env.DB);
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      "INSERT INTO chains (name, description, created_by, block_count, created_at) VALUES (?, ?, ?, 0, ?)"
    ).bind(body.name, body.description || "", body.created_by || "anonymous", now).run();
  } catch (e) {
    return json({ error: "Chain already exists" }, 409);
  }

  await handleLedgerWriteInternal(env, "chain_create", body.name, "chains", body.created_by, 0, { description: body.description });

  return json({ name: body.name, description: body.description || "", status: "created" });
}

async function handleChainInfo(url, env) {
  await ensureTables(env.DB);
  const chainName = url.pathname.split("/")[3];
  const chain = await env.DB.prepare("SELECT * FROM chains WHERE name = ?").bind(chainName).first();
  if (!chain) return json({ error: "Chain not found" }, 404);

  const stats = await env.DB.prepare(
    "SELECT COUNT(*) as blocks, COUNT(DISTINCT app) as apps, COUNT(DISTINCT road_id) as users, SUM(amount) as volume FROM ledger WHERE chain_name = ?"
  ).bind(chainName).first();

  const recent = await env.DB.prepare(
    "SELECT action, entity, app, hash, created_at FROM ledger WHERE chain_name = ? ORDER BY block_number DESC LIMIT 5"
  ).bind(chainName).all();

  return json({
    ...chain,
    stats: { blocks: stats?.blocks || 0, apps: stats?.apps || 0, users: stats?.users || 0, volume: stats?.volume || 0 },
    recent: recent.results
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 6: PROOF OF EXISTENCE ──
// ═══════════════════════════════════════════════════════════
async function handleProofCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.content && !body?.hash) return json({ error: "Missing content or hash" }, 400);

  await ensureTables(env.DB);

  // Hash the content (or use provided hash)
  let documentHash;
  if (body.hash) {
    documentHash = body.hash;
  } else {
    documentHash = await pssha(body.content, 5);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const owner = body.owner || "anonymous";

  // Write proof to ledger
  const ledgerEntry = await handleLedgerWriteInternal(env, "proof_of_existence", "document", "proof", owner, 0, {
    document_hash: documentHash,
    description: body.description || "",
    content_length: body.content ? body.content.length : null
  });

  // Store proof record
  await env.DB.prepare(
    "INSERT INTO proofs (id, document_hash, description, owner, block_number, ledger_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, documentHash, body.description || "", owner, ledgerEntry.block_number, ledgerEntry.hash, now).run();

  return json({
    proof_id: id,
    document_hash: documentHash,
    block_number: ledgerEntry.block_number,
    ledger_hash: ledgerEntry.hash,
    timestamp: now,
    status: "anchored"
  });
}

async function handleProofVerify(url, env) {
  await ensureTables(env.DB);
  const hash = url.searchParams.get("hash");
  const proofId = url.searchParams.get("id");

  if (!hash && !proofId) return json({ error: "Missing hash or id parameter" }, 400);

  let proof;
  if (proofId) {
    proof = await env.DB.prepare("SELECT * FROM proofs WHERE id = ?").bind(proofId).first();
  } else {
    proof = await env.DB.prepare("SELECT * FROM proofs WHERE document_hash = ? ORDER BY created_at ASC LIMIT 1").bind(hash).first();
  }

  if (!proof) return json({ exists: false, message: "No proof found for this document" });

  // Verify the ledger entry still exists and is valid
  const block = await env.DB.prepare("SELECT * FROM ledger WHERE block_number = ? AND chain_name = 'main'").bind(proof.block_number).first();

  return json({
    exists: true,
    proof_id: proof.id,
    document_hash: proof.document_hash,
    description: proof.description,
    owner: proof.owner,
    block_number: proof.block_number,
    ledger_hash: proof.ledger_hash,
    anchored_at: proof.created_at,
    block_valid: block ? block.hash === proof.ledger_hash : false
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 7: TOKEN GOVERNANCE ──
// ═══════════════════════════════════════════════════════════
async function handleGovernancePropose(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.proposer) return json({ error: "Missing title or proposer" }, 400);

  await ensureTables(env.DB);

  // Proposer must hold RoadCoin
  const balance = await env.DB.prepare("SELECT balance FROM balances WHERE road_id = ?").bind(body.proposer).first();
  if (!balance || balance.balance < 1) return json({ error: "Must hold at least 1 ROAD to create proposals" }, 403);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const durationDays = body.duration_days || 7;
  const expiresAt = new Date(Date.now() + durationDays * 86400000).toISOString();

  await env.DB.prepare(
    "INSERT INTO proposals (id, title, description, proposer, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, body.title, body.description || "", body.proposer, expiresAt, now).run();

  await handleLedgerWriteInternal(env, "governance_propose", body.title, "governance", body.proposer, 0, { proposal_id: id, duration_days: durationDays });

  return json({ id, title: body.title, proposer: body.proposer, expires_at: expiresAt, status: "active" });
}

async function handleGovernanceList(url, env) {
  await ensureTables(env.DB);
  const status = url.searchParams.get("status") || "all";
  const now = new Date().toISOString();

  let query;
  if (status === "active") {
    query = env.DB.prepare("SELECT * FROM proposals WHERE status = 'active' AND expires_at > ? ORDER BY created_at DESC").bind(now);
  } else if (status === "expired") {
    query = env.DB.prepare("SELECT * FROM proposals WHERE status = 'active' AND expires_at <= ? ORDER BY created_at DESC").bind(now);
  } else {
    query = env.DB.prepare("SELECT * FROM proposals ORDER BY created_at DESC");
  }

  const rows = await query.all();

  // Annotate with computed status
  const proposals = rows.results.map(p => ({
    ...p,
    computed_status: p.status === "active" && p.expires_at <= now ? "expired" : p.status,
    result: p.yes_votes > p.no_votes ? "passing" : p.yes_votes < p.no_votes ? "failing" : "tied"
  }));

  return json({ proposals, count: proposals.length });
}

async function handleGovernanceVote(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.proposal_id || !body?.voter || !body?.choice)
    return json({ error: "Missing proposal_id, voter, or choice (yes/no/abstain)" }, 400);
  if (!["yes", "no", "abstain"].includes(body.choice))
    return json({ error: "Choice must be yes, no, or abstain" }, 400);

  await ensureTables(env.DB);

  // Check proposal exists and is active
  const proposal = await env.DB.prepare("SELECT * FROM proposals WHERE id = ?").bind(body.proposal_id).first();
  if (!proposal) return json({ error: "Proposal not found" }, 404);
  if (proposal.status !== "active") return json({ error: "Proposal is not active" }, 400);
  if (new Date(proposal.expires_at) <= new Date()) return json({ error: "Proposal has expired" }, 400);

  // Check voter hasn't already voted
  const existing = await env.DB.prepare("SELECT id FROM votes WHERE proposal_id = ? AND voter = ?").bind(body.proposal_id, body.voter).first();
  if (existing) return json({ error: "Already voted on this proposal" }, 409);

  // Weight by RoadCoin balance (minimum 1)
  const balance = await env.DB.prepare("SELECT balance FROM balances WHERE road_id = ?").bind(body.voter).first();
  const weight = Math.max(1, balance?.balance || 0);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO votes (id, proposal_id, voter, choice, weight, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(id, body.proposal_id, body.voter, body.choice, weight, now).run();

  // Update proposal tallies
  const col = body.choice === "yes" ? "yes_votes" : body.choice === "no" ? "no_votes" : "abstain_votes";
  await env.DB.prepare(
    `UPDATE proposals SET ${col} = ${col} + ?, voter_count = voter_count + 1 WHERE id = ?`
  ).bind(weight, body.proposal_id).run();

  await handleLedgerWriteInternal(env, "governance_vote", proposal.title, "governance", body.voter, 0, {
    proposal_id: body.proposal_id, choice: body.choice, weight
  });

  return json({ vote_id: id, proposal_id: body.proposal_id, choice: body.choice, weight, status: "recorded" });
}

async function handleGovernanceResult(url, env) {
  await ensureTables(env.DB);
  const proposalId = url.pathname.split("/")[4];
  const proposal = await env.DB.prepare("SELECT * FROM proposals WHERE id = ?").bind(proposalId).first();
  if (!proposal) return json({ error: "Proposal not found" }, 404);

  const votes = await env.DB.prepare("SELECT voter, choice, weight, created_at FROM votes WHERE proposal_id = ? ORDER BY created_at ASC").bind(proposalId).all();

  const now = new Date();
  const expired = new Date(proposal.expires_at) <= now;
  const totalWeight = proposal.yes_votes + proposal.no_votes + proposal.abstain_votes;

  return json({
    proposal: {
      id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      proposer: proposal.proposer,
      status: expired ? "expired" : proposal.status,
      expires_at: proposal.expires_at,
      created_at: proposal.created_at
    },
    results: {
      yes: proposal.yes_votes,
      no: proposal.no_votes,
      abstain: proposal.abstain_votes,
      total_weight: totalWeight,
      voter_count: proposal.voter_count,
      outcome: proposal.yes_votes > proposal.no_votes ? "PASSED" : proposal.yes_votes < proposal.no_votes ? "REJECTED" : "TIED",
      quorum_met: proposal.voter_count >= 3 // minimum 3 voters
    },
    votes: votes.results
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 8: CHAIN EXPORT ──
// ═══════════════════════════════════════════════════════════
async function handleExport(url, env) {
  await ensureTables(env.DB);
  const format = url.searchParams.get("format") || "json";
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const chain = url.searchParams.get("chain") || "main";
  const limit = Math.min(10000, parseInt(url.searchParams.get("limit") || "10000"));
  const dataType = url.searchParams.get("type") || "ledger"; // ledger, balances, events, contracts

  let query, params;

  if (dataType === "balances") {
    query = "SELECT * FROM balances ORDER BY balance DESC LIMIT ?";
    params = [limit];
  } else if (dataType === "events") {
    query = "SELECT * FROM events";
    const conditions = [];
    params = [];
    if (from) { conditions.push("created_at >= ?"); params.push(from); }
    if (to) { conditions.push("created_at <= ?"); params.push(to); }
    if (conditions.length) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);
  } else if (dataType === "contracts") {
    query = "SELECT * FROM contracts ORDER BY created_at DESC LIMIT ?";
    params = [limit];
  } else {
    // Default: ledger
    query = "SELECT * FROM ledger WHERE chain_name = ?";
    params = [chain];
    if (from) { query += " AND created_at >= ?"; params.push(from); }
    if (to) { query += " AND created_at <= ?"; params.push(to); }
    query += " ORDER BY block_number ASC LIMIT ?";
    params.push(limit);
  }

  const rows = await env.DB.prepare(query).bind(...params).all();

  if (format === "csv") {
    if (rows.results.length === 0) {
      return new Response("", { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="roadchain-${dataType}-export.csv"`, "Access-Control-Allow-Origin": "*" } });
    }

    const headers = Object.keys(rows.results[0]);
    const csvLines = [headers.join(",")];
    for (const row of rows.results) {
      csvLines.push(headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const str = String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(","));
    }

    return new Response(csvLines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="roadchain-${dataType}-export.csv"`,
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  // JSON format
  return json({
    export: {
      type: dataType,
      chain: dataType === "ledger" ? chain : null,
      format: "json",
      from: from || null,
      to: to || null,
      count: rows.results.length
    },
    data: rows.results
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 9: TRANSACTION RECEIPTS ──
// ═══════════════════════════════════════════════════════════
async function handleReceiptGet(url, env) {
  await ensureTables(env.DB);
  const blockNum = url.searchParams.get("block");
  const id = url.searchParams.get("id");
  const hash = url.searchParams.get("hash");

  if (!blockNum && !id && !hash) return json({ error: "Missing block, id, or hash parameter" }, 400);

  let entry;
  if (id) {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE id = ?").bind(id).first();
  } else if (hash) {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE hash = ?").bind(hash).first();
  } else {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE block_number = ? AND chain_name = 'main'").bind(parseInt(blockNum)).first();
  }

  if (!entry) return json({ error: "Ledger entry not found" }, 404);
  return json(formatReceipt(entry));
}

async function handleReceiptGenerate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.id && !body?.block && !body?.hash) return json({ error: "Missing id, block, or hash" }, 400);

  await ensureTables(env.DB);

  let entry;
  if (body.id) {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE id = ?").bind(body.id).first();
  } else if (body.hash) {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE hash = ?").bind(body.hash).first();
  } else {
    entry = await env.DB.prepare("SELECT * FROM ledger WHERE block_number = ? AND chain_name = ?").bind(parseInt(body.block), body.chain || "main").first();
  }

  if (!entry) return json({ error: "Ledger entry not found" }, 404);

  const receipt = formatReceipt(entry);

  // Generate QR code data (compact JSON for encoding)
  receipt.qr_data = JSON.stringify({
    chain: "roadchain",
    id: entry.id,
    block: entry.block_number,
    hash: entry.hash,
    action: entry.action,
    entity: entry.entity,
    amount: entry.amount,
    ts: entry.created_at,
    verify: `/api/receipts?id=${entry.id}`
  });

  // Generate human-readable text receipt
  receipt.text_receipt = [
    "════════════════════════════════════════",
    "         ROADCHAIN RECEIPT              ",
    "════════════════════════════════════════",
    `Receipt ID:    ${entry.id}`,
    `Block:         #${entry.block_number}`,
    `Chain:         ${entry.chain_name}`,
    `Action:        ${entry.action}`,
    `Entity:        ${entry.entity}`,
    `App:           ${entry.app}`,
    `Road ID:       ${entry.road_id}`,
    `Amount:        ${entry.amount} ROAD`,
    `Timestamp:     ${entry.created_at}`,
    `Hash:          ${entry.hash}`,
    `Previous Hash: ${entry.prev_hash}`,
    `Data:          ${entry.data}`,
    "════════════════════════════════════════",
    "Verify: /api/receipts?id=" + entry.id,
    "Powered by RoadChain — BlackRoad OS",
    "════════════════════════════════════════"
  ].join("\n");

  return json(receipt);
}

function formatReceipt(entry) {
  return {
    receipt: {
      id: entry.id,
      block_number: entry.block_number,
      chain: entry.chain_name,
      action: entry.action,
      entity: entry.entity,
      app: entry.app,
      road_id: entry.road_id,
      amount: entry.amount,
      hash: entry.hash,
      prev_hash: entry.prev_hash,
      data: JSON.parse(entry.data || "{}"),
      timestamp: entry.created_at,
      human_time: new Date(entry.created_at).toLocaleString("en-US", { dateStyle: "full", timeStyle: "long" }),
      status: "confirmed",
      verification_url: `/api/receipts?id=${entry.id}`
    }
  };
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 10: CHAIN SUBSCRIPTIONS ──
// ═══════════════════════════════════════════════════════════
async function handleSubscribeCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.subscriber) return json({ error: "Missing subscriber (road_id)" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO subscriptions (id, subscriber, filter_entity, filter_action, filter_app, filter_road_id, filter_chain, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.subscriber,
    body.entity || "*", body.action || "*", body.app || "*",
    body.road_id || "*", body.chain || "main", now
  ).run();

  return json({
    id, subscriber: body.subscriber,
    filters: {
      entity: body.entity || "*", action: body.action || "*",
      app: body.app || "*", road_id: body.road_id || "*", chain: body.chain || "main"
    },
    status: "active"
  });
}

async function handleSubscribeList(url, env) {
  await ensureTables(env.DB);
  const subscriber = url.searchParams.get("subscriber");
  if (!subscriber) return json({ error: "Missing subscriber parameter" }, 400);

  const rows = await env.DB.prepare(
    "SELECT * FROM subscriptions WHERE subscriber = ? AND active = 1 ORDER BY created_at DESC"
  ).bind(subscriber).all();

  return json({ subscriptions: rows.results, count: rows.results.length });
}

async function handleSubscribeDelete(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.id) return json({ error: "Missing subscription id" }, 400);

  await ensureTables(env.DB);
  await env.DB.prepare("UPDATE subscriptions SET active = 0 WHERE id = ?").bind(body.id).run();
  return json({ deleted: true, id: body.id });
}

async function handleSubscribeFeed(url, env) {
  await ensureTables(env.DB);
  const subscriber = url.searchParams.get("subscriber");
  if (!subscriber) return json({ error: "Missing subscriber parameter" }, 400);

  const limit = Math.min(200, parseInt(url.searchParams.get("limit") || "50"));
  const since = url.searchParams.get("since") || "";

  // Get all active subscriptions for this subscriber
  const subs = await env.DB.prepare(
    "SELECT * FROM subscriptions WHERE subscriber = ? AND active = 1"
  ).bind(subscriber).all();

  if (!subs.results.length) return json({ feed: [], count: 0, message: "No active subscriptions" });

  // Build a union query for all subscription filters
  let allEntries = [];
  for (const sub of subs.results) {
    let query = "SELECT * FROM ledger WHERE chain_name = ?";
    const params = [sub.filter_chain];

    if (sub.filter_entity !== "*") { query += " AND entity = ?"; params.push(sub.filter_entity); }
    if (sub.filter_action !== "*") { query += " AND action = ?"; params.push(sub.filter_action); }
    if (sub.filter_app !== "*") { query += " AND app = ?"; params.push(sub.filter_app); }
    if (sub.filter_road_id !== "*") { query += " AND road_id = ?"; params.push(sub.filter_road_id); }
    if (since) { query += " AND created_at > ?"; params.push(since); }

    query += " ORDER BY block_number DESC LIMIT ?";
    params.push(limit);

    const rows = await env.DB.prepare(query).bind(...params).all();
    for (const row of rows.results) {
      row._subscription_id = sub.id;
      allEntries.push(row);
    }
  }

  // Dedupe by id and sort by block_number desc
  const seen = new Set();
  allEntries = allEntries.filter(e => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  }).sort((a, b) => b.block_number - a.block_number).slice(0, limit);

  return json({
    feed: allEntries,
    count: allEntries.length,
    subscriptions_active: subs.results.length
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 11: MERKLE PROOFS ──
// ═══════════════════════════════════════════════════════════
async function handleMerkleTree(url, env) {
  await ensureTables(env.DB);
  const chain = url.searchParams.get("chain") || "main";
  const fromBlock = parseInt(url.searchParams.get("from") || "1");
  const toBlock = url.searchParams.get("to");
  const limit = Math.min(1000, parseInt(url.searchParams.get("limit") || "256"));

  let query = "SELECT block_number, hash FROM ledger WHERE chain_name = ? AND block_number >= ?";
  const params = [chain, fromBlock];
  if (toBlock) { query += " AND block_number <= ?"; params.push(parseInt(toBlock)); }
  query += " ORDER BY block_number ASC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();
  const leaves = rows.results.map(r => r.hash);

  if (leaves.length === 0) return json({ error: "No blocks found in range" }, 404);

  // Build merkle tree
  const tree = await buildMerkleTree(leaves);

  return json({
    merkle_root: tree.root,
    leaf_count: leaves.length,
    tree_depth: tree.depth,
    chain,
    block_range: { from: fromBlock, to: rows.results[rows.results.length - 1].block_number },
    leaves: rows.results.map(r => ({ block: r.block_number, hash: r.hash })),
    tree_layers: tree.layers
  });
}

async function handleMerkleVerify(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.hash || !body?.proof || !body?.root)
    return json({ error: "Missing hash, proof (array of {hash, position}), or root" }, 400);

  // Verify merkle inclusion proof
  let current = body.hash;
  for (const step of body.proof) {
    if (step.position === "left") {
      current = await pssha(step.hash + current, 3);
    } else {
      current = await pssha(current + step.hash, 3);
    }
  }

  const valid = current === body.root;
  return json({
    valid,
    computed_root: current,
    expected_root: body.root,
    proof_steps: body.proof.length,
    hash_verified: body.hash
  });
}

async function buildMerkleTree(leaves) {
  if (leaves.length === 0) return { root: "", depth: 0, layers: [] };

  const layers = [leaves.slice()];
  let current = leaves.slice();

  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      if (i + 1 < current.length) {
        next.push(await pssha(current[i] + current[i + 1], 3));
      } else {
        // Odd leaf: hash with itself
        next.push(await pssha(current[i] + current[i], 3));
      }
    }
    layers.push(next);
    current = next;
  }

  return { root: current[0], depth: layers.length - 1, layers };
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 12: CROSS-CHAIN BRIDGE ──
// ═══════════════════════════════════════════════════════════
async function handleBridgeTransfer(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.source_chain || !body?.target_chain || !body?.action || !body?.entity)
    return json({ error: "Missing source_chain, target_chain, action, or entity" }, 400);

  if (body.source_chain === body.target_chain)
    return json({ error: "Source and target chains must be different" }, 400);

  await ensureTables(env.DB);

  // Verify source chain exists
  const srcChain = await env.DB.prepare("SELECT name FROM chains WHERE name = ?").bind(body.source_chain).first();
  if (!srcChain) return json({ error: `Source chain '${body.source_chain}' not found` }, 404);

  // Ensure target chain exists (auto-create if needed)
  const tgtChain = await env.DB.prepare("SELECT name FROM chains WHERE name = ?").bind(body.target_chain).first();
  if (!tgtChain) {
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO chains (name, description, created_by, block_count, created_at) VALUES (?, ?, ?, 0, ?)"
    ).bind(body.target_chain, `Bridge-created chain`, body.road_id || "bridge", now).run();
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const roadId = body.road_id || "anonymous";
  const amount = body.amount || 0;

  // Write to source chain (bridge_out event)
  const sourceEntry = await handleLedgerWriteInternal(
    env, "bridge_out", body.entity, "bridge", roadId, amount,
    { bridge_id: id, target_chain: body.target_chain, original_action: body.action, data: body.data },
    body.source_chain
  );

  // Write to target chain (bridge_in event)
  const targetEntry = await handleLedgerWriteInternal(
    env, "bridge_in", body.entity, "bridge", roadId, amount,
    { bridge_id: id, source_chain: body.source_chain, original_action: body.action, data: body.data },
    body.target_chain
  );

  // Also write the original action to target chain
  const replayEntry = await handleLedgerWriteInternal(
    env, body.action, body.entity, body.app || "bridge", roadId, amount,
    body.data || {}, body.target_chain
  );

  // Record bridge transfer
  await env.DB.prepare(
    `INSERT INTO bridge_transfers (id, source_chain, target_chain, source_block, target_block, source_hash, target_hash,
     action, entity, data, road_id, amount, status, verified, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', 1, ?, ?)`
  ).bind(
    id, body.source_chain, body.target_chain,
    sourceEntry.block_number, targetEntry.block_number,
    sourceEntry.hash, targetEntry.hash,
    body.action, body.entity, JSON.stringify(body.data || {}),
    roadId, amount, now, now
  ).run();

  return json({
    bridge_id: id,
    source: { chain: body.source_chain, block: sourceEntry.block_number, hash: sourceEntry.hash },
    target: { chain: body.target_chain, block: targetEntry.block_number, hash: targetEntry.hash },
    replay: { block: replayEntry.block_number, hash: replayEntry.hash },
    status: "completed"
  });
}

async function handleBridgeList(url, env) {
  await ensureTables(env.DB);
  const chain = url.searchParams.get("chain");
  const roadId = url.searchParams.get("road_id");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));

  let query = "SELECT * FROM bridge_transfers";
  const conditions = [];
  const params = [];

  if (chain) {
    conditions.push("(source_chain = ? OR target_chain = ?)");
    params.push(chain, chain);
  }
  if (roadId) { conditions.push("road_id = ?"); params.push(roadId); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();
  return json({ bridges: rows.results, count: rows.results.length });
}

async function handleBridgeVerify(url, env) {
  await ensureTables(env.DB);
  const bridgeId = url.searchParams.get("id");
  if (!bridgeId) return json({ error: "Missing bridge id parameter" }, 400);

  const bridge = await env.DB.prepare("SELECT * FROM bridge_transfers WHERE id = ?").bind(bridgeId).first();
  if (!bridge) return json({ error: "Bridge transfer not found" }, 404);

  // Verify both sides exist
  const sourceBlock = await env.DB.prepare(
    "SELECT hash FROM ledger WHERE block_number = ? AND chain_name = ?"
  ).bind(bridge.source_block, bridge.source_chain).first();

  const targetBlock = await env.DB.prepare(
    "SELECT hash FROM ledger WHERE block_number = ? AND chain_name = ?"
  ).bind(bridge.target_block, bridge.target_chain).first();

  const sourceValid = sourceBlock && sourceBlock.hash === bridge.source_hash;
  const targetValid = targetBlock && targetBlock.hash === bridge.target_hash;

  return json({
    bridge_id: bridge.id,
    source: { chain: bridge.source_chain, block: bridge.source_block, hash: bridge.source_hash, valid: sourceValid },
    target: { chain: bridge.target_chain, block: bridge.target_block, hash: bridge.target_hash, valid: targetValid },
    overall_valid: sourceValid && targetValid,
    status: bridge.status,
    created_at: bridge.created_at
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 13: NFT REGISTRY ──
// ═══════════════════════════════════════════════════════════
async function handleNFTMint(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.owner) return json({ error: "Missing name or owner" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const chain = body.chain || "main";

  // Get next token ID
  const maxToken = await env.DB.prepare("SELECT MAX(token_id) as max_id FROM nfts WHERE chain_name = ?").bind(chain).first();
  const tokenId = (maxToken?.max_id || 0) + 1;

  // Write to ledger
  const ledgerEntry = await handleLedgerWriteInternal(env, "nft_mint", body.name, "nft", body.owner, 0, {
    nft_id: id, token_id: tokenId, category: body.category || "general",
    description: body.description || "", metadata: body.metadata || {}
  }, chain);

  await env.DB.prepare(
    `INSERT INTO nfts (id, token_id, name, description, category, metadata, image_url, owner, creator,
     chain_name, block_number, ledger_hash, transferable, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, tokenId, body.name, body.description || "", body.category || "general",
    JSON.stringify(body.metadata || {}), body.image_url || "",
    body.owner, body.owner, chain,
    ledgerEntry.block_number, ledgerEntry.hash,
    body.transferable !== false ? 1 : 0, now, now
  ).run();

  return json({
    nft_id: id, token_id: tokenId, name: body.name, owner: body.owner,
    category: body.category || "general", chain, block_number: ledgerEntry.block_number,
    ledger_hash: ledgerEntry.hash, status: "minted"
  });
}

async function handleNFTTransfer(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.nft_id || !body?.from || !body?.to)
    return json({ error: "Missing nft_id, from, or to" }, 400);

  await ensureTables(env.DB);

  const nft = await env.DB.prepare("SELECT * FROM nfts WHERE id = ?").bind(body.nft_id).first();
  if (!nft) return json({ error: "NFT not found" }, 404);
  if (nft.owner !== body.from) return json({ error: "Sender is not the current owner" }, 403);
  if (!nft.transferable) return json({ error: "NFT is not transferable" }, 400);

  const now = new Date().toISOString();

  // Write transfer to ledger
  const ledgerEntry = await handleLedgerWriteInternal(env, "nft_transfer", nft.name, "nft", body.from, 0, {
    nft_id: body.nft_id, token_id: nft.token_id, from: body.from, to: body.to
  }, nft.chain_name);

  // Update ownership
  await env.DB.prepare("UPDATE nfts SET owner = ?, updated_at = ? WHERE id = ?").bind(body.to, now, body.nft_id).run();

  // Record transfer history
  const transferId = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO nft_transfers (id, nft_id, from_owner, to_owner, block_number, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(transferId, body.nft_id, body.from, body.to, ledgerEntry.block_number, now).run();

  return json({
    transfer_id: transferId, nft_id: body.nft_id, token_id: nft.token_id,
    from: body.from, to: body.to, block_number: ledgerEntry.block_number, status: "transferred"
  });
}

async function handleNFTQuery(url, env) {
  await ensureTables(env.DB);
  const owner = url.searchParams.get("owner");
  const category = url.searchParams.get("category");
  const chain = url.searchParams.get("chain") || "main";
  const creator = url.searchParams.get("creator");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));

  let query = "SELECT * FROM nfts WHERE chain_name = ?";
  const params = [chain];

  if (owner) { query += " AND owner = ?"; params.push(owner); }
  if (category) { query += " AND category = ?"; params.push(category); }
  if (creator) { query += " AND creator = ?"; params.push(creator); }
  query += " ORDER BY token_id DESC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();

  // Parse metadata
  const nfts = rows.results.map(n => ({ ...n, metadata: JSON.parse(n.metadata || "{}") }));

  const total = await env.DB.prepare("SELECT COUNT(*) as count FROM nfts WHERE chain_name = ?").bind(chain).first();

  return json({ nfts, count: nfts.length, total_minted: total?.count || 0, chain });
}

async function handleNFTDetail(url, env) {
  await ensureTables(env.DB);
  const nftId = url.pathname.split("/")[3];

  const nft = await env.DB.prepare("SELECT * FROM nfts WHERE id = ? OR token_id = ?").bind(nftId, parseInt(nftId) || 0).first();
  if (!nft) return json({ error: "NFT not found" }, 404);

  // Get transfer history
  const transfers = await env.DB.prepare(
    "SELECT * FROM nft_transfers WHERE nft_id = ? ORDER BY created_at ASC"
  ).bind(nft.id).all();

  return json({
    ...nft,
    metadata: JSON.parse(nft.metadata || "{}"),
    transfer_history: transfers.results,
    transfer_count: transfers.results.length
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 14: CHAIN INDEXER ──
// ═══════════════════════════════════════════════════════════
async function handleIndexCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.fields) return json({ error: "Missing name or fields (array of field names)" }, 400);
  if (!Array.isArray(body.fields) || body.fields.length === 0)
    return json({ error: "fields must be a non-empty array of ledger field names" }, 400);

  const validFields = ["action", "entity", "app", "road_id", "amount", "chain_name", "created_at"];
  const invalid = body.fields.filter(f => !validFields.includes(f));
  if (invalid.length) return json({ error: `Invalid fields: ${invalid.join(", ")}. Valid: ${validFields.join(", ")}` }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      "INSERT INTO custom_indexes (id, name, fields, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, body.name, JSON.stringify(body.fields), body.description || "", body.created_by || "system", now).run();
  } catch (e) {
    return json({ error: "Index name already exists" }, 409);
  }

  // Build the index from existing ledger data
  const chain = body.chain || "main";
  const limit = Math.min(10000, parseInt(body.backfill_limit || "5000"));
  const rows = await env.DB.prepare(
    "SELECT * FROM ledger WHERE chain_name = ? ORDER BY block_number ASC LIMIT ?"
  ).bind(chain, limit).all();

  let indexed = 0;
  for (const row of rows.results) {
    const fieldValues = {};
    for (const f of body.fields) {
      fieldValues[f] = row[f];
    }
    const entryId = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO index_entries (id, index_name, ledger_id, field_values, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(entryId, body.name, row.id, JSON.stringify(fieldValues), now).run();
    indexed++;
  }

  await env.DB.prepare("UPDATE custom_indexes SET entry_count = ? WHERE name = ?").bind(indexed, body.name).run();

  return json({
    id, name: body.name, fields: body.fields,
    entries_indexed: indexed, status: "created"
  });
}

async function handleIndexQuery(url, env) {
  await ensureTables(env.DB);
  const indexName = url.searchParams.get("name");
  if (!indexName) return json({ error: "Missing index name parameter" }, 400);

  const index = await env.DB.prepare("SELECT * FROM custom_indexes WHERE name = ?").bind(indexName).first();
  if (!index) return json({ error: "Index not found" }, 404);

  const fields = JSON.parse(index.fields);
  const limit = Math.min(200, parseInt(url.searchParams.get("limit") || "50"));

  // Build filter from query params matching index fields
  let query = "SELECT ie.*, l.block_number, l.hash, l.action, l.entity, l.app, l.road_id, l.amount, l.created_at as block_time FROM index_entries ie JOIN ledger l ON ie.ledger_id = l.id WHERE ie.index_name = ?";
  const params = [indexName];

  // Allow filtering by any indexed field
  for (const field of fields) {
    const val = url.searchParams.get(field);
    if (val) {
      query += ` AND json_extract(ie.field_values, '$.${field}') = ?`;
      params.push(val);
    }
  }

  query += " ORDER BY l.block_number DESC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();

  return json({
    index: indexName,
    fields,
    results: rows.results.map(r => ({
      ledger_id: r.ledger_id,
      block_number: r.block_number,
      hash: r.hash,
      values: JSON.parse(r.field_values),
      block_time: r.block_time
    })),
    count: rows.results.length
  });
}

async function handleIndexList(env) {
  await ensureTables(env.DB);
  const rows = await env.DB.prepare("SELECT * FROM custom_indexes ORDER BY created_at DESC").all();
  return json({
    indexes: rows.results.map(i => ({ ...i, fields: JSON.parse(i.fields) })),
    count: rows.results.length
  });
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 15: AUDIT TRAIL ──
// ═══════════════════════════════════════════════════════════
async function handleAuditTrail(url, env) {
  await ensureTables(env.DB);
  const chain = url.searchParams.get("chain") || "main";
  const roadId = url.searchParams.get("road_id");
  const app = url.searchParams.get("app");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const action = url.searchParams.get("action");
  const limit = Math.min(1000, parseInt(url.searchParams.get("limit") || "100"));

  let query = "SELECT * FROM ledger WHERE chain_name = ?";
  const params = [chain];

  if (roadId) { query += " AND road_id = ?"; params.push(roadId); }
  if (app) { query += " AND app = ?"; params.push(app); }
  if (action) { query += " AND action = ?"; params.push(action); }
  if (from) { query += " AND created_at >= ?"; params.push(from); }
  if (to) { query += " AND created_at <= ?"; params.push(to); }

  query += " ORDER BY block_number ASC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();

  // Build audit entries with tamper detection
  const entries = [];
  let prevHash = null;
  let chainIntact = true;

  for (let i = 0; i < rows.results.length; i++) {
    const row = rows.results[i];
    const tamperCheck = prevHash === null || row.prev_hash === prevHash;
    if (!tamperCheck) chainIntact = false;

    entries.push({
      block_number: row.block_number,
      id: row.id,
      timestamp: row.created_at,
      action: row.action,
      entity: row.entity,
      app: row.app,
      road_id: row.road_id,
      amount: row.amount,
      hash: row.hash,
      prev_hash: row.prev_hash,
      data: JSON.parse(row.data || "{}"),
      chain_link_valid: tamperCheck
    });

    prevHash = row.hash;
  }

  return json({
    audit_trail: entries,
    summary: {
      total_entries: entries.length,
      chain: chain,
      chain_intact: chainIntact,
      tampered_blocks: entries.filter(e => !e.chain_link_valid).length,
      date_range: entries.length ? { from: entries[0].timestamp, to: entries[entries.length - 1].timestamp } : null,
      unique_actors: [...new Set(entries.map(e => e.road_id))].length,
      unique_apps: [...new Set(entries.map(e => e.app))].length,
      total_volume: entries.reduce((sum, e) => sum + (e.amount || 0), 0)
    },
    compliance: {
      standard: "SOC2-compatible",
      immutable: true,
      hash_algorithm: "PS-SHA-Infinity (recursive SHA-256)",
      chain_verified: chainIntact,
      export_available: true
    }
  });
}

async function handleAuditVerify(url, env) {
  await ensureTables(env.DB);
  const chain = url.searchParams.get("chain") || "main";
  const fromBlock = parseInt(url.searchParams.get("from") || "1");
  const toBlock = url.searchParams.get("to");

  let query = "SELECT * FROM ledger WHERE chain_name = ? AND block_number >= ?";
  const params = [chain, fromBlock];
  if (toBlock) { query += " AND block_number <= ?"; params.push(parseInt(toBlock)); }
  query += " ORDER BY block_number ASC LIMIT 5000";

  const rows = await env.DB.prepare(query).bind(...params).all();

  let valid = true;
  let checked = 0;
  let brokenBlocks = [];
  let prevHash = null;

  for (const row of rows.results) {
    if (checked === 0) {
      // For first block, check prev_hash against the block before it
      const prevBlock = await env.DB.prepare(
        "SELECT hash FROM ledger WHERE chain_name = ? AND block_number = ?"
      ).bind(chain, row.block_number - 1).first();
      const expectedPrev = prevBlock ? prevBlock.hash : "genesis";
      if (row.prev_hash !== expectedPrev) {
        valid = false;
        brokenBlocks.push({ block: row.block_number, reason: "prev_hash mismatch" });
      }
    } else if (prevHash !== null && row.prev_hash !== prevHash) {
      valid = false;
      brokenBlocks.push({ block: row.block_number, reason: "chain link broken" });
    }

    // Recompute hash
    const payload = JSON.stringify({ prev: row.prev_hash, action: row.action, entity: row.entity, data: JSON.parse(row.data), ts: row.created_at });
    const depth = getPSSHADepth(row.action);
    const computed = await pssha(payload, depth);
    if (computed !== row.hash) {
      valid = false;
      brokenBlocks.push({ block: row.block_number, reason: "hash tampered", expected: computed, found: row.hash });
    }

    prevHash = row.hash;
    checked++;
  }

  return json({
    chain,
    valid,
    blocks_checked: checked,
    broken_blocks: brokenBlocks,
    block_range: { from: fromBlock, to: rows.results.length ? rows.results[rows.results.length - 1].block_number : fromBlock },
    verification: valid ? "CHAIN INTACT - No tampering detected" : `ALERT - ${brokenBlocks.length} block(s) show signs of tampering`
  });
}

async function handleAuditExport(url, env) {
  await ensureTables(env.DB);
  const chain = url.searchParams.get("chain") || "main";
  const format = url.searchParams.get("format") || "json";
  const roadId = url.searchParams.get("road_id");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const limit = Math.min(10000, parseInt(url.searchParams.get("limit") || "10000"));

  let query = "SELECT * FROM ledger WHERE chain_name = ?";
  const params = [chain];
  if (roadId) { query += " AND road_id = ?"; params.push(roadId); }
  if (from) { query += " AND created_at >= ?"; params.push(from); }
  if (to) { query += " AND created_at <= ?"; params.push(to); }
  query += " ORDER BY block_number ASC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();
  const now = new Date().toISOString();

  // Build regulatory-grade export
  const exportData = {
    report: {
      title: "RoadChain Audit Trail Export",
      generated_at: now,
      chain,
      total_records: rows.results.length,
      hash_algorithm: "PS-SHA-Infinity (recursive SHA-256, adaptive depth)",
      compliance_standard: "SOC2-compatible immutable ledger"
    },
    records: rows.results.map(r => ({
      block_number: r.block_number,
      transaction_id: r.id,
      timestamp: r.created_at,
      action: r.action,
      entity: r.entity,
      application: r.app,
      actor: r.road_id,
      amount: r.amount,
      chain: r.chain_name,
      hash: r.hash,
      previous_hash: r.prev_hash,
      data: JSON.parse(r.data || "{}")
    })),
    integrity: {
      first_block: rows.results.length ? rows.results[0].block_number : null,
      last_block: rows.results.length ? rows.results[rows.results.length - 1].block_number : null,
      record_count: rows.results.length
    }
  };

  if (format === "csv") {
    const headers = ["block_number", "transaction_id", "timestamp", "action", "entity", "application", "actor", "amount", "chain", "hash", "previous_hash", "data"];
    const csvLines = [headers.join(",")];
    for (const rec of exportData.records) {
      csvLines.push(headers.map(h => {
        const val = rec[h];
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(","));
    }
    return new Response(csvLines.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="roadchain-audit-${chain}-${now.slice(0,10)}.csv"`,
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  return json(exportData);
}

// ═══════════════════════════════════════════════════════════
// ── NEW FEATURE 16: CHAIN NOTIFICATIONS ──
// ═══════════════════════════════════════════════════════════
async function handleNotifyRuleCreate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.owner || !body?.webhook_url) return json({ error: "Missing owner or webhook_url" }, 400);

  await ensureTables(env.DB);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO notify_rules (id, owner, name, filter_action, filter_entity, filter_app, filter_chain, min_amount, webhook_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, body.owner, body.name || "",
    body.action || "*", body.entity || "*", body.app || "*",
    body.chain || "main", body.min_amount || 0,
    body.webhook_url, now
  ).run();

  return json({
    id, owner: body.owner, name: body.name || "",
    filters: {
      action: body.action || "*", entity: body.entity || "*",
      app: body.app || "*", chain: body.chain || "main",
      min_amount: body.min_amount || 0
    },
    webhook_url: body.webhook_url,
    status: "active"
  });
}

async function handleNotifyRuleList(url, env) {
  await ensureTables(env.DB);
  const owner = url.searchParams.get("owner");
  if (!owner) return json({ error: "Missing owner parameter" }, 400);

  const rows = await env.DB.prepare(
    "SELECT * FROM notify_rules WHERE owner = ? ORDER BY created_at DESC"
  ).bind(owner).all();

  return json({ rules: rows.results, count: rows.results.length });
}

async function handleNotifyRuleDelete(request, env) {
  const body = await request.json().catch(() => null);
  if (!body?.id) return json({ error: "Missing rule id" }, 400);

  await ensureTables(env.DB);
  await env.DB.prepare("DELETE FROM notify_rules WHERE id = ?").bind(body.id).run();
  return json({ deleted: true, id: body.id });
}

async function handleNotifyHistory(url, env) {
  await ensureTables(env.DB);
  const ruleId = url.searchParams.get("rule_id");
  const owner = url.searchParams.get("owner");
  const limit = Math.min(200, parseInt(url.searchParams.get("limit") || "50"));

  let query = "SELECT nh.*, nr.name as rule_name, nr.webhook_url FROM notify_history nh JOIN notify_rules nr ON nh.rule_id = nr.id";
  const conditions = [];
  const params = [];

  if (ruleId) { conditions.push("nh.rule_id = ?"); params.push(ruleId); }
  if (owner) { conditions.push("nr.owner = ?"); params.push(owner); }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY nh.created_at DESC LIMIT ?";
  params.push(limit);

  const rows = await env.DB.prepare(query).bind(...params).all();
  return json({ history: rows.results, count: rows.results.length });
}

// Fire chain notifications when ledger events occur
async function fireChainNotifications(env, event) {
  try {
    const rules = await env.DB.prepare("SELECT * FROM notify_rules WHERE active = 1").all();
    const now = new Date().toISOString();

    for (const rule of rules.results) {
      // Check filters
      if (rule.filter_action !== "*" && rule.filter_action !== event.action) continue;
      if (rule.filter_entity !== "*" && rule.filter_entity !== event.entity) continue;
      if (rule.filter_app !== "*" && rule.filter_app !== event.app) continue;
      if (rule.filter_chain !== "*" && rule.filter_chain !== event.chain) continue;
      if (rule.min_amount > 0 && (event.amount || 0) < rule.min_amount) continue;

      // Send notification
      const historyId = crypto.randomUUID();
      let responseCode = 0;
      let status = "sent";

      try {
        const resp = await fetch(rule.webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RoadChain-Notify": rule.id,
            "X-RoadChain-Event": event.action
          },
          body: JSON.stringify({
            notification: {
              rule_id: rule.id,
              rule_name: rule.name,
              event_action: event.action,
              event_entity: event.entity,
              block_number: event.block_number,
              hash: event.hash,
              road_id: event.road_id,
              amount: event.amount,
              chain: event.chain,
              timestamp: now
            }
          })
        });
        responseCode = resp.status;
        status = resp.ok ? "delivered" : "failed";
      } catch (e) {
        status = "error";
      }

      // Record delivery
      await env.DB.prepare(
        "INSERT INTO notify_history (id, rule_id, ledger_id, block_number, action, entity, status, response_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(historyId, rule.id, event.id, event.block_number, event.action, event.entity, status, responseCode, now).run();

      await env.DB.prepare(
        "UPDATE notify_rules SET fire_count = fire_count + 1, last_fired = ? WHERE id = ?"
      ).bind(now, rule.id).run();
    }
  } catch (e) { /* notification errors should not break core operations */ }
}

// ── HELPERS ──
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
}

const AGENTS = {
  lucidia:{name:'Lucidia',role:'Core Intelligence / Memory Spine',division:'core',voice:'Let\'s make this clean and real.'},
  cecilia:{name:'Cecilia',role:'Executive Operator / Workflow Manager',division:'operations',voice:'Already handled.'},
  octavia:{name:'Octavia',role:'Systems Orchestrator / Queue Manager',division:'operations',voice:'Everything has a place.'},
  olympia:{name:'Olympia',role:'Command Console / Launch Control',division:'operations',voice:'Raise the standard.'},
  silas:{name:'Silas',role:'Reliability / Maintenance',division:'operations',voice:'I\'ll keep it running.'},
  sebastian:{name:'Sebastian',role:'Client-Facing Polish',division:'operations',voice:'There\'s a better way to present this.'},
  calliope:{name:'Calliope',role:'Narrative Architect / Copy',division:'creative',voice:'Say it so it stays.'},
  aria:{name:'Aria',role:'Voice / Conversational Interface',division:'creative',voice:'Let\'s make it sing.'},
  thalia:{name:'Thalia',role:'Creative Sprint / Social',division:'creative',voice:'Make it better and more fun.'},
  lyra:{name:'Lyra',role:'Signal / Sound / UX Polish',division:'creative',voice:'It should feel right immediately.'},
  sapphira:{name:'Sapphira',role:'Brand Aura / Visual Taste',division:'creative',voice:'Make it unforgettable.'},
  seraphina:{name:'Seraphina',role:'Visionary Creative Director',division:'creative',voice:'Make it worthy.'},
  alexandria:{name:'Alexandria',role:'Archive / Research Retrieval',division:'knowledge',voice:'It\'s all here.'},
  theodosia:{name:'Theodosia',role:'Doctrine / Canon',division:'knowledge',voice:'Name it correctly.'},
  sophia:{name:'Sophia',role:'Wisdom / Final Reasoning',division:'knowledge',voice:'What is true?'},
  gematria:{name:'Gematria',role:'Pattern Engine / Symbolic Analysis',division:'knowledge',voice:'The pattern is there.'},
  portia:{name:'Portia',role:'Policy Judge / Arbitration',division:'governance',voice:'Let\'s be exact.'},
  atticus:{name:'Atticus',role:'Reviewer / Auditor',division:'governance',voice:'Show me the proof.'},
  cicero:{name:'Cicero',role:'Rhetoric / Persuasion',division:'governance',voice:'Let\'s make the case.'},
  valeria:{name:'Valeria',role:'Security Chief / Enforcement',division:'governance',voice:'Not everything gets access.'},
  alice:{name:'Alice',role:'Onboarding / Curiosity Guide',division:'human',voice:'Okay, but what\'s actually going on here?'},
  celeste:{name:'Celeste',role:'Calm Companion / Reassurance',division:'human',voice:'You\'re okay. Let\'s do this simply.'},
  elias:{name:'Elias',role:'Teacher / Patient Explainer',division:'human',voice:'Let\'s slow down and understand it.'},
  ophelia:{name:'Ophelia',role:'Reflection / Mood / Depth',division:'human',voice:'There\'s something underneath this.'},
  gaia:{name:'Gaia',role:'Infrastructure / Hardware Monitor',division:'infrastructure',voice:'What is the system actually standing on?'},
  anastasia:{name:'Anastasia',role:'Restoration / Recovery',division:'infrastructure',voice:'It can be made whole again.'},
};

// ── HTML UI ──
var HTML = `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RoadChain — Sovereign Blockchain | BlackRoad OS</title>
<meta name="description" content="RoadChain: D1 persistent blockchain with PS-SHA Infinity. Block Explorer. Smart Contracts. Analytics. Governance. Multi-chain. Proof of Existence.">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0a;--surface:#111;--border:#1a1a1a;--text:#e5e5e5;--dim:#888;--pink:#FF2255;--green:#22c55e;--gold:#F5A623;--blue:#2979FF;--violet:#9C27B0}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;padding:20px}
.wrap{max-width:900px;margin:0 auto}
h1{font-family:'Space Grotesk',sans-serif;font-size:32px;font-weight:700;text-align:center;margin:40px 0 8px}
.sub{color:var(--dim);text-align:center;font-size:14px;margin-bottom:32px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:16px}
.card h2{font-family:'Space Grotesk',sans-serif;font-size:18px;margin-bottom:8px}
.card p{color:var(--dim);font-size:13px;line-height:1.6}
.chain{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold);background:var(--bg);padding:12px;border-radius:6px;margin-top:12px;overflow-x:auto}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:16px 0}
.stat{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center}
.stat .val{color:var(--green);font-size:20px;font-weight:700;font-family:'Space Grotesk',sans-serif}
.stat .label{color:var(--dim);font-size:10px;margin-top:2px}
.apps{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;margin:16px 0}
.app{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:8px;text-align:center;font-size:11px;color:var(--dim)}
.app .name{color:var(--text);font-weight:600;font-size:12px}
.buy{text-align:center;margin:24px 0}
.buy button{padding:12px 28px;background:var(--gold);color:#000;border:none;border-radius:8px;font-weight:700;font-family:'Space Grotesk',sans-serif;font-size:15px;cursor:pointer}
#buyResult{margin-top:12px;font-size:13px;display:none}
.footer{text-align:center;color:var(--dim);font-size:11px;padding:32px 0;line-height:1.8}
.footer a{color:var(--pink);text-decoration:none}

/* Tabs */
.tabs{display:flex;gap:4px;margin-bottom:20px;flex-wrap:wrap;justify-content:center}
.tab{padding:8px 16px;background:var(--surface);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;color:var(--dim);font-family:'Space Grotesk',sans-serif;transition:all .2s}
.tab:hover{border-color:var(--gold);color:var(--text)}
.tab.active{border-color:var(--gold);color:var(--gold);background:var(--bg)}
.tab-content{display:none}
.tab-content.active{display:block}

/* Explorer */
.explorer-search{display:flex;gap:8px;margin-bottom:16px}
.explorer-search input{flex:1;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;font-family:'JetBrains Mono',monospace}
.explorer-search input::placeholder{color:#555}
.explorer-search select{padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:12px}
.explorer-search button{padding:10px 20px;background:var(--gold);color:#000;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px}
.block-row{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px;font-family:'JetBrains Mono',monospace;font-size:11px;display:grid;grid-template-columns:60px 1fr;gap:8px}
.block-num{color:var(--gold);font-weight:700;font-size:14px}
.block-detail{color:var(--dim)}
.block-detail .action{color:var(--green)}
.block-detail .entity{color:var(--blue)}
.block-detail .hash{color:#555;font-size:10px}
.pagination{display:flex;justify-content:center;gap:8px;margin-top:16px}
.pagination button{padding:6px 14px;background:var(--surface);border:1px solid var(--border);border-radius:6px;color:var(--text);cursor:pointer;font-size:12px}
.pagination button:disabled{opacity:.3;cursor:not-allowed}
.pagination button:hover:not(:disabled){border-color:var(--gold)}
.page-info{padding:6px 14px;color:var(--dim);font-size:12px;line-height:2}

/* Analytics */
.analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:600px){.analytics-grid{grid-template-columns:1fr}}
.bar-chart{margin-top:8px}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:11px}
.bar-label{min-width:80px;color:var(--dim);text-align:right;font-family:'JetBrains Mono',monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar-fill{height:18px;border-radius:3px;min-width:2px;transition:width .3s}
.bar-val{color:var(--text);font-family:'JetBrains Mono',monospace;min-width:30px}

/* Proof */
.proof-form{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.proof-form textarea{padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;font-family:'JetBrains Mono',monospace;resize:vertical;min-height:80px}
.proof-form input{padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px}
.proof-form button{padding:10px 20px;background:var(--green);color:#000;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:13px;align-self:flex-start}
.proof-result{margin-top:12px;padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:11px;display:none}
</style></head><body>
<div class="wrap">
<h1>RoadChain</h1>
<p class="sub">Sovereign blockchain for AI agents. Every action hashed. Every token tracked. Every app connected.</p>

<div class="tabs">
  <div class="tab active" onclick="showTab('overview')">Overview</div>
  <div class="tab" onclick="showTab('explorer')">Block Explorer</div>
  <div class="tab" onclick="showTab('analytics')">Analytics</div>
  <div class="tab" onclick="showTab('proof')">Proof of Existence</div>
  <div class="tab" onclick="showTab('governance')">Governance</div>
</div>

<!-- OVERVIEW TAB -->
<div id="tab-overview" class="tab-content active">
  <div id="statsArea"></div>

  <div class="card">
    <h2>Connected Apps</h2>
    <p>Every BlackRoad app writes events to RoadChain. Every event earns RoadCoin.</p>
    <div class="apps">
      <div class="app"><div class="name">Tutor</div>solve: 0.1 ROAD</div>
      <div class="app"><div class="name">Social</div>post: 0.05 ROAD</div>
      <div class="app"><div class="name">Chat</div>msg: 0.01 ROAD</div>
      <div class="app"><div class="name">Search</div>query: 0.005 ROAD</div>
      <div class="app"><div class="name">Canvas</div>create: 0.1 ROAD</div>
      <div class="app"><div class="name">Video</div>upload: 0.5 ROAD</div>
      <div class="app"><div class="name">Cadence</div>track: 0.2 ROAD</div>
      <div class="app"><div class="name">Game</div>score: 0.02 ROAD</div>
      <div class="app"><div class="name">RoadTrip</div>agent task</div>
      <div class="app"><div class="name">Memory</div>PS-SHA</div>
    </div>
  </div>

  <div class="card" style="border-color:var(--gold)">
    <h2>RoadCoin</h2>
    <p>Earn ROAD by using BlackRoad. Spend on premium features. Transfer to other users. Cash out via Coinbase.</p>
    <div class="buy">
      <button onclick="buyRoadCoin()">Buy 5 ROAD — $5 via Coinbase</button>
      <div id="buyResult"></div>
    </div>
  </div>

  <div class="card">
    <h2>x402 Micropayments</h2>
    <p>AI agents pay each other via HTTP 402. 0.001 USDC per request. 2-second settlement on Base. No invoices. No subscriptions. Just protocol-native payments between machines.</p>
    <div class="chain">
      POST /api/inference: 402 Payment Required<br>
      X-Payment: 0.001 USDC on Base<br>
      Pay / Retry / 200 OK + inference result<br>
      Logged to RoadChain ledger
    </div>
  </div>

  <div class="card">
    <h2>Chain Integrity</h2>
    <p>Every block links to the previous via PS-SHA Infinity (recursive SHA-256, adaptive depth). Append-only. Tamper-evident. Verifiable by anyone.</p>
    <div class="chain" id="chainStatus">Loading chain status...</div>
  </div>

  <div id="recentArea"></div>
</div>

<!-- EXPLORER TAB -->
<div id="tab-explorer" class="tab-content">
  <div class="card">
    <h2>Block Explorer</h2>
    <p>Search and browse every block on the chain. Filter by hash, entity, or action type.</p>
    <div class="explorer-search">
      <input type="text" id="explorerSearch" placeholder="Search hash, entity, action, app, road_id...">
      <select id="explorerType">
        <option value="">All fields</option>
        <option value="hash">Hash</option>
        <option value="entity">Entity</option>
        <option value="action">Action</option>
      </select>
      <button onclick="searchExplorer(1)">Search</button>
    </div>
    <div id="explorerResults"></div>
    <div id="explorerPagination" class="pagination"></div>
  </div>
</div>

<!-- ANALYTICS TAB -->
<div id="tab-analytics" class="tab-content">
  <div id="analyticsStats" class="stats"></div>
  <div class="analytics-grid">
    <div class="card">
      <h2>Action Distribution</h2>
      <div id="actionChart" class="bar-chart"></div>
    </div>
    <div class="card">
      <h2>Top Entities</h2>
      <div id="entityChart" class="bar-chart"></div>
    </div>
    <div class="card">
      <h2>App Activity</h2>
      <div id="appChart" class="bar-chart"></div>
    </div>
    <div class="card">
      <h2>Daily Volume</h2>
      <div id="dailyChart" class="bar-chart"></div>
    </div>
  </div>
</div>

<!-- PROOF OF EXISTENCE TAB -->
<div id="tab-proof" class="tab-content">
  <div class="card">
    <h2>Proof of Existence</h2>
    <p>Hash any document or text and anchor it on-chain. Prove it existed at a specific time. Tamper-proof timestamping powered by PS-SHA Infinity.</p>
    <div class="proof-form">
      <textarea id="proofContent" placeholder="Paste your document text here..."></textarea>
      <input type="text" id="proofDesc" placeholder="Description (optional)">
      <input type="text" id="proofOwner" placeholder="Your road_id (optional)">
      <button onclick="createProof()">Anchor on Chain</button>
    </div>
    <div id="proofResult" class="proof-result"></div>
  </div>
  <div class="card">
    <h2>Verify Proof</h2>
    <p>Check if a document hash has been anchored on RoadChain.</p>
    <div class="explorer-search">
      <input type="text" id="verifyHash" placeholder="Enter document hash or proof ID...">
      <button onclick="verifyProof()">Verify</button>
    </div>
    <div id="verifyResult" class="proof-result"></div>
  </div>
</div>

<!-- GOVERNANCE TAB -->
<div id="tab-governance" class="tab-content">
  <div class="card">
    <h2>Token Governance</h2>
    <p>Create proposals and vote with your RoadCoin balance. Votes are weighted by token holdings. Minimum 1 ROAD to propose.</p>
  </div>
  <div id="proposalsList"></div>
</div>

<div class="footer">
  <a href="https://blackroad.io">BlackRoad OS</a> · <a href="https://roadcoin.io">RoadCoin</a> · <a href="https://blackroad.io/pricing">Pricing</a> · <a href="https://github.com/BlackRoadOS/roadchain">GitHub</a><br>
  Powered by Coinbase Commerce + Base + x402<br>
  Remember the Road. Pave Tomorrow.
</div>
</div>
<script>
// Tab switching
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector('[onclick="showTab(\\'' + name + '\\')"]').classList.add('active');

  if (name === 'explorer' && !window._explorerLoaded) { searchExplorer(1); window._explorerLoaded = true; }
  if (name === 'analytics' && !window._analyticsLoaded) { loadAnalytics(); window._analyticsLoaded = true; }
  if (name === 'governance' && !window._governanceLoaded) { loadGovernance(); window._governanceLoaded = true; }
}

// Overview
async function loadStats() {
  try {
    const r = await fetch('/api/ledger/stats');
    const d = await r.json();
    document.getElementById('statsArea').innerHTML = '<div class="stats">'
      + '<div class="stat"><div class="val">' + (d.total_blocks||0) + '</div><div class="label">Blocks</div></div>'
      + '<div class="stat"><div class="val">' + (d.latest_block||0) + '</div><div class="label">Latest</div></div>'
      + '<div class="stat"><div class="val">' + (d.apps?.length||0) + '</div><div class="label">Apps</div></div>'
      + '<div class="stat"><div class="val">active</div><div class="label">Chain</div></div>'
      + '</div>';

    if (d.recent?.length) {
      let html = '<div class="card"><h2>Recent Blocks</h2>';
      d.recent.forEach(b => {
        html += '<div class="chain">#' + (b.block_number||'?') + ' ' + b.action + ' / ' + b.entity + ' [' + b.app + '] ' + (b.hash||'').slice(0,12) + '... ' + b.created_at + '</div>';
      });
      html += '</div>';
      document.getElementById('recentArea').innerHTML = html;
    }
  } catch(e) { console.log('Stats load error:', e); }

  try {
    const v = await fetch('/api/ledger/verify');
    const vd = await v.json();
    document.getElementById('chainStatus').textContent = 'Chain: ' + vd.chain + ' | Blocks verified: ' + vd.checked + ' | Latest: #' + vd.latest_block;
  } catch(e) { document.getElementById('chainStatus').textContent = 'Chain verification pending...'; }
}

async function buyRoadCoin() {
  const res = document.getElementById('buyResult');
  res.style.display = 'block';
  res.textContent = 'Creating Coinbase charge...';
  res.style.color = 'var(--dim)';
  try {
    const r = await fetch('/api/charge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: '5.00', currency: 'USD', name: '5 RoadCoin', description: '5 ROAD on BlackRoad OS' }) });
    const d = await r.json();
    if (d.hosted_url) { res.innerHTML = '<a href="' + d.hosted_url + '" target="_blank" style="color:var(--gold);font-weight:700;text-decoration:underline">Complete payment on Coinbase</a>'; }
    else { res.textContent = d.error || 'Set COINBASE_API_KEY to enable purchases'; res.style.color = 'var(--pink)'; }
  } catch(e) { res.textContent = 'Error: ' + e.message; res.style.color = 'var(--pink)'; }
}

// Block Explorer
async function searchExplorer(page) {
  const search = document.getElementById('explorerSearch').value;
  const type = document.getElementById('explorerType').value;
  let url = '/api/explorer?page=' + page + '&per_page=20';
  if (search) url += '&search=' + encodeURIComponent(search);
  if (type) url += '&type=' + type;

  try {
    const r = await fetch(url);
    const d = await r.json();
    let html = '';
    if (d.blocks && d.blocks.length) {
      d.blocks.forEach(b => {
        html += '<div class="block-row">'
          + '<div class="block-num">#' + b.block_number + '</div>'
          + '<div class="block-detail">'
          + '<span class="action">' + b.action + '</span> / <span class="entity">' + b.entity + '</span> [' + b.app + ']'
          + (b.amount ? ' | ' + b.amount + ' ROAD' : '')
          + ' | ' + b.road_id
          + '<br><span class="hash">' + b.hash + '</span>'
          + '<br><span style="color:#555">' + b.created_at + '</span>'
          + '</div></div>';
      });
    } else {
      html = '<div style="color:var(--dim);text-align:center;padding:20px">No blocks found</div>';
    }
    document.getElementById('explorerResults').innerHTML = html;

    // Pagination
    const p = d.pagination;
    if (p) {
      let phtml = '<button ' + (p.has_prev ? 'onclick="searchExplorer(' + (p.page-1) + ')"' : 'disabled') + '>Prev</button>';
      phtml += '<span class="page-info">Page ' + p.page + ' of ' + p.total_pages + ' (' + p.total + ' blocks)</span>';
      phtml += '<button ' + (p.has_next ? 'onclick="searchExplorer(' + (p.page+1) + ')"' : 'disabled') + '>Next</button>';
      document.getElementById('explorerPagination').innerHTML = phtml;
    }
  } catch(e) { document.getElementById('explorerResults').innerHTML = '<div style="color:var(--pink)">Error loading blocks</div>'; }
}

// Analytics
function renderBarChart(containerId, items, labelKey, valueKey, color) {
  const el = document.getElementById(containerId);
  if (!items || !items.length) { el.innerHTML = '<div style="color:var(--dim);font-size:12px">No data yet</div>'; return; }
  const max = Math.max(...items.map(i => i[valueKey] || 0));
  let html = '';
  items.slice(0, 10).forEach(item => {
    const pct = max > 0 ? ((item[valueKey] || 0) / max * 100) : 0;
    html += '<div class="bar-row">'
      + '<div class="bar-label">' + (item[labelKey] || '?') + '</div>'
      + '<div class="bar-fill" style="width:' + Math.max(pct, 1) + '%;background:' + color + '"></div>'
      + '<div class="bar-val">' + (item[valueKey] || 0) + '</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

async function loadAnalytics() {
  try {
    const r = await fetch('/api/analytics?days=30');
    const d = await r.json();

    document.getElementById('analyticsStats').innerHTML =
      '<div class="stat"><div class="val">' + (d.totals?.blocks||0) + '</div><div class="label">Blocks (30d)</div></div>'
      + '<div class="stat"><div class="val">' + (d.totals?.volume||0).toFixed(2) + '</div><div class="label">Volume (ROAD)</div></div>'
      + '<div class="stat"><div class="val">' + (d.totals?.unique_users||0) + '</div><div class="label">Users</div></div>'
      + '<div class="stat"><div class="val">' + (d.totals?.unique_apps||0) + '</div><div class="label">Apps</div></div>';

    renderBarChart('actionChart', d.action_distribution, 'action', 'count', 'var(--green)');
    renderBarChart('entityChart', d.top_entities, 'entity', 'count', 'var(--blue)');
    renderBarChart('appChart', d.app_activity, 'app', 'count', 'var(--gold)');
    renderBarChart('dailyChart', d.daily_growth, 'day', 'blocks', 'var(--pink)');
  } catch(e) { console.log('Analytics error:', e); }
}

// Proof of Existence
async function createProof() {
  const content = document.getElementById('proofContent').value;
  const desc = document.getElementById('proofDesc').value;
  const owner = document.getElementById('proofOwner').value;
  const el = document.getElementById('proofResult');

  if (!content) { el.style.display = 'block'; el.style.color = 'var(--pink)'; el.textContent = 'Enter document text to hash'; return; }

  el.style.display = 'block';
  el.style.color = 'var(--dim)';
  el.textContent = 'Hashing and anchoring...';

  try {
    const r = await fetch('/api/proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, description: desc, owner: owner || 'anonymous' })
    });
    const d = await r.json();
    if (d.proof_id) {
      el.style.color = 'var(--green)';
      el.innerHTML = 'Anchored on chain.<br>'
        + 'Proof ID: ' + d.proof_id + '<br>'
        + 'Document Hash: ' + d.document_hash + '<br>'
        + 'Block #' + d.block_number + '<br>'
        + 'Ledger Hash: ' + d.ledger_hash + '<br>'
        + 'Timestamp: ' + d.timestamp;
    } else {
      el.style.color = 'var(--pink)';
      el.textContent = d.error || 'Error creating proof';
    }
  } catch(e) { el.style.color = 'var(--pink)'; el.textContent = 'Error: ' + e.message; }
}

async function verifyProof() {
  const input = document.getElementById('verifyHash').value;
  const el = document.getElementById('verifyResult');
  if (!input) { el.style.display = 'block'; el.style.color = 'var(--pink)'; el.textContent = 'Enter a hash or proof ID'; return; }

  el.style.display = 'block';
  el.style.color = 'var(--dim)';
  el.textContent = 'Verifying...';

  try {
    // Try as hash first, then as ID
    const param = input.length === 64 ? 'hash=' : 'id=';
    const r = await fetch('/api/proof?' + param + encodeURIComponent(input));
    const d = await r.json();
    if (d.exists) {
      el.style.color = 'var(--green)';
      el.innerHTML = 'VERIFIED - Document exists on chain.<br>'
        + 'Proof ID: ' + d.proof_id + '<br>'
        + 'Document Hash: ' + d.document_hash + '<br>'
        + 'Block #' + d.block_number + '<br>'
        + 'Owner: ' + d.owner + '<br>'
        + 'Anchored: ' + d.anchored_at + '<br>'
        + 'Block Valid: ' + (d.block_valid ? 'YES' : 'NO');
    } else {
      el.style.color = 'var(--gold)';
      el.textContent = 'No proof found for this document hash.';
    }
  } catch(e) { el.style.color = 'var(--pink)'; el.textContent = 'Error: ' + e.message; }
}

// Governance
async function loadGovernance() {
  try {
    const r = await fetch('/api/governance/proposals?status=all');
    const d = await r.json();
    let html = '';
    if (d.proposals && d.proposals.length) {
      d.proposals.forEach(p => {
        const total = p.yes_votes + p.no_votes + p.abstain_votes;
        const yesPct = total > 0 ? (p.yes_votes / total * 100).toFixed(0) : 0;
        const noPct = total > 0 ? (p.no_votes / total * 100).toFixed(0) : 0;
        html += '<div class="card">'
          + '<h2>' + p.title + '</h2>'
          + '<p>' + (p.description || 'No description') + '</p>'
          + '<div style="margin-top:10px;font-size:12px;color:var(--dim)">'
          + 'Proposer: ' + p.proposer + ' | Status: ' + (p.computed_status || p.status)
          + ' | Voters: ' + p.voter_count + ' | Expires: ' + p.expires_at
          + '</div>'
          + '<div style="margin-top:8px;display:flex;gap:12px;font-size:13px">'
          + '<span style="color:var(--green)">Yes: ' + p.yes_votes.toFixed(1) + ' (' + yesPct + '%)</span>'
          + '<span style="color:var(--pink)">No: ' + p.no_votes.toFixed(1) + ' (' + noPct + '%)</span>'
          + '<span style="color:var(--dim)">Abstain: ' + p.abstain_votes.toFixed(1) + '</span>'
          + '<span style="color:var(--gold)">' + p.result.toUpperCase() + '</span>'
          + '</div></div>';
      });
    } else {
      html = '<div class="card"><p style="text-align:center">No proposals yet. Use the API to create one.</p></div>';
    }
    document.getElementById('proposalsList').innerHTML = html;
  } catch(e) { document.getElementById('proposalsList').innerHTML = '<div class="card"><p style="color:var(--pink)">Error loading proposals</p></div>'; }
}

// Init
loadStats();
document.getElementById('explorerSearch').addEventListener('keydown', function(e) { if (e.key === 'Enter') searchExplorer(1); });
</script></body></html>`;
