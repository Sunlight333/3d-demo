# Pérgola Dinamo — WebAR Demo

A mobile-first WebAR product demo built with Google's [`<model-viewer>`](https://modelviewer.dev/).
Visitors view the **Pérgola Dinamo** in 3D and place it in their own space via AR
(Quick Look on iOS, Scene Viewer on Android).

## Project structure

```text
.
├── index.html              # The page (loaded as the site root)
├── src/
│   ├── style.css           # All styling (mobile-first, one accent color)
│   ├── app.js              # Loading / error / AR-status logic, instructions modal
│   └── variants.js         # Phase 4: wood/fabric swatch switching
├── docs/                   # Phase 1 & 5–8 guides (modeling, deploy, testing, client msgs)
├── public/
│   ├── pergola-poster.jpg  # Hero poster shown before the GLB loads (real photo)
│   ├── pergola-01.jpg      # Product gallery photo
│   ├── pergola-02.jpg      # Product gallery photo
│   ├── pergola-dinamo.glb  # 3D model for Android + desktop 3D view  (DROP IN)
│   ├── pergola-dinamo.usdz # 3D model for iOS Quick Look             (DROP IN)
│   └── store-logo.svg      # Optional store logo
├── vercel.json             # Deploy + cache + MIME config (Vercel)
├── .gitignore
└── LICENSE
```

> The two files marked **DROP IN** (the `.glb` / `.usdz` 3D models) aren't here yet.
> Until the `.glb` exists, the hero shows the real **product photo** poster and the page
> still works as a product page — drop in the models when ready, no code changes needed.

## Run locally

It's a plain static site — no build step. Serve it over HTTP (not `file://`, or the
model won't load and AR is blocked):

```bash
# Any one of these from the project root:
npx serve .
# or
python -m http.server 8080
```

Then open the printed URL on your computer, or on your phone using your machine's LAN IP
(e.g. `http://192.168.0.10:8080`). **AR requires HTTPS on a real domain** — local HTTP is
fine for layout/3D testing but Scene Viewer / Quick Look need the deployed HTTPS URL.

## Deploy (Vercel)

Push to GitHub and import the repo in Vercel. Settings:

- **Framework preset:** Other
- **Build command:** _(none)_
- **Output directory:** _(none — serves the repo root)_

`vercel.json` already sets long-cache headers for `/public/*` and the correct
`model/vnd.usdz+zip` MIME type for `.usdz`. See [docs/phase5-deploy-and-performance.md](docs/phase5-deploy-and-performance.md)
for the full deploy walkthrough (custom domain, HTTPS, MIME verification).

## Replacing the placeholder model

1. Export the GLB from Blender (Y-up, meters, Draco compression, baked PBR, < 5 MB).
2. Convert to USDZ for iOS (Reality Converter on Mac, or an online converter).
3. Drop both plus a `pergola-poster.webp` into `public/`.
4. Remove the `data-placeholder` attribute logic note in `app.js` if present.

No code changes needed — the `<model-viewer>` `src` / `ios-src` already point at those paths.
