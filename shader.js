/** @type {string} */
export const vertex_shader_source = `
    attribute vec3 position;
    attribute vec4 color;

    uniform mat4 matrix;

    varying vec4 vColor;

    void main(void) {
        vColor = color;
        gl_Position = matrix * vec4(position, 1.0);
    }
`;

/** @type {string} */
export const fragment_shader_source = `
    precision mediump float;

    varying vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;
