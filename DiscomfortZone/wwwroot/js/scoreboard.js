//Refernce game zones
const hangmanZone = document.querySelector("#hangmanZone")
const puzzleZone = document.querySelector("#puzzleZone")
const lightsoutZone = document.querySelector("#lightsoutZone")
const memorygameZone = document.querySelector("#memorygameZone")
const snakeZone = document.querySelector("#snakeZone")
const tictactoeZone = document.querySelector("#tictactoeZone")


// Retrieve top-player lists from the local storage
const retrievedTopListHangman = JSON.parse(window.localStorage.getItem('hangman-top-players')) || []
const retrievedTopListPuzzle = JSON.parse(window.localStorage.getItem('puzzle-top-players')) || []
const retrievedTopListLightsout = JSON.parse(window.localStorage.getItem('lightsout-top-players')) || []
const retrievedTopListMemorygame = JSON.parse(window.localStorage.getItem('memorygame-top-players')) || []
const retrievedTopListSnake = JSON.parse(window.localStorage.getItem('snake-top-players')) || []
const retrievedTopListTictactoe = JSON.parse(window.localStorage.getItem('tictactoe-top-players')) || []


const scoreInfo = [{ game: hangmanZone, scorelist: retrievedTopListHangman },
    { game: puzzleZone, scorelist: retrievedTopListPuzzle },
    { game: lightsoutZone, scorelist: retrievedTopListLightsout },
    { game: memorygameZone, scorelist: retrievedTopListMemorygame },
    { game: snakeZone, scorelist: retrievedTopListSnake },
    { game: tictactoeZone, scorelist: retrievedTopListTictactoe }]



// Create a structural template for a custom element 'score-table'
const scoreTableTemplate = document.createElement('template')

scoreTableTemplate.innerHTML =
`
<table id=score-table style="margin:auto;">
  <tr>
    <th>Player</th>
    <th>Score</th>
  </tr>
</table>
`

function displayScoreList() {
    
    // Compile a table
    hangmanZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTableHangman = hangmanZone.querySelector('#score-table')
    scoreTableHangman.id = 'hangman-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListHangman.length; i++) {
        scoreTableHangman.innerHTML += '<tr><td>' + retrievedTopListHangman[i].name + '</td><td>' + retrievedTopListHangman[i].score + '</td></tr>'
    }


    // Compile a table
    puzzleZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTablePuzzle = puzzleZone.querySelector('#score-table')
    scoreTablePuzzle.id = 'lightsout-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListPuzzle.length; i++) {
        scoreTablePuzzle.innerHTML += '<tr><td>' + retrievedTopListPuzzle[i].name + '</td><td>' + retrievedTopListPuzzle[i].score + '</td></tr>'
    }



    // Compile a table
    lightsoutZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTableLightsout = lightsoutZone.querySelector('#score-table')
    scoreTableLightsout.id = 'puzlle-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListLightsout.length; i++) {
        scoreTableLightsout.innerHTML += '<tr><td>' + retrievedTopListLightsout[i].name + '</td><td>' + retrievedTopListLightsout[i].score + '</td></tr>'
    }



    // Compile a table
    memorygameZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTableMemorygame = memorygameZone.querySelector('#score-table')
    scoreTableMemorygame.id = 'memorygame-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListMemorygame.length; i++) {
        scoreTableMemorygame.innerHTML += '<tr><td>' + retrievedTopListMemorygame[i].name + '</td><td>' + retrievedTopListMemorygame[i].score + '</td></tr>'
    }


    // Compile a table
    snakeZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTableSnake = snakeZone.querySelector('#score-table')
    scoreTableSnake.id = 'snake-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListSnake.length; i++) {
        scoreTableSnake.innerHTML += '<tr><td>' + retrievedTopListSnake[i].name + '</td><td>' + retrievedTopListSnake[i].score + '</td></tr>'
    }


    // Compile a table
    tictactoeZone.appendChild(scoreTableTemplate.content.cloneNode(true))
    const scoreTableTictactoe = tictactoeZone.querySelector('#score-table')
    scoreTableTictactoe.id = 'tictactoe-score-table'

    // Load top-players into a score-table
    for (let i = 0; i < retrievedTopListTictactoe.length; i++) {
        scoreTableTictactoe.innerHTML += '<tr><td>' + retrievedTopListTictactoe[i].name + '</td><td>' + retrievedTopListTictactoe[i].score + '</td></tr>'
    }    
}

displayScoreList();