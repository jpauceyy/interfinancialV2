/*
 * Pinned section: vertical scroll drives the horizontal card track + backdrop.
 * On phones the track is a native swipe carousel instead (see components.css),
 * so the scroll-driven transform is cleared there.
 */
(function (M) {
  M.horizontal = function init() {
    const section = document.querySelector('[data-hscroll]');
    if (!section) return () => {};
    const track = section.querySelector('[data-hscroll-track]');
    const phone = matchMedia('(max-width: 47.99rem)');

    return function update() {
      if (phone.matches) { track.style.transform = ''; return; }
      const vh = innerHeight;
      const range = section.offsetHeight - vh;
      const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range));
      const max = Math.max(0, track.scrollWidth + track.offsetLeft - innerWidth + innerWidth * 0.04);
      track.style.transform = `translate3d(${-p * max}px,0,0)`;
    };
  };
})((window.Mortgage = window.Mortgage || {}));
