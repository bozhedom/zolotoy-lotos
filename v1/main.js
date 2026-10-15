/* Вариант 1 — интро героя, параллакс, золотая пыль */
FX.init();
(function () {
  const hero = document.querySelector('.hero');
  if (window.gsap && !FX.reduce) {
    gsap.from('.hero__bg img', { scale: 1.25, duration: 2.6, ease: 'expo.out' });
    gsap.to('.hero__bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__lotus', { scale: 1.4, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray('.arch img').forEach(img => gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentNode, scrub: true } }));
  }
  // Золотая пыль
  const cv = document.querySelector('.hero__dust'); if (!cv || FX.reduce) return;
  const ctx = cv.getContext('2d'); let w, h, dpr = Math.min(devicePixelRatio, 2), parts = [], visible = true;
  const n = FX.coarse ? 40 : 90;
  function size() { w = cv.width = cv.offsetWidth * dpr; h = cv.height = cv.offsetHeight * dpr; }
  size(); addEventListener('resize', size);
  for (let i = 0; i < n; i++) parts.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, s: Math.random() * .0006 + .0002, d: Math.random() * Math.PI * 2, a: Math.random() });
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(cv);
  (function loop(t) {
    requestAnimationFrame(loop); if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.s; p.x += Math.sin(t / 2000 + p.d) * .0003; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      const tw = .5 + .5 * Math.sin(t / 600 + p.d * 3);
      ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, 7);
      ctx.fillStyle = `rgba(246,220,148,${.25 + .6 * tw * p.a})`; ctx.shadowColor = '#f6dc94'; ctx.shadowBlur = 8 * dpr; ctx.fill();
    }
  })(0);
})();
