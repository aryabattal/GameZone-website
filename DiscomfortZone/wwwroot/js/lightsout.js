class App {
    // Initializes the instance of the class App
    // parameter "element" points at html element to be used as a container for an App object
    // parameter "size" points at partitioning of puzzles within App container
    constructor(element, size) {

        // Initiate game grid within App container upon App instantiation
        this.grid = this.initiateGrid();
        this.setTimer();

        // Retrieve and assign size property(rows x columns) based on respective parameter passed through constructor
        this.size = size;
        // Retrieve and assign element property based on respective parameter passed through constructor
        this.element = element;

        // Attach flip event on mouse click to the current App instantiation
        this.flip = this.flip.bind(this);
        this.element.addEventListener('click', this.flip);

        // Decalre variable for checking if the game is won
        this.winner = false;

        // Reference html elements for keeping statistics
        this.statistics = document.querySelector('#statistics');
        this.statisticDataHolder = document.querySelector('#statistic-data-holder');

        this.totalTries = document.querySelector('#totalTries');
        this.numberOfClicks = 0;

        this.totalTimer = document.querySelector('#totalTimer');
        this.totalTime = 0;
        this.currentTimer = '';

        // Retrieve the nickname from local storage or set it to default
        this.nickname = window.localStorage.getItem('loggedin') || 'Unknown Hero'
        this.score = 0;



        // Populate App container with div elements according to partitioning set as size property
        for (let rows = 0; rows < size; rows++) {
            for (let columns = 0; columns < size; columns++) {
                // Create div element
                let div = document.createElement('div');

                // Set div size (250 is the width and height of the container)
                div.style.width = (500 / size) + 'px';
                div.style.height = (500 / size) + 'px';

                // Specify div location
                div.dataset.location = JSON.stringify({ rows, columns });

                // Append newly created div
                element.appendChild(div);
            }
        }
    }

    // Renders flipped puzzles of the game grid
    render(rows, columns, delay) {
        // Locate puzzle div
        let div = this.element.children[rows * this.size + columns];
        // Set class name 
        div.className = this.grid[rows][columns] ? ('flip' + (delay ? ' flip-delay' : '')) : '';
    }

    // Initiates game Grid with 5 columns and 5 rows
    initiateGrid() {
        // Define grid variable as an array with 5 elements (=> five rows)
        const grid = Array(5);
        // Set 5 columns in each of 5 rows (all initially set to false)
        for (let i = 0; i < grid.length; i++) {
            grid[i] = [false, false, false, false, false];
        }
        return grid;
    }

    // Flip logic (contextual) (fires on mouse click)
    flip(event) {
        // Define location for flip (as JSON)
        const locationJSON = event.target.dataset.location;
        if (!locationJSON) {
            return;
        }

        // Update click counter
        this.numberOfClicks++;
        totalTries.textContent = `🔎: ${this.numberOfClicks}`;

        // Add sound effects
        const turnSound = new window.Audio('./assets/memorygame/sounds/turn.mp3')
        turnSound.volume = 0.1
        turnSound.play()

        // Parse locationJSON 
        const location = JSON.parse(locationJSON);

        // Localize rows and columns
        const locationRows = location.rows;
        const locationColumns = location.columns;

        // Flip localized puzzle
        this.grid[locationRows][locationColumns] = !this.grid[locationRows][locationColumns];

        // Render localized puzzles without delay
        this.render(locationRows, locationColumns, false);

        // Declare directions to "grab" the current puzzle
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        // "Grab" and render neighboring puzzles
        for (let direction of directions) {

            let neighboringRow = locationRows + direction[0];
            let neighboringColumn = locationColumns + direction[1];

            // Check if neighboring puzzles are within the game grid
            if (neighboringRow >= 0 && neighboringRow < this.size && neighboringColumn >= 0 && neighboringColumn < this.size) {

                // Flip localized neighboring puzzle
                this.grid[neighboringRow][neighboringColumn] = !this.grid[neighboringRow][neighboringColumn];

                // Render neighbouring puzzle with delay
                this.render(neighboringRow, neighboringColumn, true);

                if (this.gameIsWon() == true) {
                    this.calculateScore();
                    this.updateLightsoutScoreList();

                    // Clear space for further score information
                    this.statisticDataHolder.remove();

                    // Announce the end of the game
                    const gameIsOverAnnouncement = document.createElement('div')
                    gameIsOverAnnouncement.textContent = 'Lights are out!'
                    gameIsOverAnnouncement.style.fontSize = '15px'
                    gameIsOverAnnouncement.style.marginTop = '5px'
                    gameIsOverAnnouncement.style.marginBottom = '2px'
                    gameIsOverAnnouncement.style.marginLeft = '30%'
                    gameIsOverAnnouncement.style.marginRight = '30%'
                    this.statistics.appendChild(gameIsOverAnnouncement)

                    // Output score
                    const scoreAnnouncement = document.createElement('div')
                    scoreAnnouncement.textContent = `Your score is ${this.score}`
                    scoreAnnouncement.style.fontSize = '15px'
                    scoreAnnouncement.style.marginBottom = '2px'
                    scoreAnnouncement.style.marginLeft = '33%'
                    scoreAnnouncement.style.marginRight = '33%'
                    this.statistics.appendChild(scoreAnnouncement)
                }
            }
        }
    }

    setTimer() {
        // Start the timer
        this.currentTimer = setInterval(() => {
            // Display total seconds
            this.totalTime++
            this.totalTimer.textContent = `⏱: ${this.totalTime}`
        }, 1000)
    }

    gameIsWon() {
        // Define grid variable as an array with 5 elements (=> five rows)
        const grid = Array(5);
        // Check 5 columns in each of 5 rows (if each puzzle is flipped out)
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if (this.grid[i][j] !== true) {
                    return false;
                }
            }
        }
        return true;
    }

    // Calculates score based on the number of clicks used during the game
    calculateScore() {
        this.score = Math.floor(50 / this.numberOfClicks * 100)
    }

    updateLightsoutScoreList() {
        // Save current user score
        const currentNicknameScorePair = { name: this.nickname, score: this.score };

        // Check if current user score qualifies for the list of 10 top-players
        const scoreStatistics = JSON.parse(window.localStorage.getItem('lightsout-top-players')) || [];

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
        window.localStorage.setItem('lightsout-top-players', JSON.stringify(scoreStatistics))
    }
}

new App(document.querySelector('#container'), 5);