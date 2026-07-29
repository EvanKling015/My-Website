class SnakeControls{
    constructor(snake){
        this.snake = snake;
        this.UP_ARROW = 'ArrowUp';
        this.DOWN_ARROW = 'ArrowDown';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';

        window.addEventListener("keydown", (event) => {
            if ([this.UP_ARROW, this.DOWN_ARROW, this.LEFT_ARROW, this.RIGHT_ARROW].includes(event.key)){
                event.preventDefault();
            }
            this.keyDown(event);
        });
    }

    keyDown(event){
        if (event.key === this.UP_ARROW && this.snake.vy !== 1){
            this.snake.changeDirection(0, -1);
        }
        else if (event.key === this.DOWN_ARROW && this.snake.vy !== -1){
            this.snake.changeDirection(0, 1);
        }
        else if (event.key === this.LEFT_ARROW && this.snake.vx !== 1){
            this.snake.changeDirection(-1, 0);
        }
        else if (event.key === this.RIGHT_ARROW && this.snake.vx !== -1){
            this.snake.changeDirection(1, 0);
        }
    }
}