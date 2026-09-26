// Winners photos are links to their large export (assets/event-photos/2026/lg/);
// with JS the link opens in a dialog instead of leaving the page. A tap
// anywhere, the × or Esc closes it. Used by the main page strip and /2026/.
export function initLightbox() {
  const dlg = document.createElement('dialog');
  dlg.className = 'photo-dialog';
  dlg.setAttribute('aria-label', 'Photo');
  dlg.innerHTML = '<button class="clip-close" aria-label="Close">×</button><img alt="" width="1120" height="1400">';
  document.body.append(dlg);
  const img = dlg.querySelector('img');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-lightbox]'); if (!a) return;
    e.preventDefault();
    img.src = a.href; img.alt = a.querySelector('img')?.alt || '';
    dlg.showModal();
  });
  dlg.addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => img.removeAttribute('src'));
}
