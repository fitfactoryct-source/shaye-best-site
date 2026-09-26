// Generic reveal for the practical block: each .sec-head and each direct
// child of a grid/list fades up once as it enters.
export function initReveals(reduced) {
  if (reduced) return;
  const els = gsap.utils.toArray('.sec-head, .timeline li, .cost, .partner, .faq-list details, .social-body > div');
  gsap.set(els, { opacity: 0, y: 18 });
  ScrollTrigger.batch(els, { start: 'top 92%',
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, stagger: .05, duration: .5, ease: 'power2.out', overwrite: true }) });
}

// Loading-bar motif: fills 0→100% as `trigger` travels from its top hitting
// the viewport bottom to its top reaching 40% of the viewport.
export function initLoadBar(bar, trigger, reduced) {
  if (!bar) return;
  const fill = bar.querySelector('.load-fill');
  if (reduced) { gsap.set(fill, { scaleX: 1 }); return; }
  gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none',
    scrollTrigger: { trigger, start: 'top bottom', end: 'top 40%', scrub: true } });
}

export function initSponsors(reduced) {
  // Tiles scroll horizontally in a marquee track, so a per-tile reveal would fight the
  // motion (and would double-animate the aria-hidden duplicate set). Reveal the marquee
  // as one unit instead; the sponsor-title block is unrelated and keeps its own reveal.
  if (!reduced) {
    const marquee = document.querySelector('.sp-marquee');
    if (marquee) {
      gsap.set(marquee, { opacity: 0, y: 24 });
      gsap.to(marquee, { opacity: 1, y: 0, duration: .6, ease: 'power2.out',
        scrollTrigger: { trigger: marquee, start: 'top 92%', once: true } });
    }
    gsap.from('.sponsor-title', { opacity: 0, y: 14, duration: .6, ease: 'power3.out',
      scrollTrigger: { trigger: '.sponsor-title', start: 'top 85%', once: true } });
  }

  const track = document.querySelector('.sp-track');
  if (!track || reduced) return;              // reduced: static grid via CSS
  const loop = gsap.to(track, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });
  const pause = () => loop.pause(), play = () => loop.play();
  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', play);
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', play);
}

// Pointer pull for the main CTAs. Within `radius` px of the element's centre
// the element translates toward the pointer, up to `max` px, fading to
// nothing at the edge of the radius. Pure; the DOM wiring is below.
export function magneticOffset(dx, dy, radius, max) {
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > radius) return { x: 0, y: 0 };
  const k = (1 - d / radius) * max / d;
  return { x: dx * k, y: dy * k };
}

// Closer: a champion-step clip fades in as the section approaches — the
// section had no imagery at all before (void + a radial glow only). Same
// deferred-load/IntersectionObserver-play pattern as climb.js's fire.
const CLOSER_CLIP = 'assets/clips/closer-champion-step.mp4';
export function initCloserVideo(reduced) {
  if (reduced) return;
  const sec = document.getElementById('closer');
  const video = sec?.querySelector('.cl-champ');
  if (!video || !video.canPlayType('video/mp4')) return;
  video.src = CLOSER_CLIP;
  video.addEventListener('playing', () => sec.classList.add('champ-live'), { once: true });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
  }, { threshold: 0.1 }).observe(sec);
}

export function initMagnetic(selector, reduced) {
  if (reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const els = gsap.utils.toArray(selector);
  if (!els.length) return;
  const REACH = 80, MAX = 6;
  const movers = els.map(el => ({
    el,
    qx: gsap.quickTo(el, 'x', { duration: .35, ease: 'power2.out' }),
    qy: gsap.quickTo(el, 'y', { duration: .35, ease: 'power2.out' })
  }));
  window.addEventListener('pointermove', e => {
    for (const m of movers) {
      const r = m.el.getBoundingClientRect();
      const o = magneticOffset(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2), r.width / 2 + REACH, MAX);
      m.qx(o.x); m.qy(o.y);
    }
  }, { passive: true });
}
