document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp';
    let scores = { X: 0, O: 0 };
    let players = { X: 'Player 1', O: 'Player 2' };
    
    // DOM elements
    const gameBoard = document.getElementById('gameBoard');
    const gameStatus = document.getElementById('gameStatus');
    const currentPlayerSpan = document.getElementById('currentPlayer');
    const player1Name = document.getElementById('player1Name');
    const player2Name = document.getElementById('player2Name');
    const player1Score = document.getElementById('player1Score');
    const player2Score = document.getElementById('player2Score');
    const player1Info = document.getElementById('player1Info');
    const player2Info = document.getElementById('player2Info');
    const cells = document.querySelectorAll('.cell');
    
    // Winning combinations
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    // Initialize game
    function initGame() {
        const gameData = JSON.parse(sessionStorage.getItem('gameData'));
        
        if (!gameData) {
            window.location.href = 'index.html';
            return;
        }
        
        gameMode = gameData.mode;
        players.X = gameData.player1;
        players.O = gameData.player2;
        
        // Update UI
        player1Name.textContent = players.X;
        player2Name.textContent = players.O;
        
        updateDisplay();
        
        // Add event listeners to cells
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleCellClick(index));
        });
    }
    
    function handleCellClick(index) {
        if (board[index] !== '' || !gameActive) return;
        
        makeMove(index, currentPlayer);
        
        if (gameActive && gameMode === 'pvc' && currentPlayer === 'O') {
            // Computer's turn
            setTimeout(() => {
                const computerMove = getBestMove();
                makeMove(computerMove, 'O');
            }, 500);
        }
    }
    
    function makeMove(index, player) {
        board[index] = player;
        const cell = cells[index];
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('fade-in');
        
        if (checkWinner()) {
            gameActive = false;
            highlightWinningCells();
            scores[player]++;
            updateScores();
            gameStatus.innerHTML = `🎉 ${players[player]} wins!`;
            
            // Auto restart after 2 seconds
            setTimeout(() => {
                resetGame();
            }, 2000);
        } else if (board.every(cell => cell !== '')) {
            gameActive = false;
            gameStatus.innerHTML = `🤝 It's a draw! Restarting...`;
            
            // Auto restart on draw
            setTimeout(() => {
                resetGame();
            }, 1500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateDisplay();
        }
    }
    
    function checkWinner() {
        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }
    
    function highlightWinningCells() {
        winConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
            }
        });
    }
    
    function updateDisplay() {
        currentPlayerSpan.textContent = players[currentPlayer];
        
        // Update active player highlight
        player1Info.classList.toggle('active', currentPlayer === 'X');
        player2Info.classList.toggle('active', currentPlayer === 'O');
        
        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            gameStatus.innerHTML = '🤖 Computer is thinking...';
            gameBoard.classList.add('thinking');
        } else {
            gameBoard.classList.remove('thinking');
            if (gameActive) {
                gameStatus.innerHTML = `${players[currentPlayer]}'s turn`;
            }
        }
    }
    
    function updateScores() {
        player1Score.textContent = scores.X;
        player2Score.textContent = scores.O;
    }
    
    // AI Logic - Minimax Algorithm
    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    function minimax(board, depth, isMaximizing) {
        let result = checkGameResult();
        
        if (result !== null) {
            return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    function checkGameResult() {
        // Check for winner
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        // Check for draw
        if (board.every(cell => cell !== '')) {
            return 'draw';
        }
        
        return null;
    }
    
    // Game controls
    window.resetGame = function() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        updateDisplay();
    };
    
    window.resetScores = function() {
        scores = { X: 0, O: 0 };
        updateScores();
    };
    
    window.goBack = function() {
        window.location.href = 'index.html';
    };
    
    // Initialize the game
    initGame();
});