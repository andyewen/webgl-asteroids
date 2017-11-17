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
  asteroids.forEach(function(asteroid) {
    missiles.forEach(function(missile) {
      var overlapping = circlesOverlap(asteroid.position, asteroid.radius, missile.position, missile.radius),
          bothAlive = !(asteroid.dead && missile.dead);
      if (overlapping && bothAlive) {
        asteroid.dead = missile.dead = true;
      }
    });

    if (circlesOverlap(ship.position, ship.radius, asteroid.position, asteroid.radius)) {
      // Ship collided with an asteroid!
      collideAlert();
    }
  });

  function filterAndCleanUp(go) {
    if (go.dead) {
      gl.deleteBuffer(go.vertexBuffer);
      return false;
    }
    return true;
  }
  ship.missiles = missiles = missiles.filter(filterAndCleanUp);
  asteroids = asteroids.filter(filterAndCleanUp);
}

function update() {
  var now = new Date();
  var dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  ship.update(dt, controls);
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].update(dt);
  }

  missiles.forEach(function(m) {
    m.update(dt);
  })

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

  for (var i = 0; i < missiles.length; i++) {
    matStack.push();
    missiles[i].draw(mvMatrix);
    matStack.pop();
  }
}

var canvas = document.getElementsByTagName("canvas")[0];
initGL(canvas);
initViewport();
initShaders();

gl.clearColor(0.0, 0.0, 0.0, 1.0);

missiles = []
ship = new Ship(missiles);
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
