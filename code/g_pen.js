class G_pen extends Shaperoot {
	constructor() {
		super()
		this.inishape = [
			[-1.5, 0],
			[-20, -81],
			[-23, -1020+(+66*forMobile_magNega)],
			[23, -1020+(+66*forMobile_magNega)],
			[20, -81],
			[1.5, 0]
		];
		this.inishape = qvert.straight(this.inishape, [2, 20, 2, 20, 2]);
		this.addrndm = []
		
		// スピード調整のために形状を保存する配列を初期化
		this.shape = new Array(this.inishape.length);
		for (let i = 0; i < this.inishape.length; i++) {
			this.shape[i] = new Array(2);
			this.shape[i][0] = this.inishape[i][0];
			this.shape[i][1] = this.inishape[i][1];
		}
	}

	getValue(i, center, range = 20, maxSlow = 16) {
		const d = Math.abs(i - center);
		return d > range ? 1 : maxSlow - (maxSlow-1) * (1 - (Math.cos(Math.PI * d / 15) * 0.5 + 0.5));
	}

	updateShape() {
		this.ccloop = (this.ccloop + 1) % 10
		if (this.ccloop === 0) {
			for (let i = 0; i < this.inishape.length; i++) {
				this.addrndm[i] = qb.vanirndm(-2, 2);
			}
		}

		// this.shape = [];
		//   const angle = performance.now() * 0.001;
		for (let i = 0; i < this.inishape.length; i++) {
			const point = this.inishape[i];
			const transformed = this.applyTransform(point[0]+this.addrndm[i], point[1]);
			// this.shape.push(transformed);
			
			// スピード調整コードを追加
			const speed1 = this.getValue(i, 24, 16, 4);
			this.shape[i][0] += (transformed[0] - this.shape[i][0]) / speed1;
			this.shape[i][1] += (transformed[1] - this.shape[i][1]) / speed1;
		}
	}

	fef() {
		let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.1, 0.0, true, 0.0);
		let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.95, 0.65, true, 0.0);

		// updown関連のパラメータを他のコンポーネントと一貫性を持たせる
		// g_hitoyubi, g_oyayubi, g_tumeと同じ値を使用
		let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		let _upy = qb.mppng(motionpen.updownvmag, -1, 0, -80, 0, false, 0); // -90から-70に変更
		let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.075, -0.01, false, 0); // 0.08から0.07に変更

		// グローバルなスケール係数を適用
		const scaleFactor = window.globalScaleFactor || 1.0;
		const verticalOffset = window.globalVerticalOffset || 0;
		let _testr = qb.mppng(window.windowTatenagaMag, 0, 1, 0, 0.12, true, 0.0);
		this.setRotation(_r+_r2+_upr+_testr);
		// スケール係数を適用
		this.setScale(scaleFactor, scaleFactor);
		
		// 位置の設定方法を改善
		// _upxと_upyはscaleFactorを適用しない（他のコンポーネントと同様）
		this.setTranslate(
			motionpen.xre + _upx, 
			motionpen.yre + _upy + verticalOffset
		);

		this.updateShape();
	}
}