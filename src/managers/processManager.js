const ProcessManager = (function () {
	let state = 'nothing';

	const maxFPS = 60;

	const debugStates = true;

	const pointsCount = 5000;
	let points = [];

	let centers = [];

	let step = 0;
	// let previousStep = 0;
	let stepName = 'empty'

	function DrawAll() {
		DOMManager.newCenterButton.removeAttribute('disabled');
		DOMManager.clusterButton.removeAttribute('disabled');
		DOMManager.fullMoveButton.removeAttribute('disabled');
		DOMManager.restartButton.removeAttribute('disabled');

		background(28);

		if (centers.length > 0) {
			for (let i = 0; i < points.length; i++) {
				points[i].draw(centers[points[i].centerIndex].pointsCol);
			}
	
			for (let i = 0; i < centers.length; i++) {
				centers[i].draw();
			}
		} else {
			for (let i = 0; i < points.length; i++) {
				points[i].draw(color(255, 255, 255, 64));
			}
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
		// points.sort((a, b) => b.dist - a.dist);

		let changed = false;
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
			if (points[i].centerIndex != chosenCenter) changed = true;

			points[i].centerIndex = chosenCenter;
			points[i].dist = minDist;
		}

		points.sort((a, b) => {
			return b.dist - a.dist || b.centerIndex - a.centerIndex;
		});

		for (let i = 0; i < points.length; i++) {
			if (i === 0) {
				points[i].randomWeight = points[i].dist * points[i].dist;
			} else {
				points[i].randomWeight = (points[i].dist * points[i].dist) + points[i - 1].randomWeight;
			}
		}

		return changed;
	}

	function FirstCenter() {
		stepName = 'First Center';

		// place first center
		// let avgPos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));
		const avgIndex = Random.randIntValue(0, points.length - 1);
		let avgPos = points[avgIndex].pos.copy();

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
		// const randChoice = Random.randFloatValue(0, points[points.length - 1].randomWeight);
		const randChoice = 0;

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

	function FullMove() {
		stepName = 'Full Move';

		let changed = true;
		while (changed) {
			changed = false;

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

			changed = ReassignPoints();
		}

		DrawAll();
		step = 1;
	}

	function ToroidalDistance(a, b, min, max) {
		let delta = createVector(
			Math.abs(b.x - a.x),
			Math.abs(b.y - a.y)
		);
		let minMaxDelta = createVector(
			Math.abs(max.x - min.x),
			Math.abs(max.y - min.y)
		);
		let mid = p5.Vector.div(minMaxDelta, 2);

		if (delta.x > mid.x) delta.x = minMaxDelta.x - delta.x;
		if (delta.y > mid.y) delta.y = minMaxDelta.y - delta.y;

		return Math.abs(delta.magSq());
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
			points.length = 0;
			centers.length = 0;

			step = 1;

			let clusterCenters = [];
			const maxClusters = 6;
			const radius = width / (maxClusters);
			const m = 2;

			// blue noise
			for (let i = 0; i < maxClusters; i++) {
				let candidateCount = clusterCenters.length * m + 1;

				let furthestPoint = createVector(0, 0);
				let furthestDist = -1;
				for (let j = 0; j < candidateCount; j++) {
					let currentPoint = createVector(
						Random.randFloatValue(radius, width - radius),
						Random.randFloatValue(radius, height - radius)
					);
					let closestDist = (width * width + height * height) * 2;

					for (let k = 0; k < clusterCenters.length; k++) {
						const currentDist = ToroidalDistance(
							currentPoint,
							clusterCenters[k],
							createVector(0, 0),
							createVector(width, height)
						);

						if (currentDist < closestDist) closestDist = currentDist;
					}

					if (closestDist > furthestDist) {
						furthestPoint = currentPoint.copy();
						furthestDist = closestDist;
					}
				}

				clusterCenters.push(furthestPoint.copy());
			}

			// background(28);

			for (let i = 0; i < pointsCount; i++) {
				const chosenIndex = Random.randIntValue(0, clusterCenters.length - 1);
				const randRadius = Math.sqrt(Random.randFloat()) * radius;
				const randAngle = Random.randFloat() * MathCustom.TAU;

				let pos = createVector(
					(randRadius * Math.cos(randAngle)),
					randRadius * Math.sin(randAngle)
				);
				pos.add(clusterCenters[chosenIndex]);
				points.push(new Points(pos));
				// points[i].draw();
			}

			stepName = 'Setup';
			DrawAll();

			console.log('Sample Point', points[0]);
		},

		nextStep() {
			console.log('Step', step);

			if (centers.length === 0) step = 0;

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
				case 3:
					FullMove();
					break;
				default:
					break;
			}
		},

		moveCenters() {
			step = 2;
			this.nextStep();
		},
		fullMove() {
			step = 3;
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