class PongGame {

    constructor() {

        this.canvas = document.getElementById("gameboard");
        this.context = this.canvas.getContext("2d");

        this.scoreBoard = document.getElementById("scoreboard");

        this.resetButton = document.getElementById("reset");
        this.startButton = document.getElementById("start");

        this.winnerText = document.getElementById("winner");


        // game settings

        this.boardWidth = 500;
        this.boardHeight = 500;

        this.paddleWidth = 25;
        this.paddleHeight = 100;

        this.paddleSpeed = 5;

        this.ballRadius = 10;


        // score

        this.leftScore = 0;
        this.rightScore = 0;


        this.timerID = null;


        // faster ball

        this.ballSpeed = 2;


        this.gameStarted = false;
        this.gameOver = false;


        this.canvas.width = this.boardWidth;
        this.canvas.height = this.boardHeight;



        this.resetButton.addEventListener(
            "click",
            () => this.resetGame()
        );


        this.startButton.addEventListener(
            "click",
            () => this.startGame()
        );



        this.createObjects();

        this.updateScore();

        this.draw();

    }





    startGame() {

        if (this.gameStarted) return;


        if (this.gameOver) {

            this.resetGame();

        }


        this.gameStarted = true;

        this.gameOver = false;


        this.winnerText.innerHTML = "";


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

        this.context.fillRect(
            0,
            0,
            this.boardWidth,
            this.boardHeight
        );

    }





    start() {

        if (!this.timerID) {

            this.timerID = setInterval(
                () => this.gameLoop(),
                10
            );

        }

    }





    gameLoop() {

        if (!this.gameStarted || this.gameOver) return;


        this.update();

        this.draw();

    }





    update() {

        this.leftPaddle.move();

        this.rightPaddle.move();


        this.ball.bounceOffTopAndBottom(
            this.boardHeight
        );


        this.ball.bounceOffLeftPaddle(
            this.leftPaddle
        );


        this.ball.bounceOffRightPaddle(
            this.rightPaddle
        );


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



        if (this.leftScore >= 15) {

            this.endGame(
                "LEFT PLAYER WINS!"
            );

            return;

        }



        if (this.rightScore >= 15) {

            this.endGame(
                "RIGHT PLAYER WINS!"
            );

            return;

        }




        this.resetBall();

        this.resetPaddles();



        this.ball.waiting = true;



        setTimeout(() => {

            if (!this.gameOver) {

                this.ball.waiting = false;

            }

        }, 3000);


    }





    endGame(message) {


        this.gameOver = true;

        this.gameStarted = false;


        this.winnerText.innerHTML = message;


    }





    // SEVEN SEGMENT SCOREBOARD

    updateScore() {


        this.scoreBoard.innerHTML = `


            ${this.createDigit(this.leftScore)}



            <div class="score-divider">

                <div class="dot"></div>

                <div class="dot"></div>

            </div>



            ${this.createDigit(this.rightScore)}


        `;


    }





    createDigit(number) {


        const segments = {


            0: ["a","b","c","d","e","f"],

            1: ["b","c"],

            2: ["a","b","g","e","d"],

            3: ["a","b","g","c","d"],

            4: ["f","g","b","c"],

            5: ["a","f","g","c","d"],

            6: ["a","f","g","e","c","d"],

            7: ["a","b","c"],

            8: ["a","b","c","d","e","f","g"],

            9: ["a","b","c","d","f","g"]

        };



        let active = segments[number];



        return `

            <div class="digit">


                <div class="segment a ${active.includes("a") ? "active" : ""}"></div>


                <div class="segment b ${active.includes("b") ? "active" : ""}"></div>


                <div class="segment c ${active.includes("c") ? "active" : ""}"></div>


                <div class="segment d ${active.includes("d") ? "active" : ""}"></div>


                <div class="segment e ${active.includes("e") ? "active" : ""}"></div>


                <div class="segment f ${active.includes("f") ? "active" : ""}"></div>


                <div class="segment g ${active.includes("g") ? "active" : ""}"></div>


            </div>

        `;

    }





    resetGame() {


        this.stop();


        this.leftScore = 0;

        this.rightScore = 0;


        this.gameStarted = false;

        this.gameOver = false;


        this.winnerText.innerHTML = "";


        this.updateScore();


        this.resetPaddles();

        this.resetBall();


        this.draw();


    }





    createObjects() {


        this.leftPaddle = new Paddle(

            15,

            this.boardHeight / 2 - this.paddleHeight / 2,

            this.paddleWidth,

            this.paddleHeight,

            "black",

            this.boardHeight

        );




        this.rightPaddle = new Paddle(

            this.boardWidth - this.paddleWidth - 15,

            this.boardHeight / 2 - this.paddleHeight / 2,

            this.paddleWidth,

            this.paddleHeight,

            "black",

            this.boardHeight

        );




        this.controls = new KeyboardControls(

            this.leftPaddle,

            this.rightPaddle,

            this.paddleSpeed

        );



        this.resetBall();

    }





    resetPaddles() {


        this.leftPaddle.reset(

            this.boardHeight / 2 - this.paddleHeight / 2

        );


        this.rightPaddle.reset(

            this.boardHeight / 2 - this.paddleHeight / 2

        );


    }





    stop() {


        if (this.timerID) {


            clearInterval(this.timerID);


            this.timerID = null;


        }

    }





    resetBall() {


        const direction =
            Math.random() < 0.5 ? -1 : 1;


        const verticalDirection =
            Math.random() < 0.5 ? -1 : 1;



        this.ball = new Ball(

            this.boardWidth / 2,

            this.boardHeight / 2,

            this.ballSpeed * direction,

            this.ballSpeed * verticalDirection,

            this.ballRadius,

            "HotPink"

        );

    }

}





window.addEventListener(
    "DOMContentLoaded",
    () => new PongGame()
);