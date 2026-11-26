// Competition info: the weekend as two paths, athletes and spectators. Each
// path is a fuse that burns down as it scrolls through the viewport; a stop
// lights when the spark passes it, and prices count up once as they enter.
// Reduced motion: fuses fully burnt, every stop lit, prices static.
import { EVENT, DATES, DAYS, COSTS } from './data.js';
import { val } from './tbc.js';
import { tbc, rand } from './render.js';

const PATHS = [
  { key: 'athletes', title: 'For athletes', cta: true },
  { key: 'spectators', title: 'For spectators' }
];

export function renderInfo() {
  document.getElementById('info-paths').innerHTML = PATHS.map(p => {
    let day;
    const stops = DATES.filter(d => d.paths.includes(p.key)).map(d => `${d.day !== day && (day = d.day) ? `
        <li class="fuse-day">${DAYS[d.day]}</li>` : ''}
        <li class="stop"><p class="stop-time">${tbc(d.time)}</p><p class="stop-what">${d.what}</p>${d.detail ? `<p class="stop-d">${d.detail}</p>` : ''}</li>`).join('');
    const prices = COSTS.filter(c => c.path === p.key).map(c => `
        <div class="price"><dt>${c.label}${c.note ? `<span>${c.note}</span>` : ''}</dt><dd class="cond" data-count="${String(val(c.price)).replace(/\D/g, '')}">${tbc(c.price)}</dd></div>`).join('');
    return `
    <article class="path path-${p.key}" id="path-${p.key}" aria-labelledby="path-${p.key}-h">
      <h3 class="cond" id="path-${p.key}-h">${p.title}</h3>
      <div class="fuse-wrap"><i class="fuse-spark" aria-hidden="true"></i><ol class="fuse">${stops}</ol></div>
      <dl class="prices">${prices}</dl>
      ${p.cta ? `<a class="cta path-cta" href="${EVENT.whatsapp}">Join the athlete WhatsApp group →</a>` : ''}
    </article>`;
  }).join('');
  document.getElementById('info-venue').innerHTML =
    `<span class="label">Venue</span> <span>${tbc(EVENT.venue)}, ${tbc(EVENT.address)}</span> <a href="#venue">Map and directions →</a>`;
}

export function initInfo(reduced) {
  for (const path of document.querySelectorAll('#info .path')) {
    const wrap = path.querySelector('.fuse-wrap');
    const marks = [...wrap.querySelectorAll('.stop, .fuse-day')];
    if (reduced) {
      path.style.setProperty('--p', 1); path.classList.add('burnt');
      marks.forEach(m => m.classList.add('lit'));
      continue;
    }
    let at = [];
    gsap.fromTo(path, { '--p': 0 }, { '--p': 1, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top 72%', end: 'bottom 58%', scrub: .5,
        // Spark travels .6rem → height-2.4rem (style.css); a mark lights when it reaches the dot.
        onRefresh: () => { at = marks.map(m => (m.offsetTop + 4) / (wrap.offsetHeight - 48)); } },
      onUpdate() {
        const p = this.progress();
        marks.forEach((m, i) => m.classList.toggle('lit', p >= at[i]));
        path.classList.toggle('burnt', p > .995);
      } });

    for (const dd of path.querySelectorAll('.prices dd[data-count]')) {
      const n = +dd.dataset.count; if (!n) continue;
      const o = { v: 0 }; dd.textContent = rand(0);
      gsap.to(o, { v: n, duration: 1.2, ease: 'power3.out', onUpdate: () => { dd.textContent = rand(o.v); },
        scrollTrigger: { trigger: dd, start: 'top bottom', once: true } }); // starts on first pixel, so "R0" never sits on screen
    }
  }
}
