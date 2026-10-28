/*
 * Scroll-driven background: sections inside [data-bg-group] share one background
 * that blends from one section's colour to the next as the next section rises
 * through the screen (from entering at the bottom to reaching the top fifth),
 * so the shift is tied to scroll position rather than a timed fade.
 * Colours are read from each panel's bg-/text- classes, so the markup stays the source.
 */
(function (M) {
  const START = 1;    // blend starts when the next section's top is at the bottom of the screen...
  const END = 0.2;    // ...and finishes when it reaches 20% from the top

  const rgb = (c) => (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
  const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;

  M.bgShift = function init() {
    const group = document.querySelector('[data-bg-group]');
    if (!group) return () => {};
    const sections = [...group.children].map((el) => {
      const s = getComputedStyle(el.querySelector('.panel') || el);
      return { el, bg: rgb(s.backgroundColor), fg: rgb(s.color) };
    });
    group.classList.add('is-shifting');
    return function update() {
      const vh = innerHeight;
      let i = 0, t = 0;
      for (let n = 1; n < sections.length; n++) {
        const top = sections[n].el.getBoundingClientRect().top / vh;
        const p = Math.min(1, Math.max(0, (START - top) / (START - END)));
        if (p > 0) { i = n - 1; t = p; }
      }
      const a = sections[i], b = sections[Math.min(i + 1, sections.length - 1)];
      // ease in-out so the blend starts and settles gently
      const e = t * t * (3 - 2 * t);
      group.style.setProperty('--bg', mix(a.bg, b.bg, e));
      // text flips at the midpoint rather than passing through a muddy mid-tone
      group.style.setProperty('--fg', `rgb(${(e < 0.5 ? a.fg : b.fg).join(',')})`);
    };
  };
})((window.Mortgage = window.Mortgage || {}));
