// Refer structural elements
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

// Retrieve the nickname from local storage or set it to default
let nickname = window.localStorage.getItem('loggedin') || 'Unknown Hero'
let snakeScore = 0;

// Create the unit
const box = 24;

// Create the snake (snake array)
let snake = [];

// Place snake head position at the canvas center
snake[0] = {
    x: 12 * box,
    y: 12 * box
};


// Load audio resources
let deadSound = new Audio();
deadSound.src = "./assets/snakegame/sounds/dead.mp3";

let eatSound = new Audio();
eatSound.src = "./assets/snakegame/sounds/eat.mp3";

// Load image resources
const snakeImage = new Image();
snakeImage.src = "./assets/snakegame/field/snake.png";

const snakeHeadImage = new Image();
snakeHeadImage.src = "./assets/snakegame/field/snakehead.png";

const foodImage = new Image();
foodImage.src = "./assets/snakegame/field/food.png";

const groundImage = new Image();
groundImage.src = "./assets/snakegame/field/ground.jpg";


// Create and locate the food
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 18 + 3) * box
}


// Control the snake direction
let snakeDirection;

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 65 && snakeDirection != "RIGHT") {
        snakeDirection = "LEFT";

    } else if (key == 87 && snakeDirection != "DOWN") {
        snakeDirection = "UP";

    } else if (key == 68 && snakeDirection != "LEFT") {
        snakeDirection = "RIGHT";

    } else if (key == 83 && snakeDirection != "UP") {
        snakeDirection = "DOWN";

    }
}

// Check if the snake colided upon itself
function selfCollision(head, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            return true;
        }
    }
    return false;
}

function calculateSnakeScore() {
    snakeScore = Math.floor((snakeScore * 10) / 4);
}

function updateSnakeScoreList() {
    // Save current user score
    const currentNicknameScorePair = { name: nickname, score: snakeScore };

    // Check if current user score qualifies for the list of 10 top-players
    const scoreStatistics = JSON.parse(window.localStorage.getItem('snake-top-players')) || [];

    if (scoreStatistics.length >= 10) {
        for (let i = 0; i < scoreStatistics.length; i++) {
            if (score > scoreStatistics[i].score) {
                scoreStatistics[i] = currentNicknameScorePair;
                break;
            }
        }
    } else {
        scoreStatistics.push(currentNicknameScorePair);
    }

    // Sort the top-player list in descending order
    scoreStatistics.sort((a, b) => {
        const current = a.score
        const next = b.score

        let comparison = 0
        if (current > next) {
            comparison = -1
        } else if (current < next) {
            comparison = 1
        }
        return comparison
    })

    // Reset updated top-players list to the the local storage
    window.localStorage.setItem('snake-top-players', JSON.stringify(scoreStatistics))
}


// draw everything to the game
function draw() {

    context.drawImage(groundImage, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            context.drawImage(snakeHeadImage, snake[i].x, snake[i].y)
        } else {
            context.drawImage(snakeImage, snake[i].x, snake[i].y)
        }
    }

    context.drawImage(foodImage, food.x, food.y);

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (snakeDirection == "LEFT") snakeX -= box;
    if (snakeDirection == "UP") snakeY -= box;
    if (snakeDirection == "RIGHT") snakeX += box;
    if (snakeDirection == "DOWN") snakeY += box;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        snakeScore++;

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 18 + 3) * box
        }

        eatSound.play();

    } else {
        // remove the tail
        snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // game over
    gameOver = snakeX < 0 * box || snakeX > 23 * box || snakeY < 0 * box || snakeY > 23 * box || selfCollision(newHead, snake);
    if (gameOver) {
        clearInterval(game);
        deadSound.play();
        calculateSnakeScore();
        updateSnakeScoreList();
    }

    snake.unshift(newHead);

    context.fillStyle = "white";
    context.font = "45px Changa one";
    context.fillText(`🍎 ${snakeScore}`, 2 * box, 2 * box);
}

// call draw function every 200 ms
game = setInterval(draw, 100);