const words = ["apple", "peach", "lemon", "berry", "mango", "grape", "melon"];

let secretWord = "";
let tries = 0;

const guessField = document.getElementById("guess-field")
const guessButton = document.getElementById("guess-button")
const resetButton = document.getElementById("reset-button")
const messageText = document.getElementById("message-text")
const secretDisplay = document.getElementById("secret-display")
const historyTableBody = document.getElementById("history-table-body")