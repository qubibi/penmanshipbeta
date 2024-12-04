class G_pen extends Shaperoot {
	constructor() {
		super()
		this.inishape = [
			[-1.5, 0],
			[-20, -81],
			[-23, -1111],
			[23, -1111],
			[20, -81],
			[1.5, 0]
		];
		this.inishape = qvert.straight(this.inishape, [2, 10, 1, 10, 2]);
		this.addrndm = []
	}

	updateShape() {
		this.ccloop = (this.ccloop + 1) % 10
		if (this.ccloop === 0) {
			for (let i = 0; i < this.inishape.length; i++) {
				this.addrndm[i] = qb.vanirndm(-2, 2);
			}
		}

		this.shape = [];
		//   const angle = performance.now() * 0.001;
		for (let i = 0; i < this.inishape.length; i++) {
			const point = this.inishape[i];
			const transformed = this.applyTransform(point[0]+this.addrndm[i], point[1]);
			this.shape.push(transformed);
		}
	}

	fef() {
		let _r2 = qb.mppng(motionpen.mpmagx, -1, 1, 0.1, 0.0, true, 0.0);
		let _r = qb.mppng(motionpen.mpmagy, -1, 1, 0.95, 0.65, true, 0.0);

		let _upx = qb.mppng(motionpen.updownvmag, -1, 0, -20, 0, false, 0);
		let _upy = qb.mppng(motionpen.updownvmag, -1, 0, -90, 0, false, 0);
		let _upr = qb.mppng(motionpen.updownvmag, -1, 0, 0.08, 0, false, 0);

		this.setRotation(_r+_r2+_upr);
		this.setTranslate(motionpen.xre+_upx, motionpen.yre+_upy);

		this.updateShape();
	}
}