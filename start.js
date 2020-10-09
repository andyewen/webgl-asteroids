function Start() {
    var letters = {
        'A': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        'B': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 0.5],
            [1, 0.5],
            [0, 1],
            [0, 1],
            [1, 1.5],
            [1, 1.5],
            [0, 2]
        ],
        'C': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2]
        ],
        'D': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 1],
            [1, 1],
            [0, 2]
        ],
        'E': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        'F': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        'G': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 1],
            [1, 1],
            [0.5, 1]
        ],
        'H': [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        'I': [
            [0.5, 0],
            [0.5, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2]
        ],
        'J': [
            [0.5, 0],
            [0.5, 2],
            [0, 0],
            [0.5, 0],
            [0, 2],
            [1, 2]
        ],
        'K': [
            [0, 0],
            [0, 2],
            [0, 1],
            [1, 0],
            [0, 1],
            [1, 2]
        ],
        'L': [
            [0, 0],
            [0, 2],
            [0, 0],
            [1, 0],
        ],
        'M': [
            [0, 0],
            [0, 2],
            [0, 2],
            [0.5, 1],
            [1, 0],
            [1, 2],
            [0.5, 1],
            [1, 2]
        ],
        'N': [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [0, 2],
            [1, 0]
        ],
        'O': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 2],
            [0, 0],
            [1, 0]
        ],
        'P': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 1],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        'Q': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 2],
            [0, 0],
            [1, 0],
            [1, 0],
            [0.5, 1]
        ],
        'R': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 1],
            [1, 2],
            [0, 1],
            [1, 1],
            [0, 1],
            [1, 0]
        ],
        'S': [
            [1, 0],
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [1, 1],
            [0, 1],
            [0, 2],
            [1, 2],
            [0, 2]
        ],
        'T': [
            [0.5, 0],
            [0.5, 2],
            [0, 2],
            [1, 2]
        ],
        'U': [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [0, 0],
            [1, 0]
        ],
        'V': [
            [0.5, 0],
            [0, 2],
            [0.5, 0],
            [1, 2]
        ],
        'W': [
            [0, 0],
            [0, 2],
            [0, 0],
            [0.5, 1],
            [1, 0],
            [1, 2],
            [0.5, 1],
            [1, 0]
        ],
        'X': [
            [0, 0],
            [1, 2],
            [0, 2],
            [1, 0],
        ],
        'Y': [
            [0.5, 1],
            [1, 2],
            [0, 2],
            [0.5, 1],
            [0.5, 1],
            [0.5, 0]
        ],
        'Z': [
            [0, 0],
            [1, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2]
        ],
        '0': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 2],
            [0, 0],
            [1, 0],
            [0, 0],
            [1, 2]
        ],
        '1': [
            [0.5, 0],
            [0.5, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [0.5, 2]
        ],
        '2': [
            [1, 0],
            [0, 0],
            [0, 0],
            [0, 1],
            [0, 1],
            [1, 1],
            [1, 1],
            [1, 2],
            [1, 2],
            [0, 2]
        ],
        '3': [
            [1, 0],
            [1, 2],
            [0, 0],
            [1, 0],
            [0, 2],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        '4': [
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 2],
            [0, 1],
            [1, 1]
        ],
        '5': [
            [1, 0],
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [1, 1],
            [0, 1],
            [0, 2],
            [1, 2],
            [0, 2]
        ],
        '6': [
            [1, 0],
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [1, 1],
            [0, 0],
            [0, 2],
            [1, 2],
            [0, 2]
        ],
        '7': [
            [1, 0],
            [1, 2],
            [1, 2],
            [0, 2]
        ],
        '8': [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [1, 0],
            [1, 2],
            [0, 1],
            [1, 1],
            [0, 0],
            [1, 0]
        ],
        '9': [
            [1, 0],
            [1, 2],
            [0, 2],
            [1, 2],
            [0, 1],
            [0, 2],
            [0, 1],
            [1, 1]
        ],
    }

    for (var key in letters) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Flatten vertices into a Float32Array.
        var vertices = new Float32Array(letters[key].map(function(vert) {
            return [vert[0], vert[1], 0];
        }).reduce(function(a, b) {
            return a.concat(b);
        }));
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        var itemSize = 3,
            numItems = vertices.length / itemSize;

        letters[key] = {
            buffer: buffer,
            itemSize: itemSize,
            numItems: numItems
        }
    }

    this.letters = letters;
}

Start.prototype = {
    update: function(dt) {
        var gamepad = controls.getGamepad();
        if (controls.isKeyDown(90) || gamepad && gamepad.buttons[1].pressed) {
            changeState('game');
        }
    },

    draw: function() {
        this.drawString("WEBGL ASTEROIDS", [-16, 8]);
        this.drawString("PRESS Z TO PLAY", [-16, 0]);
    },
    drawString: function(s, startPosition) {
        matStack.push();
        mat4.translate(matStack.current, matStack.current, [startPosition[0], startPosition[1], 0]);

        for (var i = 0; i < s.length; i++) {
            var char = s.charAt(i);

            var letterBuffer = this.letters[char];
            if (!letterBuffer) {
                continue;
            }

            matStack.push();
            mat4.translate(matStack.current, matStack.current, [1.5 * i, 0, 0]);

            var matrix = matStack.current;
            gl.bindBuffer(gl.ARRAY_BUFFER, letterBuffer.buffer);
            gl.vertexAttribPointer(
                shaderProgram.vertexPositionAttribute,
                letterBuffer.itemSize,
                gl.FLOAT, false, 0, 0
            );
            setMatrixUniforms();
            gl.drawArrays(gl.LINES, 0, letterBuffer.numItems);

            matStack.pop();
        }

        matStack.pop();
    }
}
