const words = [
    "about", "after", "again", "alert", "alien", "allow", "alone", "angel", "angle", "apple",
    "arena", "argue", "array", "aside", "asset", "audio", "avoid", "award", "baker", "basic",
    "beach", "beard", "beast", "begin", "being", "below", "bench", "berry", "birth", "black",
    "blame", "block", "blood", "board", "boost", "bound", "brain", "bread", "break", "bring",
    "brown", "build", "buyer", "cabin", "cable", "carry", "catch", "cause", "chair", "chase",
    "chess", "chief", "child", "civic", "civil", "claim", "class", "clean", "clear", "click",
    "clock", "close", "coach", "coast", "color", "count", "court", "cover", "craft", "crane",
    "crazy", "cream", "crime", "dance", "dear", "depth", "dream", "drink", "drive", "eager",
    "early", "earth", "eight", "elite", "empty", "enemy", "enjoy", "enter", "entry", "equal",
    "event", "every", "exact", "extra", "faith", "field", "fifth", "fight", "final", "first",
    "focus", "force", "frame", "fruit", "giant", "glass", "globe", "grace", "grade", "grain",
    "grand", "grape", "green", "group", "guard", "guess", "guide", "happy", "heart", "heavy",
    "honey", "house", "human", "ideal", "image", "index", "inner", "joint", "judge", "juice",
    "knock", "known", "label", "large", "later", "laugh", "learn", "leave", "legal", "level",
    "light", "limit", "local", "logic", "major", "maker", "match", "media", "metal", "might",
    "model", "money", "month", "music", "noble", "noise", "north", "novel", "ocean", "offer",
    "often", "order", "other", "outer", "owner", "paint", "panel", "party", "peace", "phone",
    "piece", "pilot", "pitch", "place", "plain", "plane", "plant", "point", "power", "press",
    "price", "pride", "prime", "print", "prior", "proof", "queen", "quick", "quiet", "quite",
    "radio", "raise", "range", "rapid", "reach", "ready", "right", "river", "robot", "rough",
    "round", "route", "royal", "scale", "scene", "score", "serve", "seven", "shall", "shape",
    "share", "sharp", "sheep", "sheet", "shift", "shine", "shore", "short", "shown", "sight",
    "since", "skill", "sleep", "slide", "small", "smart", "smile", "smith", "smoke", "solid",
    "solve", "sound", "south", "space", "speed", "spend", "split", "sport", "staff", "stage",
    "stand", "start", "state", "steam", "steel", "stick", "still", "stock", "stone", "store",
    "storm", "story", "study", "style", "table", "teach", "teeth", "thank", "their", "theme",
    "there", "these", "thing", "think", "third", "those", "three", "throw", "title", "total",
    "touch", "track", "trade", "train", "treat", "trial", "truck", "trust", "truth", "under",
    "union", "until", "upper", "value", "video", "visit", "vital", "voice", "watch", "water",
    "while", "white", "whole", "woman", "world", "would", "write", "wrong", "young", "youth"
];

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const summaryKeyOrder = ["1", "2", "3", "4", "5", "6", "incorrect"];

let secretWord = "";
let tries = 0;
let currentGuess = "";
let board = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
let evaluationBoard = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
let keyboardState = {};
let totalGames = 0;
let roundSummary = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    incorrect: 0
};

const guessField = document.getElementById("guess-field");
const guessDisplay = document.getElementById("guess-display");
const messageText = document.getElementById("message-text");
const roundSummaryEl = document.getElementById("round-summary");
const keyboardEl = document.getElementById("keyboard");
const playAgainButton = document.getElementById("play-again");
const resetHistoryButton = document.getElementById("reset-history");
let isRoundFinished = false;

let myConfetti = null;
if (window.confetti) {
    myConfetti = confetti.create(null, { resize: true, useWorker: true });
}

function resetHistory() {
    totalGames = 0;
    roundSummary = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        incorrect: 0
    };
    hideRoundSummary();
    renderSummary();
}

function hideRoundSummary() {
    roundSummaryEl.hidden = true;
    playAgainButton.hidden = true;
}

function startGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    tries = 0;
    currentGuess = "";
    board = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
    evaluationBoard = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
    keyboardState = {};
    isRoundFinished = false;
    messageText.textContent = "Guess the hidden word.";
    guessField.value = "";
    hideRoundSummary();
    renderBoard();
    renderKeyboard();
    renderSummary();
    guessField.focus();
}

function renderBoard() {
    guessDisplay.innerHTML = "";

    for (let rowIndex = 0; rowIndex < MAX_GUESSES; rowIndex++) {
        const row = document.createElement("div");
        row.className = "guess-row";

        for (let letterIndex = 0; letterIndex < WORD_LENGTH; letterIndex++) {
            const cell = document.createElement("span");
            const letter = board[rowIndex][letterIndex];
            const status = evaluationBoard[rowIndex][letterIndex];

            cell.className = "letter-box";

            if (letter) {
                cell.textContent = letter.toUpperCase();
                cell.classList.add("filled");
            }

            if (status) {
                cell.classList.add(status);
            }

            if (rowIndex === tries && letterIndex < currentGuess.length) {
                cell.textContent = currentGuess[letterIndex].toUpperCase();
                cell.classList.add("filled");
            }

            row.appendChild(cell);
        }

        guessDisplay.appendChild(row);
    }
}

function getLetterStatus(guess) {
    const result = Array(WORD_LENGTH).fill("wrong");
    const remainingCounts = {};

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === secretWord[i]) {
            result[i] = "correct";
        } else {
            remainingCounts[secretWord[i]] = (remainingCounts[secretWord[i]] || 0) + 1;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === "correct") continue;
        const letter = guess[i];
        if ((remainingCounts[letter] || 0) > 0) {
            result[i] = "close";
            remainingCounts[letter]--;
        }
    }

    return result;
}

function renderKeyboard() {
    const rows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"]
    ];

    keyboardEl.innerHTML = "";

    rows.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";

        row.forEach((key) => {
            const keyButton = document.createElement("button");
            keyButton.type = "button";
            keyButton.className = "key";
            const keyText = key === "enter" ? "ENTER" : key === "backspace" ? "⌫" : key.toUpperCase();
            keyButton.textContent = keyText;

            if (key === "enter" || key === "backspace") {
                keyButton.classList.add("wide");
            }

            if (keyboardState[key]) {
                keyButton.classList.add(keyboardState[key]);
            }

            keyButton.addEventListener("click", () => handleKeyboardInput(key));
            rowEl.appendChild(keyButton);
        });

        keyboardEl.appendChild(rowEl);
    });
}

function updateKeyboardState(guess, statuses) {
    const currentLetterStates = {};

    for (let index = 0; index < guess.length; index++) {
        const letter = guess[index];
        const status = statuses[index];
        const existing = keyboardState[letter];
        const priority = { wrong: 0, close: 1, correct: 2 };

        currentLetterStates[letter] = (!existing || priority[status] > priority[existing]) ? status : existing;
    }

    Object.entries(currentLetterStates).forEach(([letter, status]) => {
        keyboardState[letter] = status;
    });

    renderKeyboard();
}

function addLetter(letter) {
    if (currentGuess.length >= WORD_LENGTH) return;
    currentGuess += letter.toLowerCase();
    renderBoard();
}

function removeLetter() {
    currentGuess = currentGuess.slice(0, -1);
    renderBoard();
}

function handleKeyboardInput(key) {
    const normalizedKey = key.toLowerCase();

    if (normalizedKey === "enter") {
        submitGuess();
        return;
    }

    if (normalizedKey === "backspace") {
        removeLetter();
        return;
    }

    if (/^[a-z]$/.test(normalizedKey)) {
        addLetter(normalizedKey);
    }
}

function submitGuess() {
    if (tries >= MAX_GUESSES) return;

    const guess = currentGuess.toLowerCase();

    if (guess.length !== WORD_LENGTH) {
        messageText.textContent = `Enter a ${WORD_LENGTH}-letter word.`;
        return;
    }

    if (!words.includes(guess)) {
        messageText.textContent = "Not in the word list.";
        return;
    }

    const statuses = getLetterStatus(guess);
    board[tries] = guess.split("");
    evaluationBoard[tries] = statuses;

    updateKeyboardState(guess, statuses);
    tries += 1;
    currentGuess = "";
    renderBoard();

    if (guess === secretWord) {
        totalGames += 1;
        roundSummary[tries] += 1;
        isRoundFinished = true;
        messageText.textContent = `You got it in ${tries} guess${tries === 1 ? "" : "es"}!`;
        showRoundSummary();
        if (myConfetti) {
            myConfetti({ particleCount: 150, spread: 360 });
        }
        guessField.blur();
        return;
    }

    if (tries >= MAX_GUESSES) {
        totalGames += 1;
        roundSummary.incorrect += 1;
        isRoundFinished = true;
        messageText.textContent = `No more guesses. The word was ${secretWord.toUpperCase()}.`;
        showRoundSummary();
        guessField.blur();
        return;
    }

    messageText.textContent = `Guess ${tries} of ${MAX_GUESSES}.`;
    guessField.focus();
}

function applyGuessToBoard(guess, statuses) {
    const rowIndex = tries;
    for (let index = 0; index < guess.length; index++) {
        const letter = guess[index];
        const status = statuses[index];
        board[rowIndex][index] = letter;
        evaluationBoard[rowIndex][index] = status;
    }
    renderBoard();
}

function renderSummary() {
    const rows = summaryKeyOrder.map((key) => {
        const label = key === "incorrect" ? "Incorrect" : `Guess ${key}`;
        const value = roundSummary[key] || 0;
        const percent = totalGames === 0 ? 0 : Math.round((value / totalGames) * 100);
        return `
            <div class="summary-row">
                <span class="summary-percent">${percent}%</span>
                <span class="summary-label">${label}</span>
                <span class="summary-count">${value}</span>
            </div>
        `;
    }).join("");

    roundSummaryEl.innerHTML = rows;
}

function showRoundSummary() {
    renderSummary();
    roundSummaryEl.hidden = false;
    playAgainButton.hidden = false;
}

document.addEventListener("keydown", (event) => {
    if (isRoundFinished) return;

    const key = event.key;

    if (key === "Enter") {
        event.preventDefault();
        submitGuess();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        removeLetter();
        return;
    }

    if (/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyboardInput(key);
    }
});

playAgainButton.addEventListener("click", () => {
    startGame();
});

resetHistoryButton.addEventListener("click", () => {
    resetHistory();
});

startGame();