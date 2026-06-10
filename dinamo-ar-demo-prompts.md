# Prompt Playbook — Pérgola Dinamo WebAR Demo

A sequenced set of prompts for building a WebAR product visualization demo with `<model-viewer>`. Designed to be pasted into Claude (Claude.ai chat or Claude Code in the terminal) in order. Each prompt is self-contained — you can skip a phase if you don't need it.

---

## How to use this document

1. Read the **Prerequisites** section first. Some inputs are human work (photos, dimensions, 3D modeling) — Claude can't do them for you.
2. Work through phases in order. Each prompt assumes the previous phase is done.
3. Copy a prompt as-is, fill in the bracketed `[placeholders]`, and paste it into your Claude session.
4. After running each prompt, review the output before moving on. If something looks wrong, ask Claude to revise that step rather than continuing.

**Claude Code vs Claude.ai chat:** For prompts that create files or run commands (Phases 2, 3, 4, 5), Claude Code is faster because it edits files directly in your project folder. Install at https://www.npmjs.com/package/@anthropic-ai/claude-code. For consultation prompts (Phase 1 modeling advice, Phase 6 debugging, Phase 8 communication), the chat interface is fine.

---

## Prerequisites checklist

Before starting any prompt, gather:

- [ ] Photos of the Dinamo pergola from at least 3 angles (front, side, top if possible)
- [ ] Real dimensions: width, depth, height, beam thickness
- [ ] Color and material specs: wood type/finish, fabric color
- [ ] Any existing 3D file from the manufacturer (CAD, SketchUp, Rhino, GLB, OBJ) — saves 4–8 hours of modeling
- [ ] Brand info for the store: name, primary color, logo if available
- [ ] Node.js installed (needed for Phase 5 deployment)
- [ ] One iPhone and one Android phone for testing
- [ ] An empty folder on your machine for the project

---

## Phase 1 — 3D Model Strategy

You will model the pergola in Blender yourself. Claude can't run Blender, but it can advise on approach, settings, and troubleshooting.

### Prompt 1.1 — Modeling approach consultation

```
I'm modeling a pergola in Blender for a WebAR product demo. Materials I have:

- Photos: [list angles, e.g. "front, left side, three-quarter view, close-up of beam joints"]
- Dimensions: [width × depth × height in meters, beam thickness in cm]
- Material spec: [e.g. "dark stained wood beams, beige polyester fabric canopy"]
- Existing 3D file: [yes/no, format if yes]
- Time budget: [hours I can spend on modeling]

The final GLB needs to be under 5 MB so it loads fast on 4G mobile.

Recommend:
1. Which Blender primitives to start from (cube extrusion vs curve-based, etc.)
2. Modifier strategy to keep poly count low while preserving silhouette
3. What level of detail to include vs simplify (e.g. should bolt heads be modeled or just texture-baked?)
4. UV unwrapping approach for the wood grain to look continuous across beams
5. Whether to model the fabric canopy as a flat plane or with subtle catenary curve

Give me concrete numbers (target poly count, texture resolution) not just principles.
```

### Prompt 1.2 — Texture and material setup

```
I'm texturing the pergola in Blender for WebAR. Output is GLB with baked PBR materials. The model will be viewed on phones at 1–3 meters distance in real environments with varied lighting.

I want to use free PBR textures from Polyhaven. Recommend:

1. Specific Polyhaven texture sets that match [wood type, e.g. "dark teak"] and [fabric type, e.g. "off-white outdoor canvas"] — give exact texture names if you know them
2. Which texture maps to use (base color, normal, roughness, metallic, ambient occlusion) and which to skip for file-size reasons
3. Resolution to download (1K vs 2K vs 4K) given the 5 MB GLB ceiling
4. Principled BSDF node setup for the wood (any specific roughness/specular values)
5. Principled BSDF setup for the fabric (subsurface? translucency for backlight?)
6. Whether to bake lighting into textures or leave model-viewer to handle lighting at runtime

Mobile WebAR viewers have weak GPUs. Err toward simplification.
```

### Prompt 1.3 — Export settings

```
I'm exporting a pergola from Blender to GLB for Google's <model-viewer> in WebAR. Give me the exact Blender export settings (File → Export → glTF 2.0) that produce a file that:

- Works in model-viewer's AR mode on both iOS Quick Look and Android Scene Viewer
- Stays under 5 MB
- Includes baked PBR textures inside the GLB (single-file output)
- Has correct orientation (Y-up, not Z-up — model-viewer expects Y-up)
- Has correct scale in meters (1 Blender unit = 1 meter)
- Includes Draco mesh compression for size reduction

For each export option, tell me the value and a one-line reason. After export, give me a checklist of things to verify in the file before using it (using https://gltf.report or model-viewer's own editor).
```

### Prompt 1.4 — GLB to USDZ conversion

```
I have a GLB exported from Blender. For iOS WebAR via Apple Quick Look, I need a USDZ version. I'm on [macOS / Windows / Linux].

Walk me through the conversion preserving textures and materials. Cover:

1. Primary method for my OS (Reality Converter on Mac, Apple's command-line `usdzconvert` if I have Xcode, online converters as fallback)
2. Exact commands or click sequence
3. Common conversion issues: textures missing, scale wrong, normals flipped — how to diagnose each
4. How to validate the USDZ before deploying (free preview tools, AR Quick Look on a real iPhone)

If a particular conversion path is known to drop features (e.g. emission, variants), tell me that upfront so I plan around it.
```

---

## Phase 2 — Project Setup

### Prompt 2.1 — Project scaffolding

```
Create a minimal project structure for a WebAR product demo using <model-viewer>. Deployable as a static site to Netlify or Vercel free tier.

Requirements:
- Folder layout: /public for assets (GLB, USDZ, images), /src for HTML/CSS/JS
- No build step for now — plain HTML/CSS/JS — but structured so I can add Vite + React later without restructuring
- Latest stable model-viewer from a CDN (pin the version, don't use @latest)
- README.md with: project description, how to run locally, how to deploy
- .gitignore covering node_modules, .env, .DS_Store, common editor folders
- LICENSE file (MIT placeholder, I'll replace)

Output the full file tree first, then the contents of each file. Use semantic HTML and modern CSS (custom properties, flexbox/grid). No frameworks yet.
```

### Prompt 2.2 — Asset wiring

```
I have these assets ready to drop into the project:

- pergola-dinamo.glb — [actual file size, e.g. "4.2 MB"]
- pergola-dinamo.usdz — [size]
- pergola-poster.webp — a still preview at 1024×768 to show before the GLB loads, [size]
- store-logo.svg — optional, small

Tell me where each goes in the project structure from Prompt 2.1, and write the <model-viewer> tag with all attributes wired correctly:
- src and ios-src pointing to the right files via relative paths
- poster for the preview image
- alt text for accessibility
- ar, ar-modes, ar-scale, camera-controls, auto-rotate set appropriately for a product demo
- loading and reveal strategies that feel snappy on mobile

Comment each attribute so I understand what it does.
```

---

## Phase 3 — WebAR Page

### Prompt 3.1 — Core AR page

```
Build the main HTML/CSS/JS for the WebAR pergola demo. Single page, mobile-first.

Layout (top to bottom):
1. Brand header — store name "[store name]", neutral typography, no clutter
2. Hero section — the 3D model fills most of the screen, draggable to rotate
3. Product info card — product name "Pérgola Dinamo", dimensions, materials, one-line description
4. Big primary button: "Ver no meu ambiente" (Portuguese — store is Brazilian)
5. Subtle footer with "How to use" link

Behavior:
- Tapping the primary button launches AR (Quick Look on iOS, Scene Viewer on Android)
- Page loads with poster image visible immediately, GLB loads in background
- Subtle auto-rotate on the 3D model before user interacts
- Camera permission expectation is set BEFORE the AR button — a short line of text near the button: "Vamos pedir acesso à câmera para mostrar a pérgola no seu espaço."

Style:
- Confident, restrained — this is a high-end outdoor product, not a discount banner
- One accent color (neutral, e.g. warm dark green or terracotta), the rest neutral
- System font stack, no web fonts to load
- No animations beyond model auto-rotate and a soft fade-in

Output index.html, style.css, app.js as separate files. Comment any non-obvious code.
```

### Prompt 3.2 — Instructions overlay

```
Add a first-time instructions modal to the WebAR pergola demo (built in Prompt 3.1).

Trigger: When the user taps the AR button for the first time on this device.

Modal content (in Brazilian Portuguese):
1. Title: "Como usar"
2. Three short steps with simple SVG icons:
   - Step 1: "Permita o acesso à câmera quando solicitado"
   - Step 2: "Aponte para o chão onde quer instalar a pérgola"
   - Step 3: "Toque na tela para posicionar"
3. Primary button: "Entendi, começar"
4. Secondary text link: "Não mostrar novamente"

Behavior:
- Use localStorage to remember if the user dismissed it permanently
- Always keep a small "?" help icon in the corner that re-opens the modal regardless of dismissal
- Modal blocks AR launch until user taps "Entendi, começar"
- Modal is dismissible with Escape key on desktop, swipe-down or tap-outside on mobile

Provide the HTML, CSS, and JS additions to the existing files. The SVG icons should be inline, simple, monochromatic — no emoji.
```

### Prompt 3.3 — Loading and error states

```
Add robust loading and error handling to the WebAR pergola demo.

Loading states:
- Show the poster image immediately
- Display a progress indicator under the model area while GLB downloads (use model-viewer's progress event)
- Replace progress with the live 3D model when ready
- Text in Brazilian Portuguese: "Carregando a Pérgola Dinamo..." then dismiss

Error states (each with friendly Portuguese text + retry where applicable):
1. GLB fails to load → "Não conseguimos carregar o modelo. Tente novamente." + retry button
2. Device doesn't support AR → "Seu dispositivo não suporta AR no navegador. Funciona em iPhone (iOS 12+) e Android com ARCore." + link to a compatibility check page
3. Camera permission denied → "Para ver no seu ambiente, precisamos da câmera. Permita o acesso nas configurações do navegador." + step-by-step for iOS Safari and Chrome Android
4. AR session crashes mid-use → "Algo deu errado. Vamos tentar de novo." + restart button

Output the event handler code (listening to model-viewer's events: load, error, ar-status) and the HTML/CSS for each state.
```

---

## Phase 4 — Variant Switching (optional)

Skip this phase if the demo is showing one configuration only. Add it if the client wants to test color/material switching.

### Prompt 4.1 — Color and material variants

```
The Dinamo comes in [N] wood finishes and [M] fabric colors. Total combinations: [N×M].

Two implementation options:
A) Multiple GLB files, one per combination — simple, but multiplies download size
B) One GLB with KHR_materials_variants extension — lighter, but more setup

For a demo where reliability matters more than perfect file size, recommend the right approach and implement it. Constraints:
- Variant switching must work in regular 3D view
- In AR mode on iOS Quick Look, variants likely won't work (document this honestly in code comments)
- Total page weight including all variants should stay under 12 MB

Add a UI panel below the model:
- Section "Madeira": [N] small color swatches as buttons
- Section "Tecido": [M] small color swatches as buttons
- Currently selected swatch has a visible outline
- Switching is instant in 3D view, no reload

Output the new HTML/CSS/JS and, if going with option B, a brief note on how to author the variants in Blender (or recommend a tool).
```

---

## Phase 5 — Hosting and Deployment

### Prompt 5.1 — Deploy to Netlify

```
Deploy the WebAR pergola demo to Netlify. I have a free Netlify account, project is in a Git repo on GitHub.

Walk me through:
1. Connecting the GitHub repo to Netlify via the web UI
2. Build settings (since it's static, base directory and publish directory only)
3. Setting up a custom subdomain like dinamo-ar.[mydomain].com — both Netlify-side and DNS-side
4. Verifying HTTPS is active (required for camera access)
5. How to push updates and see them live

Also give me the contents of:
- netlify.toml (build config + cache headers: long cache for /public/* assets, short cache for HTML)
- _headers file if needed for MIME types (GLB and USDZ may need explicit Content-Type)

Confirm whether Netlify serves .usdz with the correct MIME type by default. If not, give me the override.
```

### Prompt 5.2 — Performance verification

```
The demo is deployed at [URL]. Help me verify it performs well on mobile.

Run through:
1. What Lighthouse mobile performance score is realistic for a WebAR page with a 4 MB GLB? What's an acceptable minimum?
2. Specific metrics to check: total transfer size, time-to-interactive, largest contentful paint
3. How to test on throttled 4G from Chrome DevTools, including the exact throttle profile to use
4. If results are bad, an ordered list of optimizations from highest impact to lowest:
   - Draco compression on GLB
   - Texture resolution reduction
   - Lazy loading of non-critical assets
   - Preconnect / preload hints for the GLB
   - CDN-level compression (Brotli)
   - Anything else relevant

For each optimization, estimate the expected gain so I know where to spend time.
```

---

## Phase 6 — Testing

### Prompt 6.1 — Cross-device test plan

```
Generate a structured test plan for the WebAR pergola demo. I have access to: [list devices, e.g. "iPhone 13 (iOS 17), iPhone 8 (iOS 15), Pixel 6 (Android 14), Samsung A52"].

For each test case, specify:
- Device + OS + browser
- Environment (lighting, surface type)
- Steps to execute
- Expected outcome
- Common failure modes for that combination

Cover at minimum:
- Bright outdoor on hardwood deck (typical pergola installation)
- Dim indoor on carpet (typical living room)
- Mixed lighting on tile
- Featureless surface (white wall floor, polished concrete) — known to trip plane detection

Format as a checklist (markdown table or numbered list) I can run through systematically. Include a final "ready to send" gate: criteria that must all pass before I share the link with the client.
```

### Prompt 6.2 — Debug a specific issue

Re-use this prompt for each issue you encounter during testing.

```
I'm testing the WebAR pergola demo and seeing this issue:

[Describe specifically: what device, what OS, what browser, what you did, what happened vs what should have happened. Include screenshots or screen recordings if available.]

Diagnose and fix:
1. Most likely cause (rank by likelihood if multiple)
2. Diagnostic step to confirm the cause
3. Concrete fix with code or settings change
4. How to verify the fix works before re-testing on device

If the issue is a known platform limitation rather than a bug, say so plainly and suggest a workaround or graceful degradation.
```

---

## Phase 7 — Pre-Delivery Polish

### Prompt 7.1 — Client-ready polish pass

```
The WebAR demo works technically. Polish it for the client — Joana, owner of a Brazilian blinds/curtains/awnings store. The demo should feel like a professional product page, not a dev prototype.

Review and improve:
1. Visual hierarchy — is the AR button the obvious primary action?
2. Typography rhythm — line height, spacing, size scale
3. Microcopy — is every word in Portuguese natural, not translated-sounding?
4. Loading feel — does the page feel fast even before the GLB is ready?
5. AR launch moment — when she taps the button, is there any awkward delay or jank?
6. Edge cases — what happens if she's on desktop? On a tablet?

Suggest specific improvements with code, ranked by impact. Don't suggest adding features — only refinements to what's already there. The goal is "this feels right" not "this has more stuff."
```

### Prompt 7.2 — Pre-flight checklist

```
Generate a final checklist I should run through immediately before sending the demo link to the client. Format as markdown checkboxes.

Cover four categories:

Technical:
- URL loads on a phone that has never opened it before (verifies first-time experience)
- HTTPS active, no mixed content warnings
- AR launches on both iOS Safari and Android Chrome
- Model is correctly scaled (place it next to a known-size object to verify)

Visual:
- Textures render without stretching or seams
- No z-fighting between geometry
- No flickering or shimmering on beams
- Lighting in AR mode looks reasonable in different real environments

UX:
- Instructions modal text is readable on small phones
- Error states are friendly, not technical
- No developer language anywhere user-facing ("console", "render", "shader", etc.)
- The "?" help icon is findable but not intrusive

Communication:
- Message to client is drafted and reviewed
- Expectations are set in writing about what the demo includes and what the full project would add
- I know what I want from her after she tests (response within X days, scheduling the director meeting, etc.)

Include any items easy to forget.
```

---

## Phase 8 — After She Tests

### Prompt 8.1 — She loved it, scoping the full project

```
The client tested the Dinamo demo and wants to move forward with the meeting with her director. Help me prepare for that meeting and the follow-up message.

Draft a message to Joana that:
- Thanks her briefly for testing
- Confirms availability for the director meeting (propose specific time slots or ask her to)
- Sets expectations for what the meeting should cover (scope alignment, timeline, budget range)
- Asks 3–4 strategic questions I should know answers to before quoting the full project:
   - Total number of products to support (pergolas, blinds, curtains, awnings — rough counts each)
   - Who will maintain the catalog after launch (her team or me)
   - Whether the AR experience needs to integrate with her existing site/e-commerce
   - Budget range or expected investment level

Tone: confident, professional, Brazilian Portuguese, direct without being terse. No bullet points in the message — natural paragraphs. End with availability for the meeting.
```

### Prompt 8.2 — Something went wrong, recovery message

```
The client tested the demo and reported this issue:

[Quote her exact feedback, including any screenshots she sent.]

Help me respond with:
1. An honest diagnosis of what likely happened (model scaling, plane detection failure, device compatibility, etc.)
2. Whether it's fixable quickly (hours), needs work (days), or is a platform limitation (work around it)
3. A response message to her in Brazilian Portuguese that:
   - Acknowledges the issue without being defensive
   - Explains the cause in non-technical language (one or two sentences)
   - Proposes a specific fix and timeline
   - Reframes constructively — this is solvable, here's what we do next
   - Doesn't grovel or over-apologize

If the issue suggests a deeper problem (her use case is wrong for WebAR, the product is too detailed for mobile, etc.), say so honestly to me even if my client-facing message is softer.
```

---

## Notes on working with Claude effectively

A few things that make these prompts work better:

**Fill in the brackets.** Every `[placeholder]` matters. "Photos: front, side, top" is a different prompt than "Photos: I have a bunch of photos." The first gets a concrete answer; the second gets a generic one.

**One thing at a time.** Don't combine "scaffold the project and deploy it and add variants" into one prompt. Claude can do it, but you lose review checkpoints and small errors compound.

**Review before continuing.** After each prompt, skim the output. If something feels off (file in wrong location, suspicious code, missing edge case), ask Claude to revise that step before moving on. Going back to fix Phase 2 issues from inside Phase 5 is painful.

**Be specific about constraints.** "Mobile-friendly" is vague. "Under 5 MB total page weight, loads in under 3 seconds on throttled 4G" is actionable. Numbers > adjectives.

**Don't fight the tool.** If Claude suggests an approach that differs from yours, ask why before overriding. Sometimes the suggested approach is better because of a constraint you didn't think of (browser quirk, mobile GPU limit, etc.).

**Claude can't run Blender, can't be on a phone, can't see the real environment.** The 3D modeling, the device testing, the visual judgment of "does this look real" — those are your work. Don't lose time asking Claude to do them.
