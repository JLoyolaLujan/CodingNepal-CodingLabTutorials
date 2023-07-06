const playBoard = document.querySelector(".play-board"); 
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls img");

let gameOver = false;
let foodX, foodY; 
let snakeX = 5, snakeY = 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0; 

//getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

/*inside of play-board we'll add a food element, a dot*/
const initGame = () => {

    if(gameOver) return handleGameOver();
    /*grid-area is a property that sets values for grid
    element's start and end lines for both the row and column*/
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // change the position of teh food when snake eats it
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food position to snake array;
        // console.log(snakeBody); // responds!
        score++; // increment score by one

        highScore = score >= highScore ? score : highScore; // set high score to score value if score is bigger
        localStorage.setItem("high-score", highScore); // storing high score to local storage with the high-score name
        scoreElement.innerText = `Score: ${score}`;
        //highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i = snakeBody.length - 1; i > 0; i--) {
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1]; 
    }

    snakeBody[0] = [snakeX, snakeY]; // setting first element of snake body to the current snake position
    
    // this will update the snake's head position based on the current velocity
    snakeX += velocityX; 
    snakeY += velocityY;

    // if snake colides into a wall then game over
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        // adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // game over if snake hits its own body
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    /*now we'll insert the food div in the play-board element*/ 
    playBoard.innerHTML = htmlMarkup;
}; 

// change direction of snake
const changeDirection = (e) => {
    // console.log(e); // it responds!
    // changing velocity value based on key pressed
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0; 
        velocityY = -1; 
    }
    else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0; 
        velocityY = 1; 
    }
    else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0; 
    }
    else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1; 
        velocityY = 0;
    }

    //initGame(); // to update
};

controls.forEach(key => {
    // passing changeDurection on each click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

/*let's change food position ramdomly*/

const changeFoodPosition = () => {
    // random value between 0 and 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125); // the snake will now move every 125 miliseconds

document.addEventListener("keydown", changeDirection);