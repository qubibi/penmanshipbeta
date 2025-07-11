class PaperDraw {
    constructor() {
		
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.mx = 0;
        this.my = 0;


        this.setupMouseEvents();
        
        // 線の太さを設定
      //   rend_linepaper.setLineWidth(3.0); // 3ピクセルの太さに設定
        this.offset = 0.99; // 線のずらし幅（ピクセル単位）
    }

    freset() {
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.mx = 0;
        this.my = 0;
        rend_linepaper.clear(); // キャンバスをクリア
    }

    setupMouseEvents() {
		
        // canvaspaper.addEventListener('mousedown', this.startDrawing.bind(this));
        // canvaspaper.addEventListener('mousemove', this.draw.bind(this));
        // canvaspaper.addEventListener('mouseup', this.stopDrawing.bind(this));
        // canvaspaper.addEventListener('mouseout', this.stopDrawing.bind(this));
    }

    startDrawing() {
    // startDrawing(e) {
        this.isDrawing = true;
        [this.lastX, this.lastY] = this.f_automouse_pos();
        // [this.lastX, this.lastY] = this.getMousePos(e);
    }

    fef() {
    // draw(e) {
        if (!this.isDrawing) return;

        const [x, y] = this.f_automouse_pos()
        // const [x, y] = this.getMousePos(e);
        
        // メインの線
        rend_linepaper.beginShape();
        rend_linepaper.setColor(0, 0, 0, 1);
        rend_linepaper.vertex(this.lastX, this.lastY);
        rend_linepaper.vertex(x, y);
        rend_linepaper.endShape();

        // 右/下にずらした線
        rend_linepaper.beginShape();
        rend_linepaper.vertex(this.lastX + this.offset, this.lastY + this.offset);
        rend_linepaper.vertex(x + this.offset, y + this.offset);
        rend_linepaper.endShape();

        // 左/上にずらした線
        rend_linepaper.beginShape();
        rend_linepaper.vertex(this.lastX - this.offset, this.lastY - this.offset);
        rend_linepaper.vertex(x - this.offset, y - this.offset);
        rend_linepaper.endShape();

        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    f_automouse(xx,yy) {
        this.mx = xx;
        this.my = yy;
    }
    f_automouse_pos() {
        return [ this.mx, this.my ]
    }

    // getMousePos(e) {
    getMousePos() {
        
        const rect = canvaspaper.getBoundingClientRect();
        const scaleX = canvaspaper.width / rect.width;
        const scaleY = canvaspaper.height / rect.height;
        
        return [
            ((this.mx - rect.left) * scaleX / rend_linepaper.pixelDensity) - 500,
            ((this.my - rect.top) * scaleY / rend_linepaper.pixelDensity) - 500
        ];
    }
} 