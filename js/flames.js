export function initFlames(reduced) {
  const layers = gsap.utils.toArray('.flame-layer');
  if (!layers.length) return;
  if (reduced) return;                       // layers render static at CSS opacity
  layers.forEach((el, i) => {
    gsap.to(el, { y: -(8 + i * 6), scaleY: 1.02 + i * 0.01, duration: 3.4 - i * 0.6,
      yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(el, { opacity: `-=${0.08 + i * 0.04}`, duration: 1.7 - i * 0.3,
      yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.4 });
    gsap.to(el, { yPercent: -(4 + i * 4), ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
}
