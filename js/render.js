import { EVENT, FAQ, DIVISION_GROUPS, DATES, COSTS, PARTNERS, SOCIAL_TROPHY, SPONSORS,
         HIGHLIGHT_CLIPS, HIGHLIGHT_PHOTOS, SHAYE, PREVIEW, CLASSIC_TABLE } from './data.js';
import { isTbc, val } from './tbc.js';
import { maxWeight, band } from './calc.js';

export const rand = n => 'R' + Math.round(n).toLocaleString('en-ZA').replace(/,/g, ' ');

// Confirmed fact → plain text. Unconfirmed → just "TBC" in the value's own
// style; the tentative value is never shown (Troy, 2026-09-23: only the event
// name and year are confirmed, no dates, venue or prices until they are).
export const tbc = f => isTbc(f) ? '<span class="tbc-v" title="To be confirmed">TBC</span>' : String(f);

export function initCalculator() {
  const table = val(CLASSIC_TABLE);
  const input = document.getElementById('height');
  const out = document.getElementById('calc-result');
  const lbl = document.getElementById('calc-band');
  document.getElementById('calc-tbc').innerHTML = isTbc(CLASSIC_TABLE)
    ? `2027 table <span class="tbc-chip">TBC</span> · showing last year's ratio until the new one is confirmed` : '';
  const update = () => {
    const h = parseFloat(input.value);
    const w = maxWeight(h, table);
    out.textContent = w === null ? '—' : w.toFixed(1) + ' kg';
    lbl.textContent = w === null ? 'Enter a height between 140 and 220 cm' : band(h, table);
  };
  input.addEventListener('input', update);
  update();
}

export function renderHero() {
  const p = EVENT.presenter, pv = val(p);
  document.getElementById('presents').innerHTML = `
    <a href="${pv.url}" target="_blank" rel="noopener"><img src="assets/sponsors/${pv.slug}.png" alt="${pv.name}" width="400" height="61"></a>
    <span class="label">presents${isTbc(p) ? ' <span class="tbc-chip" title="Title sponsor to be confirmed">TBC</span>' : ''}</span>`;
  document.getElementById('hero-facts').innerHTML = [
    ['Show day', EVENT.showDay], ['Venue', EVENT.venue], ['Doors', EVENT.doors]
  ].map(([k, v]) => `<div><dt class="label">${k}</dt><dd class="cond">${tbc(v)}</dd></div>`).join('');
}

export function renderClimb() {
  const groups = val(DIVISION_GROUPS);
  if (isTbc(DIVISION_GROUPS)) {
    document.getElementById('c-label').innerHTML = `Divisions · 2027 <span class="tbc-chip" title="Divisions to be confirmed">TBC</span>`;
  }
  document.getElementById('c-rail').innerHTML = groups.map((g, i) => `
    <article class="ledge" style="--i:${i}">
      <p class="label">Ledge ${i + 1}${g.note ? ` · ${g.note}` : ''}</p>
      <h3 class="cond">${g.name}</h3>
      <ul>${g.lineups.map(l => `<li>${l}</li>`).join('')}</ul>
    </article>`).join('');
}
// renderSummit lives in summit.js now — it shares the beat sequence (BEATS)
// with initSummit, the way judging.js owns both halves of its own section.
// Placeholder beat — detail deferred (spec §5.5). Reserves the position.
export function renderShaye() {
  document.getElementById('sh-grid').innerHTML = `
    <div class="sh-portrait${SHAYE.portrait ? '' : ' sh-silhouette'}" aria-hidden="${SHAYE.portrait ? 'false' : 'true'}">
      ${SHAYE.portrait ? `<img src="${SHAYE.portrait}" alt="Shaye Best" loading="lazy">` : ''}
    </div>
    <div class="sh-copy">
      <p class="label">The man behind the mountain</p>
      <h2 class="cond sh-line">${tbc(SHAYE.vision)}</h2>
      <a class="sh-link" href="about/">His story →</a>
    </div>`;
}


export function renderHighlights() {
  const photos = HIGHLIGHT_PHOTOS.map(src => `<a href="${src.replace('/2026/', '/2026/lg/')}" data-lightbox><img src="${src}" width="560" height="700" alt="2026 Shaye Best Classic winner on stage" loading="lazy"></a>`);
  const clips = HIGHLIGHT_CLIPS.map(c => `
    <button class="hl-clip" data-src="${c.src}" aria-label="Play: ${c.title}">
      <img src="${c.poster}" alt="" loading="lazy"><span class="hl-play" aria-hidden="true">▶</span></button>`);
  const items = [...photos, ...clips];
  const dup = [...photos.map(p => p.replace('<a ', '<a tabindex="-1" ')), ...clips.map(c => c.replace('<button ', '<button tabindex="-1" '))];
  document.getElementById('ep-track').innerHTML = items.join('') +
    `<div class="ep-dup" aria-hidden="true">${dup.join('')}</div>`;
  document.querySelectorAll('#ep-track img').forEach(img => {
    const mark = () => img.classList.add('is-loaded');
    if (img.complete) mark(); else img.addEventListener('load', mark, { once: true });
  });

  const dlg = document.getElementById('clip-dialog'), vid = document.getElementById('clip-video');
  // Mux-hosted films (data-mux = playback ID) play in <mux-player>. The module is
  // fetched as the block nears the viewport so the tap still counts as the
  // user gesture that allows sound (iOS drops it across a slow import).
  let mux;
  const loadMux = () => (mux ??= import('./vendor/mux-player-3.13.4.mjs'));
  document.querySelectorAll('[data-mux]').forEach(el => new IntersectionObserver(([en], io) => {
    if (en.isIntersecting) { loadMux(); io.disconnect(); }
  }, { rootMargin: '100% 0px' }).observe(el));
  document.addEventListener('click', async e => {
    const b = e.target.closest('.hl-clip, .w-frame'); if (!b) return;
    if (b.dataset.mux) {
      await loadMux();
      const p = Object.assign(document.createElement('mux-player'), { playbackId: b.dataset.mux });
      p.setAttribute('poster', b.dataset.poster || '');
      p.setAttribute('accent-color', '#FF7A18');
      p.setAttribute('metadata-video-title', b.getAttribute('aria-label'));
      p.setAttribute('autoplay', ''); // a play() here is aborted by the stream load the element starts on connect
      p.setAttribute('default-hidden-captions', ''); // Mux auto-captions misspell Shaye; off until a corrected track is up (CC still offers them)
      vid.hidden = true; vid.after(p); dlg.showModal();
      return;
    }
    vid.poster = b.dataset.poster || ''; vid.src = b.dataset.src; dlg.showModal(); vid.play().catch(() => {});
  });
  dlg.querySelector('.clip-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => {
    dlg.querySelector('mux-player')?.remove(); vid.hidden = false;
    vid.pause(); vid.removeAttribute('src'); vid.load();
  });
}

export function renderDates() {
  document.getElementById('timeline').innerHTML = DATES.map(d => `
    <li><div class="w">${d.what}</div>
      <div class="tm">${isTbc(d.when) && isTbc(d.time) ? tbc(d.when) : `${tbc(d.when)} · ${tbc(d.time)}`}</div>
      ${d.detail ? `<p class="d">${d.detail}</p>` : ''}</li>`).join('');
}

export function renderCosts() {
  document.getElementById('cost-grid').innerHTML = COSTS.map(c => `
    <div class="cost"><div class="p">${tbc(c.price)}</div>
      <div class="l">${c.label}</div><div class="nt">${c.note}</div></div>`).join('');
}

export function renderPartners() {
  document.getElementById('partner-grid').innerHTML = PARTNERS.map(p => `
    <article class="partner">
      <h3>${p.name}</h3>
      <div class="role">${p.role}</div>
      <div class="contact">${p.contact}</div>
      <table>${p.items.map(([n, v]) => `<tr><td>${n}</td><td>${tbc(v)}</td></tr>`).join('')}</table>
      <ul>${p.rules.map(r => `<li>${typeof r === 'function' ? r(tbc) : r}</li>`).join('')}</ul>
    </article>`).join('');
}

const SOCIAL_ICONS = [
  ['Instagram', () => EVENT.instagram,
   'M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.73 1.66 4.88 4.88.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.15 3.22-1.63 4.73-4.88 4.88-1.25.06-1.65.07-4.85.07s-3.6 0-4.85-.07c-3.25-.15-4.73-1.66-4.88-4.88C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85C2.42 3.93 3.9 2.42 7.15 2.27 8.4 2.2 8.8 2.2 12 2.2zm0 3.68a6.12 6.12 0 1 0 0 12.24 6.12 6.12 0 0 0 0-12.24zm0 2.2a3.92 3.92 0 1 1 0 7.84 3.92 3.92 0 0 1 0-7.84zm6.4-3.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z'],
  ['TikTok', () => EVENT.tiktok,
   'M19.32 5.56a5.1 5.1 0 0 1-3.02-2.6 5.06 5.06 0 0 1-.44-1.46h-3.4v13.44a2.94 2.94 0 0 1-2.94 2.83 2.94 2.94 0 0 1-1.37-5.54 2.9 2.9 0 0 1 2.11-.22V8.55a6.34 6.34 0 0 0-4.62 1.18 6.37 6.37 0 0 0 3.88 11.45 6.37 6.37 0 0 0 6.37-6.37V8.9a8.44 8.44 0 0 0 4.86 1.54V7.06c-.5 0-1-.07-1.43-.2a5.2 5.2 0 0 1-.9-.36z'],
  ['Facebook', () => EVENT.facebook,
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
      <p style="margin-top:1rem;color:var(--ember)">Prize: ${s.prize}.</p>
    </div>
    <div><p class="label">Past winners</p>
      <ul class="winners">${s.winners.map(([y, n]) => `<li><b>${y}</b><span>${tbc(n)}</span></li>`).join('')}</ul>
    </div>`;
}

export function renderSponsors() {
  const show = SPONSORS.filter(s => s.confirmed || PREVIEW);
  const title = show.find(s => s.tier === 'title');
  const flag = s => s.confirmed ? '' : ' unconfirmed';
  const badge = s => s.confirmed ? '' : '<small class="sp-confirming">Confirming for 2027</small>';
  document.getElementById('sponsor-label').innerHTML = title
    ? `Presented by <a href="${title.url}" target="_blank" rel="noopener">${title.name}</a>${title.confirmed ? '' : ' <span class="tbc-chip">TBC</span>'}`
    : 'Title sponsor to be announced';
  document.getElementById('sponsor-title').innerHTML = title ? `
    <div class="sponsor-title${flag(title)}"><p class="label">Title sponsor</p>
      <a href="${title.url}" target="_blank" rel="noopener">
        <img src="assets/sponsors/${title.slug}.png" alt="${title.name}" loading="lazy"></a>${badge(title)}</div>` : '';

  const tile = (s, tab) => {
    const imgs = `<img class="white"  src="assets/sponsors/${s.slug}.png" alt="${s.name}" loading="lazy">
         <img class="colour" src="assets/sponsors/${s.slug}-colour.png" alt="" aria-hidden="true" loading="lazy">${badge(s)}`;
    return s.url
      ? `<a class="sp${flag(s)}" href="${s.url}" target="_blank" rel="noopener" tabindex="${tab}">${imgs}</a>`
      : `<div class="sp${flag(s)}" tabindex="${tab}">${imgs}</div>`;
  };
  const partners = show.filter(s => s.tier !== 'title');
  const set = partners.map(s => tile(s, 0)).join('');
  const dup = partners.map(s => tile(s, -1)).join('');
  document.getElementById('sponsor-grid').innerHTML = partners.length
    ? `<div class="sp-marquee"><div class="sp-track">${set}<div class="sp-dup" aria-hidden="true">${dup}</div></div></div>`
    : `<p class="label" style="padding:2rem">Sponsors to be announced</p>`;
}

export function renderVenue() {
  document.getElementById('venue-label').innerHTML = isTbc(EVENT.venue) ? 'Cape Town · venue <span class="tbc-chip">TBC</span>' : 'Cape Town';
  if (isTbc(EVENT.gps)) {                      // no address, map or directions until the venue is confirmed
    document.getElementById('venue-grid').innerHTML = `
    <div>
      <p class="addr">Venue ${tbc(EVENT.venue)}</p>
      <p class="label" style="margin-top:1.5rem">Doors ${tbc(EVENT.doors)} · Show ${tbc(EVENT.start)}</p>
    </div>`;
    return;
  }
  const { lat, lng } = val(EVENT.gps);
  const bbox = [lng - .006, lat - .004, lng + .006, lat + .004].join(',');
  document.getElementById('venue-label').innerHTML = isTbc(EVENT.venue) ? 'Cape Town · venue <span class="tbc-chip">TBC</span>' : 'Cape Town';
  document.getElementById('venue-grid').innerHTML = `
    <div>
      <p class="addr">${tbc(EVENT.venue)}<br>${tbc(EVENT.address)}</p>
      <p class="label" style="margin-top:1.5rem">Doors ${tbc(EVENT.doors)} · Show ${tbc(EVENT.start)}</p>
      <p style="margin-top:1.5rem"><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}"
        target="_blank" rel="noopener">Open in Google Maps →</a></p>
    </div>
    <iframe title="Map showing ${val(EVENT.venue)}" loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}"></iframe>`;
}

export function renderFaq() {
  document.getElementById('faq-list').innerHTML = FAQ.map(f =>
    `<details><summary>${f.q}</summary><p>${f.a(tbc)}</p></details>`).join('');
}

export function renderCloser() {
  const p = val(EVENT.presenter);
  document.getElementById('closer-presenter').innerHTML = `
    <a class="closer-presenter" href="${p.url}" target="_blank" rel="noopener">
      <span class="label">Presented by${isTbc(EVENT.presenter) ? ' <span class="tbc-chip">TBC</span>' : ''}</span>
      <img src="assets/sponsors/${p.slug}.png" alt="${p.name}" loading="lazy"></a>`;
  document.getElementById('foot').innerHTML = `
    <div>${EVENT.name} · ${isTbc(EVENT.venue) ? 'Cape Town · venue TBC' : `${EVENT.venue}, Cape Town`}</div>
    <div><a href="tel:+27824062121">${EVENT.phone}</a> · <a href="mailto:${EVENT.email}">${EVENT.email}</a>
      · <a href="${EVENT.facebook}" target="_blank" rel="noopener">Facebook</a>
      · <a href="${EVENT.instagram}" target="_blank" rel="noopener">Instagram</a>
      · <a href="about/">About Shaye</a> · <a href="2025/">2025</a></div>
    <div class="credit">Site by <a href="https://thepocketlogic.com" target="_blank" rel="noopener">Pocket Logic</a></div>`;
}
