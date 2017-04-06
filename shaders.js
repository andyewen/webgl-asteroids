var shaders = {
  vertex: `
    attribute vec3 aVertexPosition;

    uniform mat4 uPMatrix;
    uniform mat4 uMVMatrix;

    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
  `,
  fragment: `
    precision mediump float;

    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }`
};
