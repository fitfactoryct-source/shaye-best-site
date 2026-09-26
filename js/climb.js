import { scrubClip } from './scrub.js';

// The mountain's lava-stairs footage is SCRUBBED by the scroll across the
// section's whole travel (top entering the viewport to bottom leaving it), so
// scrolling up the ledges is climbing the stairs (Troy, 2026-09-22, scroll
// set-piece 3; he picked "scrub only" over scrub + pan). The clip covers the
// section and holds still; the static plate underneath keeps its gentle
// natural-aspect translateY pan as the fallback (no pin, no sideways motion:
// Troy flagged the old desktop rail-pan as unwanted). Real fire ambience
// loops on top, the same loop the hero and closer both use. Ledges fade up in
// a wrapping grid with a scale/blur "landing" and a brief ember-glow flare —
// the summit beat crossfades' visual language, not a new device. Reduced:
// static stack, plate as a dim backdrop, no fire, no clip.
const FIRE_SRC = 'assets/flames/fire-loop-v1.mp4';
const CLIMB_CLIP = {
  desktop: 'assets/clips/climb-lava-stairs-scrub.mp4',
  mobile:  'assets/clips/climb-lava-stairs-scrub-m.mp4'
};

function initClimbFire(sec) {
  const video = sec.querySelector('.c-fire');
  if (!video || !video.canPlayType('video/mp4')) return;
  video.src = FIRE_SRC;   // already cached from the hero by the time a visitor scrolls this far
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { video.play().catch(() => {}); video.classList.add('is-live'); }
    else { video.pause(); video.classList.remove('is-live'); }
  }, { threshold: 0.1 }).observe(sec);
}

export function initClimb(reduced) {
  const sec = document.getElementById('climb');
  if (!sec) return;
  const bg = sec.querySelector('.c-bg');
  const clip = sec.querySelector('.c-clip');
  if (reduced) return;                            // CSS handles the static layout

  sec.classList.add('js-pan');
  gsap.set(bg, { willChange: 'transform' });
  // How far the plate overhangs the section once it's width-fitted; 0 when it doesn't.
  const overhang = () => Math.min(0, sec.clientHeight - bg.getBoundingClientRect().height);

  gsap.fromTo(bg, { y: overhang }, { y: 0, ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });

  // The climb: the clip's playhead follows the same travel, smoothed like every other scrub on the site.
  const seekTo = scrubClip(sec, clip,
    () => matchMedia('(min-width: 821px)').matches ? CLIMB_CLIP.desktop : CLIMB_CLIP.mobile,
    () => sec.classList.add('clip-live'));
  const scrub = { t: 0 };
  gsap.to(scrub, { t: 1, ease: 'none', onUpdate: () => seekTo(scrub.t),
    scrollTrigger: { id: 'climb', trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });

  const ledges = gsap.utils.toArray('.ledge');
  gsap.set(ledges, { opacity: 0, y: 34, scale: .94, filter: 'blur(6px)' });
  ScrollTrigger.batch(ledges, { start: 'top 90%',
    onEnter: batch => batch.forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: .6, delay: i * .08, ease: 'power3.out', overwrite: true });
      gsap.fromTo(el, { boxShadow: '0 0 0px rgba(255,122,24,0)' },
        { boxShadow: '0 0 30px rgba(255,122,24,.5)', duration: .3, delay: i * .08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }) });

  initClimbFire(sec);
}
