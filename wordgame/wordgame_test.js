console.log("running tests");

console.assert(guessField !== null, "guess field");
console.assert(guessButton !== null, "GB");
console.assert(resetButton !== null, "RB");
console.assert(messageText !== null, "MT");
console.assert(secretDisplay !== null, "SD");
console.assert(historyTableBody !== null, "HTB");

startGame();
console.assert(secretWord.length == 5, "sw should be 5");
console.assert(tries ===0, "tries should be 0");
console.assert(messageText.textContent === "Guess the 5-letter secret word!", "messageText should prompt 5 letter");
console.assert(secretDisplay.textContent === "?????", "SD should have 5 qm");
console.assert(words.includes(secretWord), "sw should be in words list");
console.assert(guessField.value === "", "guess field should be empty");
console.assert(secretDisplay.textContent === "?????", "secretDisplay should show 5 question marks")

guessField.value = "banana";
checkGuess();
console.assert(tries === 1, "tries should be 1 after a guess");
console.assert(messageText.textContent === "please enter a " + secretWord.length + "-letter word.", "should indicate wrong length");

secretWord = "apple";
guessField.value = "apple";
checkGuess();
console.assert(tries === 2, "tries should be 2");
console.assert(messageText.textContent === "Congratulations! You've guessed the word!", "msg should say youre right");
console.assert(secretDisplay.textContent === "APPLE", "secretDisplay should show right word");

//test letterfeedback function
secretWord = "apple";
guessField.value = "ahead";
guess = "ahead";
let feedback = buildLetterFeedBack(guess);
console.assert(feedback.includes('class="letter-box correct"'), "feedback needs right class for a");
console.assert(feedback.includes('class="letter-box close"'), "feedback needs right class for e");
console.assert(feedback.includes('class="letter-box wrong"'), "feedback needs right class for h and d");
let result_string = '<span class="letter-box correct">A</span> \
<span class="letter-box wrong">H</span> \
<span class="letter-box close">E</span> \
<span class="letter-box close">A</span> \
<span class="letter-box wrong">D</span>';
console.assert(feedback === result_string, "feedback should match expected results");
