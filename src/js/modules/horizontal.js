/* Pinned section: vertical scroll drives the horizontal card track + backdrop. */
(function (M) {
  M.horizontal = function init() {
    const section = document.querySelector('[data-hscroll]');
    if (!section) return () => {};
    const track = section.querySelector('[data-hscroll-track]');
    

    return function update() {
      const vh = innerHeight;
      const range = section.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      const max = Math.max(0, track.scrollWidth + track.offsetLeft - innerWidth + innerWidth * 0.04);
      track.style.transform = `translate3d(${-p * max}px,0,0)`;
    };
  };
})((window.Mortgage = window.Mortgage || {}));
