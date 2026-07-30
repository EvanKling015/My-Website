class PongGame {
    constructor() {
        this.canvas = document.getElementById("gameboard");
        this.context = this.canvas.getContext("2d");
        this.scoreBoard = document.getElementById("scoreboard");
        this.resetButton = document.getElementById("reset");

        //game settings
        this.boardWidth = 500;
        this.boardHeight = 500;
        this.paddleWidth = 25;
        this.paddleHeight = 100;
        this.paddleSpeed = 5;
        this.ballRadius = 10;

        //set score board
        this.leftScore = 0;
        this.rightScore = 0;
        this.timerID = null;
        this.ballSpeed = 1;

        this.canvas.width = this.boardWidth;
        this.canvas.height = this.boardHeight;

        this.resetButton.addEventListener("click", 
            () => this.resetGame());

        this.createObjects();
        this.draw();
        this.start();
    }

    draw() {
        this.clearBoard();
        this.leftPaddle.draw(this.context);
        this.rightPaddle.draw(this.context);
        this.ball.draw(this.context);
    }

    clearBoard() {
        this.context.fillStyle = "grey";
        this.context.fillRect(0, 0, this.boardWidth, this.boardHeight);
    }

    start() {
        this.timerId = setInterval(() => this.gameLoop(), 10);
    }

    gameLoop() {
        this.update();
        this.draw();
    }

    update() {
        this.leftPaddle.move();
        this.rightPaddle.move();

        this.ball.bounceOffTopAndBottom(this.boardHeight);
        this.ball.bounceOffLeftPaddle(this.leftPaddle);
        this.ball.bounceOffRightPaddle(this.rightPaddle);

        this.ball.move();
        this.checkScore();
    }

    checkScore() {
        if (this.ball.isPastLeftWall()) {
            this.rightScore++;
            this.afterScore();
        }
        else if (this.ball.isPastRightWall(this.boardWidth)) {
            this.leftScore++;
            this.afterScore();
        }
    }

    afterScore() {
        this.updateScore();
        this.resetBall();
        this.resetPaddles();
    }

    updateScore() {
        this.scoreBoard.innerHTML = `
        ${this.leftScore} - ${this.rightScore}`;
    }

    resetGame() {
        this.stop();
        this.leftScore = 0;
        this.rightScore = 0;
        this.updateScore();
        this.resetPaddles();
        this.resetBall();
        this.draw();
        this.start();
    }

    createObjects() {

        this.leftPaddle = new Paddle(
            15, //x position - moved away from left wall
            this.boardHeight/2 - this.paddleHeight/2,
            this.paddleWidth,
            this.paddleHeight,
            "blue",
            this.boardHeight
        );

        this.rightPaddle = new Paddle(
            this.boardWidth - this.paddleWidth - 15, //x position - moved away from right wall
            this.boardHeight/2 - this.paddleHeight/2,
            this.paddleWidth,
            this.paddleHeight,
            "blue",
            this.boardHeight
        );


        // reconnect keyboard controls
        this.controls = new KeyboardControls(
            this.leftPaddle,
            this.rightPaddle,
            this.paddleSpeed
        );


        this.resetBall();
    }

    resetPaddles() {
        this.leftPaddle.reset(
            this.boardHeight/2 - this.paddleHeight / 2
        );

        this.rightPaddle.reset(
            this.boardHeight/2 - this.paddleHeight / 2
        );
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    resetBall() {
        const direction = Math.random() < 0.5 ? -1 : 1;
        const verticalDirection = Math.random() < 0.5 ? -1 : 1;

        this.ball = new Ball(
            this.boardWidth/2,
            this.boardHeight/2,
            this.ballSpeed * direction,
            this.ballSpeed * verticalDirection,
            this.ballRadius,
            "green"
        );
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new PongGame();
});