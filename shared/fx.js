/* Общие анимации: плавный скролл (Lenis), появления при скролле, параллакс,
   побуквенная/пословная анимация текста, магнитные кнопки. Требует GSAP + ScrollTrigger. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const FX = window.FX = { reduce, coarse };

  // Разбивка текста на буквы/слова с сохранением пробелов
  FX.split = function (el, mode = 'chars') {
    if (el.dataset.splitDone) return $$('.fx-u', el);
    el.dataset.splitDone = 1;
    el.setAttribute('aria-label', el.textContent.trim());
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => {
      const inner = mode === 'chars' ? Array.from(w).map(c => `<span class="fx-u">${c}</span>`).join('') : `<span class="fx-u">${w}</span>`;
      return `<span class="fx-w" aria-hidden="true">${inner}</span>`;
    }).join(' ');
    return $$('.fx-u', el);
  };

  FX.init = function (opts = {}) {
    const header = document.querySelector('[data-header]');
    const onScroll = y => header && header.classList.toggle('is-scrolled', y > 40);
    if (!window.gsap || reduce) {
      addEventListener('scroll', () => onScroll(scrollY), { passive: true });
      document.documentElement.classList.add('fx-off');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('fx');

    // Плавный скролл
    if (window.Lenis && opts.smooth !== false && !coarse) {
      const lenis = FX.lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', e => { ScrollTrigger.update(); onScroll(e.scroll); });
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (a && a.getAttribute('href').length > 1) { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } }
      });
      new MutationObserver(() => {
        const lock = document.body.classList.contains('zl-cart-open');
        lock ? lenis.stop() : lenis.start();
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

    // Появления
    const from = {
      up: { y: 60, opacity: 0 }, fade: { opacity: 0 }, left: { x: -80, opacity: 0 }, right: { x: 80, opacity: 0 },
      scale: { scale: .85, opacity: 0 }, clip: { clipPath: 'inset(100% 0 0 0)' }, 'clip-x': { clipPath: 'inset(0 100% 0 0)' },
      blur: { opacity: 0, filter: 'blur(14px)', y: 30 }
    };
    $$('[data-reveal]').forEach(el => {
      const type = el.dataset.reveal || 'up';
      gsap.from(el, { ...from[type], duration: +el.dataset.dur || 1.1, delay: +el.dataset.delay || 0, ease: 'expo.out', clearProps: 'filter',
        scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('[data-stagger]').forEach(box => {
      gsap.from(box.children, { y: 50, opacity: 0, duration: 1, stagger: +box.dataset.stagger || .1, ease: 'expo.out',
        scrollTrigger: { trigger: box, start: 'top 85%' } });
    });
    // Буквы
    $$('[data-split]').forEach(el => {
      const u = FX.split(el, el.dataset.split || 'chars');
      const cfg = { yPercent: 110, opacity: 0, rotate: el.dataset.rot ? 8 : 0, duration: 1.2, stagger: el.dataset.split === 'words' ? .06 : .035, ease: 'expo.out', delay: +el.dataset.delay || 0 };
      if (el.hasAttribute('data-onload')) gsap.from(u, cfg);
      else gsap.from(u, { ...cfg, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    // Слова подсвечиваются при скролле
    $$('[data-words]').forEach(el => {
      const u = FX.split(el, 'words');
      gsap.fromTo(u, { opacity: .14 }, { opacity: 1, stagger: .1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } });
    });
    // Параллакс
    $$('[data-parallax]').forEach(el => {
      const k = +el.dataset.parallax;
      gsap.fromTo(el, { yPercent: -k * 50 }, { yPercent: k * 50, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Счётчики
    $$('[data-count-to]').forEach(el => {
      const to = +el.dataset.countTo, o = { v: 0 };
      gsap.to(o, { v: to, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('ru-RU') });
    });
    // Магнитные кнопки
    if (!coarse) $$('[data-magnetic]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4 }); });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
    });
    // Карточки каталога
    const animateCards = box => gsap.from(box.children, { y: 40, opacity: 0, duration: .8, stagger: .06, ease: 'expo.out', clearProps: 'transform,opacity' });
    if (window.ZL) {
      window.ZL.onRender = animateCards;
      $$('[data-products]').forEach(box => {
        gsap.set(box.children, { opacity: 0, y: 50 });
        ScrollTrigger.create({ trigger: box, start: 'top 85%', once: true, onEnter: () => gsap.to(box.children, { y: 0, opacity: 1, duration: 1, stagger: .07, ease: 'expo.out', clearProps: 'transform,opacity' }) });
      });
    }
    addEventListener('load', () => ScrollTrigger.refresh());
  };
})();
