/* Boot: wire modules and run scroll-linked updates on one rAF-throttled handler. */
(function (M) {
  M.reveal();
  M.menu && M.menu();
  M.form && M.form();
  M.type && M.type();
  const updaters = [M.stack(), M.horizontal(), M.parallax(), M.nav(), M.scrollScale ? M.scrollScale() : () => {}];

  let queued = false;
  const run = () => { queued = false; updaters.forEach((u) => u()); };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  M.smooth(schedule);
  document.documentElement.classList.add('is-ready');
  run();
})(window.Mortgage);
