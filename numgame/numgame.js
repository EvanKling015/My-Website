//get elements from the DOM-HTML
const numField = document.getElementById("num-field");
const messageText = document.getElementById("message-text");
const guessCountText = document.getElementById("guess-count-text");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
const lagButton = document.getElementById("lag-button");
//set min and max
let min = 1;
let max = 100;
//create a number bretween min and max
let secret;
let maxGuess = Math.ceil(Math.log2(max-min+1));
let guessCount = 0;
let minpos;
let maxpos;

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
    maxGuess = Math.ceil(Math.log2(max-min+1));
    min = 1;
    minpos = min;
    max = 100;
    maxpos = max;
    
}


function blowUp() {
    if (myConfetti) {
            myConfetti({
                particleCount: 100000000,
                spread: 360
            });
        }
}

function makeGuess() {
    const guess = parseInt(numField.value);
    if (isNaN(guess)||guess>max||guess<min){
        messageText.textContent = "Please enter a valid number between " +min+" and "+max;
        return;
    }
    else if ( guessCount >= maxGuess) {
        messageText.textContent = "You ran out of guesses, the number was " + secret +". Press reset game to play again";
        return;
    }
    if (guess < secret){
        minpos = guess + 1;
    }
    else if (guess > secret){
        maxpos = guess - 1
    }
    guessCount++;
    guessCountText.textContent = "Guesses: "+ guessCount +" of "+ maxGuess+
    " (Next guess should be between " +minpos+" and " + maxpos+")"+
    " (Next midpoint: "+Math.floor((minpos+maxpos)/2)+")";

    if (guess === secret) {
        messageText.textContent = "Congratulations! You've guessed the number!";
        if (myConfetti) {
            myConfetti({
                particleCount: 15000,
                spread: 360
            });
        }
    }
    else if(guess === 67){
        messageText.textContent = "KYS unfunny mf"
        if (myConfetti) {
            myConfetti({
                particleCount: 300,
                spread: 160
            });
        }
        
    }
    else if(guess === 67){
        messageText.textContent = "KYS unfunny mf"
        if (myConfetti) {
            myConfetti({
                particleCount: 300,
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
lagButton.addEventListener("click", blowUp);

numField.addEventListener("keydown", function(event) {
    if (event.key === "Enter"){
        makeGuess()
    }
})

loadGame();