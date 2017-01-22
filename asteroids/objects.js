function Ship() {
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  vertices = new Float32Array([1, 0, 0,
                               -1, -0.6, 0,
                               -0.7, 0, 0,
                               -1, 0.6, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  this.vertexBuffer.itemSize = 3;
  this.vertexBuffer.numItems = 4;

  this.position = vec2.create();
  this.velocity = vec2.create();
  this.rotation = 0;
}

Ship.prototype = {
  update: function(controls) {
    if (controls.isKeyDown(38)) {
      var acceleration = vec2.fromValues(Math.cos(this.rotation),
                                         Math.sin(this.rotation));
      vec2.scale(acceleration, acceleration, this.ACCELERATION);
      vec2.add(this.velocity, this.velocity, acceleration);
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
  },
  draw: function(mvMatrix) {
    mat4.translate(mvMatrix, mvMatrix, [this.position[0],
                                        this.position[1], 0]);
    mat4.rotateZ(mvMatrix, mvMatrix, this.rotation);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                           this.vertexBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_LOOP, 0, this.vertexBuffer.numItems);
  },
  ACCELERATION: 0.005,
  FRICTION: 0.015,
}

function Asteroid(radius) {
  this.vertexBuffer = gl.createBuffer();
  vertices = [];
  for (var i = 0; i < 12; i++) {
    var rotation = (i / 12) * 2 * Math.PI;
    var vertex = [Math.cos(rotation), Math.sin(rotation), 0];
    var vertDist = radius + (Math.random() * 0.6 * radius) - 0.3 * radius;
    vec3.scale(vertex, vertex, vertDist);
    vertices = vertices.concat(vertex);
  }
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
