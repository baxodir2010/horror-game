const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');

// Canvas o'lchamlari
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// O'yinchi obyekti
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 5,
    color: 'white'
};

// Granny obyekti
const granny = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 40,
    speed: 2,
    color: 'red'
};

// Kalit
const key = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20,
    color: 'yellow',
    collected: false
};

// Yorug'lik radiusi
const lightRadius = 150;

// Klaviatura boshqaruvi
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// O'yinni tugatish funksiyasi
function endGame() {
    cancelAnimationFrame(animationFrame);
    gameOverScreen.style.display = 'block';
}

// Qayta boshlash funksiyasi
function restartGame() {
    location.reload();
}

// O'yin sikli
function gameLoop() {
    // Fonni tozalash
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // O'yinchi harakati
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;

    // Chegaralar
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

    // Granny harakati (quvib keladi)
    const dx = player.x - granny.x;
    const dy = player.y - granny.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        granny.x += (dx / distance) * granny.speed;
        granny.y += (dy / distance) * granny.speed;
    }

    // Urinishni tekshirish
    if (distance < player.size + granny.size) {
        endGame();
    }

    // Kalitni to'plash
    const keyDistance = Math.sqrt((player.x - key.x) ** 2 + (player.y - key.y) ** 2);
    if (keyDistance < player.size + key.size && !key.collected) {
        key.collected = true;
        alert("Kalit topildi! Endi eshikka bor!");
    }

    // Yorug'lik effekti
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(player.x, player.y, lightRadius, 0, Math.PI * 2);
    ctx.clip();

    // O'yinchi va Granny-ni chizish
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

    ctx.fillStyle = granny.color;
    ctx.fillRect(granny.x - granny.size / 2, granny.y - granny.size / 2, granny.size, granny.size);

    // Kalitni chizish
    if (!key.collected) {
        ctx.fillStyle = key.color;
        ctx.fillRect(key.x - key.size / 2, key.y - key.size / 2, key.size, key.size);
    }

    animationFrame = requestAnimationFrame(gameLoop);
}

// O'yinni ishga tushirish
let animationFrame = requestAnimationFrame(gameLoop);