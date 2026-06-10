Drop the real assets here, using these exact filenames (the page already
points at them — no code changes needed):

  pergola-dinamo.glb    3D model for Android Scene Viewer + desktop/3D view.
                        Y-up, meters, Draco-compressed, baked PBR, < 5 MB.

  pergola-dinamo.usdz   3D model for iOS Quick Look. Convert from the GLB
                        (Reality Converter on Mac, or an online converter).

  pergola-poster.webp   Still preview shown before the GLB finishes loading.
                        ~1024x768, matches the model's default camera angle.

  store-logo.svg        Optional. Small store logo for the header.

Until pergola-dinamo.glb exists, the page falls back to a sample model
(an astronaut) so you can test layout, the instructions modal, loading, and
error states. Remove the FALLBACK_GLB logic in ../src/app.js once real assets
are in place.
