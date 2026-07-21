console.assert(numField !== null, "NF null");
console.assert(messageText !== null, "MT null");
console.assert(guessCountText !== null, "GCT null");
console.assert(guessButton !== null, "GB null");
console.assert(resetButton !== null, "RB null");
console.assert(min === 1, "min is not 1");
console.assert(max === 100, "max is not 100");
console.assert(secret >= min && secret <= max, "secret is not between min and max");
console.assert(guessCount === 0, "guessCount is not 0");

secret = 50;
numField.value = "25";
makeGuess();
console.assert(guessCount === 1, "guessCount is not 1 after first guess")
console.assert(messageText.textContent === "Try again! The secret number is higher.", "messageText is not correct after first guess");
numField.value = "75";
makeGuess();
console.assert(guessCount === 2, "guessCount is not 2 after second guess");
console.assert(messageText.textContent === "Try again! The secret number is lower.", "messgeText is not correct after second guess");
numField.value = "50";
makeGuess();
console.assert(guessCount === 3, "guesscount is not 3 after third guess");
console.assert(messageText.textContent === "Congratulations! You've guessed the number!", "messageText is not correct after third guess");

try {
    numField.value = "abc"
    makeGuess();
} catch (error) {
    console.assert(messageText.textContent === "Please ender a valid number between 1 and 100.",
        "messageText is not correct after invalid guess");
}