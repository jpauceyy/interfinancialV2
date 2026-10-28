/*
 * Scroll-driven background: sections inside [data-bg-group] share one background
 * that fades to each section's own colour as it reaches the middle of the screen.
 * Colours are read from each panel's bg-/text- classes, so the markup stays the source.
 */
(function (M) {
  M.bgShift = function init() {
    const group = document.querySelector('[data-bg-group]');
    if (!group) return () => {};
    const sections = [...group.children].map((el) => {
      const s = getComputedStyle(el.querySelector('.panel') || el);
      return { el, bg: s.backgroundColor, fg: s.color };
    });
    group.classList.add('is-shifting');
    let current = null;
    return function update() {
      const mid = innerHeight * 0.5;
      let active = sections[0];
      sections.forEach((s) => { if (s.el.getBoundingClientRect().top <= mid) active = s; });
      if (active === current) return;
      current = active;
      group.style.setProperty('--bg', active.bg);
      group.style.setProperty('--fg', active.fg);
    };
  };
})((window.Mortgage = window.Mortgage || {}));
