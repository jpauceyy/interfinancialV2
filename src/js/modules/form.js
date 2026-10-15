/* Contact form: client-side validation + confirmation.
 * NOTE: no backend yet — wire `form.action` (or replace the TODO below) to your
 * form handler / email service before launch. */
(function (M) {
  M.form = function init() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach((el) => {
        const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
        el.setAttribute('aria-invalid', String(bad));
        if (bad) ok = false;
      });
      if (!ok) { status.textContent = 'Please check the highlighted fields.'; return; }
      // TODO: send FormData(form) to your endpoint here.
      status.textContent = 'Thanks for submitting! We will be in touch shortly.';
      form.reset();
    });
  };
})((window.Mortgage = window.Mortgage || {}));
