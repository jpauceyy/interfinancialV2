/* Header shrinks into a compact pill once the page scrolls. */
(function (M) {
  M.nav = function init() {
    const nav = document.querySelector('.nav');
    if (!nav) return () => {};
    return function update() {
      nav.classList.toggle('is-compact', scrollY > 40);
    };
  };
})((window.Mortgage = window.Mortgage || {}));
