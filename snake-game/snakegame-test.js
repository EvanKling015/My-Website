testGame = new SnakeGame();

if(testGame.timerId !== null){
    clearInterval(testGame.timerId);
    testGame.timerId = null;
}

console.assert(testGame.canvas === document.getElementById("gameboard"),
"There should be a gameboard.")
console.assert(testGame.scoreTag === document.getElementById("current-score"),
"There should be a score element")
console.assert(testGame.highScoreTag === document.getElementById("high-score"),
"There should be a high score element")
