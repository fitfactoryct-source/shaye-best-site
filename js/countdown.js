const UNITS = [['days',86400000],['hours',3600000],['minutes',60000],['seconds',1000]];

export function startCountdown(el, iso) {
  const target = new Date(iso).getTime();
  const tick = () => {
    let left = target - Date.now();
    if (left <= 0) { el.innerHTML = '<span><b>Show day</b><i>is here</i></span>'; return false; }
    el.innerHTML = UNITS.map(([name, ms]) => {
      const v = Math.floor(left / ms); left -= v * ms;
      return `<span><b>${String(v).padStart(2,'0')}</b><i>${name}</i></span>`;
    }).join('');
    return true;
  };
  if (tick()) {
    const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000);
  }
}
