const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
canvas.width = 640;
canvas.height = 360;

// Game state
const gameState = {
    player: {
        x: 100,
        y: 250,
        width: 16,
        height: 24,
        dx: 0,
        dy: 0,
        speed: 5,
        jumpForce: -12,
        onGround: false,
        color: '#e74c3c'
    },
    platforms: [
        { x: 0, y: 300, width: 640, height: 60, color: '#2ecc71' }, // Ground
        { x: 200, y: 250, width: 80, height: 20, color: '#8a6b4d' },
        { x: 400, y: 200, width: 80, height: 20, color: '#8a6b4d' }
    ],
    controls: {
        left: false,
        right: false,
        jump: false
    }
};

// Input handling
function setupControls() {
    const handleKey = (e, state) => {
        if (e.code === 'KeyA') gameState.controls.left = state;
        if (e.code === 'KeyD') gameState.controls.right = state;
        if (e.code === 'KeyW' || e.code === 'Space') gameState.controls.jump = state;
    };

    document.addEventListener('keydown', (e) => handleKey(e, true));
    document.addEventListener('keyup', (e) => handleKey(e, false));

    // Touch controls
    document.getElementById('left').addEventListener('mousedown', () => gameState.controls.left = true);
    document.getElementById('left').addEventListener('mouseup', () => gameState.controls.left = false);
    document.getElementById('right').addEventListener('mousedown', () => gameState.controls.right = true);
    document.getElementById('right').addEventListener('mouseup', () => gameState.controls.right = false);
    document.getElementById('jump').addEventListener('mousedown', () => gameState.controls.jump = true);
    document.getElementById('jump').addEventListener('mouseup', () => gameState.controls.jump = false);
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Physics and movement
function updatePlayer() {
    const p = gameState.player;
    
    // Horizontal movement
    p.dx = 0;
    if (gameState.controls.left) p.dx = -p.speed;
    if (gameState.controls.right) p.dx = p.speed;

    // Apply gravity
    p.dy += 0.5;
    p.y += p.dy;

    // Horizontal movement
    p.x += p.dx;

    // Reset ground state
    p.onGround = false;

    // Platform collisions
    gameState.platforms.forEach(platform => {
        if (checkCollision(p, platform)) {
            // Vertical collision
            if (p.dy > 0) { // Falling
                p.y = platform.y - p.height;
                p.dy = 0;
                p.onGround = true;
            }
            else if (p.dy < 0) { // Jumping
                p.y = platform.y + platform.height;
                p.dy = 0;
            }
        }
    });

    // Jumping
    if (gameState.controls.jump && p.onGround) {
        p.dy = p.jumpForce;
        p.onGround = false;
    }

    // Keep player in bounds
    p.x = Math.max(0, Math.min(canvas.width - p.width, p.x));
}

// Rendering
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    gameState.platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = gameState.player.color;
    ctx.fillRect(
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
    );
}

// Game loop
function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize
setupControls();
gameLoop();