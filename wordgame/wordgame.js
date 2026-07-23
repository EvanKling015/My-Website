const words = ["apple", "peach", "lemon", "berry", "mango", "grape", "melon", "aahed", "aalii", "aargh", "aarti", "abuse", "abyss", "admix", "admin", "allow", "aloft", "adapt", "afore", "alone", "alive", "amaze", "agile",];

let secretWord = "";
let tries = 0;

const guessField = document.getElementById("guess-field")
const guessButton = document.getElementById("guess-button")
const resetButton = document.getElementById("reset-button")
const messageText = document.getElementById("message-text")
const secretDisplay = document.getElementById("secret-display")
const historyTableBody = document.getElementById("history-table-body")

/* start the game by selecting a random word from the list and resetting the tries */
function startgame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    tries = 0;
    messageText.textContent = "Guess the 5-letter secret word!";
    guessField.value = "";
    hideSecretWord();
    
}

function hideSecretWord() {
    secretDisplay.innerHTML = "";
    for (let i = 0; i < secretWord.length; i++) {
        let box = document.createElement("span");
        box.innerHTML = "?";
        secretDisplay.appendChild(box);
    }
}

    function checkGuess() {
        const guess = guessField.value.toLowercase();
        tries++;
        if (guess.length !== secretWord.length) {
            messageText.textContent = "please enter a " + secretWord.length + "-letter word.";
            return;
        }

        if (guess === secretWord) {
            messageText.textContent = "Congratulations! You've guessed the word!";
            showSecretWord();
            addGuessToHistory(guess);
        } else {
            messageText.textContent = "Wrong guess. Try again!";
            addGuessToHistory(guess);
        }
    }

function showSecretWord() {
    secretDisplay.innerHTML = "";
    for (let i =0; i < secretWord.length; i++) {
        let box = doccument.createElement("span");;
        box.innerHTML = secretWord[i].toUpperCase();
        box.classList.add("correct");
        secretDisplay.appendChild(box);
    }
}

// stub function to add the guess to the history table
function addGuessToHistory(guess) {
}

startgame();