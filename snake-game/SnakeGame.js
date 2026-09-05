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
        const foodSetting = document.querySelector("input[name='food-count']:checked").value;
        const [gridWidth, gridHeight] = document.querySelector("input[name='map-size']:checked").value.split("x").map(Number);
        const fruitType = document.querySelector("input[name='fruit-type']:checked").value;
        return {
            gridWidth,
            gridHeight,
            snakeSpeed: Number(document.querySelector("input[name='game-speed']:checked").value),
            foodMode: foodSetting,
            foodCount: foodSetting === "bomb"
                ? 1
                : foodSetting === "random"
                    ? Math.floor(Math.random() * 6) + 1
                    : Number(foodSetting),
            fruitType,
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
        this.foodMode = this.settings.foodMode;
        this.fruitType = this.settings.fruitType;
        this.bombTriggered = false;
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
        const freeSpaces = this.getFreeSpaces();
        const spacesToFill = Math.min(this.foodCount - this.foods.length, freeSpaces.length);
        for (let i = 0; i < spacesToFill; i++) {
            const spaceIndex = Math.floor(Math.random() * freeSpaces.length);
            const [x, y] = freeSpaces.splice(spaceIndex, 1)[0];
            const type = this.foodMode === "bomb" && !this.bombTriggered && this.foods.length === 0 ? "bomb" : this.getFruitType();
            this.foods.push(new Food(x, y, "red", type));
        }
    }

    getFreeSpaces() {
        const occupied = new Set(this.snake.snakeBody.map(([x, y]) => `${x},${y}`));
        this.foods.forEach(food => occupied.add(`${food.x},${food.y}`));
        const freeSpaces = [];
        for (let y = 1; y <= this.gridHeight; y++) {
            for (let x = 1; x <= this.gridWidth; x++) {
                if (!occupied.has(`${x},${y}`)) freeSpaces.push([x, y]);
            }
        }
        return freeSpaces;
    }

    getFruitType() {
        return this.fruitType === "bowl"
            ? ["apple", "banana", "orange", "grapes", "watermelon", "strawberry", "cherry", "pineapple"][Math.floor(Math.random() * 8)]
            : this.fruitType;
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
            .map(food => `<div class="food food-${food.type}" aria-label="${food.type}" style="background-color: ${food.color}; grid-area: ${food.y} / ${food.x}"></div>`)
            .join("");
        this.canvas.innerHTML = foodHtml + this.drawSnake();
    }

    drawSnake() {
        let snakeHtml = "";
        const snakeBody = this.snake.snakeBody;
        const previousBody = this.snake.previousBody;
        for (let i = 0; i < snakeBody.length; i++) {
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                this.gameOver();
                return snakeHtml;
            }
            const previousSegment = previousBody[i] || snakeBody[i];
            const offsetX = previousSegment[0] - snakeBody[i][0];
            const offsetY = previousSegment[1] - snakeBody[i][1];
            const startTransform = `translate(${offsetX * 100}%, ${offsetY * 100}%)`;
            snakeHtml += `<div class="snake-segment ${i === 0 ? "snake-head" : "snake-body"}" style="--start-transform: ${startTransform}; --move-duration: ${this.snakeSpeed}ms; background-color: ${this.snake.color}; grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
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

        if (this.snake.hasHitBody()) {
            this.gameOver();
            return;
        }

        const foodIndex = this.foods.findIndex(food => food.x === this.snake.headX && food.y === this.snake.headY);
        if (foodIndex !== -1) {
            const collectedFood = this.foods[foodIndex];
            this.snake.growSnake(this.snake.headX, this.snake.headY);
            this.foods.splice(foodIndex, 1);
            if (collectedFood.type === "bomb") {
                this.bombTriggered = true;
                this.foodCount = Math.floor(Math.random() * 5) + 4;
            } else if (this.foodMode === "random") {
                this.foodCount = Math.floor(Math.random() * 6) + 1;
            }
            this.placeFoods();
            this.increaseScore();
        }
        this.draw();
    }
}

window.addEventListener("DOMContentLoaded", () => new SnakeGame());