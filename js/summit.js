import { OVERALLS, EVENT, ZAR_NOTE } from './data.js';
import { rand } from './render.js';
import { startJudgingEmbers, burst } from './embers.js';

// The summit's money reveal: a pinned beat sequence, one full-bleed character
// per division, amount slamming and counting up as it lands, an ember burst
// on the hit, then the R190 000 finale over all five thrones. Same mechanic
// the 2026 site's "judging" section used (pin/crossfade/count-up/burst).
// The four known divisions show the campaign's cinematic masters — King,
// Queen, the two challengers — not the prior year's winners (Troy,
// 2026-09-22: no winners on the prize money). Framing is per character in
// css (.s-beat[data-key]): the stage shows ~35% of each portrait's height,
// heads high for the King/Queen, low for the rear-view challengers.
// Classic Physique shows its champion like the other four (Troy, 2026-09-26:
// the character, not the throne-rise clip, which stays on disk unreferenced).
const PHOTO_BY_KEY = {
  'mens-bb':       'assets/2027/summit-king.webp',
  'ladies-bb':     'assets/2027/summit-queen.webp',
  'mens-physique': 'assets/2027/summit-challenger-m.webp',
  'ladies-bikini': 'assets/2027/summit-challenger-f.webp',
  'classic':       'assets/2027/classic-master.webp'
};
// Prize order, biggest first (Troy, 2026-09-26), not throne order; then the grand total.
const BEAT_ORDER = ['mens-bb', 'classic', 'ladies-bb', 'mens-physique', 'ladies-bikini'];

export const BEATS = [
  ...BEAT_ORDER.map(key => {
    const o = OVERALLS.find(x => x.key === key);
    return { ...o, photo: PHOTO_BY_KEY[key], isNew: key === 'classic' };
  }),
  { key: 'finale', title: null, amount: null, throne: null, photo: 'assets/2027/champion-at-throne.webp', isFinale: true }
];

// Throne anchor points as fractions of the still (x centre, y just above the throne top).
export const THRONE_XY = [[0.305, 0.34], [0.420, 0.34], [0.506, 0.24], [0.592, 0.34], [0.699, 0.34]];

function sizeStage(stage, sec) {
  const sw = stage.clientWidth, sh = stage.clientHeight;
  if (!sw || !sh) return;
  const scale = Math.min(sw / 1344, sh / 768);
  const iw = 1344 * scale, ih = 768 * scale;
  sec.style.setProperty('--ix', `${(sw - iw) / 2}px`);
  sec.style.setProperty('--iy', `${(sh - ih) / 2}px`);
  sec.style.setProperty('--iw', `${iw}px`);
  sec.style.setProperty('--ih', `${ih}px`);
}

export function renderSummit() {
  document.getElementById('s-beats').innerHTML = BEATS.map((b, i) => {
    if (b.isFinale) {
      return `<article class="s-beat s-beat-finale" data-beat="${i}">
        <img class="s-beat-photo" src="${b.photo}" alt="All five champions at their thrones, the Classic Physique champion at the centre" loading="lazy">
        <div class="s-beat-copy">
          <p class="label">Every overall, together</p>
          <p class="s-amt s-big cond" data-to="${EVENT.prizeTotal}">${rand(0)}</p>
          <p class="wide">In cash prizes · Fully loaded</p>
          <p>${ZAR_NOTE}</p>
        </div>
      </article>`;
    }
    return `<article class="s-beat${b.isNew ? ' s-beat-new' : ''}" data-beat="${i}" data-throne="${b.throne}" data-key="${b.key}">
      <img class="s-beat-photo" src="${b.photo}" alt="The ${b.title} champion, face in shadow" loading="lazy">
      <div class="s-beat-copy">
        <p class="label">${b.title} overall${b.isNew ? '<br>New for 2027' : ''}</p>
        <p class="s-amt cond" data-to="${b.amount}">${rand(0)}</p>
        ${b.runnerUp ? `<p class="s-ru">Runner-up <b>${rand(b.runnerUp)}</b></p>` : ''}
        <p>${ZAR_NOTE}</p>
      </div>
    </article>`;
  }).join('');
}

export function initSummit(reduced) {
  const sec = document.getElementById('summit');
  const stage = document.getElementById('s-stage');
  const beats = gsap.utils.toArray('.s-beat');
  const glows = gsap.utils.toArray('.s-glow');
  const fill = sec.querySelector('#s-bar .load-fill');
  const canvas = document.getElementById('s-embers');

  glows.forEach(g => {
    const [x, y] = THRONE_XY[+g.dataset.throne];
    g.style.setProperty('--tx', x); g.style.setProperty('--ty', y);
  });

  const paintFinal = () => beats.forEach(b => {
    const amt = b.querySelector('.s-amt');
    if (amt) amt.textContent = rand(+amt.dataset.to);
  });

  if (reduced || navigator.connection?.saveData) { // static: finale visible, every amount final
    gsap.set(beats, { opacity: 0 });
    gsap.set(beats[beats.length - 1], { opacity: 1 });
    gsap.set(glows, { opacity: 0 });
    gsap.set(fill, { scaleX: 1 });
    paintFinal();
    return;
  }

  gsap.set(beats, { opacity: 0 });
  gsap.set(beats[0], { opacity: 1 });
  gsap.set(glows, { opacity: 0 });

  startJudgingEmbers(canvas);

  gsap.matchMedia().add({ desktop: '(min-width: 821px)', mobile: '(max-width: 820px)' }, ctx => {
    const isDesktop = !!ctx.conditions.desktop;
    if (isDesktop) sizeStage(stage, sec);

    const N = BEATS.length;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'summit',
        trigger: sec, start: 'top top', end: '+=' + N * (isDesktop ? 130 : 100) + '%',
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onRefresh: () => { if (isDesktop) sizeStage(stage, sec); }
      }
    });

    tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: N }, 0);

    BEATS.forEach((b, i) => {
      tl.addLabel(`beat${i}`, i + .9);
      const el = beats[i];
      // No throne glow where it would land on the champion (Classic's neck, the mirrored Bikini's hip).
      const glow = b.throne != null && !['classic', 'ladies-bikini'].includes(b.key) ? glows[b.throne] : null;

      if (i > 0) {
        const prev = beats[i - 1];
        const prevThrone = BEATS[i - 1].throne;
        const prevGlow = prevThrone != null ? glows[prevThrone] : null;
        tl.to(prev, { opacity: 0, scale: 1.04, filter: 'blur(6px)', duration: .4 }, i)
          .fromTo(el, { opacity: 0, scale: .97, filter: 'blur(4px)' },
                       { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .5 }, i + .1)
          .call(burst, [70], i + .25);
        if (prevGlow) tl.to(prevGlow, { opacity: 0, duration: .3 }, i);
      }
      if (glow) tl.to(glow, { opacity: .9, duration: .3 }, i + .1);
      if (b.isFinale) tl.to(glows, { opacity: .55, duration: .4 }, i + .1); // every throne together, one last time

      const amtEl = el.querySelector('.s-amt');
      if (amtEl) {
        const target = +amtEl.dataset.to;
        const o = { v: 0 };
        tl.to(o, { v: target, duration: .55, ease: 'power2.out',
          onUpdate: () => amtEl.textContent = rand(o.v) }, i + .25);
      }
    });
    tl.addLabel('end');   // no explicit position: anchors to the real end of the last tween,
                          // not a guessed number — a mismatch there is what makes scrub/snap
                          // jump unpredictably (the tl's actual duration ends up short of N)

    return () => { tl.scrollTrigger?.kill(); };
  });
}
