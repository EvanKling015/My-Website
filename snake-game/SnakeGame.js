class SnakeGame{
    constructor(){
        this.canvas = document.getElementById("gameboard");
        this.scoreTag = document.getElementById("current-score");
        this.highScoreTag = document.getElementById("high-score");

        this.gridSide = 16;
        this.score = 0;
        this.highScore = localStorage.getItem("high-score") || 0;
        this.updateScoreBoard();
        this.timerId = null;

        this.snakeY = this.randomPosition();
        this.snakeX = this.randomPosition();
        this.vx = 0;
        this.vy = 0;
        this.snakeSpeed = 150;

        this.foodX = this.randomPosition();
        this.foodY = this.randomPosition();

        this.createObjects();
        this.placeFood();
        this.controls = new SnakeControls(this.snake)
        this.draw();
        this.start();
    }
    createObjects(){
        this.snake = new Snake(
            this.snakeX,
            this.snakeY,
            this.vx,
            this.vy,
            "lightblue"
        );
        this.food = new Food(
            this.foodX,
            this.foodY,
            "red"
        );
    }
    placeFood(){
        do{
            this.foodX = this.randomPosition();
            this.foodY = this.randomPosition();
        }while(this.isOccupied(this.foodX, this.foodY));
        this.food.x = this.foodX;
        this.food.y = this.foodY;
    }
    isOccupied(x, y){
        return this.snake.snakeBody.some(([bodyX, bodyY]) => bodyX === x && bodyY === y);
    }
    randomPosition(){
        return Math.floor((Math.random() * this.gridSide) + 1);
    }
    updateScoreBoard(){
        this.scoreTag.innerText = `Score: ${this.score}`;
        this.highScoreTag.innerText = `High Score: ${this.highScore}`;
    }
    increaseScore(){
        this.score++;
        if (this.score > this.highScore){
            this.highScore = this.score;
            localStorage.setItem("high-score", this.highScore);
        }
        this.updateScoreBoard();
    }
    draw(){
        let foodHtml = `<div style="background-color: ${this.food.color}; grid-area: ${this.food.y} / ${this.food.x}"></div>`;
        let snakeHtml = this.drawSnake();
        this.canvas.innerHTML = foodHtml + snakeHtml;
    }
    drawSnake(){
        let snakeHtml = "";
        let snakeBody = this.snake.snakeBody;
        for (let i = 0; i < snakeBody.length; i++){
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] &&
                snakeBody[0][0] === snakeBody[i][0]
            ){
                this.gameOver();
                return snakeHtml;
            }
            snakeHtml += `<div style="background-color: ${this.snake.color}; grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        return snakeHtml;
    }
    gameOver(){
        if( this.timerId !== null){
            clearInterval(this.timerId);
            this.timerId = null;
        }
        alert("Game Over! Press OK to replay.");
        location.reload();
    }
    start(){
        this.timerId = setInterval(() => this.gameLoop(this.gridSide), this.snakeSpeed);
    }
    gameLoop(side){
        if (this.snake.move(side)){
            this.gameOver();
            return;
        }
        this.draw();
        if (this.snake.headX === this.food.x && this.snake.headY === this.food.y){
            this.placeFood();
            this.snake.growSnake(this.food.x, this.food.y);
            this.increaseScore();
        }
    }
}
window.addEventListener("DOMContentLoaded", () => {
    new SnakeGame();
});