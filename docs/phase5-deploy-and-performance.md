# Phase 5 — Deploy & Performance

## A. Deploy to Vercel (static site)

The repo is a plain static site. `vercel.json` (in the project root) already configures
cache headers and the USDZ/GLB MIME types.

1. **Push to GitHub** — commit everything (the `public/` assets included) to a repo.
2. **Vercel → Add New… → Project → Import** the repo.
3. **Framework preset: "Other"** (no framework). Leave **Build command empty** and
   **Output directory empty** — Vercel serves the repo root as static files. Deploy.
   (You can also deploy from the CLI: `npm i -g vercel && vercel --prod` from the repo root.)
4. **Custom subdomain** `dinamo-ar.seudominio.com`:
   - Vercel side: Project → Settings → **Domains** → add `dinamo-ar.seudominio.com`.
   - DNS side: at your registrar, add the record Vercel shows — usually a **CNAME**
     `dinamo-ar` → `cname.vercel-dns.com`.
   - Vercel auto-provisions the TLS certificate once DNS resolves.
5. **Verify HTTPS** — the padlock must be green. **Camera/AR only work over HTTPS.** No
   mixed-content warnings (all assets are same-origin or HTTPS CDN, so this should be clean).
6. **Updates** — push to the connected branch; Vercel rebuilds and deploys automatically.
   Every push also gets its own **preview URL** — handy for testing before promoting to prod.

### MIME types
Vercel serves common types correctly, but `.usdz` is not guaranteed — `vercel.json` pins it
to `model/vnd.usdz+zip` (and GLB to `model/gltf-binary`) so iOS Quick Look accepts the file.
After deploy, verify:

```bash
curl -I https://dinamo-ar.seudominio.com/public/pergola-dinamo.usdz
# expect: content-type: model/vnd.usdz+zip
curl -I https://dinamo-ar.seudominio.com/public/pergola-dinamo.glb
# expect: content-type: model/gltf-binary
```

---

## B. Performance verification

### Realistic Lighthouse target
A WebAR page with a ~4 MB GLB will **not** score 95+ on mobile — the model dominates
transfer. **Realistic: 75–90 mobile performance. Acceptable minimum: 70.** Don't chase
100; the model is the product. What matters is **time-to-interactive on the page chrome**
(should be fast — the poster shows immediately) and **total transfer**.

### Metrics to check
| Metric | Target | Notes |
|---|---|---|
| Total transfer | < 6 MB | GLB + model-viewer JS (~0.3 MB gz) + page |
| LCP (poster) | < 2.5 s | The poster image is the LCP element — keep it < 80 KB |
| Time to interactive | < 3.5 s on 4G | Page is usable (poster + button) before GLB finishes |
| GLB download | < 4 s on Fast 3G/Slow 4G | Drives the "feels slow" perception |

### How to test throttled 4G (Chrome DevTools)
1. DevTools → **Network** tab → throttling dropdown → **"Slow 4G"** (or create a custom
   profile: 4 Mbps down / 3 Mbps up / 60 ms RTT).
2. **Performance** or **Lighthouse** tab → device **Mobile** → run.
3. Also test **"Fast 3G"** as a worst-case for rural Brazil mobile.
4. Hard-reload with cache disabled (DevTools open → "Disable cache").

### Optimizations, highest impact first
| Optimization | Expected gain | Effort |
|---|---|---|
| **Draco compression on GLB** | 40–70% smaller geometry | Already in export settings (Phase 1) |
| **Texture resolution 2K → 1K** | Often 1–3 MB off the GLB | Re-bake; biggest easy win if over budget |
| **WebP/JPEG for base-color maps** | 30–50% vs PNG | Set in Blender export "Images: JPEG" for color maps |
| **`preload` the GLB** | LCP/interactive sooner | Already in `index.html` (`<link rel="preload">`) |
| **Brotli compression (CDN)** | ~5–15% on text assets | Vercel does this automatically; GLB is already binary-compressed so little gain there |
| **Lazy non-critical assets** | Minor | The page is already minimal — little to lazy-load |
| **`loading="eager"` + poster** | Perceived speed | Already set — poster shows instantly |

**Order of operations if the score is bad:** (1) confirm Draco is on, (2) drop textures to
1K, (3) switch color maps to JPEG/WebP, (4) confirm the poster is < 80 KB. Those four fix
~95% of WebAR perf problems. Geometry rarely needs attention if poly count is under 15k.
