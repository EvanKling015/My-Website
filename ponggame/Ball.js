class Ball {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
    }

    draw(context) {

        context.fillStyle = this.color;
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        context.stroke();
        context.fill();
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    bounceOffTopAndBottom(boardHeight) {
        if (this.y - this.radius <= 0) {
            this.vy = Math.abs(this.vy); // Bounce down
        } else if (this.y + this.radius >= boardHeight) {
            this.vy = -Math.abs(this.vy); // Bounce up
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
            this.vx = Math.abs(this.vx); // Bounce right
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
            this.vx = -Math.abs(this.vx); // Bounce left
        }
        return true;
    }

}