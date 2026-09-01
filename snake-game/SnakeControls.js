class SnakeControls{
    constructor(snake){
        this.snake = snake;
        this.UP_ARROW = 'ArrowUp';
        this.DOWN_ARROW = 'ArrowDown';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.W_KEY = 'w';
        this.A_KEY = 'a';
        this.S_KEY = 's';
        this.D_KEY = 'd';

        window.addEventListener("keydown", (event) => 
            {if ([this.UP_ARROW, this.DOWN_ARROW, this.W_KEY, this.S_KEY].includes(
            event.code) || [this.W_KEY, this.S_KEY].includes(event.key.toLowerCase())){event.preventDefault()}});
        window.addEventListener("keyup", (event) =>this.keyUp(event));
    }

    keyUp(event){
        const key = event.key.toLowerCase();
        
        if ((event.key === this.UP_ARROW || key === this.W_KEY) && (this.snake.vy <= 0)){
            this.snake.changeDirection(0, -1);
        }
        else if ((event.key === this.DOWN_ARROW || key === this.S_KEY) && (this.snake.vy >= 0)){
            this.snake.changeDirection(0, 1);
        }
        else if ((event.key === this.LEFT_ARROW || key === this.A_KEY) && (this.snake.vx <= 0)){
            this.snake.changeDirection(-1, 0);
        }
        else if ((event.key === this.RIGHT_ARROW || key === this.D_KEY) && (this.snake.vx >= 0)){
            this.snake.changeDirection(1, 0);
        }
    }
}