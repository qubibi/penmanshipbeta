class Nyuryoku {
    constructor() {
        // マウスとタッチの状態を管理する変数
        this.isMouseDown = false;
        this.isTouchActive = false;
        
        // 現在の位置と前回の位置
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        
        // ドラッグ量（移動量）
        this.dragX = 0;
        this.dragY = 0;
        
        // 動いている最中のみ更新されるドラッグ量（停止したら最後の値を保持）
        this.dragX2 = 0;
        this.dragY2 = 0;
        
        // マウスダウン/タッチプレス時からの累積移動量（アップ/リリース時にリセット）
        this.pressMoveX = 0;
        this.pressMoveY = 0;
        
        // マウスダウン/タッチプレス時の初期位置
        this.pressStartX = 0;
        this.pressStartY = 0;
        
        // 移動中かどうかを判定するためのタイマーID
        this.moveTimerId = null;
        // 移動停止と判断するまでの時間（ミリ秒）
        this.moveStopDelay = 50;
        // 移動中フラグ
        this.isMoving = false;
        
        // タッチ操作によるコンテキストメニュー表示を防止するためのCSS設定
        this.preventTouchSelection();
        
        // イベントリスナーの設定
        this.setupEventListeners();
    }
    
    // タッチ操作による選択やコンテキストメニュー表示を防止するCSS設定
    preventTouchSelection() {
        // スタイル要素を作成
        const style = document.createElement('style');
        style.innerHTML = `
            body, canvas {
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none;   /* Safari */
                -khtml-user-select: none;    /* Konqueror HTML */
                -moz-user-select: none;      /* Firefox */
                -ms-user-select: none;       /* Internet Explorer/Edge */
                user-select: none;           /* Non-prefixed version */
                -webkit-tap-highlight-color: rgba(0,0,0,0); /* iOS Safariでタップ時のハイライトを消す */
                touch-action: none;          /* タッチアクションを無効化 */
            }
        `;
        document.head.appendChild(style);
        
        // コンテキストメニューを無効化
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, { passive: false });
        
        // タッチアクションを無効化
        canvas.style.touchAction = 'none';
        canvaspaper.style.touchAction = 'none';
    }
    
    // イベントリスナーの設定
    setupEventListeners() {
        // マウスイベント - windowに対して登録して確実に捕捉する
        window.addEventListener('mousedown', this.handleMouseDown.bind(this), { passive: false });
        window.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: false });
        window.addEventListener('mouseup', this.handleMouseUp.bind(this), { passive: false });
        
        // タッチイベント - passive: falseを設定して確実にpreventDefaultを有効にする
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        window.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
        
        // iOS Safariでのダブルタップによるズームを防止
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd < 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
    
    // 移動中フラグを更新するメソッド
    updateMovingState() {
        // 移動中フラグをtrueに設定
        this.isMoving = true;
        
        // 既存のタイマーをクリア
        if (this.moveTimerId !== null) {
            clearTimeout(this.moveTimerId);
        }
        
        // 一定時間後に移動中フラグをfalseに設定するタイマーを設定
        this.moveTimerId = setTimeout(() => {
            this.isMoving = false;
            this.moveTimerId = null;
        }, this.moveStopDelay);
    }
    
    // マウスイベントハンドラー
    handleMouseDown(e) {
        // デフォルト動作を必ず防止
        e.preventDefault();
        
        // canvasの外側のクリックは無視する（オプション）
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        const isInsideCanvas = (
            x >= rect.left && 
            x <= rect.right && 
            y >= rect.top && 
            y <= rect.bottom
        );
        
        if (!isInsideCanvas) {
            // console.log("キャンバス外のクリックなので無視します");
            return;
        }
        
        this.isMouseDown = true;
        
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.dragX = 0;
        this.dragY = 0;
        
        // 現在のpressMoveX/Y値を維持するために、pressStartX/Yを調整
        this.pressStartX = this.mouseX - this.pressMoveX;
        this.pressStartY = this.mouseY - this.pressMoveY;
        
        // 移動中フラグを更新
        this.updateMovingState();
        
        // motionpen.f_testを呼び出す
        if (motionpen) {
            const inputData = {
                isPressed: this.isPressed(),
                position: this.getPosition(),
                drag: this.getDrag(),
                drag2: this.getDrag2(),
                pressMove: this.getPressMove(),
                isMoving: this.isMoving
            };
            motionpen.f_test(inputData);
        }
    }
    
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        
        // デフォルト動作を必ず防止
        e.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        // ドラッグ量の計算
        this.dragX = this.mouseX - this.prevMouseX;
        this.dragY = this.mouseY - this.prevMouseY;
        
        // 累積移動量を更新
        this.pressMoveX = this.mouseX - this.pressStartX;
        this.pressMoveY = this.mouseY - this.pressStartY;
        
        // 動いている場合のみdragX2とdragY2を更新
        if (this.dragX !== 0 || this.dragY !== 0) {
            this.dragX2 = this.dragX;
            this.dragY2 = this.dragY;
            
            // 移動中フラグを更新
            this.updateMovingState();
        }
        
        // motionpen.f_testを呼び出す
        if (motionpen) {
            const inputData = {
                isPressed: this.isPressed(),
                position: this.getPosition(),
                drag: this.getDrag(),
                drag2: this.getDrag2(),
                pressMove: this.getPressMove(),
                isMoving: this.isMoving
            };
            motionpen.f_test(inputData);
        }
    }
    
    handleMouseUp(e) {
        if (!this.isMouseDown) return;
        
        // デフォルト動作を必ず防止
        e.preventDefault();
        
        this.isMouseDown = false;
        
        // dragXとdragYをリセット
        this.dragX = 0;
        this.dragY = 0;
        // dragX2とdragY2は保持
        
        // 最後の累積移動量を記録
        const finalPressMoveX = this.pressMoveX;
        const finalPressMoveY = this.pressMoveY;
        
        // 累積移動量をリセットしない（コメントアウト）
        // this.pressMoveX = 0;
        // this.pressMoveY = 0;
        
        // motionpen.f_testを呼び出す
        if (motionpen) {
            const inputData = {
                isPressed: this.isPressed(),
                position: this.getPosition(),
                drag: this.getDrag(),
                drag2: this.getDrag2(),
                pressMove: { x: finalPressMoveX, y: finalPressMoveY },
                finalPressMove: { x: finalPressMoveX, y: finalPressMoveY },
                isMoving: this.isMoving
            };
            motionpen.f_test(inputData);
        }
    }
    
    // タッチイベントハンドラー
    handleTouchStart(e) {
        // デフォルト動作を必ず防止（長押しメニュー表示を防ぐため）
        e.preventDefault();
        
        // canvasの外側のタッチは無視する（オプション）
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX;
            const y = touch.clientY;
            const isInsideCanvas = (
                x >= rect.left && 
                x <= rect.right && 
                y >= rect.top && 
                y <= rect.bottom
            );
            
            if (!isInsideCanvas) {
               //  console.log("キャンバス外のタッチなので無視します");
                return;
            }
            
            this.isTouchActive = true;
            
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
            this.dragX = 0;
            this.dragY = 0;
            
            // 現在のpressMoveX/Y値を維持するために、pressStartX/Yを調整
            this.pressStartX = this.mouseX - this.pressMoveX;
            this.pressStartY = this.mouseY - this.pressMoveY;
            
            // 移動中フラグを更新
            this.updateMovingState();
            
            // motionpen.f_testを呼び出す
            if (motionpen) {
                const inputData = {
                    isPressed: this.isPressed(),
                    position: this.getPosition(),
                    drag: this.getDrag(),
                    drag2: this.getDrag2(),
                    pressMove: this.getPressMove(),
                    isMoving: this.isMoving
                };
                motionpen.f_test(inputData);
            }
        }
    }
    
    handleTouchMove(e) {
        if (!this.isTouchActive) return;
        
        // デフォルト動作を必ず防止
        e.preventDefault();
        
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            
            // ドラッグ量の計算
            this.dragX = this.mouseX - this.prevMouseX;
            this.dragY = this.mouseY - this.prevMouseY;
            
            // 累積移動量を更新
            this.pressMoveX = this.mouseX - this.pressStartX;
            this.pressMoveY = this.mouseY - this.pressStartY;
            
            // 動いている場合のみdragX2とdragY2を更新
            if (this.dragX !== 0 || this.dragY !== 0) {
                this.dragX2 = this.dragX;
                this.dragY2 = this.dragY;
                
                // 移動中フラグを更新
                this.updateMovingState();
            }
            
            // motionpen.f_testを呼び出す
            if (motionpen) {
                const inputData = {
                    isPressed: this.isPressed(),
                    position: this.getPosition(),
                    drag: this.getDrag(),
                    drag2: this.getDrag2(),
                    pressMove: this.getPressMove(),
                    isMoving: this.isMoving
                };
                motionpen.f_test(inputData);
            }
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isTouchActive) return;
        
        // デフォルト動作を必ず防止
        e.preventDefault();
        
        this.isTouchActive = false;
        
        // dragXとdragYをリセット
        this.dragX = 0;
        this.dragY = 0;
        // dragX2とdragY2は保持
        
        // 最後の累積移動量を記録
        const finalPressMoveX = this.pressMoveX;
        const finalPressMoveY = this.pressMoveY;
        
        // 累積移動量をリセットしない（コメントアウト）
        // this.pressMoveX = 0;
        // this.pressMoveY = 0;
        
        // motionpen.f_testを呼び出す
        if (motionpen) {
            const inputData = {
                isPressed: this.isPressed(),
                position: this.getPosition(),
                drag: this.getDrag(),
                drag2: this.getDrag2(),
                pressMove: { x: finalPressMoveX, y: finalPressMoveY },
                finalPressMove: { x: finalPressMoveX, y: finalPressMoveY },
                isMoving: this.isMoving
            };
            motionpen.f_test(inputData);
        }
    }
    
    // 現在のマウス/タッチ位置を取得
    getPosition() {
        return {
            x: this.mouseX,
            y: this.mouseY
        };
    }
    
    // ドラッグ量を取得
    getDrag() {
        return {
            x: this.dragX,
            y: this.dragY
        };
    }
    
    // 保持されるドラッグ量を取得
    getDrag2() {
        return {
            x: this.dragX2,
            y: this.dragY2
        };
    }
    
    // プレス開始からの累積移動量を取得
    getPressMove() {
        return {
            x: this.pressMoveX,
            y: this.pressMoveY
        };
    }
    
    // マウス/タッチが押されているかどうかを取得
    isPressed() {
        return this.isMouseDown || this.isTouchActive;
    }
    
    // 外部から呼び出せるメソッド（将来的にmotionpen.f_test()などから呼び出される）
    f_test() {
        return {
            isPressed: this.isPressed(),
            position: this.getPosition(),
            drag: this.getDrag(),
            drag2: this.getDrag2(),
            pressMove: this.getPressMove(),
            isMoving: this.isMoving
        };
    }
} 