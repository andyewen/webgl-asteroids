var gl;
function initGL(canvas) {
    gl = canvas.getContext("webgl");
    if (!gl) {
        gl = canvas.getContext("experimental-webgl");
    }

    if (gl) {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } else {
        alert("Could not initialise webgl...");
    }
}

function loadShader(gl, type, code) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var controls = {
    isKeyDown: function (keyCode) {
        return Boolean(this.keyStates[keyCode]);
    },
    keyStates: [],
    getGamepad: function() {
        return navigator.getGamepads()[0];
    }
};
document.addEventListener("keyup", function (e) {
    controls.keyStates[e.keyCode] = false;
});
document.addEventListener("keydown", function (e) {
    controls.keyStates[e.keyCode] = true;
});

var shaderProgram;
function initShaders() {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, shaders.vertex);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, shaders.fragment);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Cold not initialise shaders.");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute =
        gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var pMatrix = mat4.create();
var w, h;
function initViewport() {
    var aspectRatio = gl.viewportWidth / gl.viewportHeight;
    w = 40;
    h = w / aspectRatio;
    mat4.ortho(pMatrix, -w / 2, w / 2, -h / 2, h / 2, -10, 10);
}

matStack = {
    current: mat4.create(),
    stack: [],
    push: function () {
        this.stack.push(this.current);
        this.current = mat4.clone(this.current);
    },
    pop: function () {
        if (!this.stack.length) {
            throw "Empty matrix stack";
        }
        this.current = this.stack.pop();
    }
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matStack.current);
}

function wrapPosition(object) {
    if (object.position[0] > w / 2) { object.position[0] -= w; }
    if (object.position[0] < -w / 2) { object.position[0] += w; }
    if (object.position[1] > h / 2) { object.position[1] -= h; }
    if (object.position[1] < -h / 2) { object.position[1] += h; }
}

function randomPosition(w, h) {
    return vec2.fromValues(Math.random() * w - (w / 2), Math.random() * h - (h / 2));
}

function padString(s, n) {
    var zeroes = '00000000';
    s += '';
    return zeroes.slice(0, Math.max(0, n - s.length)) + s;
}


var canvas = document.getElementsByTagName("canvas")[0],
    scoreElement = document.getElementById('score'),
    livesElement = document.getElementById('lives');
initGL(canvas);
initViewport();
initShaders();

gl.clearColor(0.0, 0.0, 0.0, 1.0);

var states = {
    'start': new Start(),
    'game': new Game()
}
var nextState = states['start'];
var currentState = states['start'];

function changeState(stateCode) {
    nextState = states[stateCode];
}


var lastFrameTime = new Date();

function tick() {
    requestAnimationFrame(tick);

    var now = new Date();
    var dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (nextState != currentState) {
        currentState = nextState;
    }

    currentState.update(dt);
    currentState.draw();
}
tick();
