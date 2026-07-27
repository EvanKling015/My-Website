//const words = ["apple", "peach", "lemon", "berry", "mango", "grape", "melon", "aahed", "aalii", "aargh", "aarti", "abuse", "abyss", "admix", "admin", "allow", "aloft", "adapt", "afore", "alone", "alive", "amaze", "agile","xenia", "zaddy", "zesty", "zilch", "zeros", "zippy", "yarco","yasss", "waddy", "water", "leche", "cream", "white", "black", "tanks" ];
const WPI_QWEN_URL = "https://ggpt-llm-p-u02.int.wpi.edu/v1/chat/completions";
const WPI_QWEN_MODEL = "qwen-cli";


let secretWord = "";
let tries = 0;
let words;
let correctLetters = [];

const guessField = document.getElementById("guess-field")
const guessButton = document.getElementById("guess-button")
const resetButton = document.getElementById("reset-button")
const messageText = document.getElementById("message-text")
const secretDisplay = document.getElementById("secret-display")
const guessDisplay = document.getElementById("guess-display")
const historyTableBody = document.getElementById("history-table-body")
const apiKeyField = document.getElementById("api-key-field");
const saveApiKeyButton = document.getElementById("save-api-key");
const clearApiKeyButton = document.getElementById("clear-api-key");

/* start the game by selecting a random word from the list and resetting the tries */
async function startGame() {

    tries = 0;
    correctLetters = [];
    messageText.textContent = "Guess the 5-letter secret word!";
    guessField.value = "";
    historyTableBody.innerHTML = "";
    guessDisplay.innerHTML = "";
    secretDisplay.innerHTML = "";

    await getExternalData();
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
        const wordData = await response.json();

        secretWord = wordData[0];

        hideSecretWord();

    } catch (error) {
        console.error("Fetch failed", error);
    }
}

function hideSecretWord() {
    secretDisplay.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        let box = document.createElement("span");
        box.innerHTML = "?";
        box.classList.add("letter-box");
        secretDisplay.appendChild(box);
    }
}

function updateSecretDisplay() {
    secretDisplay.innerHTML = "";

    for (let i = 0; i < secretWord.length; i++) {
        let box = document.createElement("span");
        box.classList.add("letter-box");

        if (correctLetters[i]) {
            box.innerHTML = correctLetters[i].toUpperCase();
            box.classList.add("correct");
        } else {
            box.innerHTML = "?";
        }

        secretDisplay.appendChild(box);
    }
}

function showSecretWord() {
    secretDisplay.innerHTML = "";

    for (let i = 0; i < secretWord.length; i++) {
        let box = document.createElement("span");
        box.innerHTML = secretWord[i].toUpperCase();
        box.classList.add("correct");
        box.classList.add("letter-box");
        secretDisplay.appendChild(box);
    }
}


function buildLetterFeedBack(guess) {
    let resultHTML = "";

    for (let i = 0; i < guess.length; i++) {
        let letter = guess[i];
        let cssClass = "";

        if (letter === secretWord[i]) {
            cssClass = "correct";
            correctLetters[i] = letter;
        } 
        else if (secretWord.includes(letter)) {
            cssClass = "close";
        } 
        else {
            cssClass = "wrong";
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

    let resultCell = document.createElement("td");
    resultCell.innerHTML = resultHTML;

    row.appendChild(guessCell);
    row.appendChild(tryCell);
    row.appendChild(resultCell);

    historyTableBody.prepend(row);
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
    updateSecretDisplay();
    
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

function saveApiKey() {
    const apiKey = apiKeyField.value.trim();
    localStorage.setItem("wpiQwenApiKey", apiKey);
    messageText.textContent = "API Key saved!";
}

function clearApiKey() {
    apiKeyField.value = "";
    localStorage.removeItem("wpiQwenApiKey");
    messageText.textContent = "API Key cleared!";
}

async function askQwen(promptText) {
    const apiKey = localStorage.getItem("wpiQwenApiKey");
    if (!apiKey) {
        messageText.textContent = "Please enter your API key.";
        return;
    }

    try {
        const response = await fetch (WPI_QWEN_MODEL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                model: WPI_QWEN_MODEL,
                message: [
                    {role: "system",
                        content: "/no_think You are a helpful assistant \
                        that provides hints for a 5-letter word guessing game."},
                        {role: "user",
                            content: promptText },
                    
                ],
            
                    temperature: 0.7,
                    max_tokens: 200,
                    stream: false,
                    chat_template_kwargs: {
                        enable_thinking: false
                    }
        })
    })
    }
    catch (error) {
        console.log (error)
    }
}

async function askForHint() {
    if (!secretWord) {
        messageText.textContent = "Please start the game first.";
        return;
    }
    const hint = "Ask Ai for a hint...";
    messageText.textContent = hint;

    const promptText = `The secret word is: ${secretWord}. \
            Please provide one short hint for the player to guess the word.`;
    try {
        const aiHint = await askQwen(promptText);
        messageText.innerHTML = `AI Hint: ${aiHint}`;
    } catch (error) {
        console.error("Error getting AI hint:", error);
        messageText.textContent = "Error getting AI hint. Please check your API key.";
    }
}
            
function loadPage() {
    guessButton.addEventListener("click", checkGuess);
    resetButton.addEventListener("click", startGame);
    saveApiKeyButton.addEventListener("click", saveApiKey);
    clearApiKeyButton.addEventListener("click", clearApiKey);
    apiKeyField.value = localStorage.getItem("wpiQwenApiKey") || "";
    startGame();
}

loadPage();