document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    const progressBar = document.getElementById('progressBar');
    const startBtn = document.getElementById('start');
    const gridSize = 20;
    let numbers = Array.from({ length: gridSize }, (_, i) => i + 1);
    let currentNumber = 1;
    let timeleft = 60;
    let shuffleFactor =10; // Define the time factor here (default is 1)
    let timer;
    let frozenNumbers = new Map(); // Use a Map to keep track of frozen numbers and their positions

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createGrid() {
        grid.innerHTML = '';
        const numbersToShuffle = numbers.filter(number => !frozenNumbers.has(number));
        shuffle(numbersToShuffle);
        
        let allNumbers = new Array(gridSize);
        frozenNumbers.forEach((value, key) => {
            allNumbers[value] = key; // Place frozen numbers at their positions
        });
        
        numbersToShuffle.forEach(number => {
            for (let i = 0; i < gridSize; i++) {
                if (allNumbers[i] === undefined) {
                    allNumbers[i] = number;
                    break;
                }
            }
        });

        allNumbers.forEach((number, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = number;
            if (frozenNumbers.has(number)) {
                cell.style.backgroundColor = 'rgba(15,15,15,0.35)';
            } else {
                cell.addEventListener('click', handleCellClick);
            }
            grid.appendChild(cell);
        });
    }

    function handleCellClick(event) {
        const clickedNumber = parseInt(event.target.textContent);
        if (clickedNumber === currentNumber) {
            event.target.style.backgroundColor = 'rgba(15,15,15,0.35)';
            const cells = Array.from(grid.children);
            const index = cells.indexOf(event.target);
            frozenNumbers.set(clickedNumber, index); // Freeze the number at the clicked position
            currentNumber++;
            if (currentNumber > gridSize) {
                clearInterval(timer);
                alert("YOU WIN!");
            }
        }
    }

    function updateProgressBar() {
        const progressPercentage = (timeleft / (60 * shuffleFactor)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function startGame() {
        currentNumber = 1;
        timeleft = 60 * shuffleFactor; // Adjust initial timeleft based on time factor
        frozenNumbers.clear();
        createGrid();
        updateProgressBar();
        timer = setInterval(() => {
            timeleft--;
            updateProgressBar();
            if (timeleft <= 0) {
                clearInterval(timer);
                alert("TIME's UP! YOU LOSE");
            } else {
                createGrid();
            }
        }, 1000 / shuffleFactor); // Adjust interval based on time factor
    }

    startBtn.addEventListener('click', () => {
        timeleft = 60;
        startGame();
    });
});
