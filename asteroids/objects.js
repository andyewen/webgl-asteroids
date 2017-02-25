function GameObject() {};
GameObject.prototype = {
  getTransformedShape: function() {
    return this.shape.map(function(vert) {
      var transformMatrix = mat2d.create();
      mat2d.translate(transformMatrix, this.position, transformMatrix);
      mat2d.rotate(transformMatrix, this.rotation, transformMatrix);
      vert = vec2.clone(vert);
      vec2.transformMat2d(vert, vert, transformMatrix);
      return vert
    });
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
  this.position = vec2.create();
  this.velocity = vec2.create();
  this.rotation = 0;
}

Ship.prototype = new GameObject();
Ship.prototype.update = function(controls) {
  this.boosting = false;
  if (controls.isKeyDown(38)) {
    var acceleration = vec2.fromValues(Math.cos(this.rotation),
                                       Math.sin(this.rotation));
    vec2.scale(acceleration, acceleration, this.ACCELERATION);
    vec2.add(this.velocity, this.velocity, acceleration);

    this.boosting = true;
  }
  var deltaRot = 0;
  if (controls.isKeyDown(37)) {
    deltaRot += 0.1;
  }
  if (controls.isKeyDown(39)) {
    deltaRot -= 0.1;
  }

  vec2.scale(this.velocity, this.velocity, 1 - this.FRICTION);
  vec2.add(this.position, this.position, this.velocity);
  this.rotation += deltaRot;

  wrapPosition(this);
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

Ship.prototype.ACCELERATION = 0.005;
Ship.prototype.FRICTION = 0.015;


function Asteroid(radius) {
  this.vertexBuffer = gl.createBuffer();
  this.shape = []
  for (var i = 0; i < 12; i++) {
    var rotation = (i / 12) * 2 * Math.PI;
    var vertex = [Math.cos(rotation), Math.sin(rotation)];
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

  this.position = vec2.fromValues(Math.random() * 40 - 20, Math.random() * 40 - 20);
  this.velocity = vec2.random(vec2.create(), 0.01);
  this.radius = radius;
}

Asteroid.prototype = {
  update: function() {
    vec2.add(this.position, this.position, this.velocity);
    wrapPosition(this);
  },
  draw: function(mvMatrix) {
    mat4.translate(mvMatrix, mvMatrix, [this.position[0],
                                        this.position[1], 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           this.vertexBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_LOOP, 0, this.vertexBuffer.numItems);
  }
}
