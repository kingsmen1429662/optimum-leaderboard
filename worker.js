// Replace ONLY the GitHub username below. No trailing slash or repository path.
// This public read-only service returns Optimum MEE6 leaderboard data only.
const ALLOWED_ORIGIN = "https://YOUR_GITHUB_USERNAME.github.io";
const GUILD_ID = "1354818163879182519";
const recentPages = new Map();

export default {
 async fetch(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const headers = {"Content-Type":"application/json; charset=utf-8", "Vary":"Origin", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff"};
  if (origin === ALLOWED_ORIGIN) headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
  const reply = (data,status=200) => new Response(JSON.stringify(data),{status,headers});
  if (origin && origin !== ALLOWED_ORIGIN) return reply({error:"Origin not allowed. Set ALLOWED_ORIGIN to your GitHub Pages origin in backend/worker.js."},403);
  if (request.method === "OPTIONS") return new Response(null,{status:204,headers:{...headers,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Max-Age":"600"}});
  if (request.method !== "GET") return reply({error:"Only GET is supported."},405);
  if (url.pathname === "/") return reply({service:"Optimum MEE6 API",next:"/api/leaderboard?page=0"});
  if (url.pathname !== "/api/leaderboard") return reply({error:"Not found"},404);
  const raw = url.searchParams.get("page") || "0";
  if (!/^\d{1,4}$/.test(raw)) return reply({error:"Invalid page"},400);
  const page = Number(raw);
  const hit = recentPages.get(page);
  if (hit && Date.now()-hit.savedAt < 60000) return reply(hit.data);
  try {
   const upstream = await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/${GUILD_ID}?page=${page}`,{headers:{"Accept":"application/json"},signal:AbortSignal.timeout(15000)});
   if (!upstream.ok) return reply({error:upstream.status===429?"MEE6 rate limit reached. Wait a minute and retry.":"MEE6 is unavailable. Retry later."},upstream.status===429?429:502);
   const source = await upstream.json();
   if (!Array.isArray(source.players)) throw Error("Invalid data");
   const players=source.players.map((p,i)=>{
    if(!/^\d+$/.test(p.id)||typeof p.username!=="string"||![p.message_count,p.xp,p.level].every(Number.isFinite))throw Error("Invalid player");
    return {id:p.id,username:p.username,messages:p.message_count,xp:p.xp,level:p.level,rank:page*100+i+1};
   });
   const data={players,fetchedAt:new Date().toISOString(),snapshot:false};
   if(recentPages.size>=100)recentPages.delete(recentPages.keys().next().value);
   recentPages.set(page,{savedAt:Date.now(),data});
   return reply(data);
  } catch {
   return reply({error:"Cannot load MEE6 data right now. Please retry."},502);
  }
 }
};
