function Game() {
    this.score = 0;
    this.stage = 0;
    this.ship = new Ship();
    this.asteroids = [];
    this.reset();
}

Game.prototype.reset = function() {
    this.score = 0;
    this.stage = 0;
    this.ship.lives = this.ship.INITIAL_LIVES;
    this.setUpAsteroids();
}

Game.prototype.update = function(dt) {
    var self = this;
    if (!self.asteroids.length) {
        self.stage++;
        self.setUpAsteroids();
    }

    self.ship.update(dt, controls);
    for (var i = 0; i < self.asteroids.length; i++) {
        self.asteroids[i].update(dt);
    }

    self.checkCollisions();

    if (scoreElement) { scoreElement.textContent = padString(self.score, 4); }
    if (livesElement) { livesElement.textContent = self.ship.lives; }
}

Game.prototype.checkCollisions = function() {
    var self = this;
    self.asteroids.forEach(function(asteroid) {
        self.ship.missiles.forEach(function(missile) {
            var overlapping = circlesOverlap(asteroid.position, asteroid.radius, missile.position, missile.radius),
                bothAlive = !(asteroid.dead || missile.dead);
            if (overlapping && bothAlive) {
                asteroid.dead = missile.dead = true;
                self.score += 1;
            }
        });

        var overlapping = circlesOverlap(self.ship.position, self.ship.radius, asteroid.position, asteroid.radius);
        if (overlapping) {
            asteroid.dead = true;
            if (self.ship.lives > 1) {
                // Remove a life.
                self.ship.lives -= 1;
            } else {
                // Game over! reset.
                self.reset();
            }

            do {
                self.ship.position = randomPosition(w * 0.66, h * 0.66);
                var overlapping = false;
                for (var i = 0; i < self.asteroids.length; i++) {
                    var a = self.asteroids[i];
                    if (circlesOverlap(self.ship.position, self.ship.radius, a.position, a.radius * 2)) {
                        overlapping = true;
                        break;
                    }
                }
            } while (overlapping);
            self.ship.velocity = vec2.create();
            self.ship.rotation = 0;
        }
    });

    var newAsteroids = [];
    self.asteroids.forEach(function (a) {
        if (a.dead && a.stage < 2) {
            var stageSpawn = [0, 2, 3],
                asteroid_stage = a.stage + 1;
            for (var i = 0; i < stageSpawn[asteroid_stage]; i++) {
                var newAsteroid = new Asteroid(asteroid_stage, self.stage);
                newAsteroid.position = vec2.clone(a.position);
                var offset = vec2.random(vec2.create(), 2);
                vec2.add(newAsteroid.position, newAsteroid.position, offset);
                newAsteroids.push(newAsteroid);
            }
        }
    });

    function filterAndCleanUp(go) {
        if (go.dead) {
            gl.deleteBuffer(go.vertexBuffer);
            return false;
        }
        return true;
    }
    self.ship.missiles = self.ship.missiles.filter(filterAndCleanUp);
    self.asteroids = self.asteroids.filter(filterAndCleanUp);

    // Add spawned asteroids.
    self.asteroids = self.asteroids.concat(newAsteroids);
}

Game.prototype.setUpAsteroids = function() {
    this.asteroids.forEach(function (a) { gl.deleteBuffer(a.vertexBuffer); });
    this.asteroids = [];

    for (var i = 0; i < 6; i++) {
        var newAsteroid = new Asteroid(0, this.stage);
        this.asteroids.push(newAsteroid);
        do {
            newAsteroid.position = randomPosition(w, h);
            var colliding = circlesOverlap(this.ship.position, this.ship.radius + 5, newAsteroid.position, newAsteroid.radius);
        } while (colliding);
    }
}

Game.prototype.draw = function() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(matStack.current);

    matStack.push();
    this.ship.draw(matStack.current);
    matStack.pop();

    for (var i = 0; i < this.asteroids.length; i++) {
        matStack.push();
        this.asteroids[i].draw(matStack.current);
        matStack.pop();
    }

    for (var i = 0; i < this.ship.missiles.length; i++) {
        matStack.push();
        this.ship.missiles[i].draw(matStack.current);
        matStack.pop();
    }
}
