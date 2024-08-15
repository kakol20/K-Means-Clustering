const ProcessManager = (function () {
	let state = 'nothing';

	const maxFPS = 60;

	const debugStates = true;

	let pointsCount = 500;
	let points = [];

	return {
		changeState(s) {
			state = s;

			if (debugStates) console.log('State Change: ' + s);
		},

		setup() {
			background(28);

			for (let i = 0; i < pointsCount; i++) {
				points.push(new Points());
				points[i].draw();
			}
		},

		draw(dt) {
			// switch (state) {
			// 	default:
			// 		// do nothing
			// 		break;
			// }
		}
	}
})()