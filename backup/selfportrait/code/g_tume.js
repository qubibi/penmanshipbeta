class G_tume extends Shaperoot {
	constructor() {
		super()
		this.multiPoints = [
			{ x: -10, y: -44, ctr2x: 0, ctr2y: -40 },
			{ x: 33, y: -91, ctr1x: -20, ctr1y: -30, ctr2x: 50, ctr2y: 20 },
			{ x: 44, y: 0, ctr1x: 10, ctr1y: -10, ctr2x: -10, ctr2y: 30 },
			{ x: 13, y: 20, ctr1x: 10, ctr1y: 10, ctr2x: -20, ctr2y: -10 },
			{ x: -10, y: -44, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0 }
		];
		this.multiSegments = [7, 7, 7, 7];
		this.inishape = qvert.beje(this.multiPoints, this.multiSegments);
		
		
		this.addrndm = []
		this.shape = new Array(this.inishape.length);
		for (let i = 0; i < this.inishape.length; i++) {
			this.shape[i] = new Array(2);
			this.shape[i][0] = this.inishape[i][0];
			this.shape[i][1] = this.inishape[i][1];
		}
	}

	getValue(i, center, range = 20, maxSlow = 16) {
		const d = Math.abs(i - center);
		return d > range ? maxSlow : 1 + (maxSlow-1) * (1 - (Math.cos(Math.PI * d / 15) * 0.5 + 0.5));
	}

	updateShape() {
		this.ccloop = (this.ccloop + 1) % 10
		if (this.ccloop === 0) {
			for (let i = 0; i < this.inishape.length; i++) {
				this.addrndm[i] = qb.vanirndm(-1, 1);
			}
		}

		// this.shape = [];
		//   const angle = performance.now() * 0.001;
		for (let i = 0; i < this.inishape.length; i++) {
			const point = this.inishape[i];
			const transformed = this.applyTransform(point[0]+this.addrndm[i], point[1]);
			// this.shape.push(transformed);
			
			const speed1 = this.getValue(i, 3, 29, 4);
			this.shape[i][0] += (transformed[0] - this.shape[i][0]) / speed1;
			this.shape[i][1] += (transformed[1] - this.shape[i][1]) / speed1;
		}
	}

	fef() {
		let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		let _upy = qb.mppng(motionpen.updownvmag, -1, 0, -70, 0, false, 0);
		let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.07, 0, false, 0);

		// グローバルなスケール係数を適用
		const scaleFactor = window.globalScaleFactor || 1.0;
		const verticalOffset = window.globalVerticalOffset || 0;

		let _scx2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.05, -0.05, true, 0.0);
		let _addx2 = qb.mppng(motionpen.mpmagx, -1, 1, 30, -20, true, 0.0);
		let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0, .5, true, 0.0);
		let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.1, -0.1, true, 0.0);
		this.setRotation(_r+_upr+_r2);
		let _scx = qb.mppng(motionpen.mpmagy, -1, 1, 0.9, 1.1, true, 0.0);
		// スケール係数を適用
		this.setScale((_scx+_scx2) * scaleFactor, scaleFactor);
		let _addx = qb.mppng(motionpen.mpmagy, -1, 1, 40, -0, true, 0.0);
		let _addy = qb.mppng(motionpen.mpmagy, -1, 1, 50, 0, true, 0.0);

		// 位置の調整値にもスケール係数を適用
		const baseOffsetX = 120;
		const baseOffsetY = -138;
		
		// 位置にもスケール係数と垂直オフセットを適用
		this.setTranslate(
			motionpen.xre + (baseOffsetX + _addx + _addx2) * scaleFactor + _upx, 
			motionpen.yre + (baseOffsetY + _addy) * scaleFactor + _upy + verticalOffset
		);

		this.updateShape();
	}
}