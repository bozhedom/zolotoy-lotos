/* Вариант 5 — раскрытие кругом, сжатие героя в рамку, стопка карточек */
FX.init();
(function () {
  const media = document.querySelector('.hero__media');
  if (!window.gsap || FX.reduce) { media.style.clipPath = 'none'; document.querySelectorAll('.ritual__steps li').forEach(l => l.classList.add('is-in')); return; }

  // Интро: круг раскрывает туманную пагоду
  gsap.fromTo(media, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(80% at 50% 55%)', duration: 2.4, ease: 'expo.inOut', onComplete: () => gsap.set(media, { clipPath: 'none' }) });
  gsap.from('.hero__media img', { scale: 1.4, duration: 3, ease: 'expo.out' });

  // Скролл: герой закрепляется и «сжимается» в арку
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    gsap.timeline({ scrollTrigger: { trigger: '.hero__pin', start: 'top top', end: '+=90%', pin: true, scrub: 1 } })
      .to(media, { scale: .62, borderRadius: '400px 400px 24px 24px', ease: 'none' }, 0)
      .to('.hero__media img', { scale: 1.25, ease: 'none' }, 0)
      .to('.hero__veil', { opacity: 0, ease: 'none' }, 0)
      .to('.hero__text', { yPercent: -40, opacity: 0, ease: 'none' }, 0)
      .to('.hero__hint', { opacity: 0, ease: 'none' }, 0);
  });

  // Карточки стран уходят вглубь, когда сверху ложится следующая
  const cards = gsap.utils.toArray('.scard');
  cards.forEach((c, i) => {
    if (i === cards.length - 1) return;
    gsap.to(c, { scale: .94, filter: 'brightness(.92)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 30%', scrub: true } });
  });
  gsap.utils.toArray('.scard__img img').forEach(img => gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Круги-«тушь» у шагов
  document.querySelectorAll('.ritual__steps li').forEach(li => ScrollTrigger.create({ trigger: li, start: 'top 85%', once: true, onEnter: () => li.classList.add('is-in') }));
  gsap.from('.intro__lotus', { rotate: -20, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: '.intro', start: 'top 80%' } });
})();
