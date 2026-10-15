/* Smooth scrolling driven by Motion's spring animate(). Native scroll position is
 * the source of truth, so sticky / scroll-linked effects keep working untouched. */
(function (M) {
  M.smooth = function init(onScroll) {
    const Motion = window.Motion;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!Motion || !Motion.animate || reduce || !fine) return null;

    const root = document.documentElement;
    const maxY = () => root.scrollHeight - innerHeight;
    const clamp = (v) => Math.min(maxY(), Math.max(0, v));

    let target = scrollY, ctrl = null, running = false, vel = 0, lastY = scrollY, lastT = performance.now();

    function to(y, soft) {
      target = clamp(y);
      if (ctrl) ctrl.stop();
      running = true;
      ctrl = Motion.animate(scrollY, target, {
        type: 'spring',
        stiffness: soft ? 60 : 85,
        damping: soft ? 18 : 22,
        mass: 0.9,
        velocity: vel,
        restDelta: 0.4,
        restSpeed: 0.4,
        onUpdate: (v) => {
          const now = performance.now();
          vel = (v - lastY) / Math.max(1, now - lastT) * 1000;
          lastY = v; lastT = now;
          window.scrollTo(0, v);
          onScroll && onScroll();
        },
        onComplete: () => { running = false; vel = 0; },
      });
    }

    addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      // let nested scrollers (textareas etc.) handle their own wheel
      if (e.target.closest && e.target.closest('textarea, [data-native-scroll]')) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1;
      to((running ? target : scrollY) + e.deltaY * unit * 1.1);
    }, { passive: false });

    // keep in sync when something else moves the page (keyboard, scrollbar drag)
    addEventListener('scroll', () => { if (!running) { target = scrollY; lastY = scrollY; } }, { passive: true });

    // anchor links glide
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const t = id.length > 1 && document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        to(t.getBoundingClientRect().top + scrollY, true);
      });
    });
    return { to };
  };
})((window.Mortgage = window.Mortgage || {}));
