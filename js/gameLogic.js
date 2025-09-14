// Core game logic and state management

import { getBestMove } from './ai.js';

export class TicTacToeGame {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'pvp';
        this.scores = { X: 0, O: 0 };
        this.players = { X: 'Player 1', O: 'Player 2' };
        
        this.winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        this.gameBoard = document.getElementById('gameBoard');
        this.gameStatus = document.getElementById('gameStatus');
        this.currentPlayerSpan = document.getElementById('currentPlayer');
        this.player1Info = document.getElementById('player1Info');
        this.player2Info = document.getElementById('player2Info');
        this.player1Score = document.getElementById('player1Score');
        this.player2Score = document.getElementById('player2Score');
    }
    
    initGame() {
        const cells = this.gameBoard.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.updateDisplay();
        this.updateScores();
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) return;
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'pvc' && this.currentPlayer === 'O') {
            setTimeout(() => {
                const computerMove = getBestMove(this.board);
                this.makeMove(computerMove, 'O');
            }, 500);
        }
    }
    
    makeMove(index, player) {
        const cells = this.gameBoard.querySelectorAll('.cell');
        this.board[index] = player;
        const cell = cells[index];
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('fade-in');
        
        if (this.checkWinner()) {
            this.gameActive = false;
            this.highlightWinningCells();
            this.scores[player]++;
            this.updateScores();
            this.gameStatus.innerHTML = `🎉 ${this.players[player]} wins!`;
            
            setTimeout(() => {
                this.resetGame();
            }, 2000);
        } else if (this.board.every(cell => cell !== '')) {
            this.gameActive = false;
            this.gameStatus.innerHTML = `🤝 It's a draw! Restarting...`;
            
            setTimeout(() => {
                this.resetGame();
            }, 1500);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    checkWinner() {
        return this.winConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c];
        });
    }
    
    highlightWinningCells() {
        const cells = this.gameBoard.querySelectorAll('.cell');
        this.winConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
            }
        });
    }
    
    updateDisplay() {
        this.currentPlayerSpan.textContent = this.players[this.currentPlayer];
        
        this.player1Info.classList.toggle('active', this.currentPlayer === 'X');
        this.player2Info.classList.toggle('active', this.currentPlayer === 'O');
        
        if (this.gameMode === 'pvc' && this.currentPlayer === 'O' && this.gameActive) {
            this.gameStatus.innerHTML = '🤖 Computer is thinking...';
            this.gameBoard.classList.add('thinking');
        } else {
            this.gameBoard.classList.remove('thinking');
            if (this.gameActive) {
                this.gameStatus.innerHTML = `${this.players[this.currentPlayer]}'s turn`;
            }
        }
    }
    
    updateScores() {
        this.player1Score.textContent = this.scores.X;
        this.player2Score.textContent = this.scores.O;
    }
    
    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        const cells = this.gameBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateDisplay();
    }
    
    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
    }
    
    setPlayers(player1, player2) {
        this.players.X = player1;
        this.players.O = player2;
    }
}