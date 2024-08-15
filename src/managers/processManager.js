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
		// place first center
		let avgPos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));

		centers.push(new Center(avgPos, color('white')));
		centers[0].setHue(0);
		
		for (let i = 0; i < points.length; i++) {
			let diff = p5.Vector.sub(centers[0].pos, points[i].pos);
			points[i].centerIndex = 0;
			points[i].sqDistToCenter = diff.magSq();

			if (i === 0) {
				points[i].randomWeight = points[i].sqDistToCenter;
			} else {
				points[i].randomWeight = points[i].sqDistToCenter + points[i - 1].randomWeight;
			}
		}

		console.log('Centers', centers);

		DrawAll();

		DOMManager.nextStepButton.removeAttribute('disabled');
		step = 1;
	}

	function Step1() {
		// random choose next center
		const randChoice = Random.randFloatValue(0, points[points.length - 1].randomWeight);

		let i = 0;
		while (i < points.length) {
			if (randChoice < points[i].randomWeight) break;
			i++;
		}
		console.log('Chosen Points Index', i);

		centers.push(new Center(points[i].pos));
		
		// set colors
		for (let j = 0; j < centers.length; j++) {
			centers[j].setHue((j / centers.length) * 360);
		}

		// re-assign points
		for (let j = 0; j < points.length; j++) {
			let chosenCenter = 0;
			let minDist = width * height * 2;

			for (let k = 0; k < centers.length; k++) {
				const diff = p5.Vector.sub(centers[k].pos, points[j].pos);
				const dist = diff.magSq();

				if (dist < minDist) {
					chosenCenter = k;
					minDist = dist;
				}
			}

			points[j].centerIndex = chosenCenter;
			points[j].sqDistToCenter = minDist;

			if (j === 0) {
				points[j].randomWeight = points[j].sqDistToCenter;
			} else {
				points[j].randomWeight = points[j].sqDistToCenter + points[j - 1].randomWeight;
			}
		}

		DrawAll();

		DOMManager.nextStepButton.removeAttribute('disabled');
		step = 2;
	}

	function Step2() {
		// move centers
	}

	return {
		debugPoints() {
			console.log('Points', points);
		},

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