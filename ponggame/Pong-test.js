function runPongTests() {
    console.log("Running Pong Game Tests");
    testBallMove();
    testBallWallBounce();
    testBallPastLeftWall()
    testBallPastRightWall()

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

runPongTests();