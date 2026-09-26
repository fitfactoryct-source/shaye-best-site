// Scroll-scrubbed footage. The video is armed (src + load) one viewport before
// `sec` enters, so nobody downloads it who never gets there, and it is never
// played. Returns seekTo(t), t in 0..1: seeks unless a seek is still in flight
// (coalescing) or the move is under a frame (deadband). `onLive` fires once a
// real frame has painted — a seeked-but-never-played video stays blank on iOS
// until then — and never fires if seeking never works, so the caller's
// fallback art simply stays. Scrub encodes need a dense keyframe interval
// (every 4-8 frames): a normal web encode seeks from the previous keyframe
// and feels like mud under the wheel.
export function scrubClip(sec, video, src, onLive) {
  if (!video || !video.canPlayType('video/mp4')) return () => {};
  let dur = 0, last = 0;
  const seekTo = t => {
    last = t;
    if (!dur || video.seeking) return;
    const want = Math.min(dur - 0.04, Math.max(0, t * dur));
    if (Math.abs(video.currentTime - want) > 1 / 60) video.currentTime = want;
  };
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    video.src = typeof src === 'function' ? src() : src;
    video.load();
    video.addEventListener('loadedmetadata', () => { dur = video.duration; seekTo(last); }, { once: true });
    video.addEventListener('seeked', function live() {
      if (video.readyState >= 2) { onLive(); video.removeEventListener('seeked', live); }
    });
  }, { rootMargin: '150% 0px' });
  io.observe(sec);
  return seekTo;
}
