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

loadGame();