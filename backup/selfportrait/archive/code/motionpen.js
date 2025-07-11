class Motionpen {
	constructor() {
		this.freset()
	}
	freset() {
		this.x = 0;
		this.y = 0;
		this.xre = 0;
		this.yre = 0;
		this.xsabn = 0; 
		this.ysabn = 0; 
		this.prexre = 0; 
		this.preyre = 0; 
		this.xtgt = 0;
		this.ytgt = 0;
		this.enxtgt = 0;
		this.enytgt = 0;
		this.xynyn = 0;
		this.yynyn = 0;
		this.xynynspd1 = qb.rndm(0.01, 0.13);
		this.yynynspd1 = qb.rndm(0.01, 0.13);
		this.xynynspd2 = qb.rndm(0.3, 0.94);
		this.yynynspd2 = qb.rndm(0.3, 0.94);
		this.updown = "up"
		this.updownv = 0;
		this.updownvmag = 0;
		this.updownvmagtgt = -1.5
		this.updownvmagtgttgt = -1.5
		this.encenterAngle = -Math.PI/0.75;    // 弧の中心角度（45度）
		this.enangleRange = Math.PI/pr_enangleRange;   // 弧の範囲
		this.enangle = this.encenterAngle - this.enangleRange/2;  // 開始角度を自動計算
		this.enradius = pr_enradius;       
		this.encenterX = -122;
		this.encenterY = 88;
		this.enspeed = 0.093;     
		this.enmag = 0.15;
		this.enmagtgt = 0.15;
		this.endirection = 1;      
		this.upkkrt = qb.rndm(0.0066,0.0145)
		this.downkkrt = qb.rndm(0.0077,0.02)
		this.mpmagx = 0
		this.mpmagy = 0
		this.isplay = true
		this.isend = false
		console.log(this.downkkrt);
		
	}

	fef() {
		//free line
		if (qb.fxrndm() < 0.6) {
			this.xtgt += qb.rndm(-3, 3);
			this.ytgt += qb.rndm(-3, 3);
		}
		if (qb.fxrndm() < 0.07) {
			this.xtgt += qb.rndm(-33, 33);
			this.ytgt += qb.rndm(-33, 33);
		}
		if (qb.fxrndm() < 0.02) {
			if (qb.fxrndm() < .75){
				if (this.updown == "up") this.xtgt += qb.rndm(-111, 5);
				else this.xtgt += qb.rndm(-5, 111);
			} else {
				this.xtgt += qb.rndm(-111, 111);
			}
		}
		if (qb.fxrndm() < 0.02) this.ytgt += qb.rndm(-111, 111);
		if (qb.fxrndm() < 0.059) this.xynynspd1 = qb.rndm(0.01, 0.13);
		if (qb.fxrndm() < 0.059) this.yynynspd1 = qb.rndm(0.01, 0.13);
		if (qb.fxrndm() < 0.059) this.xynynspd2 = qb.rndm(0.3, 0.92);
		if (qb.fxrndm() < 0.059) this.yynynspd2 = qb.rndm(0.3, 0.92);


		// circle
		this.enangle += this.enspeed * this.endirection;

		const startAngle = this.encenterAngle - this.enangleRange/2;
		const endAngle = this.encenterAngle + this.enangleRange/2;

		if (this.enangle >= endAngle || this.enangle <= startAngle) {
			this.endirection *= -1;
		}

		this.enmag += (this.enmagtgt - this.enmag)/2
		this.enxtgt = (this.encenterX + Math.cos(this.enangle) * this.enradius)*this.enmag;
		this.enytgt = (this.encenterY + Math.sin(this.enangle) * this.enradius)*this.enmag;

		if (this.updown == "up") {
			if (pr_centertype == 0) {		
				if (qb.fxrndm() < 0.08) {
					this.xtgt *= 0.95
					this.ytgt *= 0.95
				}
			} else if (pr_centertype == 1) {		
				if (this.x <= -311 || this.x >= 266 || this.y <= -266 || this.y >= 311) {
					if (qb.fxrndm() < 0.3) {
						this.xtgt *= 0.925
						this.ytgt *= 0.925
					}
				}
			}
		}

		let _yukkuri = qb.mppng_cu(motionpen.updownv, -1, -0.5, 0, 1, 0.1, 1, true, 2.9);
		
		this.x += this.xynyn = (this.xynyn + (this.enxtgt + this.xtgt - this.x) * (this.xynynspd1*_yukkuri)) * (this.xynynspd2*_yukkuri);
		this.y += this.yynyn = (this.yynyn + (this.enytgt + this.ytgt - this.y) * (this.yynynspd1*_yukkuri)) * (this.yynynspd2*_yukkuri);

		// let _cc_inoutre = qb.mppng_cu(cc_inout, 0, 0.5, 1.0,  0, 0.5, 1.0, true, -0.5)
		let _cc_inoutre = qb.mppng(cc_inout, 0, 1.0, 0, 1.0, true, -2.1)
		this.xre = (this.x*1.07)*_cc_inoutre + (550*(1-_cc_inoutre))
		this.yre = this.y * 1.07
      //   this.y = 100
      //   this.x = 0 + Math.sin(Date.now() * 0.001) * 500-800;
		this.xsabn = this.xre - this.prexre;
		this.ysabn = this.yre - this.preyre;
		this.prexre = this.xre;
		this.preyre = this.yre;
		
		this.mpmagx = qb.mppng(this.x, -422, 422, -1., 1, true, 0.0);
		this.mpmagy = qb.mppng(this.y, -422, 422, -1, 1, true, 0.0);



		// ! up
		const _rndtest = qb.fxrndm()
		if (_rndtest < this.upkkrt) {
			// console.log(_rndtest,this.upkkrt)
			if (this.updownv > -0.7) {
				this.updown = "up";
				paperdraw.stopDrawing();
				this.enmagtgt = qb.rndm(0.0, 0.13)			
			}
		}		

		// ! down
		let _downkkrt_re =this.downkkrt
		if (this.xsabn>1) _downkkrt_re *=2.5;
		else  _downkkrt_re *= 0.25;
		if (qb.fxrndm() < _downkkrt_re) {
			if (this.isplay) {
				if (cc_inout>0.6) {
					this.updown = "down";
					if (qb.fxrndm()<0.5) {
						this.upkkrt = qb.rndm(0.0066,0.0145)+pr_upkkrtadd
						this.downkkrt = qb.rndm(0.0077,0.02)+pr_upkkrtadd+pr_downkkrtadd
						if (this.downkkrt > 0.015 && qb.fxrndm() < 0.4) this.downkkrt = qb.rndm(0.0077,0.02)+pr_upkkrtadd+pr_downkkrtadd
						if (qb.fxrndm() < 0.73) this.enmagtgt = qb.rndm(0.05, 0.22)
						else this.enmagtgt = qb.rndm(0.05, 0.85)
					}
				}
			} else {
				if (qb.fxrndm() < 0.4) this.isend = true;
			}
		}


		if (this.updown == "up") {
			this.updownv += (-1-this.updownv)/7
		} else if (this.updown == "down") {
			if (this.updownv < 0) this.updownv += qb.rndm(0.05, 0.1)
			else {
				this.updownv = 0
				if (this.isplay) {
					if (!paperdraw.isDrawing) {
						paperdraw.startDrawing();
						this.updownvmagtgttgt = qb.rndm(-2, -0.77);
					}
				}
			}
		}
		if (!this.isend) {
			this.updownvmagtgt += (this.updownvmagtgttgt - this.updownvmagtgt)/3
			this.updownvmag = qb.mppng(this.updownv, -1, 0, this.updownvmagtgt, 0, true, 0);		
		}
		
		


		paperdraw.f_automouse(this.xre, this.yre);
	}
}