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

        this.controls = new KeyboardControls(this.leftPaddle, this.rightpaddle, this.paddleSpeed);
        this.resetButton.addEventListener("click", () => this.resetGame());

        createObjects();
        this.draw();
        this.start();
    }

    resetGame() {
        this.stop();
        this.leftScore = 0;
        this.rightScore = 0;
        this.UpdateScoreBoard();
        this.resetPaddles();
        this.resetBall();
        this.draw();
        this.start();
    }

    createObjects() {
        this.leftPaddle = new Paddle(
            0, //x pos 
            this.boardHeight/2 - this.paddleHeight/2, //y pos
            this.paddleWidth, //width
            this.paddleHeight, //height
            "blue", //paddle color
            this.paddleSpeed); //speed
        this.rightpaddle = newPaddle(
            this.boardWidth - this.paddleWidth, //x pos
            this.boardHeight/2 - this.paddleHeight/2, //y pos
            this.paddleWidth, //width
            this.paddleHeight, //height
            "blue", //paddle color
            this.paddleSpeed); //speed
        this.resetBall();
    }

    resetBall() {
        const direction = Math.random() < 0.5 ? -1 : 1; //randomly chooses x direction
        const verticalDirection = Math.random() < 0.5 ? -1 : 1; //randomly chooses y direction
        this.ball = new Ball(
            this.boardWidth/2, //x pos
            this.boardHeight/2, //y pos
            this.ballSpeed * direction, //x velocity
            this.ballSpeed * verticalDirection, //y velocity
            this.ballRadius, //radius
            "green"); //color
    }

}