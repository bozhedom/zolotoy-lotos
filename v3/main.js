/* Вариант 3 — горизонтальное путешествие, чек-калькулятор */
FX.init();
(function () {
  const rub = ZL.rub;
  // Живой чек
  const box = document.querySelector('[data-receipt]');
  function receipt(t) {
    box.innerHTML = t.items.length
      ? t.items.map(([id, q]) => { const p = ZL.products.find(x => x.id === id); return `<li><span>${p.title} ×${q}</span><span>${rub(p.price * q)}</span></li>`; }).join('')
      : '<li class="receipt__empty">Пока пусто — добавьте товары из каталога</li>';
    document.querySelector('[data-r-del]').textContent = ZL.state.delivery === 'courier' ? (t.delivery ? rub(t.delivery) : 'бесплатно') : 'самовывоз · 0 ₽';
    document.querySelector('[data-r-disc-row]').hidden = !t.discount;
    document.querySelector('[data-r-disc]').textContent = `−${rub(t.discount)} (${t.pct}%)`;
  }
  ZL.onCart = receipt; receipt(ZL.totals());

  if (!window.gsap || FX.reduce) return;
  gsap.from('.hero__line:first-child', { xPercent: -6, duration: 2, ease: 'expo.out' });
  gsap.to('.hero__title', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.hero__ph img').forEach((img, i) => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6 + i * 3, ease: 'none', scrollTrigger: { trigger: '.hero__strip', start: 'top bottom', end: 'bottom top', scrub: true } }));

  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const track = document.querySelector('.journey__track');
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.journey', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
      gsap.utils.toArray('.jcard__img img').forEach(img => gsap.to(img, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
      gsap.utils.toArray('.jcard__txt').forEach(t => gsap.from(t.children, { y: 40, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, containerAnimation: tween, start: 'left 75%' } }));
    }
  });
})();
