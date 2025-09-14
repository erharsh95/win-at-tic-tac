// Particle animation and visual effects module

export function createParticles() {
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

export function addInteractionEffects() {
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