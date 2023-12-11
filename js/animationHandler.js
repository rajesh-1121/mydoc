// ES6 Class for Animation
class ContainerAnimation {
    constructor(container, background) {
        this.container = container;
        this.background = background;
    }

    // Method to create bubbles
    createBubbles(numberOfBubbles) {
        for (let i = 0; i < numberOfBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.classList.add(['bubble-small', 'bubble-medium', 'bubble-large'][Math.floor(Math.random() * 3)]); // Random size
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.bottom = `${Math.random() * 100}%`; // Random vertical position
            this.background.appendChild(bubble);
        }
    }

    // Method to apply the popping effect on the container
    applyPopEffect() {
        this.container.style.transform = 'scale(1.05)';
        this.container.style.transition = 'transform 0.3s ease';
    }

    // Method to revert the popping effect on the container
    revertPopEffect() {
        this.container.style.transform = 'scale(1)';
    }
}

// Selectors for the container and the background animation
const container = document.querySelector('.container');
const backgroundAnimation = document.querySelector('.background-animation');

// Instantiating the class
const animation = new ContainerAnimation(container, backgroundAnimation);

// Add event listeners for the container
container.addEventListener('mouseover', () => animation.applyPopEffect());
container.addEventListener('mouseout', () => animation.revertPopEffect());

// Create bubbles for the background animation
animation.createBubbles(50);
