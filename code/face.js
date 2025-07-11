class Face {
    constructor() {
        this.freset();
    }

    freset() {
        this.counter = 0;
        this.kaoxv = 0;
        this.facescalex = 66; // デフォルト値
        this.maxCount = 111; // デフォルト値
        this.isActive = false; // アニメーション実行中かどうか
        this.waitCounter = 0; // 待機時間カウンター
        this.waitDuration = 0; // 開始までの待機時間
        this.pendingStart = false; // モーション開始待ちフラグ
        this.lastKeyPointIndex = 0; // 最後に使用したキーポイントのインデックス
        
        // 変化点の定義（相対値：0～1の範囲）
        // easing: 0=線形, 正=加速, 負=減速, easingCu: 0=通常, 正=効果誇張
        this.relativeKeyPoints = [
            { position: 0, value: 0, easing: -4, easingCu: 0.24 },     // 0%
            { position: 0.115, value: 0.5, easing: -0.15, easingCu: 0 },  // 20% → 13.3%
            { position: 0.21, value: 0.83, easing: 3, easingCu: 0.0 },    // 30% → 20%
            { position: 0.24, value: 0.54, easing: 0, easingCu: 0 },  // 40.8% → 27.2%
            { position: 0.272, value: 0.565, easing: -2.4, easingCu: 0 },  // 40.8% → 27.2%
            { position: 0.30, value: 0.32, easing: 3.5, easingCu: 0 },  // 45% → 30%
            { position: 0.33, value: 0.56, easing: 6, easingCu: 0.2 },  // 48% → 32%
            // { position: 0.38, value: 0.55, easing: 1, easingCu: 0 },  // 55.8% → 37.2%
            { position: 0.41, value: 0.25, easing: -4, easingCu: 0.9 },  // 60% → 40%
            { position: 0.99, value: 0, easing: 0, easingCu: 0 },  // 99%
            { position: 1, value: 0, easing: 0, easingCu: 0 }  // 100%
        ];
        
        this.keyPoints = []; // 絶対値のキーポイント
        this.updateAbsoluteKeyPoints();
        
        // 条件A関連の変数
        this.conditionACleared = false; // 条件Aがクリアされたかどうか
        this.downFrameCount = 0; // down状態のフレームカウント
        this.isMoving = false; // 移動中かどうか
        this.isDownTriggered = false; // down状態のトリガーフラグ
        this.wasMoving = true; // 直前に動いていたかどうか
    }
    
    getRandomStartDelay() { 
        return qb.rndmint(1, 6); // 1～6フレームのランダムな待機時間
    }
    
    fmotionreset() { // マウスが上がった時に呼び出される
        this.downFrameCount = 0;
        this.isDownTriggered = false;
        this.wasMoving = true;
    }
    
    fmotionstart_pre() { // down時に一回だけトリガーされる
        if (this.isDownTriggered) return; // 既にトリガーされていたら何もしない
        
        this.isDownTriggered = true; 
        this.downFrameCount = 0; 
        this.wasMoving = true; // 初期状態は動いていたとみなす
        
        if (this.conditionACleared) {
            // this.fmotionstart(); // 条件Aクリア後はdown状態のたびにモーション開始する部分をコメントアウト
        }
    }
    
    fmotionstart() { 
        this.pendingStart = true; // モーション開始要求
        this.isActive = false; // 実行中のモーションを強制終了
        this.waitCounter = 0;
        this.counter = 0; 
        this.lastKeyPointIndex = 0; 
        
        const newMaxCount = qb.rndmint(55, 146); 
        this.setMaxCount(newMaxCount);
        
        this.facescalex = qb.rndmint(56, 145); 
        
        if (this.conditionACleared) {
            this.waitDuration = qb.rndmint(1, 9); // 条件Aクリア後は1～9フレームのウェイト
        } else {
            this.waitDuration = this.getRandomStartDelay();
        }
    }
    
    updateAbsoluteKeyPoints() {
        if (!this.keyPoints.length) { // 初回のみ新しい配列を作成
            this.keyPoints = this.relativeKeyPoints.map(point => ({
                count: 0,
                value: point.value,
                easing: point.easing,
                easingCu: point.easingCu
            }));
        }
        
        for (let i = 0; i < this.relativeKeyPoints.length; i++) { 
            const point = this.relativeKeyPoints[i];
            this.keyPoints[i].count = Math.round(point.position * this.maxCount);
        }
    }
    
    setMaxCount(newMaxCount) {
        this.maxCount = newMaxCount;
        this.updateAbsoluteKeyPoints();
        this.counter = this.counter % this.maxCount; // カウンターも調整
    }

    applyEasing(t, easing, easingCu) { // t=進行度(0～1), easing=重み係数, easingCu=効果誇張量
        // 最適化: 早期リターンで不要な計算を回避
        if (easing === 0 && easingCu === 0) return t; // 線形補間のみで効果誇張なし
        
        // 最適化: 0と1の境界値チェック
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        
        let easedT = t;
        
        // イージングが必要な場合のみ計算
        if (easing !== 0) {
            if (easing > 0) {
                // 加速効果: Math.powは重いので、小さい整数値の場合は乗算を使用
                if (easing === 1) {
                    easedT = t * t;
                } else if (easing === 2) {
                    easedT = t * t * t;
                } else if (easing === 3) {
                    easedT = t * t * t * t;
                } else {
                    easedT = Math.pow(t, 1 + easing);
                }
            } else {
                // 減速効果: 同様に最適化
                const invT = 1 - t;
                const invEasing = 1 - easing;
                
                if (invEasing === 1) {
                    easedT = 1 - invT;
                } else if (invEasing === 2) {
                    easedT = 1 - (invT * invT);
                } else if (invEasing === 3) {
                    easedT = 1 - (invT * invT * invT);
                } else {
                    easedT = 1 - Math.pow(invT, invEasing);
                }
            }
        }
        
        // 効果誇張が必要な場合のみ計算
        if (easingCu !== 0) {
            return t + (easedT - t) * (1 + easingCu);
        }
        
        return easedT;
    }

    f_test(inputData) {
        if (inputData && inputData.isPressed) {
            // 必要に応じて処理を追加
        }
    }

    fmotion(count) {
        // 最適化: 範囲チェックを先に行い、不要な検索を回避
        const len = this.keyPoints.length - 1;
        
        // 範囲外の場合は即座に結果を返す
        if (count >= this.keyPoints[len].count) return this.keyPoints[len].value;
        if (count <= this.keyPoints[0].count) return this.keyPoints[0].value;
        
        // 二分探索でセグメントを効率的に見つける
        let low = 0;
        let high = len;
        let i = this.lastKeyPointIndex; // 前回のインデックスから開始（ヒント）
        
        // 前回のインデックスが有効かチェック
        if (i < len && count >= this.keyPoints[i].count && count <= this.keyPoints[i + 1].count) {
            // 前回のインデックスが正しい範囲内なら、そのまま使用
        } else if (count > this.keyPoints[i].count) {
            // カウントが増加している場合は前方向に探索
            low = i;
            while (low < high) {
                const mid = Math.floor((low + high) / 2);
                if (count > this.keyPoints[mid].count) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            i = Math.max(0, low - 1);
        } else {
            // カウントが減少している場合は後方向に探索
            high = i;
            while (low < high) {
                const mid = Math.floor((low + high) / 2);
                if (count > this.keyPoints[mid].count) {
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            i = Math.max(0, low - 1);
        }
        
        // 3番目のキーポイント（インデックス2）に到達したらドットを表示
        if (i === 1 && this.lastKeyPointIndex !== 1) {
            // 3番目のキーポイントに到達した瞬間だけドットを表示
            if (paperdraw) {
                paperdraw.drawRandomDots();
            }
        }
        
        this.lastKeyPointIndex = i; // 現在のインデックスを保存
        
        const current = this.keyPoints[i];
        const next = this.keyPoints[i + 1];
        
        // 進行度を計算（分母が0にならないよう保護）
        const segmentLength = next.count - current.count || 1;
        const linearProgress = (count - current.count) / segmentLength;
        const easedProgress = this.applyEasing(linearProgress, current.easing, current.easingCu);
        
        return current.value + (next.value - current.value) * easedProgress; // 値を補間
    }

    fef() {
        // 条件Aクリア前の処理
        if (!this.conditionACleared && this.isDownTriggered) {
            const isCurrentlyMoving = nnyu.isMoving; // 移動状態を検出
            
            if (this.wasMoving && !isCurrentlyMoving) {
                this.downFrameCount = 0; // 静止状態になった瞬間にカウンターをリセット
            }
            
            this.wasMoving = isCurrentlyMoving; // 現在の移動状態を記録
            
            if (!isCurrentlyMoving) {
                this.downFrameCount++;
                if (this.downFrameCount >= 31) { 
                    // this.fmotionstart(); // 条件A達成時のモーション起動をコメントアウト
                    this.conditionACleared = true;
                    this.downFrameCount = 0;
                }
            }
        }
        
        if (this.isActive) { // アニメーション実行中
            this.counter++;
            
            if (this.counter >= this.maxCount) { // 1サイクル完了で停止
                this.counter = 0;
                this.isActive = false;
                this.kaoxv = 0; // 即座に値をリセット
                return;
            }
            
            this.kaoxv = this.fmotion(this.counter); // 値の更新
        } else if (this.pendingStart) { // 開始待機中
            this.waitCounter++;
            
            if (this.waitCounter >= this.waitDuration) { // 待機時間経過でアニメーション開始
                this.isActive = true;
                this.pendingStart = false;
                this.counter = 0;
                this.lastKeyPointIndex = 0;
            }
        } else {
            this.kaoxv = 0; // 停止中は計算しない
        }
    }
}
