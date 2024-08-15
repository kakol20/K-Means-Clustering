const ProcessManager = (function () {
	let state = 'nothing';

	const maxFPS = 60;

	const debugStates = true;

	let pointsCount = 500;
	let points = [];

	let centers = [];

	let step = 0;

	function DrawAll() {
		background(28);
		for (let i = 0; i < centers.length; i++) {
			centers[i].draw();
		}

		for (let i = 0; i < points.length; i++) {
			points[i].draw(centers[points[i].centerIndex].pointsCol);
		}
	}

	function Step0() {
		const centerCol = color('hsl(0, 100%, 50%)');

		// place first center
		let avgPos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));

		centers.push(new Center(avgPos, centerCol));
		
		for (let i = 0; i < points.length; i++) {
			let diff = p5.Vector.sub(centers[0].pos, points[i].pos);
			points[i].centerIndex = 0;
			points[i].distToCenter = diff.magSq();

			if (i === 0) {
				points[i].randomWeight = points[i].distToCenter;
			} else {
				points[i].randomWeight = points[i].distToCenter + points[i - 1].randomWeight;
			}
		}

		console.log('Centers', centers);

		DOMManager.nextStepButton.removeAttribute('disabled');

		DrawAll();

		step = 1;
	}

	function Step1() {
		// random choose next center
	}

	return {
		changeState(s) {
			state = s;

			if (debugStates) console.log('State Change: ' + s);
		},

		setup() {
			Random.seed = (new Date() * 1) >>> 0;

			background(28);

			for (let i = 0; i < pointsCount; i++) {
				points.push(new Points());
				points[i].draw();
			}

			console.log('Sample Point', points[0]);
		},

		nextStep() {
			console.log('Step', step);

			switch (step) {
				case 0:
					Step0();
					break;
				case 1:
					Step1();
					break;
				default:
					break;
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