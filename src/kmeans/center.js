class Center {
  constructor(pos = createVector(), col = color('white')) {
    this.pos = pos.copy();
    this.col = col;
    this.pointsCol = color(red(col), green(col), blue(col), 128);
  }

  setHue(h = 0) {
    this.col = color('hsl(' + (Math.floor(h)).toString() + ', 100%, 50%)');
    this.pointsCol = color(red(this.col), green(this.col), blue(this.col), 128);
  }

  setPos(pos) {
    this.pos = pos.copy();
  }

  draw() {
    strokeWeight(1);
    stroke('white');
    fill(this.col);
    circle(this.pos.x, this.pos.y, 10);
  }
}