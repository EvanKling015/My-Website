//get elements from the DOM-HTML
const numField = document.getElementById("num-field");
const messageText = document.getElementById("message-text");
const guessCountText = document.getElementById("guess-count-text");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
//set min and max
let min = 1;
let max = 100;
//create a number bretween min and max
let secret;
let guessCount = 0;

//create confetti object
let myConfetti = null;
if (window.confetti){
    myConfetti = confetti.create(null, {
        resize: true,
        useWorker: true
    });
}

function loadGame() {
    secret = Math.floor(Math.random()* (max-min+1)) + min;
    guessCount = 0;
    messageText.textContent = "Guess a number between "+ min + " and " + max;
    guessCountText.textContent = "Guesses: " + guessCount;
    numField.value = "";
}

function makeGuess() {
    const guess = parseInt(numField.value);
    if (isNaN(guess)){
        messageText.textContent = "Please enter a valid number between " +min+" and "+max;
        return;
    }
    guessCount++;
    guessCountText.textContent = "Guesses: "+ guessCount;

    if (guess === secret) {
        messageText.textContent = "Congratulations! You've guessed the number!";
        if (myConfetti) {
            myConfetti({
                particleCount: 100,
                spread: 160
            });
        }
    }
    else if (guess < secret) {
        messageText.textContent = "Try again! The secret number is higher.";
    }
    else {
        messageText.textContent = "Try again! The secret number is lower.";
    }
}

guessButton.addEventListener("click", makeGuess);
resetButton.addEventListener("click", loadGame);

loadGame();