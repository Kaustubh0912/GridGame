document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    const progressBar = document.getElementById('progressBar');
    const startBtn = document.getElementById('start');
    const gridSize = 20;
    let numbers = Array.from({ length: gridSize }, (_, i) => i + 1);
    let currentNumber = 1;
    let timeleft = 60;
    let shuffleFactor = 2; // Define the time factor here (default is 2)
    let timer;
    let correctlyClickedNumbers = new Set(); // Keep track of correctly clicked numbers
    let lastWrongClick = null; // Keep track of the last wrong click
    const penaltyPercentage = 5; // Penalty percentage for wrong clicks

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createGrid() {
        grid.innerHTML = '';
        shuffle(numbers);

        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = number;
            if (correctlyClickedNumbers.has(number)) {
                cell.style.backgroundColor = 'rgba(15,15,15,0.35)';
                cell.style.color = 'green';
            } else if (number === lastWrongClick) {
                cell.style.color = 'red';
            }
            cell.addEventListener('click', handleCellClick);
            grid.appendChild(cell);
        });
    }

    function handleCellClick(event) {
        const clickedNumber = parseInt(event.target.textContent);
        
        // Reset the color of the last wrong click
        if (lastWrongClick !== null) {
            const lastWrongCell = Array.from(grid.children).find(cell => parseInt(cell.textContent) === lastWrongClick);
            if (lastWrongCell) {
                lastWrongCell.style.color = '';
            }
            lastWrongClick = null;
        }

        if (clickedNumber === currentNumber) {
            event.target.style.backgroundColor = 'rgba(15,15,15,0.35)';
            event.target.style.color = 'green';
            correctlyClickedNumbers.add(clickedNumber);
            currentNumber++;
            checkWinCondition();
        } else {
            event.target.style.color = 'red';
            lastWrongClick = clickedNumber;
            applyTimePenalty();
        }
    }

    function applyTimePenalty() {
        const penaltyTime = Math.floor((timeleft * penaltyPercentage) / 100);
        timeleft = Math.max(0, timeleft - penaltyTime); // Ensure timeleft doesn't go below 0
        updateProgressBar();
        if (timeleft <= 0) {
            clearInterval(timer);
            alert("TIME'S UP! YOU LOSE");
        }
    }

    function checkWinCondition() {
        if (currentNumber > gridSize) {
            clearInterval(timer);
            alert("YOU WIN!");
        }
    }

    function updateProgressBar() {
        const progressPercentage = (timeleft / (60 * shuffleFactor)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function startGame() {
        currentNumber = 1;
        timeleft = 60 * shuffleFactor; // Adjust initial timeleft based on time factor
        correctlyClickedNumbers.clear();
        lastWrongClick = null;
        createGrid();
        updateProgressBar();
        timer = setInterval(() => {
            timeleft--;
            updateProgressBar();
            if (timeleft <= 0) {
                clearInterval(timer);
                alert("TIME'S UP! YOU LOSE");
            } else {
                createGrid();
            }
        }, 1000 / shuffleFactor); // Adjust interval based on time factor
    }

    startBtn.addEventListener('click', () => {
        clearInterval(timer); // Clear any existing timer
        startGame();
    });
});