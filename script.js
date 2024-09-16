const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');
const winnerScreen = document.getElementById('winner-screen');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const winnerMessage = document.getElementById('winner-message');
const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const playAgainButton = document.getElementById('play-again');
const newGameButton = document.getElementById('new-game');
const human = 'X';
const computer = 'O';

const clickSound = new Audio('click.mp3');
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');

let boardState = Array(9).fill(null);
let playerName = '';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        welcomeScreen.style.display = 'none';
        gameContainer.style.display = 'block';
    } else {
        alert('Please enter your name');
    }
});

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click', newGame);

function handleCellClick(event) {
    const index = event.target.dataset.index;

    if (!boardState[index]) {
        makeMove(index, human);
        clickSound.play();
        if (!checkWin(boardState, human) && !isBoardFull()) {
            const bestMove = getBestMove();
            makeMove(bestMove, computer);
            clickSound.play();
        }
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player === human ? 'x' : 'o');
    if (checkWin(boardState, player)) {
        displayWinner(player === human ? playerName : 'Computer');
        winSound.play();
    } else if (isBoardFull()) {
        displayWinner('It\'s a draw!');
        drawSound.play();
    }
}

function checkWin(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function isBoardFull() {
    return boardState.every(cell => cell);
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < boardState.length; i++) {
        if (!boardState[i]) {
            boardState[i] = computer;
            let score = minimax(boardState, 0, false);
            boardState[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, computer)) return 10 - depth;
    if (checkWin(board, human)) return depth - 10;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = computer;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = human;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function displayWinner(winner) {
    winnerMessage.textContent = winner === 'It\'s a draw!' ? winner : `${winner} wins!`;
    gameContainer.style.display = 'none';
    winnerScreen.style.display = 'block';
}

function resetGame() {
    boardState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    gameContainer.style.display = 'block';
    winnerScreen.style.display = 'none';
    startGame();
}

function newGame() {
    playerName = '';
    playerNameInput.value = '';
    welcomeScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    winnerScreen.style.display = 'none';
}

function endGame() {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick);
    });
}

function startGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
}

startGame();
