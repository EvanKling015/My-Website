console.assert(numField !== null, "NF null");
console.assert(messageText !== null, "MT null");
console.assert(guessCountText !== null, "GCT null");
console.assert(guessButton !== null, "GB null");
console.assert(resetButton !== null, "RB null");
console.assert(min === 1, "min is not 1");
console.assert(max === 100, "max is not 100");
console.assert(secret >= min && secret <= max, "secret is not between min and max");
console.assert(guessCount === 0, "guessCount is not 0");