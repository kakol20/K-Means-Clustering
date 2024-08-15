const DOMManager = (function () {
	return {
		newCenterButton: 0,
		clusterButton: 0,
		fullMoveButton: 0,
		restartButton: 0,

		preload() {
			this.newCenterButton = createButton('New Center');
			this.newCenterButton.mousePressed(() => {
				this.clusterButton.attribute('disabled', true);
				this.newCenterButton.attribute('disabled', true);
				this.fullMoveButton.attribute('disabled', true);
				this.restartButton.attribute('disabled', true);
				ProcessManager.nextStep();
			});

			this.clusterButton = createButton('Move Centers');
			this.clusterButton.mousePressed(() => {
				this.clusterButton.attribute('disabled', true);
				this.newCenterButton.attribute('disabled', true);
				this.fullMoveButton.attribute('disabled', true);
				this.restartButton.attribute('disabled', true);
				ProcessManager.moveCenters();
			});

			this.fullMoveButton = createButton('Full Move');
			this.fullMoveButton.mousePressed(() => {
				this.clusterButton.attribute('disabled', true);
				this.newCenterButton.attribute('disabled', true);
				this.fullMoveButton.attribute('disabled', true);
				this.restartButton.attribute('disabled', true);
				ProcessManager.fullMove();
			});

			this.restartButton = createButton('Restart');
			this.restartButton.mousePressed(() => {
				this.clusterButton.attribute('disabled', true);
				this.newCenterButton.attribute('disabled', true);
				this.fullMoveButton.attribute('disabled', true);
				this.restartButton.attribute('disabled', true);
				ProcessManager.setup();
			});
		},

		setup() {
			const xPos = windowWidth > width ? width + 5 : 5;
			let yPos = windowWidth > width ? 5 : height + 5;

			this.restartButton.position(xPos, yPos);
			yPos += this.restartButton.height + 10;

			this.newCenterButton.position(xPos, yPos);
			yPos += this.newCenterButton.height + 10;

			this.clusterButton.position(xPos, yPos);
			yPos += this.clusterButton.height + 10;

			this.fullMoveButton.position(xPos, yPos);
			yPos += this.fullMoveButton.height + 10;
		}
	}
})()