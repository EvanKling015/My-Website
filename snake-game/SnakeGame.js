class SnakeGame {
    constructor() {
        this.canvas = document.getElementById("gameboard");
        this.gameScreen = document.getElementById("game-screen");
        this.setupPanel = document.getElementById("setup-panel");
        this.gameOverPanel = document.getElementById("game-over");
        this.scoreTag = document.getElementById("current-score");
        this.highScoreTag = document.getElementById("high-score");
        this.finalScoreTag = document.getElementById("final-score");
        this.timerId = null;
        this.score = 0;
        this.highScore = Number(localStorage.getItem("high-score") || 0);
        this.foods = [];
        this.gameOverState = false;

        document.getElementById("start-game").addEventListener("click", () => this.startGame());
        document.getElementById("play-again").addEventListener("click", () => this.startGame());
        document.getElementById("back-to-menu").addEventListener("click", () => this.showSetup());
        this.updateScoreBoard();
    }

    readSettings() {
        const foodSetting = document.getElementById("food-count").value;
        const [gridWidth, gridHeight] = document.getElementById("map-size").value.split("x").map(Number);
        return {
            gridWidth,
            gridHeight,
            snakeSpeed: Number(document.getElementById("game-speed").value),
            foodCount: foodSetting === "random" ? Math.floor(Math.random() * 5) + 1 : Number(foodSetting),
            snakeColor: document.querySelector("input[name='snake-color']:checked").value
        };
    }

    startGame() {
        this.stop();
        this.settings = this.readSettings();
        this.gridWidth = this.settings.gridWidth;
        this.gridHeight = this.settings.gridHeight;
        this.snakeSpeed = this.settings.snakeSpeed;
        this.foodCount = this.settings.foodCount;
        this.score = 0;
        this.gameOverState = false;
        this.setupPanel.hidden = true;
        this.gameScreen.hidden = false;
        this.gameOverPanel.hidden = true;
        this.canvas.style.setProperty("--grid-columns", this.gridWidth);
        this.canvas.style.setProperty("--grid-rows", this.gridHeight);
        this.canvas.style.setProperty("--board-ratio", `${this.gridWidth} / ${this.gridHeight}`);
        this.createObjects();
        this.placeFoods();
        this.controls = new SnakeControls(this.snake);
        this.canvas.style.setProperty("--snake-color", this.snake.color);
        this.updateScoreBoard();
        this.draw();
        this.start();
    }

    showSetup() {
        this.stop();
        this.gameOverState = false;
        this.gameScreen.hidden = true;
        this.gameOverPanel.hidden = true;
        this.setupPanel.hidden = false;
    }

    createObjects() {
        const startX = Math.ceil(this.gridWidth / 2);
        const startY = Math.ceil(this.gridHeight / 2);
        this.snake = new Snake(startX, startY, 0, 0, this.settings.snakeColor);
        this.foods = [];
    }

    placeFoods() {
        while (this.foods.length < this.foodCount) {
            const x = this.randomPosition(this.gridWidth);
            const y = this.randomPosition(this.gridHeight);
            if (!this.isOccupied(x, y) && !this.foods.some(food => food.x === x && food.y === y)) {
                this.foods.push(new Food(x, y, "red"));
            }
        }
    }

    isOccupied(x, y) {
        return this.snake.snakeBody.some(([bodyX, bodyY]) => bodyX === x && bodyY === y);
    }

    randomPosition(side) {
        return Math.floor(Math.random() * side) + 1;
    }

    updateScoreBoard() {
        this.scoreTag.innerText = `Score: ${this.score}`;
        this.highScoreTag.innerText = `High Score: ${this.highScore}`;
    }

    increaseScore() {
        this.score++;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("high-score", this.highScore);
        }
        this.updateScoreBoard();
    }

    draw() {
        const foodHtml = this.foods
            .map(food => `<div class="food" style="background-color: ${food.color}; grid-area: ${food.y} / ${food.x}"></div>`)
            .join("");
        this.canvas.innerHTML = foodHtml + this.drawSnake();
    }

    drawSnake() {
        let snakeHtml = "";
        const snakeBody = this.snake.snakeBody;
        for (let i = 0; i < snakeBody.length; i++) {
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                this.gameOver();
                return snakeHtml;
            }
            snakeHtml += `<div class="snake-segment ${i === 0 ? "snake-head" : "snake-body"}" style="background-color: ${this.snake.color}; grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        return snakeHtml;
    }

    gameOver() {
        if (this.gameOverState) return;
        this.stop();
        this.gameOverState = true;
        this.finalScoreTag.innerText = `FINAL SCORE: ${this.score}`;
        this.gameOverPanel.hidden = false;
    }

    start() {
        this.timerId = setInterval(() => this.gameLoop(), this.snakeSpeed);
    }

    stop() {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    gameLoop() {
        if (this.snake.move(this.gridWidth, this.gridHeight)) {
            this.gameOver();
            return;
        }

        const foodIndex = this.foods.findIndex(food => food.x === this.snake.headX && food.y === this.snake.headY);
        if (foodIndex !== -1) {
            this.snake.growSnake(this.snake.headX, this.snake.headY);
            this.foods.splice(foodIndex, 1);
            this.placeFoods();
            this.increaseScore();
        }
        this.draw();
    }
}

window.addEventListener("DOMContentLoaded", () => new SnakeGame());