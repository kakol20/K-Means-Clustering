class Points {
  constructor() {
		this.pos = createVector(Random.randFloatValue(0, width), Random.randFloatValue(0, height));
		this.centerIndex = 0;
		this.distToCenter = 0;
		this.randomWeight = 0;
	}

	draw(col = color(255, 255, 255, 128)) {
		// strokeWeight(5);
		// stroke(col);
		// point(this.pos);

		strokeWeight(1);
    stroke(20);
    fill(col);
    circle(this.pos.x, this.pos.y, 5);
	}
}