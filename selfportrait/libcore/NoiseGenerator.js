class NoiseGenerator {
	constructor() {
		this.ctx = null;
		this.masterGain = null;
		this.isInitialized = false;
		this.continuousSource = null;
		this.continuousGain = null;
	}

	init() {
		if (this.isInitialized) return;
		
		this.ctx = new AudioContext();
		this.masterGain = this.ctx.createGain();
		this.masterGain.connect(this.ctx.destination);
		this.isInitialized = true;
	}

	// 持続的なノイズを開始
	startContinuousNoise(options = {}) {
		if (!this.isInitialized) return;
		
		// 既存のノイズを停止
		this.stopContinuousNoise();

		const source = this.ctx.createBufferSource();
		const gainNode = this.ctx.createGain();
		const filter = this.ctx.createBiquadFilter();

		// ノイズバッファの作成（短い時間で繰り返し）
		const bufferSize = this.ctx.sampleRate * 2; // 2秒分
		const buffer = options.type === 'pink' ?
			this.createPinkNoise(2.0) :
			this.createWhiteNoise(2.0);

		source.buffer = buffer;
		source.loop = true; // ループを有効化

		// フィルター設定
		filter.type = options.filterType || 'lowpass';
		filter.frequency.value = options.cutoff || 1000;
		filter.Q.value = options.resonance || 1;

		// エイン設定
		gainNode.gain.value = options.peak || 0.05;

		// 接続
		source.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(this.masterGain);

		source.start(0);

		// 参照を保持
		this.continuousSource = source;
		this.continuousGain = gainNode;
		this.continuousFilter = filter;
	}

	// 持続的なノイズを停止
	stopContinuousNoise() {
		if (this.continuousSource) {
			this.continuousSource.stop();
			this.continuousSource.disconnect();
			this.continuousSource = null;
		}
		if (this.continuousGain) {
			this.continuousGain.disconnect();
			this.continuousGain = null;
		}
	}

	// 音量を設定
	setVolume(value) {
		if (this.continuousGain) {
			this.continuousGain.gain.value = value;
		}
	}

	// フィルターを設定
	setFilter(frequency, resonance) {
		if (this.continuousFilter) {
			this.continuousFilter.frequency.value = frequency;
			if (resonance !== undefined) {
				this.continuousFilter.Q.value = resonance;
			}
		}
	}

	// ホワイトノイズの生成
	createWhiteNoise(duration = 1.0) {
		// const bufferSize = this.ctx.sampleRate * duration;
		// const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		// const data = buffer.getChannelData(0);

		// for (let i = 0; i < bufferSize; i++) {
		// 	data[i] = Math.random() * 2 - 1;
		// }

		return buffer;
	}

	// ピンクノイズの生成
	createPinkNoise(duration = 1.0) {
		const bufferSize = this.ctx.sampleRate * duration;
		const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
		const data = buffer.getChannelData(0);

		let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

		for (let i = 0; i < bufferSize; i++) {
			// const white = Math.random() * 2 - 1;

			// b0 = 0.99886 * b0 + white * 0.0555179;
			// b1 = 0.99332 * b1 + white * 0.0750759;
			// b2 = 0.96900 * b2 + white * 0.1538520;
			// b3 = 0.86650 * b3 + white * 0.3104856;
			// b4 = 0.55000 * b4 + white * 0.5329522;
			// b5 = -0.7616 * b5 - white * 0.0168980;

			// data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
			// data[i] *= 0.11; // 音量調整
		}

		return buffer;
	}

	// ノイズを再生
	playNoise(options = {}) {
		if (!this.isInitialized) {
			this.init();
		}
		const source = this.ctx.createBufferSource();
		const gainNode = this.ctx.createGain();
		const filter = this.ctx.createBiquadFilter();

		// ノイズタイプの選択
		source.buffer = options.type === 'pink' ?
			this.createPinkNoise(options.duration) :
			this.createWhiteNoise(options.duration);

		// フィルター設定
		filter.type = options.filterType || 'lowpass';
		filter.frequency.value = options.cutoff || 1000;
		filter.Q.value = options.resonance || 1;

		// エンベロープ設定
		const now = this.ctx.currentTime;
		gainNode.gain.setValueAtTime(0, now);
		gainNode.gain.linearRampToValueAtTime(options.peak || 0.1, now + options.attack || 0.01);
		gainNode.gain.linearRampToValueAtTime(0, now + options.duration || 1.0);

		// 接続
		source.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(this.masterGain);

		source.start(now);
		source.stop(now + options.duration || 1.0);

		return { source, gainNode, filter };
	}


}