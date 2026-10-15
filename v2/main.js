/* Вариант 2 — лепестки, параллакс орбит за курсором */
FX.init();
(function () {
  if (window.gsap && !FX.reduce) {
    gsap.to('.hero__window img', { scale: 1.15, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.orb, .hero__badge', { scale: 0, duration: 1.4, stagger: .15, delay: .6, ease: 'elastic.out(1,.6)' });
    gsap.to('.hero__art .orb--1', { yPercent: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__art .orb--3', { yPercent: -120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    if (!FX.coarse) {
      const art = document.querySelector('.hero__art');
      addEventListener('mousemove', e => {
        const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        gsap.to('.hero__window', { x: x * 14, y: y * 10, duration: 1 });
        document.querySelectorAll('.orb').forEach((o, i) => gsap.to(o, { x: x * (30 + i * 18), y: y * (24 + i * 12), duration: 1.2 }));
      });
    }
  }
  // Падающие лепестки
  const cv = document.querySelector('.petals'); if (!cv || FX.reduce) return;
  const ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, 2); let w, h, visible = true;
  const colors = ['#f6b7c9', '#f9cdd9', '#efa3bc', '#fde0e8', '#f3c7a5'];
  function size() { w = cv.width = cv.offsetWidth * dpr; h = cv.height = cv.offsetHeight * dpr; }
  size(); addEventListener('resize', size);
  const ps = Array.from({ length: FX.coarse ? 16 : 32 }, () => ({ x: Math.random(), y: Math.random() * -1, s: 8 + Math.random() * 10, vy: .0006 + Math.random() * .0008, r: Math.random() * 6, vr: (Math.random() - .5) * .03, d: Math.random() * 6, c: colors[Math.random() * colors.length | 0] }));
  new IntersectionObserver(e => visible = e[0].isIntersecting).observe(cv);
  (function loop(t) {
    requestAnimationFrame(loop); if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.y += p.vy; p.x += Math.sin(t / 1400 + p.d) * .0007; p.r += p.vr;
      if (p.y > 1.05) { p.y = -.05; p.x = Math.random(); }
      const s = p.s * dpr, flip = Math.abs(Math.sin(t / 900 + p.d));
      ctx.save(); ctx.translate(p.x * w, p.y * h); ctx.rotate(p.r); ctx.scale(1, .4 + flip * .6);
      ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * .9, -s * .6, s * .7, s * .6, 0, s); ctx.bezierCurveTo(-s * .7, s * .6, -s * .9, -s * .6, 0, -s);
      ctx.fillStyle = p.c; ctx.globalAlpha = .85; ctx.fill(); ctx.restore();
    }
  })(0);
})();
