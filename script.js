document.addEventListener('DOMContentLoaded', function() {
    // Initially show the welcome screen
    showScreen('screen01');
});

var basket = document.getElementById('basket');
var seed = document.getElementById('seed');
var score = 0;
var collectingSound = new Audio('collectingsound.mp3');

document.addEventListener('keydown', function(event) {
    var keyCode = event.keyCode;
    if (keyCode === 37) { // Left arrow key
        moveBasket('left');
    } else if (keyCode === 39) { // Right arrow key
        moveBasket('right');
    }
});

function moveBasket(direction) {
    var currentLeft = parseInt(window.getComputedStyle(basket).left, 10);
    var containerWidth = document.getElementById('container').offsetWidth;
    var basketWidth = basket.offsetWidth;
    var step = 30; // Movement step size

    if (direction === 'left' && currentLeft - step >= 0) {
        basket.style.left = `${currentLeft - step}px`;
    } else if (direction === 'right' && currentLeft + basketWidth + step <= containerWidth - step + 150) {
        basket.style.left = `${currentLeft + step}px`;
    }
}

function startGame() {
    // Ensure the score display is visible
    document.getElementById('scoreDisplay').style.display = 'block';

    // Show the seed element and set its initial position
    seed.style.display = 'block';
    seed.style.top = '0'; // Reset seed position to top of the container

    score = 0; // Initialize score
    updateScore();
    dropSeed(); // Start the game logic for dropping seeds
}

function updateScore() {
    document.getElementById('scoreDisplay').textContent = 'Score: ' + score;
}

function dropSeed() {
    var containerHeight = document.getElementById('container').offsetHeight;
    var speed = 7; // Seed drop speed
    var seedTop = 0;

    seed.style.display = 'block';

    // Generate random starting position for the seed
    var seedLeft = Math.floor(Math.random() * (container.offsetWidth - seed.offsetWidth -45));
    seed.style.left = seedLeft + 'px';

    var seedInterval = setInterval(function() {
        seedTop += speed;
        seed.style.top = seedTop + 'px';

        if (seedTop >= containerHeight - basket.offsetHeight) {
            clearInterval(seedInterval); // Stop dropping the current seed

            if (!isSeedCaught()) {
                gameOver(); // Game over if the seed is not caught
                return; // Exit the function
            }

            score++;
            updateScore();

            // Start dropping a new seed if the current seed is close to the basket
            if (seedTop >= containerHeight - basket.offsetHeight * 2) {
                dropSeed();
            }
        }
    }, 50);
}


function isSeedCaught() {
    var basketRect = basket.getBoundingClientRect();
    var seedRect = seed.getBoundingClientRect();

    // Check if the seed overlaps with the basket
    var isCaught = !(seedRect.right < basketRect.left || 
                     seedRect.left > basketRect.right || 
                     seedRect.bottom < basketRect.top || 
                     seedRect.top > basketRect.bottom);

    if (isCaught) {
        var collectingSound = document.getElementById('collectingSound');
        collectingSound.play(); // Play the sound when seed is caught
    }

    return isCaught;
}

function showScreen(screenId) {
    var container = document.getElementById('container');
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(screen) {
        screen.style.display = 'none'; // Hiding all screens
    });

    if (screenId === 'screen02') {
        var goodLuckMessage = document.getElementById('goodLuckMessage');
        goodLuckMessage.style.display = 'block'; // Show the message initially

        // Hide the message after a delay
        setTimeout(function() {
            goodLuckMessage.style.display = 'none';
            startGame(); // Start the game once the message disappears
        }, 2000); // Adjust the delay as needed
    }

    document.getElementById(screenId).style.display = 'block';

    // Reset background image
    container.style.backgroundImage = 'none';

    // Set background image for specific screens
    if (screenId === 'screen01') {
        container.style.backgroundImage = 'url("screen1.png")';
    } else if (screenId === 'screen02') {
        container.style.backgroundImage = 'url("screen2.png")';
    } else if (screenId === 'gameOverScreen') {
        // Reset background image for gameOverScreen
        container.style.backgroundImage = 'url("screen2.png")';
    }
}

function resetGame() {
    // Reset game state for a new game
    var goodLuckMessage = document.getElementById('goodLuckMessage');
    goodLuckMessage.style.display = 'block';

    setTimeout(function() {
        goodLuckMessage.style.display = 'none';
        startGame(); // Start or restart the game
    }, 1000);
}
function gameOver() {
    var lostSound = document.getElementById('lostSound');
    lostSound.play(); // Play the sound when the game is lost

    document.getElementById('finalScore').textContent = score; // Update final score
    showScreen('gameOverScreen'); // Show game over screen
}
