class LineRenderer {
    constructor(gl) {
        this.gl = gl;
        this.vao = gl.createVertexArray();
        this.setupShaders();
        this.setupBuffers();
        
        // 初期設定
        this.color = [0, 0, 0, 1];
        this.vertices = [];
        this.pixelDensity = window.devicePixelRatio || 1;
        this.isDouble = false;
        this.doubleOffset = 0.88; // ずらす量（px）
    }

    setupShaders() {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, shd_line.vertex);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, shd_line.fragment);

        // プログラムの作成とリンク
        this.program = this.createProgram(vertexShader, fragmentShader);

        // アトリビュートとユニフォームのロケーション取得
        this.locations = {
            position: this.gl.getAttribLocation(this.program, 'aPosition'),
            resolution: this.gl.getUniformLocation(this.program, 'uResolution'),
            color: this.gl.getUniformLocation(this.program, 'uColor')
        };

        // VAOの設定
        this.gl.bindVertexArray(this.vao);
        this.gl.enableVertexAttribArray(this.locations.position);
        this.gl.bindVertexArray(null);
    }

    setupBuffers() {
        // メインバッファの作成
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        
        // VAOにバッファを関連付け
        this.gl.bindVertexArray(this.vao);
        this.gl.vertexAttribPointer(
            this.locations.position,
            2, // size (vec2)
            this.gl.FLOAT, // type
            false, // normalize
            0, // stride
            0 // offset
        );
        this.gl.bindVertexArray(null);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(program));
            return null;
        }

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        return program;
    }

    setPixelDensity(density, width, height) {
        const canvas = this.gl.canvas;
        
        // キャンバスサイズの設定
        canvas.width = Math.floor(width * density);
        canvas.height = Math.floor(height * density);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // ビューポートの設定
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        
        // 解像度の更新
        this.resolution = [canvas.width, canvas.height];
        this.pixelDensity = density;
    }

    setColor(r, g, b, a = 1.0) {
        this.color = [r, g, b, a];
    }

    beginShape(double = "solo") {
        this.vertices = [];
        if (double === "double") this.isDouble = true;
        else this.isDouble = false;
    }

    vertex(x, y) {
        // ピクセル座標での頂点追加
        this.vertices.push(x * this.pixelDensity, y * this.pixelDensity);
    }

    endShape(close = false) {
        if (this.vertices.length < 4) return;

        if (close) {
            this.vertices.push(this.vertices[0], this.vertices[1]);
        }

        const totalVertices = [...this.vertices];

        if (this.isDouble) {
            // 最初の線の頂点をすべて追加
            const firstLine = [...this.vertices];
            
            // 2本目の線は逆順で追加（最後の頂点から最初の頂点へ）
            for (let i = this.vertices.length - 2; i >= 0; i -= 2) {
                totalVertices.push(
                    this.vertices[i] + this.doubleOffset,
                    this.vertices[i + 1] - this.doubleOffset
                );
            }
        }

        // バッファデータの更新
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(totalVertices),
            this.gl.DYNAMIC_DRAW
        );

        // 描画設定
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);
        this.gl.uniform2fv(this.locations.resolution, this.resolution);
        this.gl.uniform4fv(this.locations.color, this.color);

        // 描画（doubleの場合は2本分の頂点を描画）
        const pointCount = this.vertices.length / 2;
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.isDouble ? pointCount * 2 : pointCount);
        
        this.gl.bindVertexArray(null);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    dispose() {
        // リソースの解放
        this.gl.deleteBuffer(this.buffer);
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteProgram(this.program);
    }

    debugBezier(points) {
        // コントロールポイントを表示
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            
            // メインポイントを表示
            this.beginShape();
            this.setColor(1.0, 0.0, 0.0, 1.0);  // 赤色
            this.vertex(point.x - 5, point.y - 5);
            this.vertex(point.x + 5, point.y + 5);
            this.endShape();
            
            this.beginShape();
            this.vertex(point.x - 5, point.y + 5);
            this.vertex(point.x + 5, point.y - 5);
            this.endShape();

            // コントロールポイントがある場合は表示
            if (point.ctr2x !== undefined && point.ctr2y !== undefined) {
                this.beginShape();
                this.setColor(0.0, 1.0, 0.0, 0.5);  // 緑色
                this.vertex(point.x, point.y);
                this.vertex(point.x + point.ctr2x, point.y + point.ctr2y);
                this.endShape();
            }
            
            if (point.ctr1x !== undefined && point.ctr1y !== undefined) {
                this.beginShape();
                this.setColor(0.0, 0.0, 1.0, 0.5);  // 青色
                this.vertex(point.x, point.y);
                this.vertex(point.x + point.ctr1x, point.y + point.ctr1y);
                this.endShape();
            }
        }
    }
}