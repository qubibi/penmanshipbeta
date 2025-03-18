class qb {
	static clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
	static vanirndm(_a, _b) {
		return (_a < _b ? _a : _b) + Math.random() * Math.abs(_b - _a);
	}
	static rndm(_a, _b) {
		return (_a < _b ? _a : _b) + this.fxrndm() * Math.abs(_b - _a);
	}
	static rndmint(_a, _b) {
		return Math.floor((_a < _b ? _a : _b) + this.fxrndm() * (Math.abs(_b - _a) + 1));
	}
	static fxrndm() {
		return Math.random()
		// return $fx.rand()
	}


	// curveは正の値側で大きくなるほど、はじめがじっくり（遅い）
	// 負の値側、大きくなるほど、はじめから早くに上がる
	static mppng(x, x0, x1, y0, y1, clamp = false, curve = 0) {
		if (clamp && (x <= x0 || x >= x1)) return x <= x0 ? y0 : y1;
		if (x0 > x1) [x0, x1, y0, y1] = [x1, x0, y1, y0];
		
		const t = (x - x0) / (x1 - x0);
		return curve === 0 ? t * (y1 - y0) + y0
			: curve > 0 ? Math.pow(t, 1 + curve) * (y1 - y0) + y0
			: Math.pow(1 - t, 1 - curve) * (y0 - y1) + y1;
	}

	static mppng_cu(x, x0, x1, x2, y0, y1, y2, clamp = false, smooth = 0.5) {
		if (clamp) x = Math.min(Math.max(x, x0), x2);
		const isFirstHalf = x < x1;
		const rangeX = isFirstHalf ? x1 - x0 : x2 - x1;
		const rangeY = isFirstHalf ? y1 - y0 : y1 - y2;
		const t = Math.abs((x - x1) / rangeX);
		return y1 - (smooth === 0 ? t : Math.min(Math.pow(t, 1 + smooth), 1)) * rangeY;
	}

}