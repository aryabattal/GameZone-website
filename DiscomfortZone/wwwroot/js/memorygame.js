// Reference the structural parts of 'memory-game' 
const gameSpace = document.querySelector('#gameSpace')
const board = document.querySelector('#board')
const statistics = document.querySelector('#statistics')
const totalTries = document.querySelector('#totalTries')
const totalTimer = document.querySelector('#totalTimer')

// Generate pictures id set 'behind the bricks'
let pictureSet = generatePictureSet(4, 4)

// Reference the proprevious, previous and current pictures
let propreviousPicture = 0
let previousPicture = 0
let currentPicture = 0

// The array of indexes whose pictures id matched
let matchedPairs = []

// The number of clicks (=tries) the user made to assemble the board & the derived score
let numberOfClicks = 0
let totalTime = 0
let currentTimer = ''
let score = 0

// Retrieve the nickname from local storage or set it to default
let nickname = window.localStorage.getItem('loggedin') || 'Unknown Hero'

displayBricks(4, 4)
setTimer()

function displayBricks(columns, rows) {
    for (let i = 0; i < columns * rows; i++) {
        // Display 16 bricks organized 4X4
        const image = document.createElement('img')
        image.setAttribute('src', './assets/memorygame/tiles/0.jpg')
        image.setAttribute('alt', `${i}`)
        image.setAttribute('tabindex', `${i + 1}`)
        image.style.height = '140px'

        board.appendChild(image)

        if ((i + 1) % 4 === 0) {
            board.appendChild(document.createElement('br'))
        }

        // Each brick listens for a click event
        image.addEventListener('click', e => {
            // Update number of clicks
            numberOfClicks++
            totalTries.textContent = `🔎: ${numberOfClicks}`

            // Locate image position (index) in an array
            const imagePosition = i

            // Update pictures status
            propropreviousPicture = propreviousPicture
            propreviousPicture = previousPicture
            previousPicture = currentPicture
            currentPicture = pictureSet[imagePosition]

            // Turn over the brick & Remove pointer events (to prevent double clicking)
            image.setAttribute('src', `./assets/memorygame/tiles/${currentPicture}.jpg`)
            image.style.pointerEvents = 'none'

            // Add sound effects
            const turnSound = new window.Audio('./assets/memorygame/sounds/turn.mp3')
            turnSound.volume = 0.1
            turnSound.play()

            // Check the current pair for matching
            checkForMatching()

            // If all pairs are matched, finish the game
            if (matchedPairs.length === 16) {
                finishTheGame()
            }
            e.preventDefault()
        })

        // Each brick listens for an enter keypress event (when focused with tab)
        image.addEventListener('keypress', e => {
            if (e.keyCode === 13) {
                // Update number of clicks
                numberOfClicks++

                // Locate image position (index) in an array
                const imagePosition = i

                // Update pictures status
                propropreviousPicture = propreviousPicture
                propreviousPicture = previousPicture
                previousPicture = currentPicture
                currentPicture = pictureSet[imagePosition]

                // Turn over the brick & Remove pointer events (to prevent double clicking)
                image.setAttribute('src', `./assets/memorygame/tiles/${currentPicture}.jpg`)
                image.style.pointerEvents = 'none'

                // Add sound effects
                const turnSound = new window.Audio('./assets/memorygame/sounds/turn.mp3')
                turnSound.volume = 0.1
                turnSound.play()

                // Check the current pair for matching
                checkForMatching()

                // If all pairs are matched, finish the game
                if (matchedPairs.length === 16) {
                    finishTheGame()
                }

                e.preventDefault()
            }
        })
    }
}

function generatePictureSet(columns, rows) {

    const pictureArray = []

    // Generate an array of pictures id
    for (let i = 1; i <= (columns * rows) / 2; i++) {
        pictureArray.push(i)
        pictureArray.push(i)
    }

    // Shuffle an array of pictures id
    for (let i = 0; i < pictureArray.length - 1; i++) {
        const randomIndex1 = Math.floor(Math.random() * pictureArray.length)
        const randomIndex2 = Math.floor(Math.random() * pictureArray.length)

        const pictureToShuffle = pictureArray[randomIndex1]
        pictureArray[randomIndex1] = pictureArray[randomIndex2]
        pictureArray[randomIndex2] = pictureToShuffle
    }

    return pictureArray
}

function setTimer() {
    // Start the timer
    currentTimer = setInterval(() => {
        // Display total seconds
        totalTime++
        totalTimer.textContent = `⏱: ${totalTime}`
    }, 1000)
}

function checkForMatching() {
    if (currentPicture === previousPicture) {
        registerMatch(currentPicture, previousPicture)
    }
    hidePicture(propropreviousPicture)
    hidePicture(propreviousPicture)
}


function registerMatch(firstMatch, secondMatch) {
    const index1 = pictureSet.indexOf(firstMatch)
    const index2 = pictureSet.lastIndexOf(secondMatch)

    if (!matchedPairs.includes(index1)) {
        matchedPairs.push(index1)
    }

    if (!matchedPairs.includes(index2)) {
        matchedPairs.push(index2)
    }

    // Add sound effects
    const sound = new window.Audio('./assets/memorygame/sounds/turn.mp3')
    sound.volume = 0.1
    sound.play()
}


// Hides unmatched pictures & Activates pointer events for them
function hidePicture(picture) {
    const imagePosition = pictureSet.indexOf(picture)
    const imagePosition2 = pictureSet.lastIndexOf(picture)

    // Check if the pictures are not registered as a matched pair
    let reservedMatch = false

    for (let i = 0; i < matchedPairs.length; i++) {
        if (matchedPairs[i] === imagePosition || matchedPairs[i] === imagePosition2) {
            reservedMatch = true
        }
    }

    if (imagePosition !== -1 && !reservedMatch) {
        // Turn back the pictures and reactivate their pointer events
        board.querySelectorAll('img')[imagePosition].setAttribute('src', './assets/memorygame/tiles/0.jpg')
        board.querySelectorAll('img')[imagePosition].style.pointerEvents = 'auto'

        board.querySelectorAll('img')[imagePosition2].setAttribute('src', './assets/memorygame/tiles/0.jpg')
        board.querySelectorAll('img')[imagePosition2].style.pointerEvents = 'auto'
    }
}

// Finishes the game gracefully
// Calculates and outputs score
function finishTheGame() {
    // Disable pointer events for the game board
    //board.style.pointerEvents = 'none'

    // Clear interval
    clearInterval(currentTimer)

    // Clear space for further score information
    statistics.remove()

    if (gameSpace.querySelectorAll('div').length > 1) {
        return
    }

    // Announce the end of the game
    const gameIsOverAnnouncement = document.createElement('div')
    gameIsOverAnnouncement.textContent = 'Pairs were matched!'
    gameIsOverAnnouncement.style.marginTop = '5px'
    gameIsOverAnnouncement.style.marginBottom = '2px'
    gameIsOverAnnouncement.style.marginLeft = '30%'
    gameIsOverAnnouncement.style.marginRight = '30%'
    board.appendChild(gameIsOverAnnouncement)

    // Calculate & Output score
    calculateScore()
    updateMemoryGameScoreList()

    const scoreAnnouncement = document.createElement('div')
    scoreAnnouncement.textContent = `Your score is ${score}`
    scoreAnnouncement.style.marginBottom = '2px'
    scoreAnnouncement.style.marginLeft = '33%'
    scoreAnnouncement.style.marginRight = '33%'
    board.appendChild(scoreAnnouncement)
}


// Calculates score based on the number of clicks used during the game
function calculateScore() {
    score = Math.floor(32 / numberOfClicks * 100)
}

function updateMemoryGameScoreList() {
    // Save current user score
    const currentNicknameScorePair = { name: nickname, score: score };

    // Check if current user score qualifies for the list of 10 top-players
    const scoreStatistics = JSON.parse(window.localStorage.getItem('memorygame-top-players')) || [];

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
    window.localStorage.setItem('memorygame-top-players', JSON.stringify(scoreStatistics))
}

function restartTheGame() {
    // Clear current statistical information
    clearInterval(currentTimer)
    matchedPairs = []
    totalTime = 0
    numberOfClicks = 0

    // Clear the content block
    board.innerHTML = ''

    // Re-append the board & statistical block
    board.style.pointerEvents = 'auto'

    // Generate a new pictures id set 'behind the bricks'
    pictureSet = generatePictureSet(4, 4)

    // Repopulate the board & Reset the timer
    displayBricks(4, 4)
    board.appendChild(statistics)
    setTimer()

    // Reset statistics
    totalTimer.textContent = `⏱: ${totalTime}`
    totalTries.textContent = `🔎 : ${numberOfClicks}`
}



