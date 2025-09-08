document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const playerNamesSection = document.getElementById('playerNamesSection');
    const player2Group = document.getElementById('player2Group');
    const startButton = document.getElementById('startGame');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    
    let selectedMode = null;
    
    // Mode selection
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            modeButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            selectedMode = this.dataset.mode;
            
            // Show player names section
            playerNamesSection.classList.add('active');
            
            // Show/hide player 2 input based on mode
            if (selectedMode === 'pvc') {
                player2Group.style.display = 'none';
                player2Input.value = 'Computer';
            } else {
                player2Group.style.display = 'block';
                player2Input.value = '';
            }
            
            updateStartButton();
        });
    });
    
    // Input validation
    player1Input.addEventListener('input', updateStartButton);
    player2Input.addEventListener('input', updateStartButton);
    
    function updateStartButton() {
        const player1Valid = player1Input.value.trim().length > 0;
        const player2Valid = selectedMode === 'pvc' || player2Input.value.trim().length > 0;
        
        startButton.disabled = !(selectedMode && player1Valid && player2Valid);
    }
    
    // Start game
    startButton.addEventListener('click', function() {
        if (startButton.disabled) return;
        
        const gameData = {
            mode: selectedMode,
            player1: player1Input.value.trim() || 'Player 1',
            player2: selectedMode === 'pvc' ? 'Computer' : (player2Input.value.trim() || 'Player 2')
        };
        
        // Store game data in sessionStorage
        sessionStorage.setItem('gameData', JSON.stringify(gameData));
        
        // Navigate to game page
        window.location.href = 'game.html';
    });
    
    // Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !startButton.disabled) {
            startButton.click();
        }
    });
});