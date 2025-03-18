class Shaperoot {
    constructor() {
        this.ccloop = 0
        this.inishape = [];
        this.shape = [];
       this.transformMatrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
    }

    // 変換行列の適用
    applyTransform(x, y) {
        // 入力値のチェックと安全な変換
        const safeX = isNaN(x) ? 0 : x;
        const safeY = isNaN(y) ? 0 : y;
        
        const cos = Math.cos(this.transformMatrix.rotation);
        const sin = Math.sin(this.transformMatrix.rotation);
        
        // 計算を分解して、各ステップをチェック
        const transformed = [
            (safeX * cos - safeY * sin) * this.transformMatrix.scaleX + this.transformMatrix.translateX,
            (safeX * sin + safeY * cos) * this.transformMatrix.scaleY + this.transformMatrix.translateY
        ];
        
        // NaNチェックと修正
        if (isNaN(transformed[0])) transformed[0] = safeX;
        if (isNaN(transformed[1])) transformed[1] = safeY;
        
        return transformed;
    }

    // 変換メソッド群
    setTranslate(x, y) {
        this.transformMatrix.translateX = x;
        this.transformMatrix.translateY = y;
    }

    setScale(scaleX, scaleY = scaleX) {
        this.transformMatrix.scaleX = scaleX;
        this.transformMatrix.scaleY = scaleY;
    }

    setRotation(angle) {
        this.transformMatrix.rotation = angle;
    }

    setTransform(options = {}) {
        if (options.translateX !== undefined) this.transformMatrix.translateX = options.translateX;
        if (options.translateY !== undefined) this.transformMatrix.translateY = options.translateY;
        if (options.scaleX !== undefined) this.transformMatrix.scaleX = options.scaleX;
        if (options.scaleY !== undefined) this.transformMatrix.scaleY = options.scaleY;
        if (options.rotation !== undefined) this.transformMatrix.rotation = options.rotation;
    }

    resetTransform() {
        this.transformMatrix = {
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
    }

    // 形状の更新（子クラスでオーバーライド可能）
    updateShape() {

    }
} 