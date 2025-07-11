class FillRenderer {
    constructor(gl) {
        this.gl = gl;
        this.vertices = [];
        this.pixelDensity = 1.0;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        this.setupShaders();
        this.setupBuffers();
    }

    setupShaders() {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, shd_fill.vertex);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, shd_fill.fragment);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        this.gl.useProgram(this.program);
        this.locations = {
            patternType: this.gl.getUniformLocation(this.program, 'uPatternType'),
            patternRange: this.gl.getUniformLocation(this.program, 'uPatternRange'),
            color: this.gl.getUniformLocation(this.program, 'uColor'),
            resolution: this.gl.getUniformLocation(this.program, 'uResolution')
        };
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        return shader;
    }

    setupBuffers() {
        this.vertexBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
    }

    /**
     * @param {number} type - パターンタイプ（0-5）
     * @param {number} fillWidth - 塗る範囲（ピクセル）
     * @param {number} totalWidth - パターンの全体の範囲（ピクセル）
     */
    setPattern(type, fillWidth = 1, totalWidth = 2) {
        this.gl.useProgram(this.program);
        this.gl.uniform1i(this.locations.patternType, type);
        this.gl.uniform2f(this.locations.patternRange, fillWidth, totalWidth);
    }

    setColor(r, g, b, a) {
        this.gl.useProgram(this.program);
        this.gl.uniform4f(this.locations.color, r, g, b, a);
    }

    setPixelDensity(density, width, height) {
        this.pixelDensity = density;
        this.width = width;
        this.height = height;
        
        this.gl.viewport(0, 0, 
            Math.floor(width * density), 
            Math.floor(height * density)
        );

        this.gl.useProgram(this.program);
        this.gl.uniform2f(this.locations.resolution, 
            this.width * this.pixelDensity, 
            this.height * this.pixelDensity
        );
    }

    beginShape() {
        this.vertices = [];
    }

    vertex(x, y) {
        this.vertices.push(x * this.pixelDensity, y * this.pixelDensity);
    }

    endShape() {
        const indices = earcut(this.vertices);
        
        this.gl.useProgram(this.program);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        
        const positionAttrib = this.gl.getAttribLocation(this.program, 'aPosition');
        this.gl.enableVertexAttribArray(positionAttrib);
        this.gl.vertexAttribPointer(positionAttrib, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    dispose() {
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.indexBuffer);
        this.gl.deleteProgram(this.program);
    }
}