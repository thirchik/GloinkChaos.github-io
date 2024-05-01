const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const sprites = [];
const numSprites = 15;
const spriteSize = 100;
const maxSpeed = 12;
const minSpeed = 7;
let mouseX = 0;
let mouseY = 0;

const fixDpi = () => {
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(canvas);
    
    const style = {
      height() {
        return +styles.height.slice(0, -2);
      },
      width() {
        return +styles.width.slice(0, -2);
      }
    };
    
    canvas.setAttribute('width', (style.width() * dpi).toString());
    canvas.setAttribute('height', (style.height() * dpi).toString());
}
fixDpi()

const spriteImages = [];

const imagePaths = [
    'Images/gloink.png',
    'Images/gloink3.png',
    'Images/gloink4.png',
    'Images/gloink5.png',
    'Images/gloink6.png',
    'Images/gloink7.png',
    'Images/doodle_gloink2.png',
];
const numImages = imagePaths.length; 

for (let i = 0; i < numImages; i++) {
    const img = new Image();
    img.src = imagePaths[i]; 
    spriteImages.push(img);
}


function createSprite() {
    
    const spriteImage = spriteImages[Math.floor(Math.random() * numImages)];
    
    const sprite = {
        x: Math.random() * (canvas.width - spriteSize),
        y: Math.random() * (canvas.height - spriteSize),
        vx: Math.random() * maxSpeed * 2 - maxSpeed,
        vy: Math.random() * maxSpeed * 2 - maxSpeed,
        image: spriteImage 
    };
    sprites.push(sprite);
}

for (let i = 0; i < numSprites; i++) {
    createSprite();
}

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    for (const sprite of sprites) {
     
        sprite.x += sprite.vx;
        sprite.y += sprite.vy;

        
        if (sprite.x <= 0 || sprite.x + spriteSize >= canvas.width) {
            sprite.vx *= -1;
        }
        if (sprite.y <= 0 || sprite.y + spriteSize >= canvas.height) {
            sprite.vy *= -1;
        }

       
        const dx = sprite.x + spriteSize / 2 - mouseX;
        const dy = sprite.y + spriteSize / 2 - mouseY;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
       
        if (distance < spriteSize / 2) {
           
            const angle = Math.atan2(dy, dx);
            sprite.vx = -Math.cos(angle) * maxSpeed;
            sprite.vy = -Math.sin(angle) * maxSpeed;
        }

        
        ctx.drawImage(sprite.image, sprite.x, sprite.y, spriteSize, spriteSize);
    }

    
    requestAnimationFrame(gameLoop);
}


canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    
    mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
});


spriteImages[0].onload = gameLoop;
