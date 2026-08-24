import { rand } from './render.js';
import { OVERALLS, EVENT } from './data.js';
import { burst } from './embers.js';
import { loadSequences, frameFor } from './scrubframes.js';

// Beat model: which pose art and which OVERALLS entry each beat of "The Judging"
// shows. overall:null marks the finale (the R125 000 assembly, no single title).
export const BEATS = [
  { pose: 'male-1',   overall: 0 },   // Men's Bodybuilding  (has runner-up note)
  { pose: 'male-2',   overall: 1 },   // Men's Physique
  { pose: 'female-1', overall: 2 },   // Ladies Bodybuilding
  { pose: 'female-2', overall: 3 },   // Ladies Bikini
  { pose: 'finale',   overall: null } // R125 000 assembly
];

const figureOf = pose => pose.split('-')[0];   // 'male-1' -> 'male', 'finale' -> 'finale'
const baseSrc  = figure => `assets/poses/${figure === 'finale' ? 'finale' : figure + '-0'}.webp`;
const poseSrc  = pose => `assets/poses/${pose}.webp`;

// Every beat has a distinct figure-0 base to fall back to EXCEPT the finale —
// there's no finale-0 asset, so its base and top layers are the same file.
export const hasFallback = pose => baseSrc(figureOf(pose)) !== poseSrc(pose);

function beatMarkup(b, i) {
  if (b.overall === null) {
    return `<article class="j-beat j-finale" data-beat="${i}">
      <p class="label">Every overall, together</p>
      <p class="j-total cond" data-to="${EVENT.prizeTotal}">${rand(EVENT.prizeTotal)}</p>
      <p class="wide">In cash prizes</p>
    </article>`;
  }
  const o = OVERALLS[b.overall];
  return `<article class="j-beat" data-beat="${i}">
    <p class="label">${o.title} overall</p>
    <p class="j-amt cond" data-to="${o.amount}">${rand(o.amount)}</p>
    ${o.note ? `<p class="j-note">${o.note}</p>` : ''}
    <p class="j-feeds">${o.feeds}</p>
  </article>`;
}

// Each beat gets two stacked <img> layers in .j-stage: a dim, always-preloaded
// figure base (that figure's -0 asset) underneath, and the beat's own pose art
// on top (tagged data-pose so Task 7's timeline can target it by name). The base
// layer doubles as the instantly-ready fallback source if the top image fails.
export function renderJudging() {
  const stage = BEATS.map(b => {
    const figure = figureOf(b.pose);
    return `<img class="j-pose" data-figure="${figure}" src="${baseSrc(figure)}" alt="" aria-hidden="true">
      <img class="j-pose" data-figure="${figure}" data-pose="${b.pose}" src="${poseSrc(b.pose)}" alt="" aria-hidden="true">`;
  }).join('') + '<div class="j-glow" aria-hidden="true"></div><canvas class="j-canvas" aria-hidden="true"></canvas><div class="j-veil" aria-hidden="true"></div>';

  document.getElementById('j-stage').innerHTML = stage;
  document.getElementById('j-copy').innerHTML = BEATS.map(beatMarkup).join('');
}

async function preloadPoses() {
  const imgs = gsap.utils.toArray('.j-pose');
  await Promise.all(imgs.map(async img => {
    try { await img.decode(); } catch { img.dataset.failed = '1'; }
  }));
  return imgs.filter(i => !i.dataset.failed);
}

function fixFailedPoses() {
  gsap.utils.toArray('.j-pose[data-failed="1"]').forEach(img => {
    const pose = img.dataset.pose;
    if (pose && !hasFallback(pose)) {
      // No distinct base asset exists for this figure (the finale — base and
      // top are the same file). Nothing to swap to: hide the broken layer
      // and let the finale's .j-total text carry the beat instead.
      gsap.set(img, { display: 'none' });
      return;
    }
    const fallback = baseSrc(img.dataset.figure);
    if (img.src.endsWith(fallback)) return;   // base layer itself failed, nothing further to fall back to
    img.src = fallback;
    delete img.dataset.failed;
    img.decode().catch(() => {});              // ignore a second failure
  });
}

// The static/reduced render: all five beats stacked and legible, final amounts,
// poses visible. Also doubles as the initial state for the non-reduced pinned
// timeline (Task 7 wires the scrub; this task only has to show beat 1).
function renderStatic(reduced) {
  const beats = gsap.utils.toArray('.j-beat');
  if (reduced) {
    gsap.set(beats, { opacity: 1 });
    gsap.set('.j-pose[data-pose]', { opacity: 1 });
    gsap.utils.toArray('.j-amt, .j-total').forEach(a => a.textContent = rand(+a.dataset.to));
    return;
  }
  gsap.set(beats[0], { opacity: 1 });
  gsap.set(`.j-pose[data-pose="${BEATS[0].pose}"]`, { opacity: 1 });
}

export async function initJudging(reduced) {
  renderStatic(reduced);                        // Task 6 path
  const ready = preloadPoses().then(fixFailedPoses); // swap/hide decode failures; must run even under reduced motion
  if (reduced) return;
  await ready;

  const DIVISIONS = BEATS.filter(b => b.overall !== null).map(b => b.pose);
  const seqs = loadSequences(DIVISIONS);
  const canvas = document.querySelector('.j-canvas');
  const glow = document.querySelector('.j-glow');
  const ctx = canvas.getContext('2d');
  const active = new Set();          // poses whose canvas path is live
  let last = null;                   // {pose, f} last drawn, for resize redraw
  // Which pose the shared canvas is allowed to show right now, computed
  // fresh from the live timeline position every time it's asked (never
  // cached) -- `tl` is declared further down via `const`, but this is only
  // ever called from async callbacks that run after that line has executed.
  // Deliberately NOT curDivIdx (the decode window's own bookkeeping, which
  // rounds to the nearest integer beat and so can already have advanced to
  // the next beat while THIS beat's content -- its crossfade, its copy --
  // is still what's on screen) and NOT "whichever pose's tween last ran an
  // onUpdate" (tried that first: it's wrong too, because scrubbing straight
  // through several beats' ranges on the way to a rest position that falls
  // BEFORE the next one's range leaves it pointing at whatever was touched
  // last in transit, not what the rest position actually calls for). Each
  // beat visually owns the canvas across [i, i+1) -- floor, not round.
  function livePoseNow() {
    const now = tl.time();
    const t = Math.min(DIVISIONS.length - 1, Math.max(0, Math.floor(now)));
    // [i, i+.18) is repainted with the OUTGOING beat's last frame — ownership
    // hands off at i+.18, not at i. Keep this in agreement or a late decode
    // landing while the playhead rests there hides the outgoing still and then
    // refuses to repaint it, leaving the figure blank.
    return (t > 0 && now - t < .18) ? DIVISIONS[t - 1] : DIVISIONS[t];
  }

  function sizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    if (last) drawFrame(last.pose, last.f);   // redraw after the bitmap reset
  }

  function drawFrame(pose, f) {
    const seq = seqs.get(pose);
    if (!active.has(pose) || !seq.ready) {
      // Not our beat's canvas turn (still loading/decoding, released outside
      // the window, or the sequence failed) — clear so a stale frame from a
      // previous pose never occludes this beat's still-image fallback.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      last = null;
      return;
    }
    const bmp = seq.frames[Math.min(f, seq.count - 1)];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // contain-fit, bottom-anchored — replicates the .j-pose
    // object-fit:contain + object-position:center bottom framing
    // Frames are cropped to the sequence's figure bbox to pay for the alpha
    // channel; scale from the FULL virtual frame (cw/ch) so the figure keeps
    // the same size and baseline it had uncropped, then draw at the offset.
    const s = Math.min(canvas.width / seq.cw, canvas.height / seq.ch);
    const fw = seq.cw * s, fh = seq.ch * s;
    const ox = (canvas.width - fw) / 2, oy = canvas.height - fh;
    ctx.drawImage(bmp, ox + seq.ox * s, oy + seq.oy * s, seq.width * s, seq.height * s);
    last = { pose, f };
  }

  function activate(pose) {
    active.add(pose);
    gsap.set(`.j-pose[data-pose="${pose}"]`, { visibility: 'hidden' });
    const fig = figureOf(pose);
    const siblings = DIVISIONS.filter(p => figureOf(p) === fig);
    // .j-pose:not([data-pose]) is always display:none in CSS today, so this
    // is currently a no-op — kept as insurance if that CSS rule ever changes.
    if (siblings.every(p => active.has(p)))
      gsap.set(`.j-pose[data-figure="${fig}"]:not([data-pose])`, { visibility: 'hidden' });
  }

  function deactivate(pose) {
    active.delete(pose);
    gsap.set(`.j-pose[data-pose="${pose}"]`, { visibility: 'visible' });
    gsap.set(`.j-pose[data-figure="${figureOf(pose)}"]:not([data-pose])`, { visibility: 'visible' }); // see activate()'s note
    // A released sequence's frame must not linger on screen under whatever
    // beat comes next — belt-and-braces alongside updateWindow's own clear
    // below, in case deactivate() is ever reached by a path that isn't a
    // beat change.
    if (last && last.pose === pose) { ctx.clearRect(0, 0, canvas.width, canvas.height); last = null; }
  }

  // Decode window: only the current division beat's sequence + its immediate
  // neighbors stay decoded (ImageBitmaps are ~2.5MB/frame uncompressed — all
  // 4 sequences decoded at once is ~500MB). Blobs (fetched below, cheap) stay
  // cached for every sequence so entering a window is decode-only, no network
  // wait. Driven by the ScrollTrigger's onUpdate as the scrub crosses beats.
  let curDivIdx = -1;
  function updateWindow(idx) {
    idx = Math.min(DIVISIONS.length - 1, Math.max(0, idx));
    if (idx === curDivIdx) return;
    curDivIdx = idx;
    // Invariant: the canvas may only ever hold a frame belonging to the
    // current beat — any beat change clears it, unconditionally, before
    // anything below has a chance to (re)paint. The current beat's own
    // frame tween repaints it on its very next onUpdate; until then (or if
    // decode never catches up) the safe state is a transparent canvas over
    // the v2 still, never a stale sibling's frame left over from wherever
    // the scrub was a moment ago.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    last = null;
    DIVISIONS.forEach((pose, i) => {
      const seq = seqs.get(pose);
      if (Math.abs(i - idx) <= 1) {
        // On a slow connection, decode can resolve AFTER this pose's own
        // scrub tween has already finished running (its onUpdate loop is
        // over, so nothing will paint it again). activate() hides the v2
        // fallback unconditionally — if decode lands late while its window
        // has already been visited (seq.wantFrame set, below), paint the
        // last-wanted frame immediately so hiding the fallback never leaves
        // a blank canvas in its place.
        seq.decode().then(() => {
          if (!seq.ready) return;
          activate(pose);
          // Only the beat livePoseNow() says actually owns the canvas right
          // now may repaint it. `idx` (this call's own parameter) and
          // curDivIdx (the live decode-window pointer) were both tried here
          // and both found wanting: decode() is memoized (scrubframes.js:
          // seq.decoding), so this .then() can fire long after later
          // updateWindow() calls moved on, arriving with a stale `idx`; and
          // curDivIdx rounds to the nearest beat while a beat's own content
          // stays live across the full [i, i+1), so curDivIdx can have
          // already advanced past a beat that still owns the canvas.
          // livePoseNow() is recomputed fresh from the timeline right here,
          // however late this fires, so it's never stale either way.
          if (pose === livePoseNow() && seq.wantFrame != null) drawFrame(pose, seq.wantFrame);
        });
      } else if (seq.ready || seq.decoding) {
        deactivate(pose);
        seq.release();
      }
    });
  }

  sizeCanvas();
  addEventListener('resize', sizeCanvas);
  // Blob fetch for all 4 sequences (~6MB), gated on the section approaching
  // rather than firing on page load — a visitor who never scrolls this far
  // shouldn't pay for it. A plain scroll listener rather than a position-
  // based ScrollTrigger: ScrollTrigger's `top bottom(+=X%)` start is computed
  // from #judging's live layout at CREATE time, which runs synchronously
  // early — before the async logo-lockup fetch has inserted its SVG (main.js
  // itself later calls ScrollTrigger.refresh() specifically because "logo
  // changes hero height"). Caught live: with the logo not yet in, the hero
  // measured short enough that the computed start pixel came out at/below 0,
  // so `once:true` fired onEnter immediately — before window's `load` event,
  // at real scroll 0 — the exact eager fetch this was meant to remove.
  // `scrollY` itself has no such lag (it's the browser's live scroll offset,
  // not a layout measurement), so a plain listener sidesteps the race
  // entirely. Threshold is loose (0.5 viewport) — the pin's own long scroll
  // range is the real runway before frames are actually needed.
  function maybeLoadFrames() {
    if (scrollY <= innerHeight * .5) return;
    seqs.forEach(seq => seq.load());
    // Priming the initial decode window (beat0 + its neighbor) also belongs
    // behind this gate: updateWindow()'s own decode() call fetches blobs too
    // (scrubframes.js decode() awaits load()), so calling it unconditionally
    // at setup — as it used to be, back when the load above was eager too —
    // would silently re-open the exact hole this fix closes, just for 2 of
    // the 4 sequences instead of all 4. The ScrollTrigger pin's own onUpdate
    // (self => updateWindow(Math.round(self.animation.time()))) takes over
    // decode-window management from here.
    updateWindow(0);
    removeEventListener('scroll', maybeLoadFrames);
  }
  addEventListener('scroll', maybeLoadFrames, { passive: true });
  maybeLoadFrames();   // covers a reload/back-nav that restores an already-scrolled position

  const isMobile = window.innerWidth <= 820;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#judging', start: 'top top',
      end: () => '+=' + (isMobile ? 650 : 800) + '%',
      pin: true, scrub: 0.8, invalidateOnRefresh: true,
      snap: isMobile ? undefined : { snapTo: 'labels', duration: 0.4, ease: 'power1.inOut' },
      onUpdate: self => updateWindow(Math.round(self.animation.time())),
      onRefresh: self => self.animation.render(self.animation.time(), false, true)
    }
  });
  const layer = name => document.querySelector(`.j-pose[data-pose="${name}"]`);
  const wc = (...els) => els.forEach(el => { el.style.willChange = 'transform, opacity, filter'; });
  const noWc = (...els) => els.forEach(el => { el.style.willChange = ''; });
  BEATS.forEach((beat, i) => {
    // Label at i+.9, not i: i is the START of the transition into this beat
    // (copy not visible yet — at beat0/t=0 nothing is visible at all), while
    // i+.9 is the designed rest state (pose hit, amount landed, copy at full
    // opacity) that Blocker 1's fix makes coherent. beat4 lands at 4.9, just
    // .1 before the 'end' label at 5.0 — verified live: no snap
    // oscillation/fighting between them.
    tl.addLabel(`beat${i}`, i + .9);
    const inc = layer(beat.pose);
    if (i > 0) {
      const out = layer(BEATS[i - 1].pose);
      tl.to(out, { opacity: 0, scale: 1.04, filter: 'blur(6px)', duration: .4,
                   onStart: () => wc(out, inc) }, i)
        .fromTo(inc, { opacity: 0, scale: .97, filter: 'blur(4px)' },
                     { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .5,
                       onComplete: () => noWc(out, inc),
                       onReverseComplete: () => noWc(out, inc) }, i + .1)
        .call(burst, [80], i + .3)
        .to(`.j-beat[data-beat="${i-1}"]`, { opacity: 0, y: -40, duration: .3 }, i);
    } else {
      gsap.set(inc, { opacity: 1 });
    }
    tl.fromTo(`.j-beat[data-beat="${i}"]`, { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: .5 }, i + (i ? .2 : 0));
    if (beat.overall !== null) {
      const el = document.querySelector(`.j-beat[data-beat="${i}"] .j-amt`);
      const o = { v: 0 };
      tl.to(o, { v: +el.dataset.to, duration: .65, ease: 'power2.out',
                 onUpdate: () => el.textContent = rand(o.v) }, i + .25);
    } else {
      const totalEl = document.querySelector('.j-total');
      const t = { v: 0 };
      tl.to(t, { v: +totalEl.dataset.to, duration: .7, ease: 'power2.out',
                 onUpdate: () => totalEl.textContent = rand(t.v) }, i + .2);
    }
    if (beat.overall !== null) {
      // frame scrub: starts at the canvas dip's bottom (i+.28) -- the dip
      // itself (below) is shortened to finish by i+.28, so the canvas is
      // already fully visible before any frame draws, instead of fading in
      // underneath the first third of the pose's motion. Ends with the
      // count-up (i+.9) so the pose hits as the amount lands; holds after.
      // No i===0 special case: beat0's [0, .28) is the same held-first-frame
      // beat-text-fade-in window every other beat has in its own [i, i+.28)
      // -- giving it a wider span was what made it ~45% coarser than its
      // neighbours (30.0 vs 20.8px/frame).
      const fp = { p: 0 };
      const start = i + .28;
      // [i, i+.18) has no owner: livePoseNow() already treats beat i as
      // owning [i, i+1), but the on-screen COPY is still beat i-1's until
      // the crossfade lands (~i+.2..i+.3). On reverse arrival, nothing else
      // repaints this window, so the canvas can be left holding the
      // INCOMING pose (from the i+.18 opener below, run backwards) under
      // the OUTGOING beat's still-visible copy. Repaint the outgoing beat's
      // own last frame across this window so it stays coherent with its
      // copy until the crossfade actually hands off.
      if (i > 0 && BEATS[i - 1].overall !== null) {
        const outPose = BEATS[i - 1].pose;
        tl.to({ v: 0 }, { v: 1, duration: .18, ease: 'none',
              onUpdate: () => drawFrame(outPose, frameFor(1, seqs.get(outPose).count || 1)) }, i);
      }
      // Repaint the opening frame as the dip fades back in (i+.18, matching
      // the canvas-opacity fade-in below) — without this, [i+.18, i+.28] has
      // no painter, so the canvas keeps showing whatever the PREVIOUS beat
      // last drew right as it fades back to full opacity: a ghost of the
      // outgoing pose under this beat's copy. {v:0}->{v:1} (not a bare {})
      // so onUpdate is guaranteed to fire.
      tl.to({ v: 0 }, { v: 1, duration: .1, ease: 'none',
            onUpdate: () => drawFrame(beat.pose, 0) }, i + .18);
      tl.to(fp, { p: 1, duration: (i + .9) - start, ease: 'none',
                  onUpdate: () => {
                    const seq = seqs.get(beat.pose);
                    const f = frameFor(fp.p, seq.count || 1);
                    seq.wantFrame = f;      // last frame this beat's window asked for,
                    drawFrame(beat.pose, f); // even if decode wasn't ready yet to draw it
                    glow.style.opacity = fp.p;
                  } },
            start);
    }
    if (i > 0 && beat.overall !== null) {
      // canvas dip through the crossfade window (harmless when canvas empty).
      // Shortened to finish exactly when the frame scrub starts (i+.28) --
      // was a symmetric .28/.32 split that stayed mid-fade until i+.6, so
      // roughly half the (now-longer) frame scrub played under a
      // still-fading-in canvas. Fading back in faster keeps the canvas at
      // full opacity for the whole scrub while still covering the img-layer
      // crossfade's messiest middle.
      tl.to(canvas, { opacity: 0, duration: .18 }, i)
        .to(canvas, { opacity: 1, duration: .1 }, i + .18)
        .set(glow, { opacity: 0 }, i);
    }
    if (beat.overall === null) {
      // entering the finale the canvas leaves for good — the 2-person still owns it
      tl.to(canvas, { opacity: 0, duration: .4 }, i)
        .to(glow, { opacity: 0, duration: .4 }, i);
    }
    if (beat.overall !== null) {
      // Repaint the last frame at the top of the hold — belt-and-braces
      // alongside the frame scrub's own final onUpdate tick, and the fix for
      // the fast-fling edge where decode resolves after the scrub tween has
      // already finished running (nothing left to repaint it otherwise).
      tl.to({ v: 0 }, { v: 1, duration: .1, ease: 'none',
            onUpdate: () => drawFrame(beat.pose, frameFor(1, seqs.get(beat.pose).count || 1)) }, i + .9);
    } else {
      tl.to({}, { duration: .1 }, i + .9);      // hold on each beat (finale has no frame sequence)
    }
  });
  // snap:{snapTo:'labels'} only has beat0..beat4 to anchor on, and beat4 sits
  // at the *start* of the finale's reveal (same position as every other
  // label). Without an anchor at the timeline's end, any scroll stop inside
  // the finale's hold — including the very end of the pin — snaps backward
  // onto beat4 and un-reveals the R125 000 total. One more label at the very
  // end gives snap somewhere to hold once the finale has actually arrived.
  tl.addLabel('end');

  // Test hook only (test/canvas-ownership.test.mjs): exposes the timeline,
  // canvas and decode-state map so the regression test can drive
  // scroll-to-label and read back canvas/decode state without duplicating
  // this closure's internals. No cost in production — a few object
  // references, nothing reads it at runtime.
  window.__judgingTest = { tl, canvas, seqs, DIVISIONS };
}
