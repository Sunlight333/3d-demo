/* ===========================================================================
   Pérgola Dinamo — WebAR demo logic
   - Drives AR launch from our own button
   - First-time instructions modal (localStorage-gated)
   - Loading progress + friendly error states (Brazilian Portuguese)
   No framework. Plain DOM. Runs after <model-viewer> is defined.
   =========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'dinamo-ar:instructions-dismissed';

  // Before the real GLB is dropped into public/, the hero shows the real product
  // photo (the model-viewer poster). Set USE_SAMPLE_FALLBACK = true only if you
  // want to demo the 3D-rotate / AR mechanics with a stand-in model meanwhile.
  const USE_SAMPLE_FALLBACK = false;
  const FALLBACK_GLB = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
  let usedFallback = false;

  // --- Element refs --------------------------------------------------------
  const viewer       = document.getElementById('viewer');
  const arBtn        = document.getElementById('ar-btn');
  const arUnsupported= document.getElementById('ar-unsupported');
  const helpBtn      = document.getElementById('help-btn');
  const helpLink     = document.getElementById('help-link');

  const modal        = document.getElementById('modal');
  const modalOk      = document.getElementById('modal-ok');
  const modalDismiss = document.getElementById('modal-dismiss');

  const progressBar  = viewer.querySelector('.progress-bar');
  const progressFill = viewer.querySelector('.progress-fill');
  const progressLabel= viewer.querySelector('.progress-label');

  const errorBox     = document.getElementById('error-box');
  const errorText    = document.getElementById('error-text');
  const errorRetry   = document.getElementById('error-retry');
  const errorClose   = document.getElementById('error-close');

  // --- Helpers -------------------------------------------------------------
  const wasDismissed = () => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; }
    catch { return false; }   // private mode / storage blocked
  };
  const setDismissed = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  function showError(message, { retry } = {}) {
    errorText.textContent = message;
    errorRetry.hidden = !retry;
    errorBox.hidden = false;
    errorRetry.onclick = retry || null;
  }
  function hideError() { errorBox.hidden = true; }

  // --- Modal ---------------------------------------------------------------
  // pendingArLaunch: if the modal was opened on the way to AR, launch after "Entendi".
  let pendingArLaunch = false;

  function openModal({ forAr = false } = {}) {
    pendingArLaunch = forAr;
    modal.hidden = false;
    document.addEventListener('keydown', onModalKey);
  }
  function closeModal() {
    modal.hidden = true;
    document.removeEventListener('keydown', onModalKey);
  }
  function onModalKey(e) {
    if (e.key === 'Escape') { pendingArLaunch = false; closeModal(); }
  }

  modal.querySelector('[data-close]').addEventListener('click', () => {
    pendingArLaunch = false;
    closeModal();
  });
  modalOk.addEventListener('click', () => {
    closeModal();
    if (pendingArLaunch) { pendingArLaunch = false; launchAR(); }
  });
  modalDismiss.addEventListener('click', () => {
    setDismissed();
    closeModal();
    if (pendingArLaunch) { pendingArLaunch = false; launchAR(); }
  });

  helpBtn.addEventListener('click', () => openModal({ forAr: false }));
  helpLink.addEventListener('click', () => openModal({ forAr: false }));

  // --- AR launch -----------------------------------------------------------
  function launchAR() {
    if (!viewer.canActivateAR) {
      showError(
        'Seu dispositivo não suporta AR no navegador. Funciona em iPhone (iOS 12+) ' +
        'e Android com ARCore. Você ainda pode girar o modelo em 3D acima.'
      );
      return;
    }
    try {
      viewer.activateAR();
    } catch (err) {
      showError('Algo deu errado ao abrir a câmera. Vamos tentar de novo.', {
        retry: () => { hideError(); launchAR(); },
      });
    }
  }

  arBtn.addEventListener('click', () => {
    hideError();
    // First time on this device → show instructions, then launch.
    if (!wasDismissed()) { openModal({ forAr: true }); return; }
    launchAR();
  });

  // --- AR availability: hide/disable button when unsupported ---------------
  // canActivateAR isn't reliable until the model loads, so check on load too.
  function refreshArAvailability() {
    const ok = viewer.canActivateAR;
    arUnsupported.hidden = ok;
    // Keep the button visible either way — on tap we show the explanation —
    // but soften it visually when AR isn't available.
    arBtn.style.opacity = ok ? '1' : '0.6';
  }

  // --- Loading + error events ----------------------------------------------
  viewer.addEventListener('progress', (e) => {
    const pct = Math.round((e.detail.totalProgress || 0) * 100);
    if (pct < 100) {
      progressBar.hidden = false;
      progressFill.style.width = pct + '%';
      progressLabel.textContent = 'Carregando a Pérgola Dinamo…';
    } else {
      progressFill.style.width = '100%';
      // brief beat so the bar visibly completes, then dismiss
      setTimeout(() => { progressBar.hidden = true; }, 220);
    }
  });

  viewer.addEventListener('load', () => {
    progressBar.hidden = true;
    refreshArAvailability();
  });

  viewer.addEventListener('error', (e) => {
    progressBar.hidden = true;
    const reason = (e.detail && e.detail.type) || 'loadfailure';

    // Real GLB not in place yet. Keep the real product photo (poster) visible —
    // optionally swap in a stand-in model to demo the 3D/AR mechanics.
    if (reason === 'loadfailure' && !usedFallback) {
      usedFallback = true;
      if (USE_SAMPLE_FALLBACK) {
        console.info('[dinamo] local GLB not found — loading sample model.');
        viewer.removeAttribute('ios-src');   // sample has no matching USDZ
        viewer.setAttribute('src', FALLBACK_GLB);
      } else {
        console.info('[dinamo] local GLB not found — showing product photo poster.');
      }
      return;
    }

    if (reason === 'loadfailure') {
      showError('Não conseguimos carregar o modelo. Tente novamente.', {
        retry: () => {
          hideError();
          // Re-trigger the load by re-assigning src.
          const src = viewer.getAttribute('src');
          viewer.removeAttribute('src');
          requestAnimationFrame(() => viewer.setAttribute('src', src));
        },
      });
    } else {
      showError('Algo deu errado. Vamos tentar de novo.', {
        retry: () => { hideError(); refreshArAvailability(); },
      });
    }
  });

  // ar-status: tracks AR session lifecycle (not-presenting / session-started / failed)
  viewer.addEventListener('ar-status', (e) => {
    if (e.detail.status === 'failed') {
      showError('Algo deu errado na sessão de AR. Vamos tentar de novo.', {
        retry: () => { hideError(); launchAR(); },
      });
    }
  });

  errorClose.addEventListener('click', hideError);

  // --- Init ----------------------------------------------------------------
  // If model-viewer already finished before this script ran, sync state now.
  if (viewer.loaded) { progressBar.hidden = true; refreshArAvailability(); }
  else { refreshArAvailability(); }
})();
