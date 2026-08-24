import { EVENT, FAQ, RUNNING_ORDER, DATES, COSTS, PARTNERS, SOCIAL_TROPHY, SPONSORS } from './data.js';
import { maxWeight, band } from './calc.js';

export const rand = n => 'R' + Math.round(n).toLocaleString('en-ZA').replace(/,/g, ' ');

const row = l =>
  l.break   ? `<li class="ro-break" aria-label="Break">${l.break}</li>` :
  l.overall ? `<li><span class="n">&#9733;</span><span class="t">${l.overall}</span></li>` :
  `<li><span class="n">${String(l.n).padStart(2,'0')}</span>
  <span class="t">${l.title}</span><span class="g">${l.tag}</span></li>`;

export function renderLineups() {
  document.getElementById('run-order').innerHTML = RUNNING_ORDER.map(row).join('');
}

export function initCalculator() {
  const input = document.getElementById('height');
  const out = document.getElementById('calc-result');
  const lbl = document.getElementById('calc-band');
  const update = () => {
    const h = parseFloat(input.value);
    const w = maxWeight(h);
    out.textContent = w === null ? '—' : w.toFixed(1) + ' kg';
    lbl.textContent = w === null ? 'Enter a height between 140 and 220 cm' : band(h);
  };
  input.addEventListener('input', update);
  update();
}

const EVENT_PHOTOS = ['019', '007', '051', '044', '021', '081']
  .map(n => `assets/event-photos/${n}.webp`);

export function renderEventPhotos() {
  const track = document.getElementById('ep-track');
  track.innerHTML = [...EVENT_PHOTOS, ...EVENT_PHOTOS]
    .map(src => `<img src="${src}" alt="" loading="lazy">`).join('');
}

export function renderDates() {
  document.getElementById('timeline').innerHTML = DATES.map(d => `
    <li${d.past ? ' class="past"' : ''}><div class="w">${d.what}</div>
      <div class="tm">${d.when} · ${d.time}${d.past ? ' · Completed' : ''}</div>
      ${d.detail ? `<p class="d">${d.detail}</p>` : ''}</li>`).join('');
}

export function renderCosts() {
  document.getElementById('cost-grid').innerHTML = COSTS.map(c => `
    <div class="cost"><div class="p">${c.price}</div>
      <div class="l">${c.label}</div><div class="nt">${c.note}</div></div>`).join('');
}

export function renderPartners() {
  document.getElementById('partner-grid').innerHTML = PARTNERS.map(p => `
    <article class="partner">
      <h3>${p.name}</h3>
      <div class="role">${p.role}</div>
      <div class="contact">${p.contact}</div>
      <table>${p.items.map(([n, v]) => `<tr><td>${n}</td><td>${v}</td></tr>`).join('')}</table>
      <ul>${p.rules.map(r => `<li>${r}</li>`).join('')}</ul>
    </article>`).join('');
}

const SOCIAL_ICONS = [
  ['Instagram', () => EVENT.instagram,
   'M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.73 1.66 4.88 4.88.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.15 3.22-1.63 4.73-4.88 4.88-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-3.25-.15-4.73-1.66-4.88-4.88C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85C2.42 3.93 3.9 2.42 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2zm0 3.68a6.12 6.12 0 1 0 0 12.24 6.12 6.12 0 0 0 0-12.24zm0 2.2a3.92 3.92 0 1 1 0 7.84 3.92 3.92 0 0 1 0-7.84zm6.4-3.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z'],
  ['TikTok', () => EVENT.tiktok,
   'M19.32 5.56a5.1 5.1 0 0 1-3.02-2.6 5.06 5.06 0 0 1-.44-1.46h-3.4v13.44a2.94 2.94 0 0 1-2.94 2.83 2.94 2.94 0 0 1-1.37-5.54 2.9 2.9 0 0 1 2.11-.22V8.55a6.34 6.34 0 0 0-4.62 1.18 6.37 6.37 0 0 0 3.88 11.45 6.37 6.37 0 0 0 6.37-6.37V8.9a8.44 8.44 0 0 0 4.86 1.54V7.06c-.5 0-1-.07-1.43-.2a5.2 5.2 0 0 1-.9-.36z'],
  ['Facebook event', () => EVENT.facebookEvent,
   'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z'],
];

export function renderSocial() {
  const s = SOCIAL_TROPHY;
  const icons = SOCIAL_ICONS.map(([name, url, d]) => `
    <a class="soc" href="${url()}" target="_blank" rel="noopener" aria-label="${name}">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg></a>`).join('');
  document.getElementById('social-body').innerHTML = `
    <div>
      <p>${s.rule}</p>
      <div class="tags">${s.hashtags.map(h => `<span>${h}</span>`).join('')}</div>
      <p>${s.tag}</p>
      <div class="soc-row">${icons}</div>
      <p style="margin-top:1rem;color:var(--ember)">Prize: ${s.prize}. Open since ${s.opened}.</p>
    </div>
    <div><p class="label">Past winners</p>
      <ul class="winners">${s.winners.map(([y, n]) => `<li><b>${y}</b><span>${n}</span></li>`).join('')}</ul>
    </div>`;
}

export function renderSponsors() {
  const title = SPONSORS.find(s => s.tier === 'title');
  document.getElementById('sponsor-title').innerHTML = `
    <div class="sponsor-title"><p class="label">Title sponsor</p>
      <a href="https://peptides.co.za" target="_blank" rel="noopener">
        <img src="assets/sponsors/${title.slug}.png" alt="${title.name}" loading="lazy"></a></div>`;

  const tile = (s, tab) => {
    if (s.pending) return `<div class="sp pending" tabindex="${tab}">${s.name}<small>Logo to come</small></div>`;
    const imgs = `<img class="white"  src="assets/sponsors/${s.slug}.png" alt="${s.name}" loading="lazy">
         <img class="colour" src="assets/sponsors/${s.slug}-colour.png" alt="" aria-hidden="true" loading="lazy">`;
    return s.url
      ? `<a class="sp" href="${s.url}" target="_blank" rel="noopener" tabindex="${tab}">${imgs}</a>`
      : `<div class="sp" tabindex="${tab}">${imgs}</div>`;
  };

  const partners = SPONSORS.filter(s => s.tier !== 'title');
  const set = partners.map(s => tile(s, 0)).join('');
  const dup = partners.map(s => tile(s, -1)).join('');   // aria-hidden duplicate: out of tab order

  document.getElementById('sponsor-grid').innerHTML =
    `<div class="sp-marquee"><div class="sp-track">${set}<div class="sp-dup" aria-hidden="true">${dup}</div></div></div>`;
}

export function renderVenue() {
  const { lat, lng } = EVENT.gps;
  const bbox = [lng - .006, lat - .004, lng + .006, lat + .004].join(',');
  document.getElementById('venue-grid').innerHTML = `
    <div>
      <p class="addr">${EVENT.venue}<br>${EVENT.address}</p>
      <p class="label" style="margin-top:1.2rem">Doors ${EVENT.doors} · Show ${EVENT.start}</p>
      <p style="margin-top:1.4rem"><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}"
        target="_blank" rel="noopener">Open in Google Maps →</a></p>
    </div>
    <iframe title="Map showing ${EVENT.venue}" loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}"></iframe>`;
}

export function renderFaq() {
  document.getElementById('faq-list').innerHTML = FAQ.map(f =>
    `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('');
}

export function renderCloser() {
  document.getElementById('closer-cta').href = EVENT.whatsapp;
  document.getElementById('foot').innerHTML = `
    <div>${EVENT.name} · ${EVENT.venue}, ${EVENT.address}
      · Presented by <a href="https://peptides.co.za" target="_blank" rel="noopener">Research Peptides</a></div>
    <div><a href="tel:+27824062121">${EVENT.phone}</a> · <a href="mailto:${EVENT.email}">${EVENT.email}</a>
      · <a href="${EVENT.facebook}" target="_blank" rel="noopener">Facebook</a>
      · <a href="${EVENT.instagram}" target="_blank" rel="noopener">Instagram</a></div>
    <div class="credit">Site by <a href="https://thepocketlogic.com" target="_blank" rel="noopener">Pocket Logic</a></div>`;
}
