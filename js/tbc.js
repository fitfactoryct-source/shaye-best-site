// A fact is either a plain value (confirmed) or TBC(value) (unconfirmed).
// Renderers show TBC facts in ash with a blaze "TBC" chip — never blank,
// never a stale year shown as current.
export const TBC = value => ({ value, tbc: true });
export const isTbc = f => !!(f && typeof f === 'object' && f.tbc === true);
export const val = f => (isTbc(f) ? f.value : f);
