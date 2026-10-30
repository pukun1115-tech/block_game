import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z } from "./config.js";

export class Chunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.map = null;
        this.generateMap();
    }

    generateMap() {
        this.map = new Array(CHUNK_SIZE_X);
        for (let x = 0; x < CHUNK_SIZE_X; x++) {
            this.map[x] = new Array(CHUNK_SIZE_Y);
            for (let y = 0; y < CHUNK_SIZE_Y; y++) {
                this.map[x][y] = new Array(CHUNK_SIZE_Z).fill(0);
            }
        }
        
        for (let x = 0; x < CHUNK_SIZE_X; x++) {
            for (let z = 0; z < CHUNK_SIZE_Z; z++) {
                for (let y = 0; y < 2; y++) {
                    this.map[x][y][z] = 1;
                }
            }
        }
    }

    generateMesh() {
        //
    }

    isAir(x, y, z) {
        if (x < 0 || y < 0 || z < 0 || x >= CHUNK_SIZE_X || y >= CHUNK_SIZE_Y || z >= CHUNK_SIZE_Z) {
            return true;
        }
        return (this.map[x][y][z] === 0);
    }
}
