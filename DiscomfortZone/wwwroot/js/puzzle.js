// Define the set of images in array
var images = [
    { src: './assets/img/puzzleGame/11.jpg', title: 'Eiffel tower' },
    { src: './assets/img/puzzleGame/12.jpg', title: 'Pyramids' },
    { src: './assets/img/puzzleGame/13.jpg', title: 'Great Wall of China' },
    { src: './assets/img/puzzleGame/14.jpg', title: 'Leaning Tower of Pisa' },

];

//load audio
let info = new Audio();
info.src = "./assets/puzzleSounds/rules.mp3";

let win = new Audio();
win.src = "./assets/puzzleSounds/win.mp3";

let next = new Audio();
next.src = "./assets/puzzleSounds/next.wav";

let gameover = new Audio();
gameover.src = "./assets/puzzleSounds/gameover.mp3";


// Retrieve the nickname from local storage or set it to default
let nickname = window.localStorage.getItem('loggedin') || 'Unknown Hero';
let puzzlesAreSorted = false;
let score = 0;
let stepCount = 0;

//Create grid function
var gridSize = 5;
window.onload = function () {
    var grid = document.querySelector('#collage');
    imagePuzzle.startGame(images, gridSize);
};

// Create function to restart button
function restart() {
    var grid = document.querySelector('#collage');
    imagePuzzle.startGame(images, gridSize);
    next.play();
}

//Add alert and sound to rules button
function rulesButtons() {
    info.play();
    alert('Rearrange the image parts in a way that it correctly forms the picture. \nThe no. of steps taken will be counted.');

}


// Declare timer variable
var timerFunction = setTimeout(function () {
    clearInterval(imagePuzzle.tick);
    //gameover.play();
    helper.doc('actualImageBox').innerHTML = helper.doc('gameover').innerHTML;
    helper.doc('stepCount').textContent = stepCount;
    helper.doc('win').style.display = 'none';
}, 120000);

// Create The image puzzle
var imagePuzzle = {
    stepCount: 0,
    startTime: new Date().getTime(),
    startGame: function (images, gridSize) {
        this.setImage(images, gridSize);
        helper.doc('playPanel').style.display = 'block';
        helper.shuffle('sortable');
        this.startTime = new Date().getTime();
        this.tick();
    },
    tick: function () {
        var now = new Date().getTime();
        var elapsedTime = parseInt((now - imagePuzzle.startTime) / 1000, 10);
        helper.doc('timerPanel').textContent = elapsedTime;
        timerFunction = setTimeout(imagePuzzle.tick, 1000);

    },
    setImage: function (images, gridSize) {
        var percentage = 100 / (gridSize - 1 );
        var image = images[Math.floor(Math.random() * images.length)];
        helper.doc('imgTitle').innerHTML = image.title;
        helper.doc('actualImage').setAttribute('src', image.src);
        helper.doc('sortable').innerHTML = '';
        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';

           let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            li.style.backgroundImage = 'url(' + image.src + ')';
            li.style.backgroundSize = (gridSize * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            li.style.width = (400 / gridSize )  -1 + 'px';
            li.style.height = (400 / gridSize) - 25 + 'px';
            li.style.border = '0.1px solid white';

            li.setAttribute('draggable', 'true');
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;

                if (origin && dest && p) {
                    let temp = dest.nextSibling;
                    let x_diff = origin.offsetLeft - dest.offsetLeft;
                    let y_diff = origin.offsetTop - dest.offsetTop;

                    if (y_diff == 0 && x_diff > 0) {
                        //LEFT SWAP
                        p.insertBefore(origin, dest);
                        p.insertBefore(temp, origin);
                    }
                    else {
                        p.insertBefore(dest, origin);
                        p.insertBefore(origin, temp);
                    }


                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);
                    var now = new Date().getTime();
                    helper.doc('stepCount').textContent = ++stepCount;
                    document.querySelector('.timeCount').textContent = (parseInt((now - imagePuzzle.startTime) / 1000, 10));
                   
                    if (isSorted(vals)) {
                        puzzlesAreSorted = true;
                        win.play();
                        clearTimeout(timerFunction);
                        helper.calculateScore();
                        helper.updatePuzzleScorelist();
                        helper.doc('actualImageBox').innerHTML = helper.doc('win').innerHTML;
                        helper.doc('stepCount').textContent = stepCount;
                        helper.doc('gameover').style.display = 'none';
                    }
                    if (!isSorted && elapsedTime) {
                        //gameover.play();
                        clearTimeout(timerFunction);
                        helper.doc('actualImageBox').innerHTML = helper.doc('gameover').innerHTML;
                        helper.doc('stepCount').textContent = stepCount;
                        helper.doc('win').style.display = 'none';
                    }

                }
            };
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
        }
        helper.shuffle('sortable');
    }
};


// IF is sorted
isSorted = (arr) => arr.every((elem, index) => { return elem == index; });

var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),

 // Shuffle funtion
    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    },

    calculateScore: () => {
        score = 200 - (stepCount * 4);
        clearTimeout(timerFunction);
    },

    updatePuzzleScorelist: () => {
        // Save current user score
        const currentNicknameScorePair = { name: nickname, score: score };

        // Check if current user score qualifies for the list of 10 top-players
        const scoreStatistics = JSON.parse(window.localStorage.getItem('puzzle-top-players')) || [];

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
        window.localStorage.setItem('puzzle-top-players', JSON.stringify(scoreStatistics))
    }
}
