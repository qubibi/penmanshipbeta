class PaperDraw {
    constructor() {
		
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.mx = 0;
        this.my = 0;
        
        // スクロールオフセットを追跡
        this.scrollOffset = 0;
        this.lastScrollOffset = 0;
        
        this.setupMouseEvents();
        
        // 線の太さを設定
      //   rend_linepaper.setLineWidth(3.0); // 3ピクセルの太さに設定
        this.offset = 1.13; // 線のずらし幅（ピクセル単位）
        // this.offset = 0.99; // 線のずらし幅（ピクセル単位）
        
        // ドット描画用の遅延キュー
        this.dotQueue = [];
        
        // 過去の線分を保存する配列
        this.pastLines = [];
        
        // 交差判定に使用する最小時間（ミリ秒）
        this.minTimeBetweenIntersections = 900;
        
        // 交差判定に使用する最小角度（度）- これ未満の角度の交差は無視
        this.minIntersectionAngle = 20;
    }

    freset() {
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.mx = 0;
        this.my = 0;
        this.scrollOffset = 0;
        this.lastScrollOffset = 0;
        this.dotQueue = [];
        this.pastLines = [];
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
        
        // 描画開始時に現在のスクロールオフセットを記録
        this.lastScrollOffset = this.scrollOffset;
    }

    fef() {
    // draw(e) {
        // 描画中の処理
        if (this.isDrawing) {
            const [x, y] = this.f_automouse_pos();
            // const [x, y] = this.getMousePos(e);
            
            let _dragxmag = qb.mppng(Math.abs(motionpen.xsabn), 0, 3, 1, -1, true, 0.0);
            
            const scrollDelta = Math.max(Math.min(this.scrollOffset - this.lastScrollOffset, 5), -5);
            const adjustedLastY = this.lastY + scrollDelta* _dragxmag;
            
            // 極端に長い線を防止（前回の位置と現在の位置が極端に離れている場合）
            // const distance = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - adjustedLastY, 2));
            // if (distance > 50) {
            //     this.lastX = x;
            //     this.lastY = y;
            //     this.lastScrollOffset = this.scrollOffset;
            //     return;
            // }
            
            // 現在の線分（始点と終点）
            const currentLine = {
                x1: this.lastX,
                y1: adjustedLastY - 2.11,
                x2: x,
                y2: y - 2.11,
                timestamp: Date.now() // タイムスタンプを追加
            };
            
            // 過去の線分との交差判定
            this.checkIntersections(currentLine);
            
            // メインの線
            rend_linepaper.beginShape();
            rend_linepaper.setColor(0, 0, 0, 1);
            rend_linepaper.vertex(this.lastX, adjustedLastY-2.11);
            rend_linepaper.vertex(x, y-2.11);
            rend_linepaper.endShape();

            // 右/下にずらした線
            rend_linepaper.beginShape();
            rend_linepaper.vertex(this.lastX + this.offset, adjustedLastY - this.offset-2.11);
            rend_linepaper.vertex(x + this.offset, y - this.offset-2.11);
            rend_linepaper.endShape();

            // 左/上にずらした線
            // rend_linepaper.beginShape();
            // rend_linepaper.vertex(this.lastX - this.offset, adjustedLastY - this.offset-2.11);
            // rend_linepaper.vertex(x - this.offset, y - this.offset-2.11);
            // rend_linepaper.endShape();

            // rend_linepaper.beginShape();
            // rend_linepaper.vertex(this.lastX, adjustedLastY - this.offset*2-2.11);
            // rend_linepaper.vertex(x + this.offset/2, y - this.offset*2-2.11);
            // rend_linepaper.endShape();
            
            // 描画した線分を過去の線分として保存（一定数を超えたら古いものから削除）
            this.pastLines.push(currentLine);
            if (this.pastLines.length > 500) {
                this.pastLines.shift(); // 古い線分を削除
            }

            this.lastX = x;
            this.lastY = y;
            this.lastScrollOffset = this.scrollOffset;
        }
        
        // 遅延ドットキューの処理
        this.processDotQueue();
    }
    
    // 線分の交差判定を行うメソッド
    checkIntersections(currentLine) {
        const currentTime = Date.now();
        
        // 一定時間以上経過した線のみチェック
        const linesToCheck = this.pastLines.filter(line => 
            line.timestamp && (currentTime - line.timestamp) > this.minTimeBetweenIntersections
        );
        
        for (const pastLine of linesToCheck) {
            const intersectionPoint = this.lineIntersection(
                currentLine.x1, currentLine.y1, currentLine.x2, currentLine.y2,
                pastLine.x1, pastLine.y1, pastLine.x2, pastLine.y2
            );
            
            if (intersectionPoint) {
                // 交差点に赤い四角形を描画
                // this.drawRedSquare(intersectionPoint.x, intersectionPoint.y); // 削除済み
            }
        }
    }
    
    // 2つの線分の交差判定を行い、交差する場合は交点を返す
    lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        // 線分の方程式のパラメータを計算
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        
        // 平行な場合は交差なし
        if (denom === 0) {
            return null;
        }
        
        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        
        // 両方の線分上に交点がある場合（0から1の間）
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            // 線分の角度を計算
            const angle1 = Math.atan2(y2 - y1, x2 - x1);
            const angle2 = Math.atan2(y4 - y3, x4 - x3);
            
            // 角度の差を計算（0〜180度の範囲に正規化）
            let angleDiff = Math.abs(angle1 - angle2) * (180 / Math.PI);
            if (angleDiff > 180) angleDiff = 360 - angleDiff;
            if (angleDiff > 90) angleDiff = 180 - angleDiff;
            
            // 最小角度未満なら交差と見なさない
            if (angleDiff < this.minIntersectionAngle) {
                return null;
            }
            
            // 交点を計算
            const x = x1 + ua * (x2 - x1);
            const y = y1 + ua * (y2 - y1);
            
            return { x, y };
        }
        
        return null;
    }
    
    // 指定された位置に赤い四角形を描画するメソッド（削除済み）
    /*
    drawRedSquare(x, y) {
        const squareSize = 5; // 四角形の半分のサイズ（10px×10pxになるように）
        
        // 四角形を描画
        rend_linepaper.beginShape();
        rend_linepaper.setColor(1, 0, 0, 1); // 赤色
        
        // 四角形の4つの頂点
        rend_linepaper.vertex(x - squareSize, y - squareSize);
        rend_linepaper.vertex(x + squareSize, y - squareSize);
        rend_linepaper.vertex(x + squareSize, y + squareSize);
        rend_linepaper.vertex(x - squareSize, y + squareSize);
        rend_linepaper.vertex(x - squareSize, y - squareSize);
        
        rend_linepaper.endShape();
    }
    */

    drawRandomDots() {
        // 静的変数として呼び出し回数を追跡
        if (this.drawRandomDots.callCount === undefined) {
            this.drawRandomDots.callCount = 0;
        }
        
        if (this.drawRandomDots.callCount === 0 || Math.random() < 0.8) {
            // f_automouse_posから現在の位置を取得
            const [currentX, currentY] = this.f_automouse_pos();
            
            const currentScrollOffset = this.scrollOffset;
            
            // キューに追加
            this.dotQueue.push({
                x: currentX,
                y: currentY,
                scrollOffset: currentScrollOffset,
                frameCount: 0,
                targetFrame: 77
            });
        }
        
        // 呼び出し回数をインクリメント
        this.drawRandomDots.callCount++;
    }
    
    // ドットキューを処理するメソッド
    processDotQueue() {
        if (this.dotQueue.length === 0) return;
        
        for (let i = this.dotQueue.length - 1; i >= 0; i--) {
            const dot = this.dotQueue[i];
            dot.frameCount++;
            
            if (dot.frameCount >= dot.targetFrame) {
                const scrollDelta = this.scrollOffset - dot.scrollOffset;
                
                // xは-115の位置、yはスクロール分調整
                const dotX = dot.x - qb.rndmint(11+(forMobile_magNega*-2), 26+(forMobile_magNega*-7))
                const dotY = dot.y - 120+(forMobile_magNega*120) - scrollDelta; // スクロール分を引く
                
                const dotSize = Math.random() * 0.5 + 1.7; // 2.3〜2.8の範囲
                
                const offsetX = 1.9;
                const offsetY = -0.8;
                
                // 一度に3つのダイヤモンドを描画
                this.drawMultipleDiamonds(dotX, dotY, dotSize, offsetX, offsetY);
                
                // 描画したドットをキューから削除（後ろから処理しているので安全）
                this.dotQueue.splice(i, 1);
            }
        }
    }
    
    drawMultipleDiamonds(x, y, size, offsetX, offsetY) {
        let positions = [
            {x, y},
            {x: x + offsetX, y: y + offsetY},
            {x: x + offsetX*2, y: y + offsetY}
        ];
        if (Math.random() < 0.2) {
            positions = [
                        {x, y}
                    ];
        }
        // 各ダイヤモンドを描画
        for (const pos of positions) {
            this.drawDiamond(pos.x, pos.y, size);
        }
    }
    
    // ひし形を描画するヘルパーメソッド
    drawDiamond(x, y, size) {
        rend_linepaper.beginShape();
        rend_linepaper.setColor(0, 0, 0, 1);
        const segments = 4; // 線分の数
        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * Math.PI * 2;
            const angle2 = ((i + 1) / segments) * Math.PI * 2;
            
            rend_linepaper.vertex(
                x + Math.cos(angle1) * size, 
                y + Math.sin(angle1) * size
            );
            rend_linepaper.vertex(
                x + Math.cos(angle2) * size, 
                y + Math.sin(angle2) * size+Math.random()
            );
                        rend_linepaper.endShape();
            if (i < segments - 1) {
                rend_linepaper.beginShape();
                rend_linepaper.setColor(0, 0, 0, 1);
            }
        }
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
        
        // ウィンドウサイズに合わせた中心点を計算
        const centerX = canvaspaper.width / 2;
        const centerY = canvaspaper.height / 2;
        
        // マウス位置をWebGL座標系に変換
        return [
            ((this.mx - rect.left) * scaleX / rend_linepaper.pixelDensity) - centerX,
            ((this.my - rect.top) * scaleY / rend_linepaper.pixelDensity) - centerY
        ];
    }

    // スクロールオフセットを更新するメソッド
    updateScrollOffset(newOffset) {
        this.scrollOffset = newOffset;
    }
} 