// Frame sequences for the Judging scroll scrub. Loads the manifest once,
// then each sequence's compressed frame Blobs (cheap, kept for the page
// lifetime — see load()). Decoding into ImageBitmaps is a separate, windowed
// step (decode()/release()) driven by judging.js, since 4 sequences x 56
// decoded frames each is ~500MB of uncompressed RGBA. A sequence only ever
// reports ready when EVERY frame decoded — partial sequences would stagger
// the scrub, so failure of any single frame/fetch fails the whole sequence
// (the beat then stays on its still-image fallback).
const DIR = 'assets/judging-frames';
let manifestPromise = null;
const manifest = () => manifestPromise ??=
  fetch(`${DIR}/manifest.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });

// progress 0..1 -> frame index 0..count-1, clamped, monotonic.
// Internally clamps count-1 to >=0 so frameFor(p, 0) can't return -1; callers
// still guard count themselves (e.g. `seq.count || 1`) since 0 is the "no
// sequence loaded yet" state and drawFrame treats -1 as a real array index.
export const frameFor = (progress, count) =>
  Math.min(Math.max(0, count - 1), Math.max(0, Math.round(progress * (count - 1))));

export function loadSequences(poses) {
  const map = new Map();
  for (const pose of poses) {
    const seq = {
      pose, count: 0, width: 0, height: 0, cw: 0, ch: 0, ox: 0, oy: 0,
      ready: false, failed: false, frames: [],
      blobs: null, gen: 0, decoding: null,
      // Defaults to frame 0, not null/undefined: judging.js's late-decode
      // paint (`seq.wantFrame != null`) only fires once the frame-scrub
      // tween's own onUpdate has run at least once. Beat 0's scrub doesn't
      // start until i+.28 (dropped the old i===0 special case that used to
      // start it at 0), so if this sequence decodes while it's still the
      // live beat but before that first onUpdate, defaulting to 0 lets the
      // existing late-paint path draw the opening frame instead of leaving
      // the canvas blank through the hold.
      wantFrame: 0,
      // Fetch phase: manifest + compressed blobs only. Memoized — safe to
      // call repeatedly (decode() calls it too).
      load() {
        return seq._load ??= (async () => {
          try {
            const m = (await manifest())[pose];
            if (!m) throw new Error(`no manifest entry for ${pose}`);
            Object.assign(seq, { count: m.count, width: m.w, height: m.h,
                                 cw: m.cw, ch: m.ch, ox: m.x, oy: m.y });
            seq.blobs = await Promise.all(Array.from({ length: m.count }, async (_, i) => {
              const r = await fetch(`${DIR}/${pose}/f${String(i).padStart(3, '0')}.webp`);
              if (!r.ok) throw new Error(`${pose} f${i}: ${r.status}`);
              return r.blob();
            }));
          } catch { seq.failed = true; }
        })();
      },
      // Decode phase: cached blobs -> ImageBitmaps. Idempotent; if release()
      // fires mid-decode it bumps gen so the stale result is discarded (and
      // its bitmaps closed) instead of resurrecting a sequence outside the
      // window.
      async decode() {
        if (seq.failed || seq.ready) return;
        await seq.load();
        if (seq.failed) return;
        if (!seq.decoding) {
          const myGen = seq.gen;
          seq.decoding = (async () => {
            try {
              const frames = await Promise.all(seq.blobs.map(b => createImageBitmap(b)));
              if (seq.gen !== myGen) { frames.forEach(f => f.close()); return; }
              seq.frames = frames;
              seq.ready = true;
            } catch { seq.failed = true; }
          })();
        }
        return seq.decoding;
      },
      // Release: close the decoded bitmaps and drop them (blobs stay cached
      // for a cheap re-decode later). All-or-nothing, mirrors decode().
      release() {
        seq.gen++;
        seq.frames.forEach(f => f.close());
        seq.frames = [];
        seq.ready = false;
        seq.decoding = null;
      }
    };
    map.set(pose, seq);
  }
  return map;
}
