class MoveShader {
    constructor(gl) {
        this.gl = gl;
        this.program = this.createProgram(shd_move.vertex, shd_move.fragment);
        this.setupBuffers();
        this.getLocations();
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link failed:', this.gl.getProgramInfoLog(program));
        }

        return program;
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile failed:', this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    setupBuffers() {
        // フルスクリーン四角形の頂点データを修正
        this.vertices = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0,  1.0,
            -1.0,  1.0
        ]);

        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

        // 頂点属性の設定
        const positionLoc = this.gl.getAttribLocation(this.program, 'aPosition');
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    }

    getLocations() {
        this.locations = {
            position: this.gl.getAttribLocation(this.program, 'aPosition'),
            resolution: this.gl.getUniformLocation(this.program, 'uResolution'),
            offset: this.gl.getUniformLocation(this.program, 'uOffset'),
            texture: this.gl.getUniformLocation(this.program, 'uTexture')
        };
    }

    draw(texture, offsetX, offsetY) {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);

        // Set uniforms
        this.gl.uniform2f(this.locations.resolution, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(this.locations.offset, offsetX, offsetY);

        // Set up texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this.locations.texture, 0);

        // 描画方法を修正
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    dispose() {
        this.gl.deleteBuffer(this.buffer);
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteProgram(this.program);
    }
} 