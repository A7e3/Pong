/*Add constants for the ball both players the score constant text variables so we can update the score display in different
functions*/
var ball; //self explanatory
var dxy = [6, 6]; //Ball array for speed dx and dy
var player1; //The actual paddle for player 1
var player2; //The actual paddle for player 2
var playerScore = [0, 0]; //both of players score stored in this array
var player1Score_Text;
var player2Score_Text; 
// avamode aka AIvsAI mode it just makes the normal player controls not work and plays virtually the same player2 AI.
var avamode = false;

//Constants for sounds that play when you score hit wall or hit the ball, etc..
var PADDLE = new Audio("https://nerpx.github.io/pong-sound/Paddle.wav");
var WALL = new Audio("https://nerpx.github.io/pong-sound/Wall.wav");
var POINT = new Audio("https://nerpx.github.io/pong-sound/Point.wav");

function start(){
    //creates a alert that asks the user if they want to use AIvsAI or
    //actually play the game
    avamode = readBoolean("AvA?");
    
    var background = new Rectangle(getWidth(), getHeight());
    add(background);
    ball = new Rectangle(10, 10);
    ball.setPosition(getWidth() / 2, getHeight() / 2);
    ball.setColor(Color.white);
    add(ball);

    //add Score for the left side or player1
    player1Score_Text = new Text("0", "30pt Courier New");
    player1Score_Text.setPosition(100, 50);
    player1Score_Text.setColor(Color.white);
    player1Score_Text.setText(playerScore[0].toString());
    add(player1Score_Text);

    // Create dots for the dotted line divider
    for (var y = 0; y < getHeight(); y += 20) {
        var dot = new Rectangle(2, 10);
        dot.setPosition(getWidth() / 2, y);
        dot.setColor(Color.white);
        add(dot);
    }

    //add Score for the right side or player2
    player2Score_Text = new Text("0", "30pt Courier New");
    player2Score_Text.setPosition(getWidth() - 100, 50);
    player2Score_Text.setColor(Color.white);
    player2Score_Text.setText(playerScore[1].toString());
    add(player2Score_Text);

    player1 = new Rectangle(10, 30);
    player1.setPosition(10, 150);
    player1.setColor(Color.white);
    add(player1);

    player2 = new Rectangle(10, 30);
    player2.setPosition(getWidth() - 20, 150);
    player2.setColor(Color.white);
    add(player2);
    
    mouseMoveMethod(handle);
    // Start timer for ball and draws movement for player2
    // if AVA mode is enabled it also does player1 too.
    setTimer(draw, 0);
    //was gonna add a up speed function but it caused some issues

    setTimer(upSpeed, 15000);
}

function handle(e){
    if (!avamode)
    {
        player1.setPosition(10, e.getY() - player1.getHeight() /2);
    }
}

function upSpeed()
{
    if (dxy[0] > 0) {
        dxy[0] += 1;
    } else {
        dxy[0] -= 1;
    }
    if (dxy[1] > 0) {
        dxy[1] += 1;
    } else {
        dxy[1] -= 1;
    }
}

function reset(){
    dxy[0] = 6;
    dxy[1] = 6;
    player1Score_Text.setText(playerScore[0].toString()); //updates Scores for both players
    player2Score_Text.setText(playerScore[1].toString()); //updates Scores for both players
    stopTimer(draw); //Stop the ball moving so the players have time to react after the other player scores.
    setTimeout(function () { //Timeout functon provided by ChatGPT to add a delay so players can react to other player scoring
        ball.setPosition(getWidth() / 2, getHeight() / 2);
        setTimer(draw, 0);
    }, 2000);
}

function draw(){
    //Checks walls for ball
    checkWalls();
    //Moves the pong ball using the DX and DY constants made into constants so we can edit them later
    ball.move(dxy[0], dxy[1]);
    //function for player2 AI always plays no if statement needed
    handleRightPaddle();
    //Check the constant boolean avamode to check if the user wanted to play or the AI to play
    if (avamode)
    {
        handleLeftPaddle();
    }
}

//#START of AI's 
// if you want a explaination of how this works see line 14.
function handleLeftPaddle(){
    if (dxy[0] < 0){
        if (player1.getY() < ball.getY()){
            player1.move(0, 9);
        } else {
            player1.move(0, -9);
        }
    }
}

function handleRightPaddle(){
    if (dxy[0] > 0) {
        if (player2.getY() < ball.getY()) {
            player2.move(0, 9);
        } else {
            player2.move(0, -9);
        }
    }
}
//#END of AI's 

function checkWalls(){
    // Bounce off right paddle
    if (
        ball.getX() < player2.getX() + player2.getWidth() &&
        ball.getX() + ball.getWidth() > player2.getX() &&
        ball.getY() + ball.getHeight() > player2.getY() &&
        ball.getY() < player2.getY() + player2.getHeight()
    ) {
    dxy[0] = -dxy[0];
    //Plays Blip sound in real pong these are stored as constants
    //so we can play them from all these functions :)
    PADDLE.play();
}

    // count score for right wall
    if(ball.getX() + ball.getWidth() > getWidth()){
        POINT.play();
        playerScore[0] += 1;
        reset();
    }
    
    // Bounce off left paddle
    if (
        ball.getX() + ball.getWidth() > player1.getX() &&
        ball.getX() < player1.getX() + player1.getWidth() &&
        ball.getY() + ball.getHeight() > player1.getY() &&
        ball.getY() < player1.getY() + player1.getHeight()
    ){
    dxy[0] = -dxy[0];
    PADDLE.play();
}

    // count score for left wall
    if(ball.getX() + ball.getWidth() < 0) {
        POINT.play();
        playerScore[1] += 1;
        reset();
    }
    
    // Bounce off bottom wall
    if(ball.getY() + ball.getWidth() > getHeight()){
        dxy[1] = -dxy[1];
        WALL.play();
    }

    //Fix issue with Clipping
    //explained: Basically sometimes if the ball gets to fast it just
    //ignores the collison detection system so this would reset the ball.
    //No longer needed because ball does not have the incrementing addedX and addedY that was going to be added.
    // if (ball.getY() > getHeight() || ball.getY() < 0)
    // {
    //     reset();
    // }
    
    // Bounce off top wall
    if(ball.getY() - ball.getWidth() < 0){
        dxy[1] = -dxy[1];
        WALL.play();
    }
}
