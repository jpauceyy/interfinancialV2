/* [data-scroll-scale="0.4"] grows while its section scrolls into view: from (1 - amount) as the
 * section enters at the bottom to full size when it fills the screen, then a touch more as it
 * leaves. Growth is capped just past full size so edge-to-edge type never clips. */
(function (M) {
  M.scrollScale = function init() {
    const els = [...document.querySelectorAll('[data-scroll-scale]')];
    if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    return function update() {
      const vh = innerHeight;
      els.forEach((el) => {
        const box = el.closest('section').getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const p = Math.min(0.15, Math.max(-1, -box.top / vh));
        el.style.transform = `scale(${(1 + p * (parseFloat(el.dataset.scrollScale) || 0.3)).toFixed(4)})`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
