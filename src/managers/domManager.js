const DOMManager = (function () {
	return {
		nextStepButton: 0,

		preload() {
			this.nextStepButton = createButton('Next Step');
			this.nextStepButton.mousePressed(() => {
				this.nextStepButton.attribute('disabled', true);
				ProcessManager.nextStep();
				// this.nextStepButton.removeAttribute('disabled');
			});
		},

		setup() {
			const xPos = windowWidth > width ? width + 5 : 5;
			let yPos = windowWidth > width ? 5 : height + 5;

			this.nextStepButton.position(xPos, yPos);
			yPos += this.nextStepButton.height + 10;
		}
	}
})()