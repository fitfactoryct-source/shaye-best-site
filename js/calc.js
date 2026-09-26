// Classic Physique height-to-weight. `table` rows are "up to and including
// upTo cm" and carry either `plus` (max = h - 100 + plus) or `maxKg` (fixed).
const inRange = h => Number.isFinite(h) && h >= 140 && h <= 220;
const pick = (h, table) => table.find(r => h <= r.upTo);

export function maxWeight(heightCm, table) {
  if (!inRange(heightCm)) return null;
  const r = pick(heightCm, table);
  if (!r) return null;
  return r.maxKg ?? (heightCm - 100) + r.plus;
}

export function band(heightCm, table) {
  if (!inRange(heightCm)) return '';
  const r = pick(heightCm, table);
  return r ? r.label : '';
}
