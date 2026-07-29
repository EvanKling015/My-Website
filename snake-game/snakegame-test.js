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

testSnake = new Snake(2, 9, 0, 0, "lightblue");
testFood = new Food(5, 12, "red");
console.assert(JSON.stringify(testSnake) !== null, "The snake should not be null.");
console.assert(JSON.stringify(testFood) !== null, "The food should not be null.");

testGame.snake.headX = 2;
testGame.snake.headY = 9;
testGame.snake.snakeBody = [[2, 9]];
testGame.food.x = 5;
testGame.food.y = 12;
testGame.draw();
console.assert(JSON.stringify(testGame.snake) === JSON.stringify(testSnake),
"The snake should be the same.");
console.assert(JSON.stringify(testGame.food) === JSON.stringify(testFood),
"The foods should be the same.");

testControls = new SnakeControls(testSnake);
console.assert(JSON.stringify(testControls) !== null,
"The controls should not be null.");
console.assert(JSON.stringify(testControls) === JSON.stringify(testGame.controls),
"The snake controls should be the same.");

testGame.snake.headX = 3;
testGame.snake.headY = 8;
isOver = testGame.snake.move(16);
testGame.draw();
newCanvas = '<div style="background-color: red; grid-area: 12 / 5"></div><div style="background-color: lightblue; grid-area: 8 / 3"></div>';
console.assert(isOver === false, "The game should not be over");
console.assert(testGame.canvas.innerHTML === newCanvas,
    "The gameboard should show new changes");

testGame.snake.headX = -1;
testGame.snake.headY = 8;
isOver = testGame.snake.move(16);
testGame.draw();
console.assert(isOver === true, "The game should be over.");

testGame.snake.headX = 5;
testGame.snake.headY = 12;
testGame.snake.move(16);
testGame.snake.growSnake(testGame.food.x, testGame.food.y);
testGame.placeFood();
testGame.snake.headX = 6;
testGame.snake.headY = 12;
testGame.snake.move(16);
testGame.draw();
body = [[6,12], [5, 12]];
console.assert(JSON.stringify(body) === JSON.stringify(testGame.snake.snakeBody),
"The snake should not be two blocks long.");

testGame.snake.snakeBody = [[9, 11], [8, 11], [8, 12], [9, 12], [10, 12]];
testGame.snake.headX = 9;
testGame.snake.headY = 12;
testGame.snake.move(16);
testGame.draw();