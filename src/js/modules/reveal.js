/* Word-split + in-view reveal. Adds `.is-in` to [data-reveal] / [data-words] / .txt. */
(function (M) {
  function splitWords(root) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) { frag.append(w); return; }
            const s = document.createElement('span');
            s.className = 'cut';
            s.style.setProperty('--i', i++);
            s.textContent = w;
            frag.append(s);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && !c.classList.contains('cut') && !c.hasAttribute('aria-hidden')) {
          walk(c);
        }
      });
    };
    walk(root);
  }

  /*
   * Small text (titles, list items, captions, card copy) fades up from dim once it
   * scrolls into view, staggered among its siblings and after any .rise parent.
   * Text that already has its own animation (.cut / .rise / [data-words]) is left alone.
   */
  const TEXT = ['h3', 'h4', 'p', 'li', 'figcaption', 'address', 'a.btn-pill', '.stat > span', '.border-t > span > *'];
  const scoped = (list) => list.flatMap((s) => ['main ' + s, 'body > footer ' + s]).join(',');
  function tagText() {
    const seen = new Map();
    const banner = document.querySelector('main > section');
    return [...document.querySelectorAll(scoped(TEXT))].filter((el) => {
      if (!el.textContent.trim() || el.classList.contains('rise')) return false;
      if (banner && banner.contains(el)) return false; // the hero has its own choreography
      if (el.closest('.cut, [data-words], .marquee, [aria-hidden="true"]')) return false;
      if (el.querySelector('.cut, .rise, [data-words], h3, h4, p, li')) return false; // containers
      const n = seen.get(el.parentElement) || 0;
      seen.set(el.parentElement, n + 1);
      el.classList.add('txt');
      el.style.setProperty('--t', n);
      return true;
    });
  }

  /* Images below the banner fade in and settle from a slight zoom. */
  function tagImages() {
    const banner = document.querySelector('main > section');
    return [...document.querySelectorAll(scoped(['img']))].filter((img) => {
      if (banner && banner.contains(img)) return false;
      if (img.closest('.h-pill, [aria-hidden="true"]')) return false;
      img.classList.add('img-in');
      return true;
    });
  }

  M.reveal = function init() {
    document.querySelectorAll('[data-words]').forEach(splitWords);
    const vh = () => innerHeight;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        // tall sections may never reach 25% visible, so also accept "fills a third of the screen"
        if (e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height > vh() * 0.33)) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: [0, 0.1, 0.25, 0.5] });
    const sections = [...document.querySelectorAll('[data-reveal], [data-words]')];

    const ioText = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); ioText.unobserve(e.target); } });
    }, { threshold: 0.2 }); // no negative margin: text at the very bottom of the page must still trigger
    const small = [...tagText(), ...tagImages()];
    // hold everything until the splash hands over, so nothing animates behind it
    (M.intro || Promise.resolve()).then(() => {
      sections.forEach((el) => io.observe(el));
      small.forEach((el) => ioText.observe(el));
    });
  };
})((window.Mortgage = window.Mortgage || {}));
