class Points {
  constructor(pos = createVector(0, 0)) {
		this.pos = pos.copy();
		this.centerIndex = 0;
		this.sqDistToCenter = 0;
		this.randomWeight = 0;
	}

	draw(col = color(255, 255, 255, 128)) {
		// strokeWeight(5);
		// stroke(col);
		// point(this.pos);

		noStroke();
    fill(col);
    circle(this.pos.x, this.pos.y, 5);
	}
}