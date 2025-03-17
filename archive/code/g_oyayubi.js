 class G_oyayubi  extends Shaperoot {
	constructor() {
		super()
		this.multiPoints = [
			{ x: 950, y: 0, ctr1x: 0, ctr1y: 0, ctr2x: 0, ctr2y: 0 },
			{ x: 830, y: 300, ctr1x: 0, ctr1y: 0, ctr2x: -400, ctr2y: 0 },
			{ x: 90, y: 110, ctr1x: 200, ctr1y: 50, ctr2x: -70, ctr2y: -30 },
			{ x: 0, y: 0, ctr1x: 70, ctr1y: 90, ctr2x: -30, ctr2y: -20 },
			{ x: 15, y: -100, ctr1x: -20, ctr1y: 0, ctr2x: 20, ctr2y: -50 },
			{ x: 180, y: -60, ctr1x: 0, ctr1y: -20, ctr2x: 0, ctr2y: 0 },
			{ x: 410, y: -60, ctr1x: 0, ctr1y: 50, ctr2x: 0, ctr2y: 0 }

		];
		this.multiSegments = [15, 15, 8, 8, 8, 12];
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
				this.addrndm[i] = qb.vanirndm(-3, 3);
			}
		}

		// this.shape = []
		for (let i = 0; i < this.inishape.length; i++) {
			const point = this.inishape[i];


			const transformed = this.applyTransform(point[0], point[1]+this.addrndm[i]);
			// this.shape.push(transformed);
			// this.shape[i] = transformed
			const speed1 = this.getValue(i, 46, 31, 3); 			
			this.shape[i][0] += (transformed[0] - this.shape[i][0]) / speed1;
			this.shape[i][1] += (transformed[1] - this.shape[i][1]) / speed1;
			
			

			
		}
		// _x += xynyn = ( xynyn + ( tgt - _x ) * 0.3 )*0.9; 
	}

	fef() {
		let _scx2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.05, -0.1, true, 0.0);
		let _addx2 = qb.mppng(motionpen.mpmagx, -1, 1, 30, -20, true, 0.0);
		let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0, .3, true, 0.0);
		let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.1, -0.1, true, 0.0);

		let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		let _upy = qb.mppng(motionpen.updownvmag, -1, 0, -70, 0, false, 0);
		let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.07, 0, false, 0);

		this.setRotation(_r+_upr+_r2);
		let _scx = qb.mppng(motionpen.mpmagy, -1, 1, 0.9, 1.1, true, 0.0);
		this.setScale(_scx+_scx2, 1);
		let _addx = qb.mppng(motionpen.mpmagy, -1, 1, 40, -0, true, 0.0);
		let _addy = qb.mppng(motionpen.mpmagy, -1, 1, 50, 0, true, 0.0);

		// let _scx = qb.mppng(motionpen.mpmagx, -1, 1, 0.9, 1.1, true, 0.0);
		// this.setScale(_scx, 1);

		this.setTranslate(motionpen.xre+120+_addx+_addx2+_upx, motionpen.yre-150+_addy+_upy);
		this.updateShape();
	}
}