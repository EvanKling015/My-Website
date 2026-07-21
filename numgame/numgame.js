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


function loadGame() {
    secret = Math.floor(Math.random()* (max-min+1)) + min;
    guessCount = 0;
    messageText.textContent = "Guess a number between "+ min + " and " + max;
    guessCountText.textContent = "Guesses: " + guessCount;
    numField.value = "";
}

function checkGuess() {
    const guess = parseInt(numField.value);
    if (isNaN(guess)){
        messageText.textContent = "Please enter a valid number between " +min+" and "+max;
        return;
    }
    guessCount++;
    guessCountText.textContent = "Guesses: "+ guessCount;

    if (guess === secret) {
        messageText.textContent = "Congratulations! You've guessed the right number!";
    }
    else if (guess < secret) {
        messageText.textContent = "Try again! The secret number is higher";
    }
    else {
        messageText.textContent = "Try again! The secret number is lower";
    }
}

guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", loadGame);

loadGame();