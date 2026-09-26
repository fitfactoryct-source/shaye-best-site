// Hero fire. The three CSS flame layers render immediately and are all that
// ever renders under reduced motion / data-saver. When the browser can play
// the reel's fire loop, it is sourced after first paint, fades in on
// `playing`, and the CSS layers fade out under it. Any failure (rejected
// play(), no codec, low-power mode) leaves the CSS layers exactly as today.
const FIRE_SRC = 'assets/flames/fire-loop-v1.mp4';

export function initFlames(reduced) {
  const hero = document.getElementById('hero');
  const layers = gsap.utils.toArray('.flame-layer');
  if (!hero || !layers.length) return;
  if (reduced) return;                       // layers render static at CSS opacity

  const loops = layers.flatMap((el, i) => [
    gsap.to(el, { y: -(8 + i * 6), scaleY: 1.02 + i * 0.01, duration: 5.5 - i * 0.8,
      yoyo: true, repeat: -1, ease: 'sine.inOut' }),
    gsap.to(el, { opacity: `-=${0.08 + i * 0.04}`, duration: 1.7 - i * 0.3,
      yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.4 }),
    gsap.to(el, { yPercent: -(4 + i * 4), ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
  ]);

  const video = hero.querySelector('.fire-loop');
  if (!video || !video.canPlayType('video/mp4')) return;

  const light = () => {
    video.src = FIRE_SRC;
    video.play().catch(() => {});          // rejection: CSS flames stay, nothing else happens
  };
  if ('requestIdleCallback' in window) requestIdleCallback(light, { timeout: 1500 });
  else setTimeout(light, 300);

  video.addEventListener('playing', () => {
    hero.classList.add('has-fire');
    loops.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
    gsap.to(layers, { opacity: 0, duration: 1.2, overwrite: true,
      onComplete: () => gsap.set(layers, { display: 'none' }) });
    gsap.set(video, { willChange: 'transform' });
    gsap.to(video, { yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(hero);
  }, { once: true });
}
