class SnakeControls{
    constructor(snake){
        this.snake = snake;
        this.UP_ARROW = 'ArrowUp';
        this.DOWN_ARROW = 'ArrowDown';
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.DIRECTION_MAP = {
            [this.UP_ARROW]: [0, -1],
            w: [0, -1],
            W: [0, -1],
            [this.DOWN_ARROW]: [0, 1],
            s: [0, 1],
            S: [0, 1],
            [this.LEFT_ARROW]: [-1, 0],
            a: [-1, 0],
            A: [-1, 0],
            [this.RIGHT_ARROW]: [1, 0],
            d: [1, 0],
            D: [1, 0]
        };

        window.addEventListener("keydown", (event) => {
            const key = event.key;
            const direction = this.DIRECTION_MAP[key];
            if (direction) {
                event.preventDefault();
                this.setDirection(direction[0], direction[1]);
            }
        });
    }

    setDirection(vx, vy){
        const isOpposite =
            (this.snake.vx !== 0 || this.snake.vy !== 0) &&
            this.snake.vx === -vx &&
            this.snake.vy === -vy;

        if (isOpposite) return;

        this.snake.changeDirection(vx, vy);
    }
}