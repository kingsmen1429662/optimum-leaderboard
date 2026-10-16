# Optimum Discord Activity — Pixel Rey

Is package mein aapki site ka GitHub Pages version hai: uploaded Optimum logo, top par bada “Site designed by Pixel Rey”, username/ID search, MEE6 messages/XP/level/rank, aur successful search par flowers.

## Pehle ye samjho

- `index.html` self-contained hai: CSS, JavaScript aur logo isi file mein hain.
- GitHub Pages static HTML host karega. Live MEE6 data ke liye `backend/` ka Cloudflare Worker deploy karna hai.
- Sirf HTML upload karne par layout aur dated preview dikhega. Live search tabhi chalegi jab backend connect hoga.
- Preview 14 October 2026, 17:55:02 UTC ka saved first-100 snapshot hai. Ye current data nahi hai.
- Aapki pehle se bani ChatGPT Site ko change nahi kiya gaya. Uska private backend is export mein use nahi hota.

## Files

| File | Kaam |
| --- | --- |
| index.html | GitHub Pages website; logo embedded hai |
| backend/worker.js | Public, read-only MEE6 data service |
| backend/wrangler.jsonc | Cloudflare deployment configuration |
| backend/package.json | Deployment dependency aur command |
| .nojekyll | Static files ke liye marker |
| README.md | Ye guide |

## Step 1 — ZIP extract karo

ZIP ko download karke Windows mein right-click → Extract All karo. Extracted folder kholo. GitHub mein ZIP file upload mat karna; uske andar ke files aur backend folder upload karna.

## Step 2 — GitHub repository banao

1. https://github.com par sign in karo.
2. “+” → “New repository” kholo.
3. Repository name: `optimum-leaderboard`.
4. Public select karo. Ye shareable public website banane ka setup hai.
5. “Create repository” dabao.
6. Empty repository mein “uploading an existing file”, ya Add file → Upload files kholo.
7. `index.html`, `README.md`, `.nojekyll` (agar file picker mein visible ho) aur poora `backend` folder drag karo.
8. “Commit changes” dabao.
9. Check: `index.html` directly repository root mein ho, kisi extra Optimum-GitHub folder ke andar nahi.

## Step 3 — Apna GitHub origin set karo

1. GitHub par `backend/worker.js` kholo aur pencil/Edit dabao.
2. Shuru ki ye line badlo:

```js
const ALLOWED_ORIGIN = "https://YOUR_GITHUB_USERNAME.github.io";
```

Example ONLY: agar aapka actual GitHub username `pixelrey` hai:

```js
const ALLOWED_ORIGIN = "https://pixelrey.github.io";
```

`/optimum-leaderboard/` is value mein MAT lagana. Origin sirf protocol + domain hota hai. Koi trailing slash bhi nahi. Apna asli GitHub username use karo, X/Discord username nahi.

3. Commit changes karo.

## Step 4 — Live backend Cloudflare par deploy karo

1. https://dash.cloudflare.com par account banao ya sign in karo.
2. Workers & Pages → Create application kholo.
3. Apna existing GitHub repository import karne ka option choose karo.
4. GitHub connect karo aur `optimum-leaderboard` repo select karo.
5. Build/deploy settings mein ye values rakho (labels thode alag ho sakte hain):

| Setting | Value |
| --- | --- |
| Worker/project name | optimum-api |
| Production branch | main |
| Root directory | backend |
| Build command | Khali chhodo; build step nahi hai |
| Deploy command | npx wrangler deploy |

6. Deploy dabao. `backend/package.json` se Wrangler dependency install hogi; `backend/wrangler.jsonc` Worker ko configure karega.
7. Deployment complete hone par exact `https://...workers.dev` URL copy karo.
8. Us URL ke aage `/api/leaderboard?page=0` lagakar browser mein kholo.
9. Sahi setup mein JSON dikhega: `players`, `messages`, `rank`, `snapshot:false`.

Agar Worker name conflict ho, Cloudflare project name aur `backend/wrangler.jsonc` ka `name` ek hi unique naam karo. Account/provider ki quotas aur billing terms apply hoti hain; is package mein paid service automatically activate nahi hoti.

## Step 5 — HTML ko backend se connect karo

1. GitHub mein `index.html` kholo → Edit.
2. Find/Search se `const OPTIMUM_API_BASE` dhoondo.
3. Empty value ko exact Worker origin se replace karo:

```js
const OPTIMUM_API_BASE = "https://YOUR-ACTUAL-WORKER.YOUR-SUBDOMAIN.workers.dev";
```

Ye example address hai, working address nahi. Apna copied Cloudflare URL lagana. `/api/leaderboard` ya query string yahan mat lagana.

4. Commit changes karo.
5. Koi password, Discord token, ChatGPT token ya API secret HTML mein nahi daalna. Is setup ko unki zaroorat nahi hai.

## Step 6 — GitHub Pages enable karo

1. Repository → Settings → Pages kholo.
2. Build and deployment → Source: Deploy from a branch.
3. Branch: `main`.
4. Folder: `/ (root)`.
5. Save dabao. GitHub deployment finish hone do.
6. Pages settings mein jo actual published URL aaye, wahi kholo. Pattern aam taur par `https://YOUR_GITHUB_USERNAME.github.io/optimum-leaderboard/` hoga.

## Step 7 — Check aur share karo

1. Website kholo; zarurat ho toh Ctrl + Shift + R dabao.
2. “MEE6 connected” aur recent data time check karo. “Setup required · Preview” ka matlab backend URL abhi empty hai.
3. `goldenboyvee` search karke Find member dabao. Current rank/message details khulni chahiye aur flowers aane chahiye.
4. Apna exact Discord username ya numeric user ID search karo. Server nickname alag ho sakta hai.
5. Search 2,000 further members tak ek batch mein check karti hai. Member na mile aur source khatam na hua ho toh Find member dobara dabao: search aage continue hogi.
6. Page ko incognito mein test karo, phir GitHub Pages URL tweet/share karo.

## Agar problem aaye

- **404:** index.html repository root mein hai? Pages main + /(root) par set hai? GitHub Actions/Pages deployment successful hai?
- **Preview only:** index.html mein OPTIMUM_API_BASE set karo; filename index.html.txt nahi hona chahiye.
- **Failed to fetch / CORS:** backend/worker.js mein ALLOWED_ORIGIN actual GitHub Pages origin se match karo. Commit ke baad Cloudflare redeploy finish hone do.
- **Worker JSON kaam karta hai, site nahi:** OPTIMUM_API_BASE aur ALLOWED_ORIGIN dono check karo. Normal GitHub file page nahi, published github.io URL kholo.
- **429:** MEE6 request limit aayi hai; wait karke retry karo. Repeated Refresh mat dabao.
- **Username nahi mila:** actual Discord username/ID use karo; server nickname ya X handle nahi. Search ko next batch tak continue karo. MEE6 leaderboard mein record na ho toh site bhi record nahi dikha sakti.
- **Flowers nahi chal rahe:** successful exact search ke baad aate hain. Reduced-motion setting on ho toh short static flowers dikhte hain.
- **Numbers ka meaning:** message count MEE6 ka reported count hai; rank XP-based hai. Ye har message ever sent ka independently verified count ya daily progress chart nahi hai.
- **Custom domain:** future mein custom domain lagao toh ALLOWED_ORIGIN us naye origin par update karo.

## Verification and limits

HTML scripts ki syntax, saved preview, API response shape, page-rank calculation, allowed/disallowed CORS origins aur failure handling locally check ki gayi. Aapke GitHub/Cloudflare accounts par deployment is package ke saath automatically nahi kiya gaya. Browser visual QA is export ke liye nahi chali. MEE6 ka public endpoint third-party service hai; availability/response format badal sakta hai.

## Official setup references

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- GitHub publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Cloudflare dashboard deployment: https://developers.cloudflare.com/workers/get-started/dashboard/

Unofficial community tool. Site designed by Pixel Rey. Optimum logo remains its owner's asset; use does not imply official endorsement.
