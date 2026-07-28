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
        this.snakeX = this.randomPositino();
        this.vx = 0;
        this.vy = 0;
        this.snakeSpeed = 120;

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
}