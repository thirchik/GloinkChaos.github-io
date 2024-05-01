const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const sprites = [];
const numSprites = 15; // Number of sprites to spawn
const spriteSize = 100; // Size of each sprite (assumed to be square)
const maxSpeed = 12; // Maximum speed of sprites
const minSpeed = 7;
let mouseX = 0;
let mouseY = 0;

const fixDpi = () => {
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(canvas);
    
    // create a style object that returns width and height
    const style = {
      height() {
        return +styles.height.slice(0, -2);
      },
      width() {
        return +styles.width.slice(0, -2);
      }
    };
    
    // set the correct canvas attributes for device dpi
    canvas.setAttribute('width', (style.width() * dpi).toString());
    canvas.setAttribute('height', (style.height() * dpi).toString());
}
fixDpi()
// Array to hold the sprite images
const spriteImages = [];

// Array of paths to sprite images
const imagePaths = [
    '/Images/gloink.png',
    '/Images/gloink3.png',
    '/Images/gloink4.png',
    '/Images/gloink5.png',
    '/Images/gloink6.png',
    '/Images/gloink7.png',
    '/Images/doodle_gloink2.png',
];
const numImages = imagePaths.length; // Number of different images

// Load each of the sprite images
for (let i = 0; i < numImages; i++) {
    const img = new Image();
    img.src = imagePaths[i]; // Set this to the paths of your sprite images
    spriteImages.push(img);
}

// Function to create a sprite
function createSprite() {
    // Randomly select one of the sprite images
    const spriteImage = spriteImages[Math.floor(Math.random() * numImages)];
    
    const sprite = {
        x: Math.random() * (canvas.width - spriteSize),
        y: Math.random() * (canvas.height - spriteSize),
        vx: Math.random() * maxSpeed * 2 - maxSpeed,
        vy: Math.random() * maxSpeed * 2 - maxSpeed,
        image: spriteImage // Assign the selected image to the sprite
    };
    sprites.push(sprite);
}

// Create initial sprites
for (let i = 0; i < numSprites; i++) {
    createSprite();
}

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw sprites
    for (const sprite of sprites) {
        // Update position
        sprite.x += sprite.vx;
        sprite.y += sprite.vy;

        // Check for collisions with canvas edges and bounce
        if (sprite.x <= 0 || sprite.x + spriteSize >= canvas.width) {
            sprite.vx *= -1;
        }
        if (sprite.y <= 0 || sprite.y + spriteSize >= canvas.height) {
            sprite.vy *= -1;
        }

        // Check for mouse interaction
        const dx = sprite.x + spriteSize / 2 - mouseX;
        const dy = sprite.y + spriteSize / 2 - mouseY;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        // Change sprite direction instead of speed
        if (distance < spriteSize / 2) {
            // Calculate new direction vector
            const angle = Math.atan2(dy, dx);
            sprite.vx = -Math.cos(angle) * maxSpeed;
            sprite.vy = -Math.sin(angle) * maxSpeed;
        }

        // Draw the sprite using its assigned image
        ctx.drawImage(sprite.image, sprite.x, sprite.y, spriteSize, spriteSize);
    }

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Track mouse movement
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    // Adjust mouse coordinates based on canvas position and scaling
    mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
});

// Start the game loop
spriteImages[0].onload = gameLoop;
