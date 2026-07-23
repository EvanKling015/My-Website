console.log("running tests");

console.assert(guessField !== null, "guess field");
console.assert(guessButton !== null, "GB");
console.assert(resetButton !== null, "RB");
console.assert(messageText !== null, "MT");
console.assert(secretDisplay !== null, "SD");
console.assert(historyTableBody !== null, "HTB");

console.assert(secretWord.length == 5, "sw should be 5");
console.assert(tries ===0, "tries should be 0");
console.assert(messageText.textContent === "Guess the f-letter secret word!", "messageText should prompt 5 letter");
console.assert(secretDisplay.innerHTML === "?????", "SD should have 5 qm");
console.assert(words.includes(secretword), "sw should be in words list");
console.assert(guessField.value === "", "guess field should be empty");