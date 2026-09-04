class Ball {

    constructor(x, y, vx, vy, radius, color) {

        this.x = x;
        this.y = y;

        this.radius = radius;

        this.vx = vx;
        this.vy = vy;

        this.color = color;


        // trail storage

        this.previousPositions = [];


        // Used while the ball is waiting to launch.

        this.waiting = false;

    }




    draw(context) {



        // =========================
        // TAPERED FADING TRAIL
        // =========================


        for (let i = 0; i < this.previousPositions.length; i++) {


            let pos = this.previousPositions[i];


            // older trail pieces get smaller

            let size =
                (i / this.previousPositions.length) * this.radius;



            // older pieces fade away

            let opacity =
                (i / this.previousPositions.length) * 0.35;



            context.beginPath();



            context.arc(

                pos.x,

                pos.y,

                size,

                0,

                Math.PI * 2

            );



            context.fillStyle =
                `rgba(255,105,180,${opacity})`;



            context.fill();



            context.closePath();


        }




        // =========================
        // SMALL BLACK OUTLINE
        // =========================


        context.beginPath();



        context.arc(

            this.x,

            this.y,

            this.radius + 1.5,

            0,

            Math.PI * 2

        );



        context.fillStyle = "rgba(0,0,0,0.55)";



        context.fill();



        context.closePath();





        // =========================
        // MAIN BALL
        // =========================


        context.beginPath();



        context.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI * 2

        );



        context.fillStyle = this.color;



        context.fill();



        context.closePath();


    }





    move() {



        // Don't move while waiting to launch.

        if (this.waiting) return;




        // store old position


        this.previousPositions.push({

            x: this.x,

            y: this.y

        });




        // trail length

        if (this.previousPositions.length > 25) {


            this.previousPositions.shift();


        }




        // move ball


        this.x += this.vx;

        this.y += this.vy;


    }


    increaseSpeed(amount = 0.15, maximum = 8) {

        const speed = Math.hypot(this.vx, this.vy);

        if (speed === 0) return;


        const nextSpeed = Math.min(speed + amount, maximum);
        const scale = nextSpeed / speed;

        this.vx *= scale;
        this.vy *= scale;

    }






    bounceOffTopAndBottom(boardHeight) {



        if (this.y - this.radius <= 0) {


            this.vy = Math.abs(this.vy);


        }


        else if (this.y + this.radius >= boardHeight) {


            this.vy = -Math.abs(this.vy);


        }


    }





    isPastLeftWall() {


        return this.x - this.radius < 0;


    }





    isPastRightWall(boardWidth) {


        return this.x + this.radius > boardWidth;


    }






    bounceOffLeftPaddle(paddle) {


        const ballLeft = this.x - this.radius;

        const ballTop = this.y - this.radius;

        const ballBottom = this.y + this.radius;



        const paddleRight = paddle.x + paddle.width;

        const paddleTop = paddle.y;

        const paddleBottom = paddle.y + paddle.height;




        if (ballLeft > paddleRight) return false;

        if (ballBottom < paddleTop) return false;

        if (ballTop > paddleBottom) return false;





        if (this.vx < 0) {


            this.vx = Math.abs(this.vx);
            this.vy += paddle.vy * 0.35;


        }



        return true;


    }





    bounceOffRightPaddle(paddle) {


        const ballRight = this.x + this.radius;

        const ballTop = this.y - this.radius;

        const ballBottom = this.y + this.radius;



        const paddleLeft = paddle.x;

        const paddleTop = paddle.y;

        const paddleBottom = paddle.y + paddle.height;





        if (ballRight < paddleLeft) return false;

        if (ballBottom < paddleTop) return false;

        if (ballTop > paddleBottom) return false;





        if (this.vx > 0) {


            this.vx = -Math.abs(this.vx);
            this.vy += paddle.vy * 0.35;


        }



        return true;


    }

}