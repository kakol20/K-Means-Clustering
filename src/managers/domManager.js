const DOMManager = (function () {
	return {
		newCenterButton: 0,
		clusterButton: 0,

		preload() {
			this.newCenterButton = createButton('New Center');
			this.newCenterButton.mousePressed(() => {
				this.newCenterButton.attribute('disabled', true);
				this.clusterButton.attribute('disabled', true);
				ProcessManager.nextStep();
			});

			this.clusterButton = createButton('Cluster');
			this.clusterButton.mousePressed(() => {
				this.clusterButton.attribute('disabled', true);
				this.newCenterButton.attribute('disabled', true);
				ProcessManager.moveCenters();
			});
		},

		setup() {
			const xPos = windowWidth > width ? width + 5 : 5;
			let yPos = windowWidth > width ? 5 : height + 5;

			this.newCenterButton.position(xPos, yPos);
			yPos += this.newCenterButton.height + 10;

			this.clusterButton.position(xPos, yPos);
			yPos += this.clusterButton.height + 10;
		}
	}
})()