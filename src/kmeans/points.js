class Points {
  constructor() {
		this.pos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));
	}

	draw(col = color(255, 255, 255, 128)) {
		strokeWeight(5);
		stroke(col);
		point(this.pos);
	}
}