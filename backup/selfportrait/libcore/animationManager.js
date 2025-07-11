class AnimationManager {
    constructor(frameRate = 60) {
        this.frameRate = frameRate;
        this.frameInterval = 1000 / frameRate;
        this.lastFrameTime = 0;
        this.drawCallback = null;
        this.isRunning = false;
        this.rafId = null;
    }

    setDrawCallback(callback) {
        this.drawCallback = callback;
    }

    setFrameRate(fps) {
        this.frameRate = fps;
        this.frameInterval = 1000 / fps;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastFrameTime = performance.now();
            this.animate(this.lastFrameTime);
        }
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.isRunning = false;
    }

    animate(currentTime) {
        if (!this.isRunning) return;

        this.rafId = requestAnimationFrame((time) => this.animate(time));

        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime < this.frameInterval) return;

        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
        
        if (this.drawCallback) {
            this.drawCallback(deltaTime / 1000); // デルタ時間を秒単位で渡す
        }
    }
}