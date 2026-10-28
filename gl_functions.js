/**
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @param {"vertex" | "fragment"} type
 * @returns {WebGLShader | null}
 */
export function create_shader(gl, source, type) {
    /** @type {WebGLShader | null} */
    let shader = null;

    if (type === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (type === "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else {
        console.error("cannot create shader. type: " + type);
        return null;
    }

    if (shader === null) {
        console.error("cannot create shader. type: " + type);
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
}
