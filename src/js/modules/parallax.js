/* Image parallax: [data-parallax="0.12"] drifts inside its clipped parent, and zooms in
 * as its frame nears the middle of the screen, easing back out as it scrolls away.
 * The 1.18 base keeps the drift from exposing edges; ZOOM is added on top at the centre. */
(function (M) {
  const ZOOM = 0.14;
  M.parallax = function init() {
    const els = [...document.querySelectorAll('[data-parallax]')];
    if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    return function update() {
      const vh = innerHeight;
      els.forEach((el) => {
        const box = el.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        const k = parseFloat(el.dataset.parallax) || 0.1;
        const p = (box.top + box.height / 2 - vh / 2) / vh; // -1..1 around centre
        const near = 1 - Math.min(1, Math.abs(p) * 1.4); // 1 at centre, 0 well off it
        const z = 1.18 + ZOOM * near * near * (3 - 2 * near);
        el.style.transform = `translate3d(0,${(-p * k * 100).toFixed(2)}%,0) scale(${z.toFixed(4)})`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
