import { vertex_shader_source, fragment_shader_source, getAttributeLocations, getAttributeStrides, getUniformLocations } from "./shader.js";
import { Mat4 } from "./matrix.js";
import { create_shader, create_program, create_vbo, create_ibo, create_texture, set_attribute } from "./gl_functions.js";

/** @type {HTMLCanvasElement | null} */
const canvas = document.getElementById("canvas");

if (canvas === null) {
    throw new Error("canvas");
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
const attributeLocations = getAttributeLocations(gl, program);
/** @type {Record<string, number>} */
const attributeStrides = getAttributeStrides();

/** @type {Record<string, number>} */
const uniformLocations = getUniformLocations(gl, program);

gl.activeTexture(gl.TEXTURE0);
/** @type {} */
let texture = null;
create_texture(gl, "./texture1.png", (loadedTexture) => {
    texture = loadedTexture;
});
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

const mMatrix = Mat4.identity(Mat4.create());
const vMatrix = Mat4.identity(Mat4.create());
const pMatrix = Mat4.identity(Mat4.create());
const mvpMatrix = Mat4.identity(Mat4.create());

/**
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function mainLoop(gl, indexCount, t) {
    gl.clearDepth(1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.uniform1i(uniformLocations["texture"], 0);

    Mat4.identity(mMatrix);
    Mat4.identity(vMatrix);
    Mat4.identity(pMatrix);
    Mat4.identity(mvpMatrix);

    Mat4.lookAt(vMatrix, [0.0, 3.0, 6.0], [0, 0, 0], [0, 1, 0]);
    Mat4.perspective(pMatrix, 60 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.01, 100);
    Mat4.rotateY(mMatrix, mMatrix, (Math.PI / 180) * (t % 360));

    Mat4.multiply(mvpMatrix, pMatrix, vMatrix);
    Mat4.multiply(mvpMatrix, mvpMatrix, mMatrix);

    gl.uniformMatrix4fv(uniformLocations["mvpMatrix"], false, mvpMatrix);

    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    
    requestAnimationFrame(() => mainLoop(gl, indexCount, t + 1));
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {void}
 */
function init(gl) {
    /**
     * @param {WebGLRenderingContext} gl
     * @returns {void}
     */
    function resizeCanvas(gl) {
        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    window.addEventListener("resize", () => {
        setTimeout(() => {
            resizeCanvas();
        }, 10);
    });
    resizeCanvas();

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    const position = [
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0.5, 0.5, 0,
        -0.5, 0.5, 0,
    ];
    const color = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
    ];
    const textureCoord = [
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,
    ];
    const index = [
        0, 1, 2,
        0, 2, 3,
    ];
    const ibo = create_ibo(gl, index);
    const position_vbo = create_vbo(gl, position);
    const color_vbo = create_vbo(gl, color);
    const textureCoord_vbo = create_vbo(gl, textureCoord);

    if (ibo === null) {
        throw new Error("create_ibo");
    }
    if (position_vbo === null || color_vbo === null) {
        throw new Error("create_vbo");
    }

    set_attribute(gl, {
        "position": position_vbo,
        "color": color_vbo,
        "textureCoord": textureCoord_vbo,
    }, attributeLocations, attributeStrides);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    mainLoop(gl, index.length, 0);
}

init(gl);
