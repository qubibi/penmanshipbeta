class qvert {
	static convertToArray(point) {
		return [point.x, point.y];
	}

	static convertToObject(point) {
		return Array.isArray(point) ? { x: point[0], y: point[1] } : point;
	}

	static straight(shape, segmentPoints) {
		// バリデーション
		if (shape.length < 2) {
			console.error('straight: 形状データは少なくとも2点必要'); return shape;
		}
		const expectedSegments = shape.length - 1;
		if (segmentPoints.length !== expectedSegments) {
			console.error(`straight: 分割数配列の長さが不正`); return shape;
		}

		// 必要な頂点数を事前計算
		const totalPoints = segmentPoints.reduce((sum, points) => sum + points + 1, 0) - (expectedSegments - 1);
		const vertices = new Array(totalPoints);
		let vertexIndex = 0;

		for (let i = 0; i < expectedSegments; i++) {
			const start = this.convertToObject(shape[i]);
			const end = this.convertToObject(shape[i + 1]);
			const divisions = segmentPoints[i];
			const dx = (end.x - start.x) / divisions;
			const dy = (end.y - start.y) / divisions;

			for (let j = 0; j <= divisions; j++) {
				if (i > 0 && j === 0) continue;
				vertices[vertexIndex++] = this.convertToArray({
					x: start.x + dx * j,
					y: start.y + dy * j
				});
			}
		}
		return vertices;
	}

	static beje(shape, segmentPoints) {
		// バリデーション
		if (shape.length < 2) {
			console.error('beje: 形状データは少なくとも2点必要'); return shape;
		}
		const expectedSegments = shape.length - 1;
		if (segmentPoints.length !== expectedSegments) {
			console.error(`beje: 分割数配列の長さが不正`); return shape;
		}

		// 必要な頂点数を事前計算
		const totalPoints = segmentPoints.reduce((sum, points) => sum + points + 1, 0) - (expectedSegments - 1);
		const vertices = new Array(totalPoints);
		let vertexIndex = 0;

		for (let i = 0; i < expectedSegments; i++) {
			const start = this.convertToObject(shape[i]);
			const end = this.convertToObject(shape[i + 1]);
			const divisions = segmentPoints[i];

			for (let j = 0; j <= divisions; j++) {
				if (i > 0 && j === 0) continue;
				const t = j / divisions;
				vertices[vertexIndex++] = this.convertToArray(
					this.calculateCubicBezierPoint(start, end, t)
				);
			}
		}
		return vertices;
	}

	static calculateCubicBezierPoint(start, end, t) {
		const t1 = 1 - t;
		const t13 = t1 * t1 * t1;
		const t12 = 3 * t * t1 * t1;
		const t2 = 3 * t * t * t1;
		const t3 = t * t * t;

		return {
			x: t13 * start.x + t12 * (start.x + (start.ctr2x || 0)) + t2 * (end.x + (end.ctr1x || 0)) + t3 * end.x,
			y: t13 * start.y + t12 * (start.y + (start.ctr2y || 0)) + t2 * (end.y + (end.ctr1y || 0)) + t3 * end.y
		};
	}
}