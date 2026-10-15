/*
 * Sticky stacked panels: each panel scales back + dims as the next one covers it.
 * A panel taller than the viewport would pin with its lower content unreachable,
 * so its sticky `top` is set negative: it scrolls fully, then pins by its bottom edge.
 * (The offset is layout, not motion, so it also applies with reduced motion.)
 */
(function (M) {
  M.stack = function init() {
    const items = [...document.querySelectorAll('[data-stack]')];
    if (!items.length) return () => {};
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    return function update() {
      const vh = innerHeight;
      items.forEach((el) => {
        el.style.top = Math.min(0, vh - el.offsetHeight) + 'px';
        if (!motion) return;
        const next = el.nextElementSibling;
        if (!next) return;
        const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh));
        el.style.transform = `scale(${1 - p * 0.05})`;
        el.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
