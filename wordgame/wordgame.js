//const words = ["apple", "peach", "lemon", "berry", "mango", "grape", "melon", "aahed", "aalii", "aargh", "aarti", "abuse", "abyss", "admix", "admin", "allow", "aloft", "adapt", "afore", "alone", "alive", "amaze", "agile","xenia", "zaddy", "zesty", "zilch", "zeros", "zippy", "yarco","yasss", "waddy", "water", "leche", "cream", "white", "black", "tanks" ];

let secretWord = "";
let tries = 0;
let words;

const guessField = document.getElementById("guess-field")
const guessButton = document.getElementById("guess-button")
const resetButton = document.getElementById("reset-button")
const messageText = document.getElementById("message-text")
const secretDisplay = document.getElementById("secret-display")
const historyTableBody = document.getElementById("history-table-body")

/* start the game by selecting a random word from the list and resetting the tries */
function startGame() {

    console.log(getExternalData());
    tries = 0;
    messageText.textContent = "Guess the 5-letter secret word!";
    guessField.value = "";
    historyTableBody.innerHTML = "";
    hideSecretWord();
    
}

//make confetti 
let myConfetti = null;
if (window.confetti){
    myConfetti = confetti.create(null, {
        resize: true,
        useWorker: true
    });
}

async function getExternalData(){
    const url = "https://random-word-api.herokuapp.com/word?length=5";
    try {
        const response = await fetch(url);
    
    const data = await response.json();
    secretWord = data[0];
    hideSecretWord();
    } catch (error) {
    console.error("Fetch failed");
    }
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
        const guess = guessField.value.toLowerCase();
        tries++;
        if (tries >= 7) {
            messageText.innerHTML = "Game over!";
            messageText.
            return;
        }
        if (guess.length !== secretWord.length) {
            messageText.textContent = "please enter a " + secretWord.length + "-letter word.";
            return;
        }
        let resultHTML = buildLetterFeedBack(guess);
        
        if (guess === secretWord) {
            messageText.textContent = "Congratulations! You've guessed the word!";
            if (myConfetti) {
            myConfetti({
                particleCount: 5000,
                spread: 360
            });
            }
            showSecretWord();
            addGuessToHistory(guess, resultHTML);
        } else {
            messageText.textContent = "Wrong guess. Try again!";
            addGuessToHistory(guess, resultHTML);
        }
    }

function showSecretWord() {
    secretDisplay.innerHTML = "";
    for (let i =0; i < secretWord.length; i++) {
        let box = document.createElement("span");;
        box.innerHTML = secretWord[i].toUpperCase();
        box.classList.add("correct");
        secretDisplay.appendChild(box);
    }
}


function buildLetterFeedBack(guess) {
    let resultHTML = "";
    //resetting secretdisplay
    secretDisplay.innerHTML = "";
    for (let i = 0; i < guess.length; i++) {
        let letter = guess[i];
        let cssClass = "";
        if (letter === secretWord[i]) {
            cssClass = "correct";
            //display
            let box = document.createElement("span");;
            box.innerHTML = secretWord[i].toUpperCase();
            box.classList.add("correct");
        secretDisplay.appendChild(box);
        } else if (secretWord.includes(letter)) {
            cssClass = "close";
            //display
            let box = document.createElement("span");
            box.innerHTML = "?";
            secretDisplay.appendChild(box);
        } else {
            cssClass = "wrong";
            //display
            let box = document.createElement("span");
            box.innerHTML = "?";
            secretDisplay.appendChild(box);
        }
        resultHTML += `<span class="letter-box ${cssClass}">${letter.toUpperCase()}</span>`;
    }
    return resultHTML;
}

// stub function to add the guess to the history table
function addGuessToHistory(guess, resultHTML) {
    let row = document.createElement("tr");

    let tryCell = document.createElement("td");
    tryCell.innerHTML = tries;

    let guessCell = document.createElement("td");
    guessCell.innerHTML = guess.toUpperCase();

    let resultCell = document.createElement("td")
    resultCell.innerHTML = resultHTML;

    row.appendChild(guessCell);
    row.appendChild(tryCell);
    row.appendChild(resultCell);

    historyTableBody.appendChild(row);
}

guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", startGame);
guessField.addEventListener("keydown", function(event) {
    if (event.key === "Enter"){
        checkGuess()
    }
})

startGame();

function checkGuess() {
    if (tries >= 6) {
        return;
    }

    const guess = guessField.value.toLowerCase();
    
    // Validate word length before counting it as an official try
    if (guess.length !== secretWord.length) {
        messageText.textContent = "Please enter a " + secretWord.length + "-letter word.";
        return;
    }

    tries++;
    let resultHTML = buildLetterFeedBack(guess);
    
    if (guess === secretWord) {
        messageText.textContent = "Congratulations! You've guessed the word!";
        if (myConfetti) {
            myConfetti({ particleCount: 150, spread: 360 });
        }
        showSecretWord();
        addGuessToHistory(guess, resultHTML);
        
        // Disable board because they won
        guessField.disabled = true;
        guessButton.disabled = true;
    } else {
        addGuessToHistory(guess, resultHTML);
        guessField.value = ""; // Clear the input field for their next attempt

        if (tries >= 6) {
            messageText.innerHTML = "Game over! You will now never know what the word was :)";
            
            // Disable board because they ran out of tries
            guessButton.disabled = true;
        } else {
            messageText.textContent = "Wrong guess. Try again! (" + (6 - tries) + " guesses left)";
        }
    }
}