import { vertex_shader_source, fragment_shader_source } from "./shader.js";
import { Mat4 } from "./matrix.js";
import { torus } from "./torus.js";
import { create_shader, create_program, create_vbo } from "./gl_functions.js";

/**
 * @param {WebGLRenderingContext} gl
 * @param {Record<string, WebGLBuffer>} vbos
 * @param {Record<string, number>} attLocation
 * @param {Record<string, number>} attStride
 * @returns {void}
 */
function set_attribute(gl, vbos, attLocation, attStride) {
    for (const key of Object.keys(attLocation)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vbos[key]);
        gl.enableVertexAttribArray(attLocation[key]);
        gl.vertexAttribPointer(attLocation[key], attStride[key], gl.FLOAT, false, 0, 0);
    }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @returns {void}
 */
function create_texture(gl, source) {
    const img = new Image();

    img.onload = () => {
        const tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.generateMipmap(gl.TEXTURE2D);

        gl.bindTexture(gl.TEXTURE2D, null);

        texture = tex;
    };

    img.src = source;
}

/** @type {HTMLCanvasElement | null} */
const canvas = document.getElementById("canvas");

if (canvas === null) {
    throw new Error("canvas");
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function resizeCanvas(gl) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewport(0, 0, canvas.width, canvas.height);
}

/** @type {WebGLRenderingContext | null} */
const gl = canvas.getContext("webgl");

if (gl === null) {
    throw new Error("gl");
}

/** @type {WebGLShader | null} */
const vertex_shader = create_shader(gl, vertex_shader_source, "vertex");
/** @type {WebGLShader | null} */
const fragment_shader = create_shader(gl, fragment_shader_source, "fragment");

if (vertex_shader === null || fragment_shader === null) {
    throw new Error("create_shader");
}

/** @type {WebGLProgram | null} */
const program = create_program(gl, vertex_shader, fragment_shader);

if (program === null) {
    throw new Error("create_program");
}

gl.useProgram(program);

/** @type {Record<string, number>} */
const attributeLocations = {
    "position": gl.getAttribLocation(program, "position"),
    "color": gl.getAttribLocation(program, "color"),
};
/** @type {Record<string, number>} */
const attributeStrides = {
    "position": 3,
    "color": 4,
};

/** @type {Record<string, number>} */
const uniformLocations = {
    "matrix": gl.getUniformLocation(program, "matrix"),
};

let frame = 0;
let indexCount = 0;

/**
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function mainLoop(gl) {
    gl.clearDepth(1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /** @type {Float32Array} */
    const mMatrix = Mat4.identity(Mat4.create());
    /** @type {Float32Array} */
    const vMatrix = Mat4.identity(Mat4.create());
    /** @type {Float32Array} */
    const pMatrix = Mat4.identity(Mat4.create());

    /** @type {Float32Array} **/
    const mvpMatrix = Mat4.identity(Mat4.create());

    Mat4.lookAt(vMatrix, [0.0, 0.0, 24.0], [0, 0, 0], [0, 1, 0]);
    Mat4.perspective(pMatrix, 60 * Math.PI / 180, canvas.width / canvas.height, 0.01, 100);

    //Mat4.rotateZ(mMatrix, mMatrix, (frame % 360) * Math.PI / 180);
    //Mat4.rotateX(mMatrix, mMatrix, ((frame * 2) % 360) * Math.PI / 180);
    //Mat4.rotateY(mMatrix, mMatrix, (frame % 360) * Math.PI / 180);
    //Mat4.rotateX(mMatrix, mMatrix, (Math.PI * 2 / 360) * (15 + Math.abs((frame % 30) - 15)));
    Mat4.rotateX(mMatrix, mMatrix, (Math.PI * 2 / 360) * 30);
    Mat4.rotateY(mMatrix, mMatrix, (frame % 360) * Math.PI / 180);
    //Mat4.translate(mMatrix, mMatrix, 1, 2, 0);

    Mat4.multiply(mvpMatrix, pMatrix, vMatrix);
    Mat4.multiply(mvpMatrix, mvpMatrix, mMatrix);

    gl.uniformMatrix4fv(uniformLocations["matrix"], false, mvpMatrix);

    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);

    frame++;
    requestAnimationFrame(() => mainLoop(gl));
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function init(gl) {
    window.addEventListener("resize", () => {
        setTimeout(() => {
            resizeCanvas(gl);
        }, 10);
    });
    resizeCanvas(gl);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    const torusData = torus(60, 60, 3, 4);
    const [position, color, index] = torusData;
    indexCount = index.length;
    const ibo = create_ibo(gl, index);
    if (ibo === null) {
        throw new Error("create_ibo");
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    const position_vbo = create_vbo(gl, position);
    const color_vbo = create_vbo(gl, color);

    if (position_vbo === null || color_vbo === null) {
        throw new Error("create_vbo");
    }

    set_attribute(gl, { "position": position_vbo, "color": color_vbo }, attributeLocations, attributeStrides);

    mainLoop(gl);
}

init(gl);
