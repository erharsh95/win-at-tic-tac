// Main application entry point

import { createParticles, addInteractionEffects } from './animations.js';
import { TicTacToeGame } from './gameLogic.js';
import { UIManager } from './ui.js';

function init() {
    // Initialize visual effects
    createParticles();
    addInteractionEffects();
    
    // Initialize game logic and UI
    const game = new TicTacToeGame();
    const ui = new UIManager(game);
    
    console.log('Tic Tac Toe game initialized with modular architecture');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}