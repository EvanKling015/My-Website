class PongGame {

    constructor() {

        this.canvas = document.getElementById("gameboard");
        this.context = this.canvas.getContext("2d");

        this.scoreBoard = document.getElementById("scoreboard");

        this.resetButton = document.getElementById("reset");
        this.startButton = document.getElementById("start");

        this.winnerText = document.getElementById("winner");


        // game settings

        this.boardWidth = 700;
        this.boardHeight = 500;
        this.paddleWallOffset = 10;

        this.paddleWidth = 25;
        this.paddleHeight = 100;

        this.paddleSpeed = 8;

        this.ballRadius = 10;


        // score

        this.leftScore = 0;
        this.rightScore = 0;


        this.timerID = null;
        this.launchTimeoutID = null;
        this.launchToken = 0;


        // ball speed

        this.ballSpeed = 2.5;
        this.winningScore = 21;


        this.gameStarted = false;
        this.gameOver = false;
        this.gameMode = "vs-player";
        this.aiDifficulty = "medium";
        this.aiEnabled = false;

        this.aiDifficultySettings = {
            easy: {
                responseRate: 0.68,
                stopDistance: 24,
                aimError: 28,
                chaseThreshold: 0.55,
                lookAhead: 0.15
            },
            medium: {
                responseRate: 0.9,
                stopDistance: 14,
                aimError: 16,
                chaseThreshold: 0.35,
                lookAhead: 0.32
            },
            hard: {
                responseRate: 1.08,
                stopDistance: 6,
                aimError: 7,
                chaseThreshold: 0.2,
                lookAhead: 0.5
            }
        };


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



        this.modeButtons = document.querySelectorAll(".mode-option");
        this.difficultyButtons = document.querySelectorAll(".difficulty-option");
        this.difficultyPanel = document.getElementById("difficulty-panel");

        this.createObjects();
        this.bindHudControls();
        this.updateModeSelection();

        this.updateScore();

        this.draw();

    }





    bindHudControls() {

        this.modeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.gameMode = button.dataset.mode;
                this.aiEnabled = this.gameMode === "vs-ai";

                if (this.controls) {
                    this.controls.aiEnabled = this.aiEnabled;
                }

                this.updateModeSelection();

                if (!this.gameStarted) {
                    this.rightPaddle.stop();
                }
            });
        });

        this.difficultyButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.aiDifficulty = button.dataset.difficulty;
                this.updateDifficultySelection();
            });
        });

    }



    updateModeSelection() {

        this.modeButtons.forEach((button) => {
            const isActive = button.dataset.mode === this.gameMode;
            button.classList.toggle("active", isActive);
        });

        this.difficultyPanel.classList.toggle("hidden", this.gameMode !== "vs-ai");

    }



    updateDifficultySelection() {

        this.difficultyButtons.forEach((button) => {
            const isActive = button.dataset.difficulty === this.aiDifficulty;
            button.classList.toggle("active", isActive);
        });

    }



    startGame() {

        if (this.gameStarted) return;

        this.aiEnabled = this.gameMode === "vs-ai";

        if (this.controls) {
            this.controls.aiEnabled = this.aiEnabled;
        }

        if (this.gameOver) {

            this.resetGame();

        }


        this.gameStarted = true;

        this.gameOver = false;


        this.winnerText.innerHTML = "";

        this.ball.waiting = true;
        this.scheduleLaunch(1000);


        this.start();

    }





    draw() {

        this.clearBoard();

        this.leftPaddle.draw(this.context);

        this.rightPaddle.draw(this.context);

        this.ball.draw(this.context);

    }





    clearBoard() {

        this.context.fillStyle = "#071016";

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
        this.updateAI();
        this.rightPaddle.move();


        this.ball.bounceOffTopAndBottom(
            this.boardHeight
        );


        const hitLeftPaddle = this.ball.bounceOffLeftPaddle(
            this.leftPaddle
        );


        const hitRightPaddle = this.ball.bounceOffRightPaddle(
            this.rightPaddle
        );

        if (hitLeftPaddle || hitRightPaddle) {
            this.ball.increaseSpeed();
        }


        this.ball.move();


        this.checkScore();

    }





    updateAI() {

        if (!this.aiEnabled || this.gameMode !== "vs-ai") return;

        const settings = this.aiDifficultySettings[this.aiDifficulty] ?? this.aiDifficultySettings.medium;
        const paddleCenter = this.rightPaddle.y + this.rightPaddle.height / 2;
        const targetY = this.ball.y + this.ball.vy * settings.lookAhead * 12;
        const chaseThreshold = this.boardWidth * settings.chaseThreshold;

        if (this.ball.x < chaseThreshold && this.ball.vx < 0) {
            this.rightPaddle.stop();
            return;
        }

        const noisyTarget = targetY + (Math.random() - 0.5) * settings.aimError;
        const delta = noisyTarget - paddleCenter;
        const preferredSpeed = this.paddleSpeed * settings.responseRate;

        if (Math.abs(delta) < settings.stopDistance) {
            this.rightPaddle.stop();
            return;
        }

        if (delta < 0) {
            this.rightPaddle.moveUp(preferredSpeed);
        }
        else {
            this.rightPaddle.moveDown(preferredSpeed);
        }

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



        if (this.leftScore >= this.winningScore) {

            this.endGame(
                "LEFT PLAYER WINS!"
            );

            return;

        }



        if (this.rightScore >= this.winningScore) {

            this.endGame(
                "RIGHT PLAYER WINS!"
            );

            return;

        }




        this.resetBall();

        this.resetPaddles();



        this.ball.waiting = true;



        this.scheduleLaunch(500);


    }





    endGame(message) {


        this.gameOver = true;

        this.gameStarted = false;


        this.winnerText.innerHTML = message;


    }





    // SEVEN SEGMENT SCOREBOARD

    updateScore() {


        this.scoreBoard.innerHTML = `


            ${this.createScoreDigits(this.leftScore)}



            <div class="score-divider">

                <div class="dot"></div>

                <div class="dot"></div>

            </div>



            ${this.createScoreDigits(this.rightScore)}


        `;


    }





    createScoreDigits(score) {
        return String(score)
            .split("")
            .map((digit) => this.createDigit(Number(digit)))
            .join("");
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
        this.cancelLaunch();


        this.leftScore = 0;

        this.rightScore = 0;


        this.gameStarted = false;

        this.gameOver = false;


        this.winnerText.innerHTML = "";

        this.aiEnabled = this.gameMode === "vs-ai";

        if (this.controls) {
            this.controls.aiEnabled = this.aiEnabled;
        }

        this.updateScore();


        this.resetPaddles();

        this.resetBall();


        this.draw();


    }





    createObjects() {


        this.leftPaddle = new Paddle(

            this.paddleWallOffset,

            this.boardHeight / 2 - this.paddleHeight / 2,

            this.paddleWidth,

            this.paddleHeight,

            "#d5ff45",

            this.boardHeight

        );




        this.rightPaddle = new Paddle(

            this.boardWidth - this.paddleWidth - this.paddleWallOffset,

            this.boardHeight / 2 - this.paddleHeight / 2,

            this.paddleWidth,

            this.paddleHeight,

            "#35e6e6",

            this.boardHeight

        );




        this.controls = new KeyboardControls(

            this.leftPaddle,

            this.rightPaddle,

            this.paddleSpeed,

            this.aiEnabled

        );

        this.updateModeSelection();
        this.updateDifficultySelection();



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
        const launchAngle =
            -(Math.random() * (Math.PI / 6) + Math.PI / 12);
        const horizontalSpeed =
            Math.cos(launchAngle) * this.ballSpeed;
        const verticalSpeed =
            Math.sin(launchAngle) * this.ballSpeed;


        this.ball = new Ball(

            this.boardWidth / 2,

            this.boardHeight / 2,

            Math.abs(horizontalSpeed) * direction,

            verticalSpeed,

            this.ballRadius,

            "HotPink"

        );

    }


    scheduleLaunch(delay) {

        this.cancelLaunch();

        const launchToken = ++this.launchToken;


        this.launchTimeoutID = setTimeout(() => {

            if (launchToken === this.launchToken && this.gameStarted && !this.gameOver) {

                this.ball.waiting = false;
                this.launchTimeoutID = null;

            }

        }, delay);

    }


    cancelLaunch() {

        if (this.launchTimeoutID) {

            clearTimeout(this.launchTimeoutID);
            this.launchTimeoutID = null;

        }


        this.launchToken++;

    }

}





window.addEventListener(
    "DOMContentLoaded",
    () => new PongGame()
);