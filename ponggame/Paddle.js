class Paddle {
    constructor(x, y, width, height, color, boardheight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.boardheight = boardheight;
        this.vy = 0; 
    }

    draw(context) {
        context.fillStyle = this.color;
        context.strokeStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        const newY = this.y + this.vy;
        if (newY < 0) {
            this.y = 0; //prevent moving above the top
            return;
        }
        if (newY + this.height > this.boardheight) {
            this.y = this.boardheight - this.height;
            return;
        }
        this.y = newY;
    }

    moveUp(speed) {
        this.vy = -speed;
    }
    
    moveDown(speed) {
        this.vy = speed;
    }

    stop() {
        this.vy = 0;
    }

    reset(y) {
        this.y = y;
        this.vy = 0;
    }
}