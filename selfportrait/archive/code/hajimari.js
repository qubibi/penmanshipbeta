class Hajimari {
	constructor() {
		rend_linepaper = new LineRenderer(glpaper);
		rend_line = new LineRenderer(gl);
		rend_fill = new FillRenderer(gl);
		// noiseGenerator = new NoiseGenerator();
		anima = new AnimationManager(60);
		ddra = new Draw();
		paperdraw = new PaperDraw();


		g_pen = new G_pen();
		g_tume = new G_tume();
		g_oyayubi = new G_oyayubi();
		g_hitoyubi = new G_hitoyubi();
		g_sode = new G_sode();
		motionpen = new Motionpen();


		rend_linepaper.setPixelDensity(0.66, 1000, 1000);
		rend_line.setPixelDensity(0.66, 1000, 1000);
		rend_fill.setPixelDensity(0.66, 1000, 1000);



if (fxhash_iscapturemode()) {
	const canvases = document.querySelectorAll('canvas');
	const actualHeight = canvas.getBoundingClientRect().height;  // 実際の表示サイズを取得
	const marginValue = 500/0.66 + 'px';
	canvases.forEach(canvas => {
		canvas.style.marginTop = marginValue;
	});
}







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

		
		this.scrolling = false;
		this.scrollSpeed = 2; 
		this.totalScrollDistance = 0;
	}

	update(deltaTime) {
		cc+=1;

		this.ftransition()
		if (this.scrolling) this.fscrollstart()
		

		motionpen.fef();
		g_pen.fef();
		g_oyayubi.fef();
		g_hitoyubi.fef();
		g_sode.fef();
		g_tume.fef();
		
		paperdraw.fef()
		ddra.fef()
	}
	

	ftransition() {
		if (cc > pr_timelimit) motionpen.isplay = false
		if (motionpen.isplay) {
			if (cc_inout < 1) cc_inout += 0.013;
			else cc_inout = 1;
		} else {
			if (motionpen.isend) {
				if (cc_inout > 0) cc_inout += -0.0152;
				else {
					if (!this.scrolling) {
						setTimeout(() => {
							this.scrolling = true;
						}, 1111);
					}
				}
			}
		}

	}

	fscrollstart() {
		if (Math.abs(this.totalScrollDistance) < 666) {
			if (cc_loopkaisu==1) fxhashfxpreview();
			cc_loopkaisu += 1

			this.shiftDrawingUp(this.scrollSpeed);
			this.totalScrollDistance += this.scrollSpeed;
		} else {
			this.fallreset()
		}
	}

	fallreset() {
		
			fxhashreset()
			this.scrolling = false;
			cc_inout = -0.5;
			cc = 0;
			this.totalScrollDistance = 0;

pr_enangleRange = qb.rndmint(1, 13);
pr_enradius = qb.rndmint(200, 350);
pr_timelimit = qb.rndmint(1500, 3000);
pr_upkkrtadd = qb.rndm(-0.001, 0.0042);
pr_downkkrtadd = qb.rndm(0.00, 0.0032);
pr_centertype = qb.rndmint(0, 1);

			// 各Shapeクラスのccloopをリセット
			g_pen.ccloop = 0;
			g_oyayubi.ccloop = 0;
			g_hitoyubi.ccloop = 0;
			g_sode.ccloop = 0;
			g_tume.ccloop = 0;
			
			motionpen.freset();
			paperdraw.freset();

	}

	shiftDrawingUp(speed) {
		const height = canvaspaper.height;
		glpaper.bindTexture(glpaper.TEXTURE_2D, this.moveTexture);
		glpaper.copyTexImage2D(
			glpaper.TEXTURE_2D,
			0,
			glpaper.RGBA,
			0,
			0,  // ここでY座標を調整
			canvaspaper.width,
			canvaspaper.height,
			0
		);
		glpaper.clear(glpaper.COLOR_BUFFER_BIT);
		this.moveShader.draw(this.moveTexture, 0, -speed);
	}


}

// クリーンアップ
window.addEventListener('unload', () => {
	anima.stop();
	rend_linepaper.dispose();
	rend_line.dispose();
	rend_fill.dispose();
});

