class KeyboardControls {
    constructor(leftPaddle, rightPaddle, speed) {
        this.leftPaddle = leftPaddle;
        this.rightPaddle = rightPaddle;
        this.speed = speed;
        this.UP_ARROW = "ArrowUp";
        this.DOWN_ARROW = "ArrowDown";
        this.W_KEY = "w";
        this.S_KEY = "s";
        window.addEventListener("keydown",
            (event) => this.handleKeyDown(event));
        window.addEventListener("keyup",
            (event) => this.handleKeyUp(event));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case this.UP_ARROW:
                this.rightPaddle.moveUp(this.speed);
                break;
            case this.DOWN_ARROW:
                this.rightPaddle.moveDown(this.speed);
                break;
            case this.W_KEY:
            case this.W_KEY.toUpperCase():
                this.leftPaddle.moveUp(this.speed);
                break;
            case this.S_KEY:
            case this.S_KEY.toUpperCase():
                this.leftPaddle.moveDown(this.speed);
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case this.UP_ARROW:
            case this.DOWN_ARROW:
                this.rightPaddle.stop();
                break;
            case this.W_KEY:
            case this.W_KEY.toUpperCase():
            case this.S_KEY:
            case this.S_KEY.toUpperCase():
                this.leftPaddle.stop();
                break;
        }
    }

}