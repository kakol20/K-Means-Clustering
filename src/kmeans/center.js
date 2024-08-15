class Center {
  constructor(pos = createVector(), col = color()) {
    this.pos = pos.copy();
    this.col = col;
    this.pointsCol = color(red(col), green(col), blue(col), 128)
  }

  draw() {
    strokeWeight(1);
    stroke('white');
    fill(this.col);
    circle(this.pos.x, this.pos.y, 10);
  }
}