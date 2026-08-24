import { EVENT } from './data.js';
import { startCountdown } from './countdown.js';
import { startEmbers, startJudgingEmbers } from './embers.js';
import { forgeReveal } from './forge.js';
import { initFlames } from './flames.js';
import {
  renderLineups, initCalculator, renderDates, renderCosts, renderEventPhotos,
  renderPartners, renderSocial, renderSponsors, renderVenue, renderFaq, renderCloser
} from './render.js';
import {
  initLineups, initSponsors
} from './motion.js';
import { renderJudging, initJudging } from './judging.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

// 1. Content first — motion measures against real layout.
renderJudging(); renderEventPhotos(); renderLineups(); renderDates(); renderCosts();
renderPartners(); renderSocial(); renderSponsors(); renderVenue();
renderFaq(); renderCloser();
initCalculator();

// 2. CTAs
for (const id of ['hero-cta', 'sticky-cta', 'closer-cta']) {
  document.getElementById(id).href = EVENT.whatsapp;
}
startCountdown(document.getElementById('countdown'), EVENT.showDate);

// Sticky bar (Task 8): hidden at top, shows on scroll-up, hides on scroll-down.
const bar = document.getElementById('stickybar');
bar.hidden = false;

ScrollTrigger.create({
  start: 'top -85%',
  onUpdate: self => gsap.to(bar, {
    y: self.direction === -1 ? '0%' : '-100%',
    duration: .3, overwrite: true
  }),
  onLeaveBack: () => gsap.to(bar, { y: '-100%', duration: .3, overwrite: true })
});

// 3. Motion, created top-to-bottom so ScrollTrigger refreshes in page order.
initFlames(reduced);
initJudging(reduced);
initLineups(reduced);
initSponsors(reduced);
if (!reduced) {
  startEmbers(document.getElementById('embers'));
  startJudgingEmbers(document.getElementById('j-embers'));
}

// 4. Logo last — it fetches, so it resolves after layout is settled.
fetch('assets/logo.svg')
  .then(r => r.text())
  .then(svg => {
    const host = document.getElementById('logo-lockup');
    host.innerHTML = svg;
    forgeReveal(host.querySelector('svg'), reduced);
    ScrollTrigger.refresh();      // logo changes hero height
  });

// Fonts change metrics; re-measure once they land.
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
