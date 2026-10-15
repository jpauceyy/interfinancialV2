/*
 * Pinned section: vertical scroll drives the horizontal card track + backdrop.
 * On phones the track is a native swipe carousel instead (see components.css),
 * so the scroll-driven transform is cleared there and the carousel autoplays.
 */
(function (M) {
  /*
   * Phone carousel autoplay: a continuous, seamless drift. The card set is duplicated
   * once (clones are aria-hidden and hidden from md up); when the strip has travelled
   * exactly one set's width it jumps back by that width, which looks identical, so the
   * loop never shows a seam. Runs only while on screen and the tab is visible; touching
   * or swiping pauses it and it picks up from wherever the user left it.
   * With reduced motion it steps one card at a time without sliding instead.
   */
  function autoplay(track, phone) {
    const SPEED = 32;               // px per second
    const IDLE_MS = 3000;           // resume after this long without interaction
    const STEP_MS = 3200;           // reduced-motion step interval
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const originals = [...track.children];

    // one duplicate set, made visible immediately (they never go through the reveal)
    originals.forEach((el) => {
      const c = el.cloneNode(true);
      c.setAttribute('data-clone', '');
      c.setAttribute('aria-hidden', 'true');
      [c, ...c.querySelectorAll('*')].forEach((n) => { n.classList.remove('txt', 'img-in', 'rise'); n.removeAttribute('loading'); });
      track.append(c);
    });
    const loopWidth = () => track.querySelector('[data-clone]').offsetLeft - originals[0].offsetLeft;

    let raf = 0, timer = 0, last = 0, pos = 0, visible = false, holdUntil = 0;

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(64, t - last) : 0;
      last = t;
      if (Date.now() < holdUntil) { pos = track.scrollLeft; track.style.setProperty('--drift', 0); return; }
      const w = loopWidth();
      pos += (SPEED * dt) / 1000;
      if (w > 0 && pos >= w) pos -= w;
      // browsers round scroll positions, so a slow drift would tick in whole pixels;
      // scroll by whole pixels and shift the cards by the sub-pixel remainder instead
      const whole = Math.floor(pos);
      track.scrollLeft = whole;
      track.style.setProperty('--drift', (pos - whole).toFixed(3));
    };
    const step = () => {
      if (Date.now() < holdUntil) return;
      const stops = originals.map((c) => c.offsetLeft - originals[0].offsetLeft);
      const next = stops.find((s) => s > track.scrollLeft + 4);
      track.scrollLeft = next === undefined ? 0 : next; // after the last original, back to the start
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; clearInterval(timer); timer = 0; track.style.setProperty('--drift', 0); };
    const sync = () => {
      const run = phone.matches && visible && !document.hidden;
      if (!run) return stop();
      if (reduce.matches) { if (raf) stop(); if (!timer) timer = setInterval(step, STEP_MS); }
      else if (!raf) { if (timer) stop(); pos = track.scrollLeft; raf = requestAnimationFrame(frame); }
    };
    const hold = () => { holdUntil = Date.now() + IDLE_MS; };

    ['pointerdown', 'touchstart', 'wheel'].forEach((t) => track.addEventListener(t, hold, { passive: true }));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.3 }).observe(track);
    document.addEventListener('visibilitychange', sync);
    phone.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
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
