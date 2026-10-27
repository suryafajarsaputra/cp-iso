// Membersihkan & melengkapi data konten berdasarkan struktur default.
const IMG = /^[a-f0-9]{32}\.(jpg|png|webp|gif)$/;
const HEX = /^#[0-9a-fA-F]{6}$/;

export function clean(inp, def, key = '') {
  if (Array.isArray(def)) {
    const arr = Array.isArray(inp) ? inp : def;
    return arr.slice(0, 40).map((x) => clean(x, def[0]));
  }
  if (def && typeof def === 'object') {
    const o = {};
    for (const k of Object.keys(def)) o[k] = clean(inp && typeof inp === 'object' ? inp[k] : undefined, def[k], k);
    return o;
  }
  if (typeof def === 'boolean') return typeof inp === 'boolean' ? inp : def;
  const v = inp == null ? def : String(inp).slice(0, 3000);
  if (key === 'image') return IMG.test(v) ? v : '';
  if (typeof def === 'string' && HEX.test(def)) return HEX.test(v) ? v : def;
  return v;
}
