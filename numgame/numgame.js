const numField = document.getElementById("num-field");
const messageText = document.getElementById("message-text");
const guessCountText = document.getElementById("guess-count-text");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");

const min = 1;
const max = 100;
const maxGuess = Math.ceil(Math.log2(max - min + 1));
let secret;
let guessCount;
let minPosition;
let maxPosition;

let myConfetti = null;
if (window.confetti) {
    myConfetti = confetti.create(null, { resize: true, useWorker: true });
}

function showWinConfetti() {
    if (myConfetti) myConfetti({ particleCount: 150, spread: 360 });
}

function loadGame() {
    secret = Math.floor(Math.random() * (max - min + 1)) + min;
    guessCount = 0;
    minPosition = min;
    maxPosition = max;
    numField.value = "";
    messageText.textContent = `Guess a number between ${min} and ${max}`;
    guessCountText.textContent = "Guesses: 0";
    guessButton.disabled = false;
}

function makeGuess() {
    const guess = parseInt(numField.value, 10);

    if (Number.isNaN(guess) || guess > max || guess < min) {
        messageText.textContent = `Please enter a valid number between ${min} and ${max}`;
        return;
    }

    if (guessCount >= maxGuess) {
        messageText.textContent = `You ran out of guesses. The number was ${secret}. Press reset to play again.`;
        return;
    }

    if (guess < secret) minPosition = guess + 1;
    if (guess > secret) maxPosition = guess - 1;

    guessCount++;
    guessCountText.textContent = `Guesses: ${guessCount} of ${maxGuess} (Next range: ${minPosition}-${maxPosition})`;

    if (guess === secret) {
        messageText.textContent = "Congratulations! You've guessed the number!";
        guessButton.disabled = true;
        showWinConfetti();
    } else if (guess < secret) {
        messageText.textContent = "Try again! The secret number is higher.";
    } else {
        messageText.textContent = "Try again! The secret number is lower.";
    }

    if (guessCount >= maxGuess && guess !== secret) {
        messageText.textContent = `Game over. The number was ${secret}. Press reset to play again.`;
        guessButton.disabled = true;
    }
}

guessButton.addEventListener("click", makeGuess);
resetButton.addEventListener("click", loadGame);
numField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") makeGuess();
});

loadGame();