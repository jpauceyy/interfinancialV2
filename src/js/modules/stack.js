/* Sticky stacked panels: each panel scales back + dims as the next one covers it. */
(function (M) {
  M.stack = function init() {
    const items = [...document.querySelectorAll('[data-stack]')];
    if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    return function update() {
      const vh = innerHeight;
      items.forEach((el) => {
        const next = el.nextElementSibling;
        if (!next) return;
        const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh));
        el.style.transform = `scale(${1 - p * 0.05})`;
        el.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
