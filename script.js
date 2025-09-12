// Create floating particles
function createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        document.querySelector('.rgb-bg').appendChild(particle);
    }
}

// Enhanced interaction effects
function addInteractionEffects() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) perspective(1000px) rotateX(5deg)';
        });
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg)';
            }
        });
    });
}

function init() {
    createParticles();
    addInteractionEffects();
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp';
    let scores = { X: 0, O: 0 };
    let players = { X: 'Player 1', O: 'Player 2' };
    
    // Selection screen elements
    const selectionScreen = document.getElementById('selectionScreen');
    const gameScreen = document.getElementById('gameScreen');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const playerNamesSection = document.getElementById('playerNamesSection');
    const player2Group = document.getElementById('player2Group');
    const startButton = document.getElementById('startGame');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    
    // Game screen elements
    const gameBoard = document.getElementById('gameBoard');
    const gameStatus = document.getElementById('gameStatus');
    const currentPlayerSpan = document.getElementById('currentPlayer');
    const player1Name = document.getElementById('player1Name');
    const player2Name = document.getElementById('player2Name');
    const player1Score = document.getElementById('player1Score');
    const player2Score = document.getElementById('player2Score');
    const player1Info = document.getElementById('player1Info');
    const player2Info = document.getElementById('player2Info');
    const backBtn = document.getElementById('backBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const resetScoresBtn = document.getElementById('resetScoresBtn');
    
    let selectedMode = null;
    
    // Winning combinations
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    // Selection screen logic
    function handleModeSelect(buttonEl) {
        if (!buttonEl) return;
        modeButtons.forEach(btn => btn.classList.remove('selected'));
        buttonEl.classList.add('selected');
        selectedMode = buttonEl.dataset.mode;
        playerNamesSection.classList.add('active');

        if (selectedMode === 'pvc') {
            player2Group.style.display = 'none';
            player2Input.value = 'Computer';
        } else {
            player2Group.style.display = 'block';
            player2Input.value = '';
        }

        updateStartButton();
        console.log('Mode selected:', selectedMode);
    }

    console.log('UI ready. modeButtons:', modeButtons.length);
    modeButtons.forEach(button => {
        ['click','touchend','pointerup'].forEach(evt => {
            button.addEventListener(evt, function (e) {
                e.preventDefault();
                handleModeSelect(this);
            }, { passive: false });
        });
    });

    // Fallback delegation
    ;['click','touchend','pointerup'].forEach(evt => {
        document.addEventListener(evt, (e) => {
            const btn = e.target.closest && e.target.closest('.mode-btn');
            if (btn) {
                e.preventDefault();
                handleModeSelect(btn);
            }
        }, { passive: false });
    });

    // Default to PvP for convenience
    const defaultBtn = document.querySelector('.mode-btn[data-mode="pvp"]');
    if (defaultBtn) handleModeSelect(defaultBtn);

    // Ensure initial state
    updateStartButton();
    
    ['input','change','keyup','paste'].forEach(evt => player1Input.addEventListener(evt, updateStartButton));
    ['input','change','keyup','paste'].forEach(evt => player2Input.addEventListener(evt, updateStartButton));
    
    function updateStartButton() {
        const player1Valid = player1Input.value.trim().length > 0;
        const player2Valid = selectedMode === 'pvc' || player2Input.value.trim().length > 0;
        startButton.disabled = !(selectedMode && player1Valid && player2Valid);
    }
    
    startButton.addEventListener('click', function() {
        if (startButton.disabled) return;
        
        gameMode = selectedMode;
        players.X = player1Input.value.trim() || 'Player 1';
        players.O = selectedMode === 'pvc' ? 'Computer' : (player2Input.value.trim() || 'Player 2');
        
        showGameScreen();
    });
    
    // Enter key support for selection screen
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startButton.disabled && selectionScreen.style.display !== 'none') {
            startButton.click();
        }
    });
    
    // Game screen logic
    function showGameScreen() {
        selectionScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        
        player1Name.textContent = players.X;
        player2Name.textContent = players.O;
        
        initGame();
    }
    
    function showSelectionScreen() {
        gameScreen.style.display = 'none';
        selectionScreen.style.display = 'block';
        resetGame();
        scores = { X: 0, O: 0 };
    }
    
    backBtn.addEventListener('click', showSelectionScreen);
    
    function initGame() {
        const cells = gameBoard.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleCellClick(index));
        });
        
        updateDisplay();
        updateScores();
    }
    
    function handleCellClick(index) {
        const cells = gameBoard.querySelectorAll('.cell');
        if (board[index] !== '' || !gameActive) return;
        
        makeMove(index, currentPlayer);
        
        if (gameActive && gameMode === 'pvc' && currentPlayer === 'O') {
            setTimeout(() => {
                const computerMove = getBestMove();
                makeMove(computerMove, 'O');
            }, 500);
        }
    }
    
    function makeMove(index, player) {
        const cells = gameBoard.querySelectorAll('.cell');
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
            
            setTimeout(() => {
                resetGame();
            }, 2000);
        } else if (board.every(cell => cell !== '')) {
            gameActive = false;
            gameStatus.innerHTML = `🤝 It's a draw! Restarting...`;
            
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
        const cells = gameBoard.querySelectorAll('.cell');
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
    
    // AI Logic - Minimax Algorithm (Unbeatable)
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
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        if (board.every(cell => cell !== '')) {
            return 'draw';
        }
        
        return null;
    }
    
    // Game controls
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        const cells = gameBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        updateDisplay();
    }
    
    function resetScores() {
        scores = { X: 0, O: 0 };
        updateScores();
    }
    
    newGameBtn.addEventListener('click', resetGame);
    resetScoresBtn.addEventListener('click', resetScores);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}