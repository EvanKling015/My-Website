function runPongTests() {
    console.log("Running Pong Game Tests");
    testBallMove();
    testBallWallBounce();
    testBallPastLeftWall();
    testBallPastRightWall();
    testPaddleMoveDown();
    testPaddleMoveUp();
    testPaddleStop();
    testPaddleReset();
    testBallLeftPaddleBounce();
    testBallRightPaddleBounce();

    console.log("All Pong Game Tests Passed!");
}

function testBallMove() {
    const ball = new Ball(50, 50, 5, 5, 10, "red");
    ball.move();
    console.assert(ball.x === 55 && ball.y ===55, "Ball did not move as expected");
}

function testBallWallBounce() {
    const ball = new Ball(50, 10, 0, -5, 10, "red");
    ball.bounceOffTopAndBottom(100);
    console.assert(ball.vy === 5, "Ball did not bouce off the top wall");
}

function testBallPastLeftWall() {
    const ball = new Ball(5, 50, -5, 0, 10, "red");
    console.assert(ball.isPastLeftWall() === true, "Ball should be past left wall");
}

function testBallPastRightWall() {
    const ball = new Ball(495, 50, 5, 0, 10, "red");
    console.assert(ball.isPastRightWall(500) === true, "Ball should be past right wall");
}

function testPaddleMoveDown() {
    const paddle = new Paddle(10, 10, 10, 100, "blue", 400);
    paddle.moveDown(5);
    paddle.move();
    console.assert(paddle.y === 15, "Paddle didn't move down as expected");
}

function testPaddleMoveUp() {
    const paddle = new Paddle(10, 10, 10, 100, "blue", 400);
    paddle.moveUp(5);
    paddle.move();
    console.assert(paddle.y === 5, "Paddle didn't move up as expected");
}

function testPaddleStop() {
    const paddle = new Paddle(10, 10, 10, 100, "blue", 400);
    paddle.moveDown(5);
    paddle.move();
    paddle.stop();
    paddle.move();
    console.assert(paddle.y === 15, "Paddle didn't stop as expected");
}

function testPaddleReset() {
    const paddle = new Paddle(10, 10, 10, 100, "blue", 400);
    paddle.reset(20);
    console.assert(paddle.y === 20, "Paddle didn't reset to the correct y pos");
    console.assert(paddle.vy === 0, "Paddle vertical velocity didn't reset to 0");
}

function testBallLeftPaddleBounce() {
    const ball = new Ball(15, 50, -5, 0, 10, "red");
    const paddle = new Paddle(10, 40, 10, 100, "blue", 400);
    const bounced = ball.bounceOffLeftPaddle(paddle);
    console.assert(bounced === true, "Ball should have bounced off the paddle");
    console.assert(ball.vx === 5, "Ball velocity didn't change as expected");
}

function testBallRightPaddleBounce() {
    const ball = new Ball(485, 50, 5, 0, 10, "red");
    const paddle = new Paddle(490, 40, 10, 100, "blue", 400);
    const bounced = ball.bounceOffRightPaddle(paddle);
    console.assert(bounced === true, "Ball should have bounced off right paddle");
    console.assert(ball.vx === -5, "Ball velocity didn't change as expected after right paddle");
}

runPongTests();