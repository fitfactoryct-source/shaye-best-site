// Pinned ~1.4 viewports: the plate pushes in 1.0→1.08 while the four throne
// crowns ignite in turn, "Four thrones stood." lands after the fourth, then a
// fifth glow rises out of the empty stairs at centre with "A fifth is rising."
// The glows sit inside the plate so the push carries them with the thrones;
// their positions come from the still's cover maths (object-position center
// 30%) so they stay on the crowns at any viewport. Reduced: static, everything
// visible and lit (css lights the glows).
const IMG_W = 1152, IMG_H = 2048;

function placeGlows(sec, glows) {
  const sw = sec.clientWidth, sh = sec.clientHeight;
  if (!sw || !sh) return;
  const s = Math.max(sw / IMG_W, sh / IMG_H);
  const w = IMG_W * s, h = IMG_H * s;
  const ox = (sw - w) * 0.5, oy = (sh - h) * 0.30;
  glows.forEach(g => {
    g.style.left = (ox + w * +g.dataset.fx) + 'px';
    g.style.top = (oy + h * +g.dataset.fy) + 'px';
  });
}

export function initGathering(reduced) {
  const sec = document.getElementById('gathering');
  if (!sec) return;
  const plate = sec.querySelector('.g-plate');
  const glows = gsap.utils.toArray(sec.querySelectorAll('.g-glow'));
  const lines = ['.g-l1', '.g-l2'].map(s => sec.querySelector(s));
  placeGlows(sec, glows);
  if (reduced) { gsap.set(lines, { opacity: 1, y: 0 }); return; }
  gsap.set(lines, { opacity: 0, y: 40 });
  gsap.set(plate, { willChange: 'transform' });
  const tl = gsap.timeline({
    scrollTrigger: { id: 'gathering', trigger: sec, start: 'top top', end: '+=140%', pin: true, scrub: 0.6,
      invalidateOnRefresh: true, onRefresh: () => placeGlows(sec, glows) }
  });
  tl.to(plate, { scale: 1.08, ease: 'none', duration: 1 }, 0);
  // Count-in: each crown flares, then settles.
  glows.slice(0, 4).forEach((g, i) => {
    const at = .08 + i * .12;
    tl.fromTo(g, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1.15, duration: .06, ease: 'power2.out' }, at)
      .to(g, { opacity: .8, scale: 1, duration: .08, ease: 'power1.inOut' }, at + .06);
  });
  tl.to(lines[0], { opacity: 1, y: 0, duration: .2, ease: 'power2.out' }, .52);
  // The fifth rises out of the stairs as it ignites; the line lands on it.
  tl.fromTo(glows[4], { opacity: 0, scale: .5, y: 90 }, { opacity: 1, scale: 1.2, y: 0, duration: .14, ease: 'power2.out' }, .70)
    .to(glows[4], { opacity: .9, scale: 1, duration: .08, ease: 'power1.inOut' }, .84)
    .to(lines[1], { opacity: 1, y: 0, duration: .2, ease: 'power2.out' }, .76)
    .to({}, { duration: .18 });   // hold on the finished headline before unpinning
}
