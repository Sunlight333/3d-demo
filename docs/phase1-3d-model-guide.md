# Phase 1 — 3D Model & Texture Guide (Pérgola Dinamo)

Concrete targets for modeling the retractable-canopy pergola seen in the reference
photos, so the final GLB stays under **5 MB** and renders well on mobile GPUs.

The reference shows: a graphite/dark-bronze **aluminium frame**, a **retractable fabric
canopy** (sand/taupe), mounted over a **wood deck**, roughly **4.0 m wide × 3.0 m deep ×
2.6 m high**. Model only the pergola itself — not the deck, furniture, or house.

---

## 1. Geometry strategy

| Decision | Recommendation | Why |
|---|---|---|
| Base primitives | Start from **cubes**, extrude/bevel for posts and beams | The whole structure is rectilinear box-section extrusion — no curves needed |
| Posts (4) | Box section, ~80×80 mm, slight bevel (1–2 mm) on edges | Bevels catch light; sharp edges look CGI-fake |
| Rafters/beams | Box-section array via **Array modifier** along the top | One beam, arrayed — keeps it editable and low-poly |
| Canopy | Single **subdivided plane** with a subtle catenary droop, OR flat with fabric normal map | Avoid cloth sim; a 2–3 cm sag sells "fabric" without poly cost |
| Fasteners/bolts | **Do not model.** Bake into normal/roughness or omit | At 1–3 m viewing distance on a phone, modeled bolts are invisible cost |
| Canopy "ribs" (the visible fabric folds) | Model as shallow geometry **only if** half-retracted look is wanted; otherwise normal-map them | Folds are the signature look — a low-poly ridge array reads well |

**Target poly count: 8,000–15,000 triangles.** A rectilinear pergola has no business
going above this. If you're over 25k, you over-modeled something (likely bevels or canopy
subdivisions) — decimate it.

### Modifier discipline
- **Array** for repeated rafters and canopy ribs (don't copy-paste).
- **Bevel** (modifier, 1 segment, ~1.5 mm) on the frame for edge highlights.
- **Mirror** if the design is symmetric front-to-back.
- **Apply all modifiers before export** — glTF bakes them anyway, but applying lets you
  verify the final mesh and UVs.

---

## 2. Materials & textures

Use free PBR sets from [Polyhaven](https://polyhaven.com). You need **three** materials:

### A. Frame (powder-coated aluminium, graphite)
- This is **not** a textured surface — it's flat painted metal. **Don't use a texture map.**
- Principled BSDF: Base Color `#3a3d3e` (dark graphite), **Metallic 0.0** (powder coat is
  dielectric, not bare metal), **Roughness 0.45**, Specular default.
- A faint roughness map adds realism but is optional. Saves a whole texture set.

### B. Canopy fabric (sand/taupe outdoor acrylic)
- Polyhaven search: **"fabric"** / **"canvas"** — e.g. `fabric_pattern_07`, `denim_fabric`,
  or a plain canvas. Pick one with a **tight, subtle weave**, not a loud pattern.
- Maps to use: **Base Color**, **Normal**, **Roughness**. Skip metallic (it's 0).
- Principled BSDF: Base Color tinted to sand `#cbbfa6`, **Roughness 0.7–0.8** (matte),
  **Metallic 0**. Add a touch of **Subsurface (0.05–0.1)** in warm tone so backlight glows
  slightly — sells "fabric under sun." Skip if targeting the very weakest phones.

### C. Wood (only if you model deck trim or wood-clad beams — the reference frame is metal)
- Likely **not needed** for the Dinamo (frame is metal). Include only if a wood variant is
  planned. If so: Polyhaven `wood_planks` / `plywood`, dark-stained tint, Roughness 0.5.

### Texture resolution (the 5 MB budget)
- Download **2K**, then **downscale to 1K** before baking into the GLB. At phone distance,
  1K fabric is indistinguishable from 2K and is ~4× smaller.
- One fabric set at 1K (color+normal+roughness, compressed) ≈ 0.8–1.5 MB. That leaves
  plenty of headroom under 5 MB for geometry.
- **Use a single shared UV/texture for the canopy.** Don't give each rib its own texture.

### UV unwrapping
- Frame: no UVs needed (flat color). If you add a roughness map, a simple **Smart UV
  Project** is fine.
- Canopy: **unwrap as one continuous sheet** so the weave runs straight along the fabric,
  matching the real folds. Mark seams at the canopy edges only.

---

## 3. Lighting: bake or runtime?

**Leave lighting to `<model-viewer>` at runtime — do NOT bake lighting into textures.**

- In AR, the model sits in the user's real environment with real lighting. Baked shadows/
  highlights would fight the real scene and look wrong.
- Bake only **ambient occlusion** (contact shadows in crevices) into a low-strength AO map
  if you want extra grounding — but even that is optional for a clean rectilinear frame.
- `<model-viewer>` applies image-based lighting from its default environment; the page can
  override with `environment-image` / `exposure` if needed (already exposed via `exposure="1"`).

---

## 4. Quick sanity checklist before export

- [ ] Scale: **1 Blender unit = 1 meter**, pergola ≈ 4×3×2.6 m (measure it in Blender)
- [ ] Origin at the **base center** of the structure (so AR places it on the floor correctly)
- [ ] **+Y is up** conceptually (Blender is Z-up; the glTF exporter converts — see export guide)
- [ ] All modifiers applied, no n-gons in deforming areas
- [ ] Normals facing outward (Overlays → Face Orientation: all blue, no red)
- [ ] Three materials max, fabric texture ≤ 1K, no baked lighting
- [ ] Triangle count under ~15k

Next: see **phase1-export-and-usdz.md** for the exact export settings and iOS conversion.
