/*
 * Pinned section: vertical scroll drives the horizontal card track + backdrop.
 * On phones the track is a native swipe carousel instead (see components.css),
 * so the scroll-driven transform is cleared there and the carousel autoplays.
 */
(function (M) {
  /*
   * Phone carousel autoplay: steps one card every few seconds and loops back to the
   * start. Runs only while the carousel is on screen and the tab is visible; any
   * touch, swipe or wheel pauses it, and it resumes after a short idle. With
   * reduced motion it still advances, but jumps instead of sliding.
   */
  function autoplay(track, phone) {
    const STEP_MS = 3200, IDLE_MS = 6000;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0, visible = false, holdUntil = 0;

    const stops = () => {
      const inset = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      return [...track.children].map((c) => Math.max(0, c.offsetLeft - track.offsetLeft - inset));
    };
    const step = () => {
      if (Date.now() < holdUntil) return;
      const max = track.scrollWidth - track.clientWidth;
      const x = track.scrollLeft;
      const next = x >= max - 4 ? 0 : (stops().find((s) => s > x + 4) ?? 0);
      track.scrollTo({ left: Math.min(next, max), behavior: reduce.matches ? 'auto' : 'smooth' });
    };
    const sync = () => {
      const run = phone.matches && visible && !document.hidden;
      if (run && !timer) timer = setInterval(step, STEP_MS);
      if (!run && timer) { clearInterval(timer); timer = 0; }
    };
    const hold = () => { holdUntil = Date.now() + IDLE_MS; };

    ['pointerdown', 'touchstart', 'wheel'].forEach((t) => track.addEventListener(t, hold, { passive: true }));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.5 }).observe(track);
    document.addEventListener('visibilitychange', sync);
    phone.addEventListener('change', sync);
  }

  M.horizontal = function init() {
    const section = document.querySelector('[data-hscroll]');
    if (!section) return () => {};
    const track = section.querySelector('[data-hscroll-track]');
    const phone = matchMedia('(max-width: 47.99rem)');
    autoplay(track, phone);

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
