/** @type {string} */
export const vertex_shader_source = `
    attribute vec3 position;
    attribute vec4 color;
    attribute vec2 textureCoord;

    uniform mat4 mvpMatrix;

    varying vec4 vColor;
    varying vec2 vTextureCoord;

    void main(void) {
        vColor = color;
        vTextureCoord = textureCoord;
        gl_Position = mvpMatrix * vec4(position, 1.0);
    }
`;

/** @type {string} */
export const fragment_shader_source = `
    precision mediump float;

    uniform sampler2D texture;

    varying vec4 vColor;
    varying vec2 vTextureCoord;

    void main(void) {
        gl_FragColor = vColor * texture2D(texture, vTextureCoord);
    }
`;

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} prg
 * @returns {Record<string, number>}
 */
export function getAttributeLocations(gl, prg) {
    return {
        "position": gl.getAttribLocation(prg, "position"),
        "color": gl.getAttribLocation(prg, "color"),
        "textureCoord": gl.getAttribLocation(prg, "textureCoord"),
    };
}

/**
 * @returns {Record<string, number>}
 */
export function getAttributeStrides() {
    return {
        "position": 3,
        "color": 4,
        "textureCoord": 2,
    };
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} prg
 * @returns {Record<string, number>}
 */
export function getUniformLocations(gl, prg) {
    return {
        "mvpMatrix": gl.getUniformLocation(prg, "mvpMatrix"),
        "texture": gl.getUniformLocation(prg, "texture"),
    }
}
