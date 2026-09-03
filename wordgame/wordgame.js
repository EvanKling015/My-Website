const words = [
    "apple", "beach", "berry", "brain", "bread", "chair", "chess",
    "cloud", "dance", "dream", "earth", "flame", "fruit", "ghost",
    "grape", "green", "heart", "house", "light", "lemon", "magic",
    "melon", "money", "music", "ocean", "peach", "plant", "plane",
    "pizza", "queen", "river", "robot", "rock", "space", "snake",
    "sound", "storm", "table", "tiger", "toast", "train", "water",
    "whale", "world", "zesty"
];

let secretWord = "";
let tries = 0;
let correctLetters = [];

const guessField = document.getElementById("guess-field");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
const messageText = document.getElementById("message-text");
const secretDisplay = document.getElementById("secret-display");
const guessDisplay = document.getElementById("guess-display");
const historyTableBody = document.getElementById("history-table-body");

let myConfetti = null;
if (window.confetti) {
    myConfetti = confetti.create(null, { resize: true, useWorker: true });
}

function startGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    tries = 0;
    correctLetters = [];
    messageText.textContent = "Guess the 5-letter secret word!";
    guessField.value = "";
    guessButton.disabled = false;
    historyTableBody.innerHTML = "";
    renderGuessRows();
    hideSecretWord();
}

function renderGuessRows() {
    guessDisplay.innerHTML = "";

    for (let rowNumber = 0; rowNumber < 6; rowNumber++) {
        const row = document.createElement("div");
        row.className = "guess-row";

        for (let letterNumber = 0; letterNumber < 5; letterNumber++) {
            const box = document.createElement("span");
            box.className = "letter-box empty";
            row.appendChild(box);
        }

        guessDisplay.appendChild(row);
    }
}

function hideSecretWord() {
    secretDisplay.innerHTML = "";

    for (let letterNumber = 0; letterNumber < 5; letterNumber++) {
        const box = document.createElement("span");
        box.textContent = "?";
        box.className = "letter-box";
        secretDisplay.appendChild(box);
    }
}

function updateSecretDisplay() {
    secretDisplay.innerHTML = "";

    for (let letterNumber = 0; letterNumber < secretWord.length; letterNumber++) {
        const box = document.createElement("span");
        box.className = "letter-box";
        box.textContent = correctLetters[letterNumber]?.toUpperCase() || "?";

        if (correctLetters[letterNumber]) {
            box.classList.add("correct");
        }

        secretDisplay.appendChild(box);
    }
}

function showSecretWord() {
    secretDisplay.innerHTML = "";

    for (const letter of secretWord) {
        const box = document.createElement("span");
        box.textContent = letter.toUpperCase();
        box.className = "correct letter-box";
        secretDisplay.appendChild(box);
    }
}

function buildLetterFeedBack(guess) {
    let resultHTML = "";

    for (let letterNumber = 0; letterNumber < guess.length; letterNumber++) {
        const letter = guess[letterNumber];
        let cssClass = "wrong";

        if (letter === secretWord[letterNumber]) {
            cssClass = "correct";
            correctLetters[letterNumber] = letter;
        } else if (secretWord.includes(letter)) {
            cssClass = "close";
        }

        resultHTML += `<span class="letter-box ${cssClass}">${letter.toUpperCase()}</span>`;
    }

    return resultHTML;
}

function addGuessToBoard(resultHTML) {
    guessDisplay.children[tries - 1].innerHTML = resultHTML;
}

function addGuessToHistory(guess, resultHTML) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${guess.toUpperCase()}</td><td>${tries}</td><td>${resultHTML}</td>`;
    historyTableBody.prepend(row);
}

function checkGuess() {
    if (tries >= 6) return;

    const guess = guessField.value.trim().toLowerCase();
    if (guess.length !== secretWord.length) {
        messageText.textContent = `Please enter a ${secretWord.length}-letter word.`;
        return;
    }

    tries++;
    const resultHTML = buildLetterFeedBack(guess);
    addGuessToBoard(resultHTML);
    addGuessToHistory(guess, resultHTML);
    updateSecretDisplay();

    if (guess === secretWord) {
        messageText.textContent = "Congratulations! You've guessed the word!";
        showSecretWord();
        guessButton.disabled = true;
        if (myConfetti) myConfetti({ particleCount: 150, spread: 360 });
    } else if (tries >= 6) {
        messageText.textContent = `Game over! The word was ${secretWord.toUpperCase()}.`;
        showSecretWord();
        guessButton.disabled = true;
    } else {
        messageText.textContent = `Wrong guess. Try again! (${6 - tries} guesses left)`;
        guessField.value = "";
    }
}

guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", startGame);
guessField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkGuess();
});

startGame();