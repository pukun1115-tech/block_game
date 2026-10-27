import { HSVAtoRGBA } from "./HSVAtoRGBA.js";

/**
 * @param {number} si 柱の断面の円の頂点数
 * @param {number} sj トーラスを構成する断面の円の数
 * @param {number} r 柱の半径
 * @param {number} R トーラスの中心から柱の中心までの距離
 * @returns {[number[], number[], number[]]}
 */
export function torus(si, sj, r, R) {
    const pos = [];
    const color = [];
    const index = [];

    // 頂点と色を生成
    for (let i = 0; i < si; i++) {
        const a = (Math.PI * 2 / si) * i;
        const cosA = Math.cos(a);
        const sinA = Math.sin(a);

        for (let j = 0; j < sj; j++) {
            const b = (Math.PI * 2 / sj) * j;
            const cosB = Math.cos(b);
            const sinB = Math.sin(b);

            const x = (r * cosA + R) * cosB;
            const y = r * sinA;
            const z = (r * cosA + R) * sinB;

            pos.push(x, y, z);

            const col = HSVAtoRGBA([(360 / sj) * j, 1, 1, 1]);

            color.push(col[0] / 255, col[1] / 255, col[2] / 255, col[3]);
        }
    }

    // インデックスを生成
    for (let i = 0; i < si; i++) {
        const nextI = (i + 1) % si;

        for (let j = 0; j < sj; j++) {
            const nextJ = (j + 1) % sj;

            const current = i * sj + j;
            const nextRing = nextI * sj + j;
            const nextColumn = i * sj + nextJ;
            const diagonal = nextI * sj + nextJ;

            index.push(
                current,
                nextRing,
                nextColumn
            );

            index.push(
                nextRing,
                diagonal,
                nextColumn
            );
        }
    }

    return [pos, color, index];
}
