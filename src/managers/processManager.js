const ProcessManager = (function () {
	let state = 'nothing';

	const maxFPS = 60;

	const debugStates = true;

	const pointsCount = 10000;
	let points = [];

	let centers = [];

	let step = 0;
	let previousStep = 0;
	let stepName = 'empty'

	function DrawAll() {
		background(28);
		for (let i = 0; i < centers.length; i++) {
			centers[i].draw();
		}

		for (let i = 0; i < points.length; i++) {
			points[i].draw(centers[points[i].centerIndex].pointsCol);
		}

		// draw text
		let displayText = 'Step: ' + stepName;
		displayText += '\nCenters: ' + centers.length;

		stroke('black');
		strokeWeight(1);
		rectMode(CORNERS);
		textAlign(LEFT, TOP);
		fill('white');
		textSize(15);
		textFont('Helvetica');
		text(displayText, 5, 5);
	}

	function ReassignPoints() {
		// set colors
		for (let j = 0; j < centers.length; j++) {
			centers[j].setHue(MathCustom.UnsignedMod((j / centers.length) * 360, 360));
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

	}

	function FirstCenter() {
		stepName = 'First Center';

		// place first center
		let avgPos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));

		centers.push(new Center(avgPos, color('white')));
		
		ReassignPoints();
		DrawAll();
		DOMManager.nextStepButton.removeAttribute('disabled');
		previousStep = 0;
		step = 1;

		console.log('Centers', centers);
	}

	function NewCenter() {
		stepName = 'New Center';
		// random choose next center
		const randChoice = Random.randFloatValue(0, points[points.length - 1].randomWeight);

		let i = 0;
		while (i < points.length) {
			if (randChoice < points[i].randomWeight) break;
			i++;
		}
		console.log('Chosen Points Index', i);

		centers.push(new Center(points[i].pos));

		ReassignPoints();
		DrawAll();
		DOMManager.nextStepButton.removeAttribute('disabled');
		previousStep = 1;
		step = 2;
	}

	function MoveCenters() {
		stepName = 'Move Centers';
		// move centers
		let average = [];
		for (let i = 0; i < centers.length; i++) {
			average.push({
				count: 0,
				pos: createVector(0, 0)
			});
		}

		for (let i = 0; i < points.length; i++) {
			const avgI = points[i].centerIndex;
			average[avgI].pos.add(points[i].pos);
			average[avgI].count += 1;
		}

		for (let i = 0; i < centers.length; i++) {
			average[i].pos.div(average[i].count);
			centers[i].setPos(average[i].pos);
		}

		ReassignPoints();
		DrawAll();
		DOMManager.nextStepButton.removeAttribute('disabled');
		if (previousStep === 1) {
			previousStep = 2;
			step = 1;
		} else {
			previousStep = 2;
			step = 3;
		}
	}

	return {
		debugPoints() {
			console.log('Points', points);
		},

		debugCenters() {
			console.log('Centers', centers);
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
					FirstCenter(); // first center
					break;
				case 1:
					NewCenter(); // add new center
					break;
				case 2:
					MoveCenters(); // move centers
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