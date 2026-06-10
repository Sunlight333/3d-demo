# Phase 7 — Pre-Flight Checklist (before sending to the client)

Run immediately before sharing the link with Joana. The page is already polished — this is
the final gate, not a build step.

## Technical
- [ ] URL loads on a phone that has **never** opened it (true first-time experience)
- [ ] HTTPS active, padlock green, **no mixed-content** warnings
- [ ] AR launches on **iOS Safari** (Quick Look) and **Android Chrome** (Scene Viewer)
- [ ] Model correctly scaled — placed next to a known-size object in AR, reads ~4×3×2.6 m
- [ ] `.usdz` and `.glb` served with correct MIME types (see Phase 5 `curl` checks)
- [ ] Poster image present and < 80 KB; shows instantly before the GLB

## Visual
- [ ] Textures render without stretching or visible seams
- [ ] No z-fighting between overlapping geometry (beams/joints)
- [ ] No flickering or shimmering on beams when rotating
- [ ] AR lighting looks reasonable in bright outdoor **and** dim indoor
- [ ] Frame color and fabric color match the real product

## UX
- [ ] Instructions modal text readable on a small phone (iPhone SE / older Android)
- [ ] Error states are friendly, not technical
- [ ] **No developer language** anywhere user-facing ("console", "render", "shader", "GLB")
- [ ] The "?" help icon is findable but not intrusive
- [ ] Auto-rotate is gentle, stops on interaction, doesn't feel gimmicky
- [ ] Primary "Ver no meu ambiente" button is the obvious main action

## Communication
- [ ] Message to Joana drafted and reviewed (see `phase8-client-messages.md`)
- [ ] In writing: what the demo includes vs what the full project would add
- [ ] Clear on what you want back from her (test by date X, schedule director meeting)

## Easy-to-forget
- [ ] Test on **cellular**, not just home Wi-Fi (real first-impression network)
- [ ] Test in **landscape** too, not only portrait
- [ ] Confirm the page title / link preview looks clean when shared via WhatsApp
- [ ] Brazilian Portuguese throughout, including the `<title>` and meta description
- [ ] One last full run-through in **airplane-mode-then-reconnect** to see cold load
