/*
 * Splash hand-over. M.intro resolves when the splash starts lifting (the CSS --intro
 * time), so on-load reveals and the typewriter wait for it. Without a splash it
 * resolves straight away. Must run before reveal/type in main.js.
 */
(function (M) {
  const INTRO_MS = 1900; // keep in step with `.has-splash { --intro }` in animations.css

  M.splash = function init() {
    const root = document.documentElement;
    const el = document.querySelector('.splash');
    if (!root.classList.contains('has-splash') || !el) { M.intro = Promise.resolve(); return; }

    const elapsed = performance.now() - (window.__splashT0 || 0);
    M.intro = new Promise((resolve) => setTimeout(resolve, Math.max(0, INTRO_MS - elapsed)));

    const done = () => { root.classList.remove('splash-active'); el.remove(); };
    el.addEventListener('animationend', (e) => { if (e.target === el) done(); });
    setTimeout(done, Math.max(0, INTRO_MS + 1200 - elapsed)); // fallback if animationend never fires
  };
})((window.Mortgage = window.Mortgage || {}));
