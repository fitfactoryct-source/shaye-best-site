export function forgeReveal(svg, reduced) {
  // All-white lockup per the remastered brand keyart (campaign-bible/brand/) —
  // the old below-the-split fire gradient on CLASSIC/2026 is retired.
  svg.querySelectorAll('[fill]').forEach(n => n.setAttribute('fill', 'currentColor'));

  if (reduced) { svg.style.color = 'var(--bone)'; return; }

  // Hot copy sits above the cold copy and is revealed by a moving gradient mask.
  const hot = svg.cloneNode(true);
  hot.classList.add('logo-hot');
  svg.parentElement.appendChild(hot);
  svg.style.color = 'var(--bone)';

  gsap.set(hot, { '--sweep': '-40%' });
  gsap.timeline({ delay: .35 })
    .to(hot, { '--sweep': '140%', duration: 2.2, ease: 'power2.inOut' })
    .to(hot, { '--glow': 1, duration: .6 }, '-=.4')
    .to(hot, { '--glow': .55, duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // Cool back down as the hero leaves.
  gsap.to([svg, hot], {
    opacity: .35, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
}
