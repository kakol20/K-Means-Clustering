const MainManager = (function () {
	return {
		canvas: 0,

		preload() {
			Random.seed = (new Date() * 1) >>> 0;

			DOMManager.preload();
		},

		setup() {
			// pixelDensity(1);
			const size = Math.min(windowWidth, windowHeight);

			this.canvas = createCanvas(size, size);
			this.canvas.position(0, 0);

			DOMManager.setup();
			ProcessManager.setup();

			noLoop();
		},

		draw(dt) {
			ProcessManager.draw(dt);
		}
	}
})();