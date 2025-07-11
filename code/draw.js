class Draw {
	constructor() {
		// this.randomSeed = Math.random() * 10;
		// this.cc_randomSeed = 0
		
	}
	fef(){

		// this.cc_randomSeed+=1;
		// if (this.cc_randomSeed>11) this.cc_randomSeed = 0;
		// if (this.cc_randomSeed==0) this.randomSeed = Math.random() * 5+1;
		// rend_fill.setPattern(7, 0.74, this.randomSeed);  




		// ! hitoyubi fill
		rend_fill.setPattern(0, 0, 0);  
		rend_fill.beginShape();
		rend_fill.setColor(
			FINGER_FILL_COLOR.r,
			FINGER_FILL_COLOR.g,
			FINGER_FILL_COLOR.b,
			FINGER_FILL_COLOR.a
		);
		for (let ii = 0; ii < g_hitoyubi.shape.length; ii++) {
			const point = g_hitoyubi.shape[ii];
			rend_fill.vertex(point[0], point[1]);
		}
		rend_fill.endShape(false);


		// ! hitoyubi
		rend_line.beginShape("double");
		rend_line.setColor(0.0, 0.0, 0.0, 1.0);
		for (let ii = 0; ii < g_hitoyubi.shape.length; ii++) {
			const point = g_hitoyubi.shape[ii];
			rend_line.vertex(point[0], point[1]);
		}
		rend_line.endShape(false);




		// ! pen
		rend_fill.setPattern(0, 0, 0);  
		rend_fill.beginShape();
		rend_fill.setColor(0.0, 0.0, 0.0, 1.0);
		for (let i = 0; i < g_pen.shape.length; i++) {
			const point = g_pen.shape[i];
			rend_fill.vertex(point[0], point[1]);
		}
		rend_fill.endShape(false);


		// ! oyayubi
		rend_fill.setPattern(0, 0, 0);  
		rend_fill.beginShape();
		rend_fill.setColor(
			FINGER_FILL_COLOR.r,
			FINGER_FILL_COLOR.g,
			FINGER_FILL_COLOR.b,
			FINGER_FILL_COLOR.a
		);
		for (let i = 0; i < g_oyayubi.shape.length; i++) {
			const point = g_oyayubi.shape[i];
			rend_fill.vertex(point[0], point[1]);
		}
		rend_fill.endShape(false);


		// ! oyayubi
		rend_line.beginShape("double");
		rend_line.setColor(0.0, 0.0, 0.0, 1.0);
		for (let ii = 0; ii < g_oyayubi.shape.length; ii++) {
			const point = g_oyayubi.shape[ii];
			rend_line.vertex(point[0], point[1]);
		}
		rend_line.endShape(false);


		// ! tume
		rend_fill.setPattern(0, 0, 0);  
		rend_fill.beginShape();
		// rend_fill.setBlendMode('multiply');
		rend_fill.setColor(
			TUME_FILL_COLOR.r,
			TUME_FILL_COLOR.g,
			TUME_FILL_COLOR.b,
			TUME_FILL_COLOR.a
		);
		for (let i = 0; i < g_tume.shape.length; i++) {
			const point = g_tume.shape[i];
			rend_fill.vertex(point[0], point[1]);
		}
		rend_fill.endShape(false);
		// rend_fill.setBlendMode('normal');

		// 線（アウトライン）
		rend_line.beginShape("double");
		rend_line.setColor(0.0, 0.0, 0.0, 1.0);
		for (let ii = 0; ii < g_tume.shape.length; ii++) {
			const point = g_tume.shape[ii];
			rend_line.vertex(point[0], point[1]);
		}
		rend_line.endShape(false);




		// ! sode
		rend_fill.setPattern(0, 0, 0);  
		rend_fill.beginShape();
		rend_fill.setColor(
			SODE_FILL_COLOR.r,
			SODE_FILL_COLOR.g,
			SODE_FILL_COLOR.b,
			SODE_FILL_COLOR.a
		);
		for (let i = 0; i < g_sode.shape.length; i++) {
			const point = g_sode.shape[i];
			rend_fill.vertex(point[0], point[1]);
		}
		rend_fill.endShape(false);

		// ! sode
		rend_line.beginShape("double");
		rend_line.setColor(0.0, 0.0, 0.0, 1.0);
		for (let i = 0; i < g_sode.shape.length; i++) {
			const point = g_sode.shape[i];
			rend_line.vertex(point[0], point[1]);
		}
		rend_line.endShape(false);



		// rend_line.debugBezier(g_hitoyubi.multiPoints);

	}
}