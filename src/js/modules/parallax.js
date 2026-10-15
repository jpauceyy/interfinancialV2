/* Image parallax: [data-parallax="0.12"] drifts inside its clipped parent. */
(function (M) {
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
        el.style.transform = `translate3d(0,${(-p * k * 100).toFixed(2)}%,0) scale(1.18)`;
      });
    };
  };
})((window.Mortgage = window.Mortgage || {}));
