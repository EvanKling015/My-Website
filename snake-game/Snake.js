class Snake{
    constructor(headX, headY, vx, vy, color){
        this.headX = headX;
        this.headY = headY;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.snakeBody = [];
        this.snakeBody[0] = [headX, headY];
    }

    move(side){
        const newY = this.headY + this.vy;
        const newX = this.headX + this.vx;
        this.headX = newX;
        this.headY = newY;

        for (let i = this.snakeBody.length -1; i > 0; i--){
            this.snakeBody[i] = this.snakeBody[i - 1];
        }
        this.snakeBody[0] = [this.headX, this.headY];

        if (newX <= 0 || newY <= 0 || this.headX > side || this.headY > side){
            return true;
        }
        return false;
    }
    changeDirection(vx, vy){
        this.vx = vx;
        this.vy = vy;
    }
    growSnake(foodX, foodY){
        this.snakeBody.push([foodX, foodY]);
    }
    changeColor(color){
        this.color = color;
    }
}