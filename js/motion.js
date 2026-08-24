export function initLineups(reduced) {
  if (reduced) return;
  gsap.set('.lu-list li', { opacity: 0, y: 18 });
  ScrollTrigger.batch('.lu-list li', {
    start: 'top 92%',
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: .035, duration: .5,
      ease: 'power2.out', overwrite: true })
  });
}

export function initSponsors(reduced) {
  // Tiles scroll horizontally in a marquee track, so a per-tile reveal would fight the
  // motion (and would double-animate the aria-hidden duplicate set). Reveal the marquee
  // as one unit instead; the sponsor-title block is unrelated and keeps its own reveal.
  if (!reduced) {
    const marquee = document.querySelector('.sp-marquee');
    if (marquee) {
      gsap.set(marquee, { opacity: 0, y: 24 });
      gsap.to(marquee, { opacity: 1, y: 0, duration: .6, ease: 'power2.out',
        scrollTrigger: { trigger: marquee, start: 'top 92%', once: true } });
    }
    gsap.from('.sponsor-title', { opacity: 0, y: 40, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.sponsor-title', start: 'top 85%', once: true } });
  }

  const track = document.querySelector('.sp-track');
  if (!track || reduced) return;              // reduced: static grid via CSS
  const loop = gsap.to(track, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  const pause = () => loop.pause(), play = () => loop.play();
  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', play);
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', play);
}
