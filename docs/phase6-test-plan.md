# Phase 6 — Cross-Device Test Plan

Run this before sharing the link with the client. Test matrix targets the two platforms
that matter: **iOS Safari → Quick Look** and **Android Chrome → Scene Viewer**.

Adjust the device list to what you actually have. Suggested minimum: one recent iPhone,
one older iPhone, one mid-range Android.

## How to run
For each row: open the deployed HTTPS URL in the listed browser, do the steps, compare to
expected. Mark ✅ / ⚠️ / ❌ and note anything off.

---

## Functional tests

| # | Device / OS / Browser | Steps | Expected |
|---|---|---|---|
| 1 | iPhone (recent, iOS 16+) / Safari | Load page → tap "Ver no meu ambiente" → instructions modal → "Entendi, começar" | Quick Look opens, pergola placeable on floor |
| 2 | iPhone (old, iOS 12–15) / Safari | Same | Quick Look opens; if iOS 12, confirm USDZ loads at all |
| 3 | Android (mid-range, ARCore) / Chrome | Same → tap button | Scene Viewer opens, plane detection, placeable |
| 4 | Android without ARCore | Tap button | Friendly "não suporta AR" message, 3D view still works |
| 5 | Desktop Chrome | Load page, tap button | 3D rotates; AR button shows graceful unsupported message |
| 6 | Any | First visit | Instructions modal appears once; "Não mostrar novamente" persists across reload |
| 7 | Any | Tap "?" help icon | Modal re-opens even after being dismissed |
| 8 | Any | Throttle to Slow 4G, reload | Poster shows immediately; progress bar; model appears |
| 9 | Any | Block the GLB (DevTools) | Falls back to sample model OR friendly error + retry (per app.js) |
| 10 | Android / Desktop | Tap a "Madeira" / "Tecido" swatch | Color changes instantly in 3D view (no reload) |

---

## Environment / AR-quality tests (real world)

Plane detection and lighting vary by environment. Test each:

| Environment | Surface | Watch for |
|---|---|---|
| Bright outdoor | Hardwood deck | Over-exposure; model washing out. Typical real install — must look good |
| Dim indoor | Carpet | Plane detection slow/failing in low light; model too dark |
| Mixed lighting | Tile | Shadow direction looking wrong vs room light |
| Featureless | White floor / polished concrete | **Plane detection failure** — known hard case. Move device slowly, add visual texture |

For each: place the pergola next to a **known-size object** (a door ≈ 2 m, a standard chair
seat ≈ 0.45 m) and confirm it reads as ~2.6 m tall, ~4 m wide. Wrong scale is the #1 demo-killer.

---

## "Ready to send" gate — ALL must pass

- [ ] AR launches on at least one real iPhone **and** one real Android
- [ ] Model scale is correct (verified against a known object in AR)
- [ ] No mixed-content / HTTPS warnings
- [ ] First-time instructions appear and persist-dismiss correctly
- [ ] Poster shows instantly on a throttled connection; model loads within a few seconds
- [ ] All user-facing text is natural Portuguese, no dev jargon, no English leftovers
- [ ] Error states are friendly and offer a way forward (retry / explanation)
- [ ] On unsupported devices, the page degrades gracefully (no broken button, no crash)
- [ ] Textures: no obvious stretching, seams, z-fighting, or beam shimmer

If any gate item fails, fix before sending. Use the debug template in the original
playbook (Prompt 6.2) for specific issues.
