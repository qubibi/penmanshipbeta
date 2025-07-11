class G_sode extends Shaperoot {
	constructor() {
		super()
		this.inishape = [
			[900, -570],
			[1800, -590],
			[1800, 0],
			[900, -20],
			[900, -570]
		];
		this.inishape = qvert.straight(this.inishape, [10, 10, 10, 10]);
		this.addrndm = []
		this.addrndm2 = []
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
				this.addrndm2[i] = qb.vanirndm(-3, 3);
			}
		}

		// this.shape = [];
		//   const angle = performance.now() * 0.001;
		for (let i = 0; i < this.inishape.length; i++) {
			const point = this.inishape[i];
			const transformed = this.applyTransform(point[0]+this.addrndm[i], point[1]+this.addrndm2[i]);
			// this.shape.push(transformed);
			const speed1 = this.getValue(i, 30, 22, 6); 			
			this.shape[i][0] += (transformed[0] - this.shape[i][0]) / speed1;
			this.shape[i][1] += (transformed[1] - this.shape[i][1]) / speed1;
	
		}
	}

	fef() {
		// let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.1, 0.0, true, 0.0);
		// let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.05, 0.35, true, 0.0);

		// let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		// let _upy = qb.mppng(motionpen.updownvmag, -1, -0, -90, 0, false, 0);
		// let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.08, 0, false, 0);


		let _scx2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.05, -0.1, true, 0.0);
		let _addx2 = qb.mppng(motionpen.mpmagx, -1, 1, 30, -20, true, 0.0);
		let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0, .3, true, 0.0);
		let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.5, 0.45, true, 0.0);

		let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		let _upy = qb.mppng(motionpen.updownvmag, -1, 0, -30, 0, false, 0);
		let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.03, 0, false, 0);

		this.setRotation(_r+_upr+_r2);
		let _scx = qb.mppng(motionpen.mpmagy, -1, 1, 0.9, 1.1, true, 0.0);
		this.setScale(_scx+_scx2, 1);
		let _addx = qb.mppng(motionpen.mpmagy, -1, 1, 40, -0, true, 0.0);
		let _addy = qb.mppng(motionpen.mpmagy, -1, 1, 50, 0, true, 0.0);



	// 	this.setRotation(_r+_r2+_upr);
	// 	this.setTranslate(motionpen.x+_upx, motionpen.y+_upy);

		// this.setRotation(_r+_r2+_upr);
		this.setTranslate(motionpen.xre-90+_addx+_addx2+_upx, motionpen.yre-220+_addy+_upy);

		this.updateShape();
	}
}