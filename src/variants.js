/* ===========================================================================
   Pérgola Dinamo — Phase 4: color / material variant switching
   ---------------------------------------------------------------------------
   Two independent axes: "Madeira" (frame finish) and "Tecido" (canopy fabric).

   model-viewer's KHR_materials_variants supports ONE flat list of variants, so
   we author COMBINED variants in Blender named "<frame>-<fabric>", e.g.
   "grafite-areia", "grafite-carvao", "bronze-areia", ... (frames x fabrics).
   This file maps the two swatch rows onto those combined variant names.

   FALLBACK: if the loaded model has no authored variants (e.g. the placeholder
   sample model), we instead recolor named materials at runtime via the
   scene-graph API. If neither is available, the panel hides itself.

   IMPORTANT: Variants do NOT survive USDZ conversion, so this UI has no effect
   in iOS Quick Look AR. It works in the in-browser 3D view and Android Scene
   Viewer. This is a known platform limitation, not a bug.
   =========================================================================== */

(function () {
  'use strict';

  // --- Configure your real finishes here ----------------------------------
  // `id` must match the Blender variant name segment. `color` is the swatch
  // shown in the UI AND the runtime-recolor fallback value.
  const FRAMES = [
    { id: 'grafite', label: 'Grafite', color: '#3a3d3e' },
    { id: 'bronze',  label: 'Bronze',  color: '#6b5640' },
    { id: 'branco',  label: 'Branco',  color: '#e9e6df' },
  ];
  const FABRICS = [
    { id: 'areia',   label: 'Areia',   color: '#cbbfa6' },
    { id: 'carvao',  label: 'Carvão',  color: '#5a564f' },
    { id: 'verde',   label: 'Verde',   color: '#5c6b54' },
  ];

  // Names of the materials to recolor in the FALLBACK path (must match the
  // material names in the GLB). Adjust to your model's material names.
  const FRAME_MATERIAL  = 'Frame';
  const FABRIC_MATERIAL = 'Canopy';

  // --- State ---------------------------------------------------------------
  const viewer = document.getElementById('viewer');
  const panel  = document.getElementById('variant-panel');
  if (!viewer || !panel) return;

  let selected = { frame: FRAMES[0].id, fabric: FABRICS[0].id };
  let mode = null; // 'variants' | 'recolor' | null(unsupported)

  // --- Build the swatch UI -------------------------------------------------
  function buildRow(containerId, items, axis) {
    const row = panel.querySelector(containerId);
    items.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch';
      btn.style.setProperty('--swatch', item.color);
      btn.setAttribute('aria-label', item.label);
      btn.title = item.label;
      if (i === 0) btn.classList.add('is-selected');
      btn.addEventListener('click', () => {
        selected[axis] = item.id;
        row.querySelectorAll('.swatch').forEach((s) => s.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        apply();
      });
      row.appendChild(btn);
    });
  }

  // --- Apply the current selection -----------------------------------------
  function apply() {
    if (mode === 'variants') {
      const name = `${selected.frame}-${selected.fabric}`;
      if (viewer.availableVariants.includes(name)) {
        viewer.variantName = name;
      } else {
        console.warn('[dinamo] variant not found in model:', name);
      }
    } else if (mode === 'recolor') {
      recolor(FRAME_MATERIAL,  byId(FRAMES,  selected.frame).color);
      recolor(FABRIC_MATERIAL, byId(FABRICS, selected.fabric).color);
    }
  }

  function recolor(materialName, hex) {
    const mat = viewer.model && viewer.model.materials
      ? viewer.model.materials.find((m) => m.name === materialName)
      : null;
    if (!mat) return; // material name not present in this model — silently skip
    const [r, g, b] = hexToLinear(hex);
    mat.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1]);
  }

  // --- Decide which mode the loaded model supports -------------------------
  function detectMode() {
    const hasVariants = Array.isArray(viewer.availableVariants) &&
                        viewer.availableVariants.length > 0;
    const hasNamedMats = viewer.model && viewer.model.materials &&
      viewer.model.materials.some((m) => m.name === FRAME_MATERIAL ||
                                         m.name === FABRIC_MATERIAL);

    if (hasVariants)      mode = 'variants';
    else if (hasNamedMats) mode = 'recolor';
    else                   mode = null;

    if (mode) {
      buildRow('#frames-row', FRAMES, 'frame');
      buildRow('#fabrics-row', FABRICS, 'fabric');
      panel.hidden = false;
      apply();
    } else {
      // Placeholder / model without variants or matching materials → hide panel.
      panel.hidden = true;
      console.info('[dinamo] no variants or named materials — hiding variant panel.');
    }
  }

  viewer.addEventListener('load', detectMode);
  if (viewer.loaded) detectMode();

  // --- utils ---------------------------------------------------------------
  function byId(list, id) { return list.find((x) => x.id === id) || list[0]; }

  // model-viewer's setBaseColorFactor expects LINEAR color; convert from sRGB hex.
  function hexToLinear(hex) {
    const n = hex.replace('#', '');
    const to = (h) => {
      const s = parseInt(h, 16) / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return [to(n.slice(0, 2)), to(n.slice(2, 4)), to(n.slice(4, 6))];
  }
})();
