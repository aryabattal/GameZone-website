var Xturn = true; //true means X turn
var circles = [];

// Retrieve the nickname from local storage or set it to default
let nickname = window.localStorage.getItem('loggedin') || 'Unknown Hero';
let score = "lost";

// Load audio resources (winning sound) 
let win = new Audio();
win.src = "./assets/tictactoe/sounds/winning.mp3";


/***************************************************************/
function reset(A, B, C) {
    document.getElementById('circle' + A).style.color = "green";
    document.getElementById('circle' + B).style.color = "green";
    document.getElementById('circle' + C).style.color = "green";

    setTimeout(function () { location.reload() }, 3000);
}

//checkPotentialWinner
function checkPotentialWinner() {
    for (var i = 1; i <= 9; i++) {
        circles[i] = document.getElementById('circle' + i).innerHTML;
    }

    let nextId = 0;

    // check horizontal
    if (circles[1] == circles[2] && circles[1] != "" && circles[3] == "") nextId = 3;
    if (circles[1] == circles[3] && circles[1] != "" && circles[2] == "") nextId = 2;
    if (circles[2] == circles[3] && circles[2] != "" && circles[1] == "") nextId = 1;

    if (circles[4] == circles[5] && circles[4] != "" && circles[6] == "") nextId = 6;
    if (circles[4] == circles[6] && circles[4] != "" && circles[5] == "") nextId = 5;
    if (circles[5] == circles[6] && circles[5] != "" && circles[4] == "") nextId = 4;
    
    if (circles[7] == circles[8] && circles[7] != "" && circles[9] == "") nextId = 9;
    if (circles[7] == circles[9] && circles[7] != "" && circles[8] == "") nextId = 8;
    if (circles[8] == circles[9] && circles[8] != "" && circles[7] == "") nextId = 7;
    

    //check vertical
    if (circles[1] == circles[4] && circles[1] != "" && circles[7] == "") nextId = 7;
    if (circles[1] == circles[7] && circles[1] != "" && circles[4] == "") nextId = 4;
    if (circles[4] == circles[7] && circles[4] != "" && circles[1] == "") nextId = 1;

    if (circles[2] == circles[5] && circles[2] != "" && circles[8] == "") nextId = 8;
    if (circles[2] == circles[8] && circles[2] != "" && circles[5] == "") nextId = 5;
    if (circles[5] == circles[8] && circles[5] != "" && circles[2] == "") nextId = 2;

    if (circles[3] == circles[6] && circles[3] != "" && circles[9] == "") nextId = 9;
    if (circles[3] == circles[9] && circles[3] != "" && circles[6] == "") nextId = 6;
    if (circles[6] == circles[9] && circles[6] != "" && circles[3] == "") nextId = 3;
    
    //check diagonal
    if (circles[1] == circles[5] && circles[1] != "" && circles[9] == "") nextId = 9;
    if (circles[1] == circles[9] && circles[1] != "" && circles[5] == "") nextId = 5;
    if (circles[5] == circles[9] && circles[5] != "" && circles[1] == "") nextId = 1;

    if (circles[3] == circles[5] && circles[3] != "" && circles[7] == "") nextId = 7;
    if (circles[3] == circles[7] && circles[3] != "" && circles[5] == "") nextId = 5;
    if (circles[5] == circles[7] && circles[5] != "" && circles[3] == "") nextId = 3;

    return nextId;
}


//checkWinner
function checkWinner() {
    for (var i = 1; i <= 9; i++) {
        circles[i] = document.getElementById('circle' + i).innerHTML;
    }

    let weHaveAWinner = false;

    /***************************************************************/
    // check horizontal
    if (circles[1] == circles[2] && circles[2] == circles[3] && circles[1] != "") {
        win.play();
        reset(1, 2, 3);
        weHaveAWinner = true;
    }
    if (circles[4] == circles[5] && circles[5] == circles[6] && circles[4] != "") {
        win.play();
        reset(4, 5, 6);
        weHaveAWinner = true;
    }
    if (circles[7] == circles[8] && circles[8] == circles[9] && circles[7] != "") {
        win.play();
        reset(7, 8, 9);
        weHaveAWinner = true;
    }

    //check vertical
    if (circles[1] == circles[4] && circles[4] == circles[7] && circles[1] != "") {
        win.play();
        reset(1, 4, 7);
        weHaveAWinner = true;
    }
    if (circles[2] == circles[5] && circles[5] == circles[8] && circles[2] != "") {
        win.play();
        reset(2, 5, 8);
        weHaveAWinner = true;
    }
    if (circles[3] == circles[6] && circles[6] == circles[9] && circles[3] != "") {
        win.play();
        reset(3, 6, 9);
        weHaveAWinner = true;
    }

    //check diagonal
    if (circles[1] == circles[5] && circles[5] == circles[9] && circles[1] != "") {
        win.play();
        reset(1, 5, 9);
        weHaveAWinner = true;
    }
    if (circles[3] == circles[5] && circles[5] == circles[7] && circles[3] != "") {
        win.play();
        reset(3, 5, 7);
        weHaveAWinner = true;
    }

    //check if it is a tie
    if (circles.indexOf("") == -1) {
        win.play();
        reset(1, 2, 3);
        reset(4, 5, 6);
        reset(7, 8, 9);
        weHaveAWinner = true;
        score = "tie"
    }

    return weHaveAWinner;
}


function insert(id) {

    var insertValue = document.getElementById(id);

    if (insertValue.innerHTML == "") {

        insertValue.innerHTML = "X";
        if (checkWinner()) {
            score = score === "tie" ? "tie" : "win";
            updateTicTacToeScoreList();
            return;
        }
            

        let nextId = checkPotentialWinner();

        if (nextId != 0) {
            insertValue = document.getElementById('circle' + nextId);
            insertValue.innerHTML = "O";
            if (checkWinner()) {
                updateTicTacToeScoreList();
                return;
            }
        }

        else if (nextId == 0) {
            nextId = Math.floor(Math.random() * 10) + 1;
            insertValue = document.getElementById('circle' + nextId);
            let placeIsVacant = insertValue.innerHTML == "" && nextId != id;

            while (!placeIsVacant) {
                nextId = Math.floor(Math.random() * 10) + 1;
                insertValue = document.getElementById('circle' + nextId);
                placeIsVacant = insertValue.innerHTML == "";
            }

            insertValue.innerHTML = "O";
            if (checkWinner()) {
                updateTicTacToeScoreList();
                return;
            }
        }
    }
}

function updateTicTacToeScoreList() {
    // Save current user score
    const currentNicknameScorePair = { name: nickname, score: score };
    const scoreStatistics = JSON.parse(window.localStorage.getItem('tictactoe-top-players')) || [];
    scoreStatistics.push(currentNicknameScorePair);

    // Reset updated top-players list to the the local storage
    window.localStorage.setItem('tictactoe-top-players', JSON.stringify(scoreStatistics))
}
