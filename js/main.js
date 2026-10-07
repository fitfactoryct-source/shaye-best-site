import { EVENT } from './data.js';
import { startCountdown } from './countdown.js';
import { startEmbers } from './embers.js';
import { forgeReveal } from './forge.js';
import { initFlames } from './flames.js';
import {
  renderHero, renderClimb, renderShaye, renderHighlights, renderDates, renderCosts,
  initCalculator, renderPartners, renderSocial, renderSponsors, renderVenue, renderFaq, renderCloser
} from './render.js';
import { initSponsors, initReveals, initLoadBar, initMagnetic, initCloserVideo } from './motion.js';
import { initGathering } from './gathering.js';
import { initClimb } from './climb.js';
import { initSummit, renderSummit } from './summit.js';
import { initRail } from './rail.js';
import { initLightbox } from './lightbox.js';

// `?reduced=1` forces the static fallbacks for local verification.
// Data-saver (§5.4) gets the same static fallbacks as reduced motion.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  || new URLSearchParams(location.search).has('reduced')
  || !!navigator.connection?.saveData;
document.documentElement.classList.toggle('reduced', reduced);

gsap.registerPlugin(ScrollTrigger);

// 1. Content first — motion measures against real layout.
renderHero(); renderClimb(); renderSummit(); renderShaye(); renderHighlights(); initLightbox();
renderDates(); renderCosts(); renderPartners(); renderSocial(); renderSponsors();
renderVenue(); renderFaq(); renderCloser();
initCalculator();
initMagnetic('.cta', reduced);

// 2. CTAs + countdown (dormant until a show date is confirmed).
for (const id of ['hero-cta', 'closer-cta']) document.getElementById(id).href = EVENT.whatsapp;
if (EVENT.showDate) {
  document.getElementById('countdown-label').hidden = false;
  const cd = document.getElementById('countdown'); cd.hidden = false;
  startCountdown(cd, EVENT.showDate);
}

// 3. Motion, top-to-bottom so ScrollTrigger refreshes in page order.
initFlames(reduced);
initGathering(reduced);
initClimb(reduced);
initSummit(reduced);
initReveals(reduced);
initLoadBar(document.getElementById('soc-bar'), '#social', reduced);
initSponsors(reduced);
initCloserVideo(reduced);
initRail(reduced);
if (!reduced) startEmbers(document.getElementById('embers'));

// 4. Logo last — it fetches, so it resolves after layout is settled.
fetch('assets/logo-white-lockup.svg')
  .then(r => r.text())
  .then(svg => {
    const host = document.getElementById('logo-lockup');
    host.innerHTML = svg;
    forgeReveal(host.querySelector('svg'), reduced);
    ScrollTrigger.refresh();
  });

if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
