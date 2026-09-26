// Two independent particle fields share this module: `hero` is the ambient
// field behind the hero section (recycles dead particles forever — a fixed
// ambient density), `judging` is the Judging section's burst-only field
// (dead particles are pruned, not recycled, so it sits empty between bursts
// instead of permanently densifying — see Task 7 fix-round finding).
const hero = { ctx: null, parts: [], w: 0, h: 0, seed: null, pointer: null };
const judging = { ctx: null, parts: [], w: 0, h: 0, seed: null, pointer: null };

const draw = (ctx, p) => {
  ctx.beginPath();
  ctx.fillStyle = `hsla(${p.hue},100%,58%,${Math.max(p.a, 0)})`;
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
};

// One physics step. `ambient` particles recycle on death (hero); non-ambient
// particles are pruned out of the array on death (judging burst pool).
// Ambient particles within REACH of state.pointer get a push away that decays
// per frame (px/py), on top of their own drift. Exported (as `_tick`) for the
// DOM-less unit tests only.
const REACH = 120, PUSH = .12, DECAY = .9;
function tick(state, ambient) {
  if (ambient) {
    const P = state.pointer;
    for (const p of state.parts) {
      if (P) {
        const dx = p.x - P.x, dy = p.y - P.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < REACH) { const f = (1 - d / REACH) * PUSH; p.px = (p.px || 0) + dx / d * f; p.py = (p.py || 0) + dy / d * f; }
      }
      p.px = (p.px || 0) * DECAY; p.py = (p.py || 0) * DECAY;
      p.x += p.vx + p.px; p.y += p.vy + p.py; p.a -= .0016;
      if (p.a <= 0 || p.y < -20) Object.assign(p, state.seed(), { px: 0, py: 0 });
    }
  } else {
    state.parts = state.parts.filter(p => {
      p.x += p.vx; p.y += p.vy; p.a -= .0016;
      return p.a > 0 && p.y > -20;
    });
  }
}

function start(canvas, state, ambient) {
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;
  state.ctx = ctx;

  const dpr = Math.min(devicePixelRatio || 1, 2);

  state.seed = () => ({
    x: Math.random() * state.w,
    y: state.h + Math.random() * state.h * .4,
    r: Math.random() * 1.8 + .4,
    vy: -(Math.random() * .35 + .12),
    vx: (Math.random() - .5) * .18,
    a: Math.random() * .5 + .18,
    hue: 18 + Math.random() * 22
  });

  const resize = () => {
    state.w = canvas.clientWidth; state.h = canvas.clientHeight;
    canvas.width = state.w * dpr; canvas.height = state.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (ambient) {
      // ponytail: density scales with area, capped for mobile GPUs
      const count = Math.min(140, Math.round(state.w * state.h / 12000));
      state.parts = Array.from({ length: count }, state.seed);
    }
  };

  const frame = () => {
    ctx.clearRect(0, 0, state.w, state.h);
    tick(state, ambient);
    for (const p of state.parts) draw(ctx, p);
    requestAnimationFrame(frame);
  };

  resize();
  if (ambient && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const host = canvas.parentElement;           // the hero section; the canvas itself is pointer-events:none
    host.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      state.pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    }, { passive: true });
    host.addEventListener('pointerleave', () => { state.pointer = null; });
  }
  addEventListener('resize', resize);
  requestAnimationFrame(frame);
}

// Hero ambient field. Same density/seed/recycle behaviour as before the
// per-instance refactor.
export function startEmbers(canvas) { start(canvas, hero, true); }

// Judging section's burst-only field. Starts empty (no ambient seeding) and
// stays empty between bursts — dead particles are pruned, not recycled.
export function startJudgingEmbers(canvas) { start(canvas, judging, false); }

// One-shot ember pulse used by the Judging transitions. Always targets the
// judging instance. Safe if that canvas was never started (e.g. reduced
// motion, where startJudgingEmbers is never called).
export function burst(n = 40) {
  if (!judging.ctx) return;
  for (let i = 0; i < n; i++) judging.parts.push({ ...judging.seed(), vy: -(Math.random() * 1.2 + .5), a: .9 });
  if (judging.parts.length > 300) judging.parts.splice(0, judging.parts.length - 300);
}

// Exported for the DOM-less unit tests only — not for general use.
export { hero as _heroState, judging as _judgingState, tick as _tick };
