var gl;
function initGL(canvas) {
  try {
    gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
    alert("Could not initialise WebGL, sorry :(");
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
  isKeyDown: function(keyCode) {
    return Boolean(this.keyStates[keyCode]);
  },
  keyStates: []
};
document.addEventListener("keyup", function(e) {
  controls.keyStates[e.keyCode] = false;
});
document.addEventListener("keydown", function(e) {
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

var mvMatrix = mat4.create();
matStack = {
  stack: [],
  push: function() {
    this.stack.push(mvMatrix);
    mvMatrix = mat4.clone(mvMatrix);
  },
  pop: function() {
    if (!this.stack.length) {
      throw "Empty matrix stack";
    }
    mvMatrix = this.stack.pop();
  }
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function wrapPosition(object) {
  if (object.position[0] > w / 2) { object.position[0] -= w; }
  if (object.position[0] < -w / 2) { object.position[0] += w; }
  if (object.position[1] > h / 2) { object.position[1] -= h; }
  if (object.position[1] < -h / 2) { object.position[1] += h; }
}

function checkCollisions() {
  // Returns the asteroid we collided with.
  for (var asteroidI = 0; asteroidI < asteroids.length; asteroidI++) {
    asteroid = asteroids[asteroidI];

    var shipLines = ship.getTransformedLines();
    var asteroidLines = asteroid.getTransformedLines();
    // Check if any of the ship's lines intersect with any of the asteroid's.
    for (var i = 0; i < shipLines.length; i++) {
      for (var j = 0; j < asteroidLines.length; j++) {
        if (linesIntersect(shipLines[i], asteroidLines[j])) {
          collideAlert();
          return asteroid;
        }
      }
    }
  }
}

function update() {
  var now = new Date();
  var dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  ship.update(dt, controls);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].update(dt);
  }

  checkCollisions();
}

function draw() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.identity(mvMatrix);

  matStack.push();
  ship.draw(mvMatrix);
  matStack.pop();

  for (var i = 0; i < asteroids.length; i++) {
    matStack.push();
    asteroids[i].draw(mvMatrix);
    matStack.pop();
  }
}

var canvas = document.getElementsByTagName("canvas")[0];
initGL(canvas);
initViewport();
initShaders();

gl.clearColor(0.0, 0.0, 0.0, 1.0);

ship = new Ship();
asteroids = [];
for (var i = 0; i < 12; i++) {
  asteroids.push(new Asteroid(2.2));
}

var lastFrameTime = new Date();

function tick() {
  requestAnimationFrame(tick);

  update();
  draw();
}
tick();
