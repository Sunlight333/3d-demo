# Phase 1 — GLB Export & USDZ Conversion

How to get a Blender model into a `<model-viewer>`-ready GLB, then into a USDZ for iOS
Quick Look. Drop both into `public/` as `pergola-dinamo.glb` and `pergola-dinamo.usdz`.

---

## A. Blender → GLB (File → Export → glTF 2.0)

Set the format to **glTF Binary (.glb)** — single file with textures embedded.

### Format
| Option | Value | Reason |
|---|---|---|
| Format | **glTF Binary (.glb)** | One self-contained file; `<model-viewer>` loads it directly |

### Include
| Option | Value | Reason |
|---|---|---|
| Limit to → **Selected Objects** | On (select only the pergola) | Don't export lights/cameras/deck |
| Limit to → Visible / Renderable | Optional | Belt-and-suspenders to avoid hidden helpers |
| Data → Custom Properties | Off | Not needed, adds bytes |
| Data → Cameras | Off | model-viewer supplies its own camera |
| Data → Punctual Lights | Off | Lighting is runtime (IBL); baked lights would double up |

### Transform
| Option | Value | Reason |
|---|---|---|
| **+Y Up** | **On** | glTF/`model-viewer` expect Y-up; Blender is Z-up. The exporter converts when this is on |

> Don't manually rotate the model −90° to "fix" up-axis. Leave it upright in Blender and
> let **+Y Up** handle the conversion. Manual rotation causes the AR scale/placement to be off.

### Geometry
| Option | Value | Reason |
|---|---|---|
| Apply Modifiers | **On** | Bakes Array/Bevel/Mirror into the exported mesh |
| UVs | On | Needed for the fabric texture |
| Normals | On | Needed for lighting; without them the frame looks flat |
| Tangents | On **only if** using a normal map | Required for correct normal-map lighting on the fabric |
| Vertex Colors | Off (unless used) | Saves bytes |
| Materials | **Export** | Keep PBR materials |
| Images | **Automatic** (or JPEG for color maps) | JPEG for base color shrinks size; keep normal maps PNG |

### Compression
| Option | Value | Reason |
|---|---|---|
| **Draco mesh compression** | **On** | Big size win on geometry — often 5–10× smaller meshes |
| Draco → Compression Level | 6 (default) | Good balance; higher = slower decode on weak phones |
| Draco → Quantization (Position) | 14 | Default; lower only if you see vertex wobble |

> `<model-viewer>` decodes Draco automatically (it ships a Draco decoder). No extra setup
> on the web side.

### Animation
- Pergola is static → **disable** the Animation section entirely. Smaller file, fewer bugs.
- (If you ever animate the canopy retracting, that's a separate, advanced add-on — skip for v1.)

### After export — verify before using
Open the GLB in one of these and check:
1. **https://gltf.report** — drag the GLB in. Check: file size < 5 MB, triangle count,
   texture sizes, that there are no surprise extra meshes.
2. **https://modelviewer.dev/editor/** — drag it in. Check: correct orientation (stands
   upright, not on its side), correct scale (use the dimensions readout), materials look right.
3. On the gltf.report **"Inspect"** tab, confirm `KHR_draco_mesh_compression` is listed
   (proves Draco applied) and total size.

**Common export problems and fixes**
- *Model on its side in model-viewer* → +Y Up was off, or you manually rotated. Re-export with +Y Up on, model upright in Blender.
- *Model huge or tiny in AR* → scale not in meters. Set Blender scene units to Metric, 1 unit = 1 m, and apply scale (Ctrl+A → Scale) before export.
- *Fabric looks flat / wrong lighting* → Normals or Tangents off, or normal map exported as sRGB. Normal maps must be **Non-Color** data in Blender.
- *Black/missing textures* → Images set to "Reference" instead of embedded. Use Automatic.

---

## B. GLB → USDZ (for iOS Quick Look)

iOS Safari's AR (Quick Look) needs a **USDZ**, served via the `ios-src` attribute (already
wired in `index.html`). Pick the path for your OS:

### macOS (best results) — Reality Converter
1. Download **Reality Converter** (free, Apple Developer site).
2. Open it → drag in `pergola-dinamo.glb`.
3. It auto-converts; check materials in the preview pane. Re-assign any that look off.
4. File → Export → **USDZ**. Save as `pergola-dinamo.usdz`.

### macOS (command line) — usdzconvert / Xcode
- With Xcode tools installed: `xcrun usdz_converter pergola-dinamo.glb pergola-dinamo.usdz`
  (older), or use Apple's `usdzconvert` Python tool from the USD Python package.
- Reality Converter is more forgiving than the CLI — prefer it unless scripting a pipeline.

### Windows / Linux (no Mac) — fallback
You can't run Apple's converters. Options, best first:
1. **Online converters** — e.g. modelviewer/Sketchfab-style GLB→USDZ services, or
   `https://products.aspose.app/3d/conversion/glb-to-usdz`. Verify output on a real iPhone.
2. **Blender USD export** — Blender can export `.usdc`/`.usda`, but **not** zipped `.usdz`
   with embedded textures cleanly for Quick Look. Not recommended as the primary path.
3. **Borrow a Mac** (even a cloud Mac for an hour) and use Reality Converter — most reliable.

### Known feature drops in USDZ conversion (plan around these)
- **KHR_materials_variants does NOT survive to Quick Look.** Color/fabric switching
  (Phase 4) works in the in-browser 3D view and Android Scene Viewer, **not** in iOS AR.
  This is documented in the variant code comments — set the client's expectations.
- **Emission / some advanced shader nodes** may not translate. Keep materials to standard
  Principled BSDF (base color, metallic, roughness, normal) — which is what Phase 1 specifies.
- **Double-sided fabric** can render single-sided in Quick Look. If the canopy underside
  goes invisible at certain angles, give the fabric thickness (solidify) or enable
  double-sided in the USDZ material.

### Validate the USDZ
- **On a real iPhone** (the only true test): host it (even temporarily) and open the page
  in Safari → tap "Ver no meu ambiente" → it should open Quick Look and let you place it.
- Quick visual check on Mac: double-click the `.usdz` → it opens in Quick Look / Preview.
- Confirm **scale**: place it next to a known object (a door ≈ 2 m). The pergola top beam
  should sit ~2.6 m up.

---

## C. The poster image

Also produce `pergola-poster.webp` (~1024×768): render the model from `model-viewer`'s
default camera angle (front three-quarter, matching the reference photo framing). This
shows instantly while the GLB downloads. Export as WebP at ~80% quality (≈ 40–80 KB).
