function GameObject() {};
GameObject.prototype = {
  getTransformedShape: function() {
    var self = this;
    return self.shape.map(function(vert) {
      var transformMatrix = mat2d.create();
      mat2d.translate(transformMatrix, transformMatrix, self.position);
      mat2d.rotate(transformMatrix, transformMatrix, self.rotation);
      vert = vec2.clone(vert);
      vec2.transformMat2d(vert, vert, transformMatrix);
      return vert
    });
  },
  getTransformedLines: function() {
    var lines = [];
    var shape = this.getTransformedShape();
    for (var i = 0; i < shape.length; i++) {
      var from = vec2.clone(shape[i]);
      if (i + 1 < shape.length) {
        var to = shape[i + 1];
      } else {
        var to = vec2.clone(shape[0]);
      }
      lines.push([from, to]);
    }
    return lines;
  }
};

var shipShape = [
  [ 1, 0 ],
  [ -1, -0.6 ],
  [ -1, -0.6 ],
  [ -0.7, 0 ],
  [ -0.7, 0 ],
  [ -1, 0.6 ],
  [ -1, 0.6 ],
  [ 1, 0 ],
  [ -0.8, -0.2 ],
  [ -1.4, 0 ],
  [ -1.4, 0 ],
  [ -0.8, 0.2 ]
].map(function(vert) {
  return vec2.fromValues(vert[0], vert[1]);
});

function Ship() {
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  this.shape = shipShape;
  var vertices = new Float32Array(this.shape.map(function(vert){
    return [vert[0], vert[1], 0];
  }).reduce(function(a, b) {
    return a.concat(b);
  }));
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 12;
  this.vertexBuffer.numItemsNoBoost = 8;

  this.boosting = false;
  this.missiles = [];
  this.shootPressedLast = false;
  this.missileCooldown = 0;
  this.radius = 0;
  this.lives = this.INITIAL_LIVES;

  this.position = vec2.create();
  this.velocity = vec2.create();
  this.rotation = 0;
}

Ship.prototype = new GameObject();
Ship.prototype.update = function(dt, controls) {
  this.boosting = false;
  if (controls.isKeyDown(38)) {
    var acceleration = vec2.fromValues(Math.cos(this.rotation),
                                       Math.sin(this.rotation));
    vec2.scale(acceleration, acceleration, dt * this.ACCELERATION);
    vec2.add(this.velocity, this.velocity, acceleration);

    this.boosting = true;
  }

  this.missileCooldown -= dt;
  this.missileCooldown = Math.max(this.missileCooldown, 0);
  var shootPressed = controls.isKeyDown(90);
  if (this.missileCooldown <= 0 && shootPressed && !this.shootPressedLast) {
    this.missiles.push(new Missile(vec2.clone(this.position), this.rotation));
    this.missileCooldown = this.MISSILE_COOLDOWN;
  }
  this.shootPressedLast = shootPressed;

  var deltaRot = 0;
  if (controls.isKeyDown(37)) {
    deltaRot += this.ROTATION_RATE;
  }
  if (controls.isKeyDown(39)) {
    deltaRot -= this.ROTATION_RATE;
  }

  var frictionVector = vec2.clone(this.velocity);
  vec2.scale(frictionVector, frictionVector, -1 * this.FRICTION * dt);
  vec2.add(this.velocity, this.velocity, frictionVector);

  var frameVelocity = vec2.clone(this.velocity);
  vec2.scale(frameVelocity, frameVelocity, dt)
  vec2.add(this.position, this.position, frameVelocity);
  this.rotation += deltaRot * dt;

  wrapPosition(this);

  // Update the ship's missiles.
  this.missiles.forEach(function(m) {
    m.update(dt);
  })
}

Ship.prototype.draw = function(mvMatrix) {
  mat4.translate(mvMatrix, mvMatrix, [this.position[0],
                                      this.position[1], 0]);
  mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         this.vertexBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.LINES, 0, this.boosting ? this.vertexBuffer.numItems : this.vertexBuffer.numItemsNoBoost);
}

Ship.prototype.ROTATION_RATE = 4.2;
Ship.prototype.ACCELERATION = 12;
Ship.prototype.FRICTION = 0.6;
Ship.prototype.MISSILE_COOLDOWN = 0.05;
Ship.prototype.INITIAL_LIVES = 3;


function Missile(position, rotation) {
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  var vertices = new Float32Array([-0.3, 0, 0, 0.3, 0, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 2;

  this.dead = false;
  this.travelled = 0;

  this.radius = 0;
  this.position = position || vec2.create();
  this.rotation = rotation || 0;

  this.velocity = vec2.fromValues(Math.cos(this.rotation),
                                  Math.sin(this.rotation));
  vec2.scale(this.velocity, this.velocity, this.SPEED);
}

Missile.prototype = new GameObject();

Missile.prototype.update = function(dt) {
  var frameVelocity = vec2.clone(this.velocity);
  vec2.scale(frameVelocity, frameVelocity, dt);
  vec2.add(this.position, this.position, frameVelocity);

  this.travelled += vec2.len(frameVelocity);
  if (this.travelled > 20) {
    this.dead = true;
  }

  wrapPosition(this);
}

Missile.prototype.draw = function(mvMatrix) {
  mat4.translate(mvMatrix, mvMatrix, [this.position[0],
                                      this.position[1], 0]);
  mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         this.vertexBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.LINE_STRIP, 0, this.vertexBuffer.numItems);
}

Missile.prototype.SPEED = 17;


function Asteroid(radius) {
  this.vertexBuffer = gl.createBuffer();
  this.shape = []
  for (var i = 0; i < 12; i++) {
    var rotation = (i / 12) * 2 * Math.PI;
    var vertex = vec2.fromValues(Math.cos(rotation), Math.sin(rotation));
    var vertDist = radius + (Math.random() * 0.6 * radius) - 0.3 * radius;
    vec2.scale(vertex, vertex, vertDist);
    this.shape.push(vertex);
  }
  var vertices = new Float32Array(this.shape.map(function(vert){
    return [vert[0], vert[1], 0];
  }).reduce(function(a, b) {
    return a.concat(b);
  }));
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
                gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 12;

  this.dead = false;

  this.position = vec2.fromValues(Math.random() * 40 - 20, Math.random() * 40 - 20);
  this.rotation = 0;
  this.velocity = vec2.random(vec2.create(), 0.8);
  this.radius = radius;
}

Asteroid.prototype = new GameObject();

Asteroid.prototype.update = function(dt) {
  var frameVelocity = vec2.clone(this.velocity);
  vec2.scale(frameVelocity, frameVelocity, dt);
  vec2.add(this.position, this.position, frameVelocity);

  wrapPosition(this);
}

Asteroid.prototype.draw = function(mvMatrix) {
  mat4.translate(mvMatrix, mvMatrix, [this.position[0],
                                      this.position[1], 0]);
  mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                         this.vertexBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.LINE_LOOP, 0, this.vertexBuffer.numItems);
}
