/* Вариант 4 — слайдшоу пейзажей, хит недели, прогресс калькулятора */
FX.init();
(function () {
  // Слайдшоу
  const slides = [...document.querySelectorAll('.slide')], dots = [...document.querySelectorAll('.dots button')];
  let cur = 0, timer;
  function go(i) {
    slides[cur].classList.remove('is-on'); dots[cur].classList.remove('is-on');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('is-on'); void dots[cur].offsetWidth; dots[cur].classList.add('is-on');
    clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 6000);
  }
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  if (!FX.reduce) timer = setTimeout(() => go(1), 6000);

  // Хит недели
  const hit = ZL.products.find(p => p.id === 'p10');
  document.querySelector('[data-hit-art]').innerHTML = ZL.art(hit);

  // Прогресс до бесплатной доставки и скидки
  const bar = document.querySelector('[data-calc-bar]'), goal = document.querySelector('[data-calc-goal]');
  function upd(t) {
    bar.style.transform = `scaleX(${Math.min(1, t.subtotal / 5000)})`;
    goal.innerHTML = !t.count ? 'Добавьте товары — и здесь появится сумма'
      : t.subtotal >= 5000 ? 'Скидка 5% уже применена 🎉'
      : t.subtotal >= 3000 ? `Курьер уже бесплатно. До скидки 5% — <b>${ZL.rub(5000 - t.subtotal)}</b>`
      : `До бесплатного курьера — <b>${ZL.rub(3000 - t.subtotal)}</b>`;
  }
  ZL.onCart = upd; upd(ZL.totals());

  if (!window.gsap || FX.reduce) return;
  gsap.to('.slides', { yPercent: 20, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
  // 3D-наклон плиток за курсором
  if (!FX.coarse) document.querySelectorAll('.tile, .zl-card').forEach(t => {
    t.addEventListener('mousemove', e => { const r = t.getBoundingClientRect(); gsap.to(t, { rotateY: ((e.clientX - r.left) / r.width - .5) * 8, rotateX: -((e.clientY - r.top) / r.height - .5) * 8, transformPerspective: 900, duration: .5 }); });
    t.addEventListener('mouseleave', () => gsap.to(t, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
  });
})();
