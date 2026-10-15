/* [data-scroll-scale="0.4"] grows by up to that amount as its section scrolls off the top. */
(function (M) {
  M.scrollScale = function init() {
    const els = [...document.querySelectorAll('[data-scroll-scale]')];
    if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    return function update() {
      const vh = innerHeight;
      els.forEach((el) => {
        const box = el.closest('section').getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const p = Math.min(1, Math.max(0, -box.top / vh));
        el.style.transform = `scale(${(1 + p * (parseFloat(el.dataset.scrollScale) || 0.3)).toFixed(4)})`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
