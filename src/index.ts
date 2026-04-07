export interface Env { STORE: KVNamespace; DB: D1Database; SERVICE_NAME: string; VERSION: string; }
const SVC = "roadchain";
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d,null,2),{status:s,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","X-BlackRoad-Service":SVC}}); }
async function track(env: Env, req: Request, path: string) { const cf=(req as any).cf||{}; env.DB.prepare("INSERT INTO analytics(subdomain,path,country,ua,ts)VALUES(?,?,?,?,?)").bind(SVC,path,cf.country||"",req.headers.get("User-Agent")?.slice(0,150)||"",Date.now()).run().catch(()=>{}); }

async function sha256(s: string): Promise<string> {
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function getHead(env: Env): Promise<any|null> {
  const raw=await env.STORE.get("chain:head");if(!raw)return null;
  return JSON.parse(raw);
}
async function append(env: Env, data: any, author: string, event_type: string): Promise<any> {
  const head=await getHead(env);
  const index=(head?.index??-1)+1;
  const prev_hash=head?.hash??"0000000000000000000000000000000000000000000000000000000000000000";
  const ts=Date.now();const nonce=crypto.randomUUID();
  const payload=`${index}:${prev_hash}:${ts}:${nonce}:${JSON.stringify(data)}`;
  const hash=await sha256(payload);
  const block={index,prev_hash,hash,data,author,event_type,ts,nonce};
  await env.STORE.put(`chain:block:${index}`,JSON.stringify(block));
  await env.STORE.put("chain:head",JSON.stringify(block));
  await env.STORE.put("chain:count",String(index+1));
  return block;
}

function page(): Response {
  const html=`<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RoadChain — BlackRoad Ledger</title>
<meta name="description" content="RoadChain — append-only audit ledger with SHA-256 hash chain. Immutable record of every event in BlackRoad OS.">
<link rel="canonical" href="https://roadchain.blackroad.io/">
<meta property="og:title" content="RoadChain — BlackRoad Ledger">
<meta property="og:description" content="Append-only audit ledger with SHA-256 hash chain. Immutable records for BlackRoad OS.">
<meta property="og:url" content="https://roadchain.blackroad.io/">
<meta property="og:type" content="website">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"RoadChain","url":"https://roadchain.blackroad.io/","description":"Append-only audit ledger with SHA-256 hash chain","applicationCategory":"DeveloperApplication","publisher":{"@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io"}}</script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#030303;--card:#0a0a0a;--border:#111;--text:#f0f0f0;--sub:#444;--purple:#7800FF;--grad:linear-gradient(135deg,#7800FF,#3E84FF)}
html,body{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif}
.grad-bar{height:2px;background:var(--grad)}
.wrap{max-width:1000px;margin:0 auto;padding:32px 20px}
h1{font-size:2rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.sub{font-size:.75rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-bottom:24px}
.stats{display:flex;gap:12px;margin-bottom:24px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px;flex:1;text-align:center}
.stat-n{font-size:1.6rem;font-weight:700;color:var(--purple)}
.stat-l{font-size:.65rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-top:3px}
.append-form{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:20px}
.ct{font-size:.65rem;color:var(--sub);text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace;margin-bottom:12px}
.form-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
input,select{width:100%;padding:8px 12px;background:#0d0d0d;border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:.78rem;outline:none}
input:focus{border-color:var(--purple)}
.btn{padding:9px 20px;background:var(--purple);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:.82rem}
.chain{display:flex;flex-direction:column;gap:8px}
.block{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px;position:relative}
.block::before{content:'';position:absolute;left:20px;top:-8px;width:2px;height:8px;background:var(--border)}
.block:first-child::before{display:none}
.block-header{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.block-index{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--purple);background:rgba(156,39,176,.1);border:1px solid rgba(156,39,176,.2);padding:2px 8px;border-radius:4px}
.block-type{font-family:'JetBrains Mono',monospace;font-size:.68rem;color:var(--sub);text-transform:uppercase}
.block-author{font-size:.75rem;font-weight:600}
.block-hash{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:#222;margin-top:6px}
.block-data{font-size:.75rem;color:var(--sub);margin-top:4px;font-family:'JetBrains Mono',monospace}
.block-ts{font-size:.65rem;color:#333;font-family:'JetBrains Mono',monospace;margin-left:auto}
</style></head><body>
<div class="grad-bar"></div>
<div class="wrap">
<h1>RoadChain</h1>
<div class="sub">roadchain.blackroad.io · append-only audit ledger · SHA-256 hash chain</div>
<div class="stats">
  <div class="stat"><div class="stat-n" id="s-blocks">0</div><div class="stat-l">blocks</div></div>
  <div class="stat"><div class="stat-n" id="s-head" style="font-size:1rem;word-break:break-all">genesis</div><div class="stat-l">head hash</div></div>
</div>
<div class="append-form">
  <div class="ct">Append Block</div>
  <div class="form-row">
    <input type="text" id="b-author" placeholder="Author (e.g. alexa, roadie)">
    <input type="text" id="b-type" placeholder="Event type (e.g. deploy, codex_entry)">
    <input type="text" id="b-data" placeholder="Data / note">
  </div>
  <button class="btn" onclick="appendBlock()">Append to Chain</button>
</div>
<div class="ct">Recent Blocks</div>
<div class="chain" id="chain">Loading...</div>
</div>
<script src="https://cdn.blackroad.io/br.js"></script>
<script>
async function appendBlock(){
  var author=document.getElementById('b-author').value.trim()||'anonymous';
  var type=document.getElementById('b-type').value.trim()||'event';
  var data=document.getElementById('b-data').value.trim()||'{}';
  await fetch('/api/blocks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:{note:data},author,event_type:type})});
  document.getElementById('b-data').value='';
  loadChain();
}
async function loadChain(){
  var r=await fetch('/api/blocks?limit=20');var d=await r.json();
  document.getElementById('s-blocks').textContent=d.head_index!==undefined?d.head_index+1:0;
  if(d.blocks?.length)document.getElementById('s-head').textContent=(d.blocks[0].hash||'').slice(0,16)+'...';
  var chain=document.getElementById('chain');
  if(!d.blocks?.length){chain.innerHTML='<div style="color:var(--sub);font-size:.8rem;padding:16px">No blocks yet — append the first one above.</div>';return;}
  chain.innerHTML=d.blocks.map(function(b){return'<div class="block"><div class="block-header"><span class="block-index">#'+b.index+'</span><span class="block-type">'+b.event_type+'</span><span class="block-author">'+b.author+'</span><span class="block-ts">'+new Date(b.ts).toLocaleTimeString()+'</span></div><div class="block-data">'+JSON.stringify(b.data||{})+'</div><div class="block-hash">'+b.hash+'</div></div>';}).join('');
}
loadChain();
</script>
</body></html>`;
  return new Response(html,{headers:{"Content-Type":"text/html;charset=UTF-8"}});
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*"}});
    const url=new URL(req.url);const path=url.pathname;
    track(env,req,path);
    if(path==="/health")return json({service:SVC,status:"ok",version:env.VERSION,ts:Date.now()});
    if(path==="/api/blocks"&&req.method==="POST"){
      const b=await req.json() as any;
      const block=await append(env,b.data||{},b.author||"anonymous",b.event_type||"event");
      return json({ok:true,block_index:block.index,hash:block.hash});
    }
    if(path==="/api/blocks"&&req.method==="GET"){
      const limit=Math.min(parseInt(url.searchParams.get("limit")||"20"),100);
      const countRaw=await env.STORE.get("chain:count");
      const count=parseInt(countRaw||"0");
      const blocks=[];
      for(let i=count-1;i>=Math.max(0,count-limit);i--){
        const raw=await env.STORE.get(`chain:block:${i}`);
        if(raw)blocks.push(JSON.parse(raw));
      }
      return json({blocks,head_index:count-1,count});
    }
    if(path==="/api/head"){const head=await getHead(env);return json(head||{note:"Empty chain"});}
    if(path==="/api/verify"){
      const countRaw=await env.STORE.get("chain:count");
      const count=parseInt(countRaw||"0");
      const errors=[];
      for(let i=1;i<count;i++){
        const raw=await env.STORE.get(`chain:block:${i}`);
        if(!raw){errors.push(`Block ${i} missing`);continue;}
        const b=JSON.parse(raw);
        const prevRaw=await env.STORE.get(`chain:block:${i-1}`);
        if(prevRaw){const prev=JSON.parse(prevRaw);if(b.prev_hash!==prev.hash)errors.push(`Block ${i} hash mismatch`);}
      }
      return json({valid:errors.length===0,blocks_checked:count,errors});
    }
    return page();
  }
};
