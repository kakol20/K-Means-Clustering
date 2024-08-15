const Random = (function () {
  function UnsignedMod(numer, denom) {
		return ((numer % denom) + denom) % denom;
	}

  const max = (~0) >>> 0;

  return {
    seed: 256 >>> 0,

    randInt() {
      let state = Math.imul(this.seed, 747796405) >>> 0;
      state = (state + 2891336453) >>> 0;

      let word = ((state >>> 28) + 4) >>> 0;
      word = state >>> word;
      word = (word ^ state) >>> 0;
      word = Math.imul(word, 27780373) >>> 0;

      this.seed = ((word >>> 22) ^ word) >>> 0;

      return this.seed;
    },

    randFloat() {
			return this.randInt() / max;
		},

    randIntValue(minV, maxV) {
      const diff = (maxV - minV) + 1;

      const randV = this.randInt();

      return UnsignedMod(randV, diff) + minV;
    },

    randFloatValue(minV, maxV) {
      const diff = maxV - minV;
      return (diff * this.randFloat()) + minV;
    }
  }
})();