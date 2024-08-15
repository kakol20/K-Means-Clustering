const ProcessManager = (function () {
	let state = 'nothing';

	const maxFPS = 60;

	const debugStates = true;

	const pointsCount = 10000;
	let points = [];

	let centers = [];

	let step = 0;
	// let previousStep = 0;
	let stepName = 'empty'

	function DrawAll() {
		DOMManager.newCenterButton.removeAttribute('disabled');
		DOMManager.clusterButton.removeAttribute('disabled');

		background(28);

		for (let i = 0; i < points.length; i++) {
			points[i].draw(centers[points[i].centerIndex].pointsCol);
		}

		for (let i = 0; i < centers.length; i++) {
			centers[i].draw();
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
		for (let i = 0; i < centers.length; i++) {
			centers[i].setHue(MathCustom.UnsignedMod((i / centers.length) * 360, 360));
		}

		// re-assign points
		for (let i = 0; i < points.length; i++) {
			let chosenCenter = 0;
			let minDist = width * height * 2;

			for (let j = 0; j < centers.length; j++) {
				const diff = p5.Vector.sub(centers[j].pos, points[i].pos);
				const dist = diff.mag();

				if (dist < minDist) {
					chosenCenter = j;
					minDist = dist;
				}
			}

			points[i].centerIndex = chosenCenter;
			points[i].sqDistToCenter = minDist;

			if (i === 0) {
				points[i].randomWeight = points[i].sqDistToCenter * points[i].sqDistToCenter;
			} else {
				points[i].randomWeight = (points[i].sqDistToCenter * points[i].sqDistToCenter) + points[i - 1].randomWeight;
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
		DOMManager.newCenterButton.removeAttribute('disabled');
		step = 1;

		console.log('Centers', centers);
	}

	function NewCenter() {
		stepName = 'New Center';
		// random choose next center
		const randChoice = Random.randFloatValue(0, points[points.length - 1].randomWeight);
		// const randChoice = 0;

		let i = 0;
		while (i < points.length) {
			if (randChoice <= points[i].randomWeight) break;
			i++;
		}
		console.log('Chosen Points Index', i);

		centers.push(new Center(points[i].pos));

		ReassignPoints();
		DrawAll();
		DOMManager.newCenterButton.removeAttribute('disabled');
		step = 1;
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
		step = 1;
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

		moveCenters() {
			step = 2;
			this.nextStep();
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