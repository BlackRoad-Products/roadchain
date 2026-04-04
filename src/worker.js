/**
 * RoadChain — Blockchain Verification Layer
 * Copyright (c) 2026 BlackRoad OS, Inc. All rights reserved.
 *
 * Every bit verified. Every ship signed.
 */

// --- In-memory blockchain ---
let chain = [];

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createBlock(index, data, previousHash) {
  const timestamp = new Date().toISOString();
  const nonce = Math.floor(Math.random() * 1000000);
  const hash = await sha256(`${index}${previousHash}${timestamp}${data}${nonce}`);
  return { index, timestamp, data, hash, previousHash, nonce };
}

async function initChain() {
  if (chain.length === 0) {
    const genesis = await createBlock(0, 'Genesis Block', '0'.repeat(64));
    chain.push(genesis);
  }
}

async function addBlock(data) {
  const prev = chain[chain.length - 1];
  const block = await createBlock(chain.length, data, prev.hash);
  chain.push(block);
  return block;
}

async function verifyChain() {
  const results = [];
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const computedHash = await sha256(
      `${block.index}${block.previousHash}${block.timestamp}${block.data}${block.nonce}`
    );
    const hashValid = computedHash === block.hash;
    const linkValid = i === 0 || block.previousHash === chain[i - 1].hash;
    results.push({ index: i, hashValid, linkValid, valid: hashValid && linkValid });
  }
  const valid = results.every(r => r.valid);
  return { valid, blocks: results, totalBlocks: chain.length };
}

function findHash(hash) {
  return chain.find(b => b.hash === hash) || null;
}

async function computeMerkleRoot(hashes) {
  if (hashes.length === 0) return '0'.repeat(64);
  if (hashes.length === 1) return hashes[0];
  const next = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = i + 1 < hashes.length ? hashes[i + 1] : left;
    next.push(await sha256(left + right));
  }
  return computeMerkleRoot(next);
}

async function getMerkleTree() {
  const hashes = chain.map(b => b.hash);
  const layers = [hashes.slice()];
  let current = hashes.slice();
  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const left = current[i];
      const right = i + 1 < current.length ? current[i + 1] : left;
      next.push(await sha256(left + right));
    }
    layers.push(next);
    current = next;
  }
  return { root: current[0] || '0'.repeat(64), layers, depth: layers.length };
}

// --- CORS & Security ---
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://blackroad.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none';",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
  });
}

function htmlResponse(html) {
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', ...SECURITY_HEADERS },
  });
}

// --- API Router ---
async function handleAPI(path, request) {
  if (path === '/api/health') {
    return jsonResponse({ status: 'healthy', service: 'roadchain', blocks: chain.length, uptime: Date.now() });
  }

  if (path === '/api/chain' && request.method === 'GET') {
    return jsonResponse({ chain, length: chain.length });
  }

  if (path === '/api/chain/stats' && request.method === 'GET') {
    const last = chain[chain.length - 1];
    const verification = await verifyChain();
    return jsonResponse({
      totalBlocks: chain.length,
      chainLength: chain.length,
      lastBlockTime: last ? last.timestamp : null,
      lastBlockHash: last ? last.hash : null,
      chainIntegrity: verification.valid ? 'valid' : 'invalid',
      genesisHash: chain[0] ? chain[0].hash : null,
    });
  }

  if (path === '/api/chain/add' && request.method === 'POST') {
    try {
      const body = await request.json();
      if (!body.data) return jsonResponse({ error: 'Missing "data" field' }, 400);
      const block = await addBlock(typeof body.data === 'string' ? body.data : JSON.stringify(body.data));
      return jsonResponse({ success: true, block });
    } catch (e) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }
  }

  if (path === '/api/chain/verify' && request.method === 'GET') {
    const result = await verifyChain();
    return jsonResponse(result);
  }

  if (path === '/api/chain/verify-hash' && request.method === 'POST') {
    try {
      const body = await request.json();
      if (!body.hash) return jsonResponse({ error: 'Missing "hash" field' }, 400);
      const block = findHash(body.hash);
      return jsonResponse({ found: !!block, block });
    } catch (e) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }
  }

  if (path === '/api/chain/merkle' && request.method === 'GET') {
    const tree = await getMerkleTree();
    return jsonResponse(tree);
  }

  // /api/chain/block/:index
  const blockMatch = path.match(/^\/api\/chain\/block\/(\d+)$/);
  if (blockMatch && request.method === 'GET') {
    const idx = parseInt(blockMatch[1], 10);
    if (idx < 0 || idx >= chain.length) return jsonResponse({ error: 'Block not found' }, 404);
    return jsonResponse({ block: chain[idx] });
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

// --- Frontend ---
function renderUI() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RoadChain — Immutable Blockchain Ledger — BlackRoad OS</title>
<meta name="description" content="Immutable blockchain ledger with SHA-256 hashing, block explorer, chain verification, and Merkle proofs. Every action stamped and sealed.">
<meta name="robots" content="index, follow, noai, noimageai">
<link rel="canonical" href="https://roadchain.blackroad.io/">
<meta property="og:title" content="RoadChain — Immutable Ledger — BlackRoad OS">
<meta property="og:description" content="Blockchain ledger with SHA-256 hashing, block explorer, and chain verification. Every action stamped.">
<meta property="og:url" content="https://roadchain.blackroad.io/"><meta property="og:type" content="website">
<meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png"><meta property="og:site_name" content="BlackRoad OS">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="RoadChain — Immutable Ledger — BlackRoad OS">
<meta name="twitter:description" content="Blockchain ledger with SHA-256 hashing, block explorer, and chain verification.">
<meta name="twitter:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"RoadChain","url":"https://roadchain.blackroad.io/","description":"Immutable blockchain ledger with SHA-256 hashing, block explorer, and chain verification.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"}}</script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    min-height: 100vh;
    line-height: 1.5;
  }
  a { color: #f5f5f5; text-decoration: none; }

  .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

  header {
    padding: 40px 0 20px;
    text-align: center;
    border-bottom: 2px solid #FF1D6C;
  }
  header h1 { font-size: 2.4rem; font-weight: 700; letter-spacing: 2px; }
  header .tagline { color: #aaa; font-size: 0.95rem; margin-top: 6px; }

  .stats-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin: 28px 0;
  }
  .stat-card {
    background: #141414;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
  }
  .stat-card .label { color: #888; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
  .stat-card .value { font-size: 1.5rem; font-weight: 700; margin-top: 4px; }
  .stat-card.integrity .value.valid { color: #f5f5f5; }
  .stat-card.integrity .value.invalid { color: #f5f5f5; }
  .stat-card.integrity .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
  .stat-card.integrity .dot.valid { background: #00E676; }
  .stat-card.integrity .dot.invalid { background: #FF1D6C; }

  .section { margin: 32px 0; }
  .section h2 { font-size: 1.2rem; font-weight: 600; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 1px solid #222; }

  .actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 24px 0;
  }
  .action-card {
    background: #141414;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 20px;
  }
  .action-card h3 { font-size: 1rem; margin-bottom: 12px; }

  input[type="text"], textarea {
    width: 100%;
    padding: 10px 12px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #f5f5f5;
    font-family: system-ui, sans-serif;
    font-size: 0.9rem;
    margin-bottom: 10px;
    outline: none;
  }
  input[type="text"]:focus, textarea:focus { border-color: #2979FF; }
  textarea { resize: vertical; min-height: 60px; }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    color: #f5f5f5;
    transition: opacity 0.2s;
  }
  button:hover { opacity: 0.85; }
  .btn-pink { background: #FF1D6C; }
  .btn-blue { background: #2979FF; }
  .btn-amber { background: #F5A623; color: #0a0a0a; }
  .btn-violet { background: #9C27B0; }
  .btn-green { background: #00E676; color: #0a0a0a; }

  .result-box {
    margin-top: 12px;
    padding: 12px;
    background: #1a1a1a;
    border: 1px solid #222;
    border-radius: 6px;
    font-size: 0.82rem;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
    color: #ccc;
    max-height: 200px;
    overflow-y: auto;
    display: none;
  }
  .result-box.show { display: block; }

  /* Chain explorer */
  .chain-explorer {
    display: flex;
    gap: 0;
    overflow-x: auto;
    padding: 20px 0;
    align-items: center;
  }
  .block-node {
    flex-shrink: 0;
    width: 120px;
    background: #141414;
    border: 2px solid #2979FF;
    border-radius: 8px;
    padding: 12px 10px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
  }
  .block-node:hover { border-color: #FF1D6C; transform: translateY(-2px); }
  .block-node .blk-idx { font-size: 1.3rem; font-weight: 700; }
  .block-node .blk-hash { font-size: 0.6rem; color: #888; margin-top: 4px; font-family: monospace; word-break: break-all; }
  .block-node .blk-time { font-size: 0.65rem; color: #666; margin-top: 4px; }
  .chain-link {
    flex-shrink: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #2979FF, #FF1D6C);
    position: relative;
  }
  .chain-link::after {
    content: '';
    position: absolute;
    right: -4px;
    top: -4px;
    width: 0; height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid #FF1D6C;
  }

  /* Block detail modal */
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 100;
    justify-content: center;
    align-items: center;
  }
  .modal-overlay.show { display: flex; }
  .modal {
    background: #141414;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 28px;
    max-width: 520px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }
  .modal h3 { margin-bottom: 16px; font-size: 1.1rem; }
  .modal .field { margin-bottom: 10px; }
  .modal .field .flabel { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .modal .field .fvalue { font-family: monospace; font-size: 0.82rem; word-break: break-all; margin-top: 2px; color: #ddd; }
  .modal .close-btn {
    margin-top: 16px;
    padding: 8px 24px;
    background: #333;
    border: none;
    border-radius: 6px;
    color: #f5f5f5;
    cursor: pointer;
  }

  /* Merkle tree */
  .merkle-vis {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
    overflow-x: auto;
  }
  .merkle-layer {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .merkle-node {
    padding: 6px 10px;
    background: #1a1a1a;
    border: 1px solid #9C27B0;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.6rem;
    color: #bbb;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .merkle-node.root { border-color: #FF1D6C; border-width: 2px; }
  .merkle-arrow { color: #555; font-size: 0.7rem; }

  .chain-check-result {
    margin-top: 12px;
    padding: 12px;
    border-radius: 6px;
    display: none;
  }
  .chain-check-result.show { display: block; }
  .chain-check-result.valid { background: #0d2b0d; border: 1px solid #00E676; }
  .chain-check-result.invalid { background: #2b0d0d; border: 1px solid #FF1D6C; }

  footer {
    text-align: center;
    padding: 40px 0 24px;
    color: #444;
    font-size: 0.75rem;
    border-top: 1px solid #1a1a1a;
    margin-top: 40px;
  }

  @media (max-width: 600px) {
    header h1 { font-size: 1.6rem; }
    .actions { grid-template-columns: 1fr; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .block-node { width: 90px; padding: 8px 6px; }
    .block-node .blk-idx { font-size: 1rem; }
  }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>RoadChain</h1>
    <div class="tagline">Every bit verified. Every ship signed.</div>
  </header>

  <div class="stats-bar" id="statsBar">
    <div class="stat-card"><div class="label">Total Blocks</div><div class="value" id="statBlocks">--</div></div>
    <div class="stat-card"><div class="label">Chain Length</div><div class="value" id="statLength">--</div></div>
    <div class="stat-card"><div class="label">Last Block</div><div class="value" id="statLastTime" style="font-size:0.85rem">--</div></div>
    <div class="stat-card integrity"><div class="label">Integrity</div><div class="value" id="statIntegrity">--</div></div>
  </div>

  <div class="section">
    <h2>Chain Explorer</h2>
    <div class="chain-explorer" id="chainExplorer"></div>
  </div>

  <div class="actions">
    <div class="action-card">
      <h3>Add Block</h3>
      <textarea id="addDataInput" placeholder="Enter block data..."></textarea>
      <button class="btn-pink" onclick="addBlock()">Add Block</button>
      <div class="result-box" id="addResult"></div>
    </div>
    <div class="action-card">
      <h3>Verify Hash</h3>
      <input type="text" id="verifyHashInput" placeholder="Paste a SHA-256 hash..." />
      <button class="btn-blue" onclick="verifyHash()">Verify</button>
      <div class="result-box" id="verifyResult"></div>
    </div>
  </div>

  <div class="actions">
    <div class="action-card">
      <h3>Chain Integrity Check</h3>
      <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Validate every block hash and link in the chain.</p>
      <button class="btn-green" onclick="checkIntegrity()">Run Integrity Check</button>
      <div class="chain-check-result" id="integrityResult"></div>
    </div>
    <div class="action-card">
      <h3>Merkle Tree</h3>
      <p style="color:#888;font-size:0.85rem;margin-bottom:12px">Merkle root and tree visualization of the current chain.</p>
      <button class="btn-violet" onclick="loadMerkle()">Show Merkle Tree</button>
      <div id="merkleVis" class="merkle-vis" style="display:none"></div>
    </div>
  </div>

  <footer>BlackRoad OS, Inc. -- RoadChain Verification Layer</footer>
</div>

<!-- Block Detail Modal -->
<div class="modal-overlay" id="blockModal">
  <div class="modal">
    <h3 id="modalTitle">Block Detail</h3>
    <div class="field"><div class="flabel">Index</div><div class="fvalue" id="modalIndex"></div></div>
    <div class="field"><div class="flabel">Timestamp</div><div class="fvalue" id="modalTimestamp"></div></div>
    <div class="field"><div class="flabel">Data</div><div class="fvalue" id="modalData"></div></div>
    <div class="field"><div class="flabel">Hash</div><div class="fvalue" id="modalHash"></div></div>
    <div class="field"><div class="flabel">Previous Hash</div><div class="fvalue" id="modalPrevHash"></div></div>
    <div class="field"><div class="flabel">Nonce</div><div class="fvalue" id="modalNonce"></div></div>
    <button class="close-btn" onclick="closeModal()">Close</button>
  </div>
</div>

<script>
const API = '';

async function loadStats() {
  try {
    const res = await fetch(API + '/api/chain/stats');
    const data = await res.json();
    document.getElementById('statBlocks').textContent = data.totalBlocks;
    document.getElementById('statLength').textContent = data.chainLength;
    document.getElementById('statLastTime').textContent = data.lastBlockTime ? new Date(data.lastBlockTime).toLocaleTimeString() : '--';
    const el = document.getElementById('statIntegrity');
    const isValid = data.chainIntegrity === 'valid';
    el.innerHTML = '<span class="dot ' + (isValid ? 'valid' : 'invalid') + '"></span>' + data.chainIntegrity.toUpperCase();
  } catch (e) {
    console.error('Stats error', e);
  }
}

async function loadChain() {
  try {
    const res = await fetch(API + '/api/chain');
    const data = await res.json();
    const explorer = document.getElementById('chainExplorer');
    explorer.innerHTML = '';
    data.chain.forEach((block, i) => {
      if (i > 0) {
        const link = document.createElement('div');
        link.className = 'chain-link';
        explorer.appendChild(link);
      }
      const node = document.createElement('div');
      node.className = 'block-node';
      node.onclick = () => showBlock(block);
      node.innerHTML =
        '<div class="blk-idx">#' + block.index + '</div>' +
        '<div class="blk-hash">' + block.hash.slice(0, 16) + '...</div>' +
        '<div class="blk-time">' + new Date(block.timestamp).toLocaleTimeString() + '</div>';
      explorer.appendChild(node);
    });
  } catch (e) {
    console.error('Chain error', e);
  }
}

function showBlock(block) {
  document.getElementById('modalTitle').textContent = 'Block #' + block.index;
  document.getElementById('modalIndex').textContent = block.index;
  document.getElementById('modalTimestamp').textContent = block.timestamp;
  document.getElementById('modalData').textContent = block.data;
  document.getElementById('modalHash').textContent = block.hash;
  document.getElementById('modalPrevHash').textContent = block.previousHash;
  document.getElementById('modalNonce').textContent = block.nonce;
  document.getElementById('blockModal').classList.add('show');
}

function closeModal() {
  document.getElementById('blockModal').classList.remove('show');
}

document.getElementById('blockModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

async function addBlock() {
  const data = document.getElementById('addDataInput').value.trim();
  if (!data) return;
  const resultEl = document.getElementById('addResult');
  try {
    const res = await fetch(API + '/api/chain/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    const result = await res.json();
    resultEl.textContent = 'Block #' + result.block.index + ' added\\nHash: ' + result.block.hash;
    resultEl.classList.add('show');
    document.getElementById('addDataInput').value = '';
    loadStats();
    loadChain();
  } catch (e) {
    resultEl.textContent = 'Error: ' + e.message;
    resultEl.classList.add('show');
  }
}

async function verifyHash() {
  const hash = document.getElementById('verifyHashInput').value.trim();
  if (!hash) return;
  const resultEl = document.getElementById('verifyResult');
  try {
    const res = await fetch(API + '/api/chain/verify-hash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash })
    });
    const result = await res.json();
    if (result.found) {
      resultEl.textContent = 'FOUND on chain\\nBlock #' + result.block.index + '\\nData: ' + result.block.data + '\\nTimestamp: ' + result.block.timestamp;
    } else {
      resultEl.textContent = 'NOT FOUND -- This hash is not on the chain.';
    }
    resultEl.classList.add('show');
  } catch (e) {
    resultEl.textContent = 'Error: ' + e.message;
    resultEl.classList.add('show');
  }
}

async function checkIntegrity() {
  const resultEl = document.getElementById('integrityResult');
  try {
    const res = await fetch(API + '/api/chain/verify');
    const data = await res.json();
    resultEl.className = 'chain-check-result show ' + (data.valid ? 'valid' : 'invalid');
    let text = data.valid
      ? 'CHAIN VALID -- All ' + data.totalBlocks + ' blocks verified.'
      : 'CHAIN INVALID -- Integrity compromised.';
    text += '\\n\\n';
    data.blocks.forEach(b => {
      text += 'Block #' + b.index + ': hash=' + (b.hashValid ? 'OK' : 'FAIL') + ' link=' + (b.linkValid ? 'OK' : 'FAIL') + '\\n';
    });
    resultEl.textContent = text;
  } catch (e) {
    resultEl.className = 'chain-check-result show invalid';
    resultEl.textContent = 'Error: ' + e.message;
  }
}

async function loadMerkle() {
  const vis = document.getElementById('merkleVis');
  try {
    const res = await fetch(API + '/api/chain/merkle');
    const data = await res.json();
    vis.style.display = 'flex';
    vis.innerHTML = '';
    // Render from root down
    const reversed = [...data.layers].reverse();
    reversed.forEach((layer, li) => {
      if (li > 0) {
        const arrow = document.createElement('div');
        arrow.className = 'merkle-arrow';
        arrow.textContent = '|';
        vis.appendChild(arrow);
      }
      const row = document.createElement('div');
      row.className = 'merkle-layer';
      layer.forEach(hash => {
        const node = document.createElement('div');
        node.className = 'merkle-node' + (layer.length === 1 ? ' root' : '');
        node.textContent = hash.slice(0, 16) + '...';
        node.title = hash;
        row.appendChild(node);
      });
      vis.appendChild(row);
    });
  } catch (e) {
    vis.style.display = 'flex';
    vis.innerHTML = '<div style="color:#888">Error loading Merkle tree</div>';
  }
}

// Init
loadStats();
loadChain();
</script>
</body>
</html>`;
}

// --- Main handler ---
export default {
  async fetch(request, env) {
    await initChain();

    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // API routes
    if (path.startsWith('/api/')) {
      return handleAPI(path, request);
    }

    // Frontend
    return htmlResponse(renderUI());
  },
};
