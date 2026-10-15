/* Typewriter loop: [data-type="word"] types the word in, holds, deletes, repeats. */
(function (M) {
  M.type = function init() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-type]').forEach((el) => {
      const word = el.dataset.type;
      if (reduce) { el.textContent = word; return; }
      let n = 0, dir = 1;
      const tick = () => {
        n += dir;
        el.textContent = word.slice(0, n);
        if (n === word.length) { dir = -1; return setTimeout(tick, 3200); }
        if (n === 0) { dir = 1; return setTimeout(tick, 450); }
        setTimeout(tick, dir > 0 ? 95 : 45);
      };
      (M.intro || Promise.resolve()).then(() => setTimeout(tick, parseInt(el.dataset.typeDelay, 10) || 1200));
    });
  };
})((window.Mortgage = window.Mortgage || {}));
