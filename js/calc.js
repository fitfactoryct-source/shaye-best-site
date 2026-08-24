// Official Shaye Best Classic ratio. Each band is "up to AND INCLUDING" its height.
const BANDS = [
  [168, 2,  'Up to and including 168 cm — plus 2 kg'],
  [171, 4,  'Up to and including 171 cm — plus 4 kg'],
  [173, 7,  'Up to and including 173 cm — plus 7 kg'],
  [180, 10, 'Up to and including 180 cm — plus 10 kg'],
  [188, 12, 'Over 180 up to and including 188 cm — plus 12 kg'],
  [196, 14, 'Over 188 up to and including 196 cm — plus 14 kg'],
  [Infinity, 15, 'Over 196 cm — plus 15 kg']
];

const inRange = h => Number.isFinite(h) && h >= 140 && h <= 220;
const pick = h => BANDS.find(([max]) => h <= max);

export function maxWeight(heightCm) {
  if (!inRange(heightCm)) return null;
  return (heightCm - 100) + pick(heightCm)[1];
}

export function band(heightCm) {
  if (!inRange(heightCm)) return '';
  return pick(heightCm)[2];
}
