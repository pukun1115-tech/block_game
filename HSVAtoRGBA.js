/**
 * @param {Array<number> | Float32Array} hsva
 * @returns {Float32Array}
 */
export function HSVAtoRGBA(hsva) {
    const h = hsva[0];
    const s = hsva[1];
    const v = hsva[2];
    const a = hsva[3];

    const out = new Float32Array(4);

    if (s === 0) {
        out[0] = v;
        out[1] = v;
        out[2] = v;
    } else {
        const h2 = (((h % 360) + 360) % 360) / 60;
        const hi = Math.floor(h2);
        const f = h2 - hi;

        const p = v * (1.0 - s);
        const q = v * (1.0 - f * s);
        const t = v * (1.0 - (1.0 - f) * s);

        if (hi === 0) {
            out[0] = v;
            out[1] = t;
            out[2] = p;
        } else if (hi === 1) {
            out[0] = q;
            out[1] = v;
            out[2] = p;
        } else if (hi === 2) {
            out[0] = p;
            out[1] = v;
            out[2] = t;
        } else if (hi === 3) {
            out[0] = p;
            out[1] = q;
            out[2] = v;
        } else if (hi === 4) {
            out[0] = t;
            out[1] = p;
            out[2] = v;
        } else if (hi === 5) {
            out[0] = v;
            out[1] = p;
            out[2] = q;
        }
    }

    out[0] = Math.round(out[0] * 255);
    out[1] = Math.round(out[1] * 255);
    out[2] = Math.round(out[2] * 255);
    out[3] = a;

    return out;
}
