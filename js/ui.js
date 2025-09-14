// UI handling and screen management

export class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedMode = 'pvp';
        
        // Selection screen elements
        this.selectionScreen = document.getElementById('selectionScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.playerNamesSection = document.getElementById('playerNamesSection');
        this.player2Group = document.getElementById('player2Group');
        this.startButton = document.getElementById('startGame');
        this.player1Input = document.getElementById('player1');
        this.player2Input = document.getElementById('player2');
        
        // Game screen elements
        this.player1Name = document.getElementById('player1Name');
        this.player2Name = document.getElementById('player2Name');
        this.backBtn = document.getElementById('backBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.resetScoresBtn = document.getElementById('resetScoresBtn');
        
        this.initSelectionScreen();
        this.initGameScreen();
    }
    
    initSelectionScreen() {
        // Mode selection
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleModeSelect(button);
            });
        });
        
        // Default to PvP
        const defaultBtn = document.querySelector('.mode-btn[data-mode="pvp"]');
        if (defaultBtn) this.handleModeSelect(defaultBtn);
        
        // Input validation
        this.player1Input.addEventListener('input', () => this.updateStartButton());
        this.player2Input.addEventListener('input', () => this.updateStartButton());
        
        // Start game
        this.startButton.addEventListener('click', () => {
            if (this.startButton.disabled) return;
            this.startGame();
        });
        
        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.startButton.disabled && this.selectionScreen.style.display !== 'none') {
                this.startButton.click();
            }
        });
        
        this.updateStartButton();
    }
    
    initGameScreen() {
        this.backBtn.addEventListener('click', () => this.showSelectionScreen());
        this.newGameBtn.addEventListener('click', () => this.game.resetGame());
        this.resetScoresBtn.addEventListener('click', () => this.game.resetScores());
    }
    
    handleModeSelect(buttonEl) {
        if (!buttonEl) return;
        
        this.modeButtons.forEach(btn => btn.classList.remove('selected'));
        buttonEl.classList.add('selected');
        this.selectedMode = buttonEl.dataset.mode;
        this.playerNamesSection.classList.add('active');

        if (this.selectedMode === 'pvc') {
            this.player2Group.style.display = 'none';
            this.player2Input.value = 'Computer';
        } else {
            this.player2Group.style.display = 'block';
            this.player2Input.value = '';
        }

        this.updateStartButton();
        console.log('Mode selected:', this.selectedMode);
    }
    
    updateStartButton() {
        // Allow starting as soon as a mode is selected; names are optional
        this.startButton.disabled = !this.selectedMode;
    }
    
    startGame() {
        const player1Name = this.player1Input.value.trim() || 'Player 1';
        const player2Name = this.selectedMode === 'pvc' ? 'Computer' : (this.player2Input.value.trim() || 'Player 2');
        
        this.game.setGameMode(this.selectedMode);
        this.game.setPlayers(player1Name, player2Name);
        
        this.showGameScreen();
    }
    
    showGameScreen() {
        this.selectionScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        this.player1Name.textContent = this.game.players.X;
        this.player2Name.textContent = this.game.players.O;
        
        this.game.initGame();
    }
    
    showSelectionScreen() {
        this.gameScreen.style.display = 'none';
        this.selectionScreen.style.display = 'block';
        this.game.resetGame();
        this.game.scores = { X: 0, O: 0 };
    }
}