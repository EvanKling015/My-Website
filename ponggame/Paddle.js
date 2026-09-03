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
        // Black paddle
        context.fillStyle = this.color;
        context.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Neon outline matches each player's paddle color.
        context.strokeStyle = this.color;
        context.lineWidth = 2;

        context.shadowColor = this.color;
        context.shadowBlur = 30;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Reset glow so it doesn't affect other objects
        context.shadowBlur = 0;
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