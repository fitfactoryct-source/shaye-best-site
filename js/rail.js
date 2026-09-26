// The loading rail: a persistent bottom bar tracking whole-page scroll
// progress, with one real button per beat as a lightweight nav. Reads
// "fully loaded" near the end, matching the campaign's own vocabulary.
//
// Pure functions exported for testing; initRail() wires them to the DOM.

// Page progress 0..1 from raw scroll metrics. Guards a not-yet-scrollable
// page (scrollHeight <= innerHeight) to 0 rather than NaN/Infinity.
export function pageProgress(scrollY, scrollHeight, innerHeight) {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / max));
}

// Each waypoint's own progress fraction, from its offsetTop against the
// same scrollable range used above.
export function waypointProgress(offsetTop, scrollHeight, innerHeight) {
  const max = scrollHeight - innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, offsetTop / max));
}

const WAYPOINTS = [
  { id: 'gathering', label: 'The gathering' },
  { id: 'climb', label: 'The climb' },
  { id: 'summit', label: 'The summit' },
  { id: 'shaye', label: 'Shaye Best' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'dates', label: 'Key info' },
  { id: 'closer', label: 'Join up' }
];

export function initRail(reduced) {
  const rail = document.getElementById('rail');
  if (!rail) return;
  const fill = document.getElementById('rail-fill');
  const ticksHost = document.getElementById('rail-ticks');
  const label = document.getElementById('rail-label');

  const present = WAYPOINTS
    .map(w => ({ ...w, el: document.getElementById(w.id) }))
    .filter(w => w.el);

  ticksHost.innerHTML = present.map((w, i) => `
    <button class="rail-tick" data-i="${i}" aria-label="Jump to ${w.label}"></button>`).join('');
  const tickEls = [...ticksHost.querySelectorAll('.rail-tick')];

  let positions = []; // {p, tickEl}, recomputed whenever layout can change

  function measure() {
    const sh = document.documentElement.scrollHeight, ih = window.innerHeight;
    // getBoundingClientRect(), not offsetTop: GSAP's pin wraps a pinned
    // section in its own spacer and reparents the section inside it, so
    // offsetTop then reads position *within that spacer* (often ~0) rather
    // than the section's true place in the document. rect.top + scrollY is
    // unaffected by that reparenting. Only valid while nothing is mid-pin
    // at read time, which holds here (called at load, resize, refresh).
    positions = present.map((w, i) => ({
      p: waypointProgress(w.el.getBoundingClientRect().top + window.scrollY, sh, ih),
      tickEl: tickEls[i]
    }));
    tickEls.forEach((t, i) => { t.style.left = `${positions[i].p * 100}%`; });
  }

  tickEls.forEach((t, i) => t.addEventListener('click', () => {
    const el = present[i].el;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }));

  measure();
  window.addEventListener('resize', measure);
  if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', measure);

  let target = 0, shown = -1; // shown stays -1 so the very first paint always applies
  function paint(p) {
    if (p === shown) return;
    shown = p;
    fill.style.transform = `scaleX(${p})`;
    positions.forEach(({ p: wp, tickEl }) => tickEl.classList.toggle('lit', p >= wp - 0.002));
    label.textContent = p >= 0.99 ? 'Fully loaded' : 'Loading';
  }

  if (reduced) {
    // No rAF loop under reduced motion: read once per scroll event, direct set.
    const onScroll = () => paint(+pageProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight).toFixed(4));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  let current = 0;
  function loop() {
    target = pageProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
    current += (target - current) * 0.2;
    if (Math.abs(target - current) < 0.0005) current = target;
    paint(+current.toFixed(4));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
