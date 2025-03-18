class Hajimari {
	constructor() {
		rend_linepaper = new LineRenderer(glpaper);
		rend_line = new LineRenderer(gl);
		rend_fill = new FillRenderer(gl);
		// noiseGenerator = new NoiseGenerator();
		
		// スマホでも60FPSを強制的に設定
		anima = new AnimationManager(60);
		// スマホの場合でもフレームレートを60に固定
		if (window.is_mobile) {
			console.log("Mobile device detected, forcing 60 FPS");
			// モバイルデバイスでもフレームレートを60に維持
			anima.setFrameRate(60);
		}
		
		ddra = new Draw();
		paperdraw = new PaperDraw();

		// グローバルなスケール係数を初期化
		window.globalScaleFactor = 1.0*forMobile_mag;

		g_pen = new G_pen();
		g_tume = new G_tume();
		g_oyayubi = new G_oyayubi();
		g_hitoyubi = new G_hitoyubi();
		g_sode = new G_sode();
		motionpen = new Motionpen();
		fface = new Face(); // Faceクラスのインスタンスを作成
		nnyu = new Nyuryoku(); // 入力処理クラスのインスタンスを作成

		// 青いカバーのクリックイベントを設定
		const bluecover = document.getElementById('bluecover');
		if (bluecover) {
			const hideBluecover = (e) => {
				e.preventDefault();
				e.stopPropagation();
				bluecover.style.display = 'none';
				return false;
			};
			
			// 各種イベントをキャプチャフェーズで捕捉
			['mousedown', 'touchstart', 'click'].forEach(eventType => {
				bluecover.addEventListener(eventType, hideBluecover, true);
			});
		}

		// 初期アニメーション（右側から移動してくる）のために
		// cc_inoutを-0.5に設定し、徐々に1に変化させる
		cc_inout = 0;

		// ウィンドウサイズに合わせてキャンバスサイズを設定
		this.updateCanvasSize();

		// ウィンドウリサイズ時にキャンバスサイズを更新
		window.addEventListener('resize', () => {
			this.updateCanvasSize();
			
			// テクスチャの再作成
			this.setupTexture();
		});

// if (fxhash_iscapturemode()) {
// 	const canvases = document.querySelectorAll('canvas');
// 	const actualHeight = canvas.getBoundingClientRect().height;  // 実際の表示サイズを取得
// 	const marginValue = 500/0.66 + 'px';
// 	canvases.forEach(canvas => {
// 		canvas.style.marginTop = marginValue;
// 	});
// }

		this.update = this.update.bind(this);
		anima.setDrawCallback(this.update);
		anima.start();

		document.addEventListener('keydown', (e) => {
			if (e.key === 'r' || e.key === 'R') {
				// motionpen.freset();
				// paperdraw.freset();
			}
		});
		// ユーザーインタラクションを待つ
		// document.addEventListener('click', () => {
		// 	noiseGenerator.init();  // AudioContextの初期化
		// 	 noiseGenerator.startContinuousNoise({
		// 	type: 'pink',
		// 	peak: 0.01, filterType: 'bandpass',
		// 	cutoff: 1000, resonance: 2
		// 	});
		// }, { once: true });  // 一度だけ実行

		// 移動用のシェーダープログラムを作成
		this.moveShader = new MoveShader(glpaper);

		// フレームバッファとテクスチャの設定
		this.setupTexture();
		
		// スクロールを常に有効にし、速度を設定
		this.scrolling = true;
		this.scrollSpeed = 3.0; // スクロール速度：数値が大きいほど速くスクロールします（推奨範囲：0.5〜5）
		
		// スクロール量を追跡するための変数
		this.totalScrollY = 0;
	}

	// キャンバスサイズを更新するメソッド（ウィンドウの縦横比に合わせる）
	updateCanvasSize() {
		// ウィンドウのサイズを取得
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		
		// アスペクト比を計算（幅/高さ）
		const aspectRatio = windowWidth / windowHeight;
		
		// 固定の解像度値を使用

		let densityFactor = 0.66;
		if (window.is_mobile) densityFactor = 1.0;
		// キャンバスのピクセル密度を設定（ウィンドウの縦横比を維持）
		rend_linepaper.setPixelDensity(densityFactor, windowWidth, windowHeight);
		rend_line.setPixelDensity(densityFactor, windowWidth, windowHeight);
		rend_fill.setPixelDensity(densityFactor, windowWidth, windowHeight);
		
		// グローバルなスケール係数を更新
		// 縦長ウィンドウの場合は縮小率を高くする
		if (aspectRatio < 1) {
			// 縦長の場合、アスペクト比に応じて縮小（0.5〜1.0の範囲）
			window.globalScaleFactor = (0.3 + aspectRatio * 0.7)*forMobile_mag;
			window.windowTatenagaMag = qb.mppng((0.3 + aspectRatio * 0.7), 0.3, 1, 1, 0, true, 0.0);

			

		} else {
			// 横長または正方形の場合は通常サイズ
			window.globalScaleFactor = (  qb.mppng(windowWidth, 0, 1000, 0.1, 1, true, 0)  )*forMobile_mag;
			window.windowTatenagaMag = 0
		}
		
		
		// モバイルデバイスの場合、追加の調整を行う
		if (window.is_mobile) {
			console.log("Mobile device detected, applying additional scaling");
		}
	}

	// テクスチャ設定を別メソッドに分離
	setupTexture() {
		this.moveTexture = glpaper.createTexture();
		glpaper.bindTexture(glpaper.TEXTURE_2D, this.moveTexture);
		glpaper.texImage2D(
			glpaper.TEXTURE_2D, 
			0, 
			glpaper.RGBA, 
			canvaspaper.width, 
			canvaspaper.height, 
			0, 
			glpaper.RGBA, 
			glpaper.UNSIGNED_BYTE, 
			null
		);
		
		// テクスチャパラメータの設定
		glpaper.texParameteri(glpaper.TEXTURE_2D, glpaper.TEXTURE_MIN_FILTER, glpaper.NEAREST);
		glpaper.texParameteri(glpaper.TEXTURE_2D, glpaper.TEXTURE_MAG_FILTER, glpaper.NEAREST);
		glpaper.texParameteri(glpaper.TEXTURE_2D, glpaper.TEXTURE_WRAP_S, glpaper.CLAMP_TO_EDGE);
		glpaper.texParameteri(glpaper.TEXTURE_2D, glpaper.TEXTURE_WRAP_T, glpaper.CLAMP_TO_EDGE);
	}

	update(deltaTime) {
		cc+=1;

		// cc_inoutを徐々に1に変化させる（初期アニメーション用）
		if (cc_inout < 1) cc_inout += 0.013;
		else cc_inout = 1;

		// 常にスクロールを実行
		this.shiftDrawingUp(this.scrollSpeed);
		
		// スクロール量をpaperDrawに伝える
		if (paperdraw) {
			paperdraw.updateScrollOffset(this.totalScrollY);
		}
		
		motionpen.fef();
		g_pen.fef();
		g_oyayubi.fef();
		g_hitoyubi.fef();
		g_sode.fef();
		g_tume.fef();
		fface.fef();
		
		paperdraw.fef()
		ddra.fef()
	}
	
	shiftDrawingUp(speed) {
		const height = canvaspaper.height;
		glpaper.bindTexture(glpaper.TEXTURE_2D, this.moveTexture);
		glpaper.copyTexImage2D(
			glpaper.TEXTURE_2D,
			0,
			glpaper.RGBA,
			0,
			0,
			canvaspaper.width,
			canvaspaper.height,
			0
		);
		glpaper.clear(glpaper.COLOR_BUFFER_BIT);
		this.moveShader.draw(this.moveTexture, 0, -speed);
		
		// スクロール量を更新
		this.totalScrollY += speed;
	}
}

// クリーンアップ
window.addEventListener('unload', () => {
	anima.stop();
	rend_linepaper.dispose();
	rend_line.dispose();
	rend_fill.dispose();
});

