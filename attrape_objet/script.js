const player = document.getElementById('player');
const fenetreJeu = document.getElementById('fenetre_jeu');
const score_html = document.getElementById('score');
const best_html = document.getElementById('best_score');
const lives_html = document.getElementById('lives');

const gameOverScreen = document.getElementById('game_over');
const finalScore_html = document.getElementById('final_score');
const restartBtn = document.getElementById('restart_btn');

let playerPosition = 175;
let lives = 5;
let score = 0;
let gameRunning = true;

let bestScore = localStorage.getItem('bestScore') || 0;
best_html.textContent = 'Meilleur score : ' + bestScore;

function updateLives() {
    lives_html.innerHTML = "";
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        lives_html.appendChild(heart);
    }
}
updateLives();

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    if (event.key === 'ArrowLeft' && playerPosition > 45) {
        playerPosition -= 8;
    } else if (event.key === 'ArrowRight' && playerPosition < 375) {
        playerPosition += 8;
    }
    player.style.left = playerPosition + 'px';
});

function createFallingObject() {
    if (!gameRunning) return;

    let positionObjet = 0;
    const objet = document.createElement('div');
    objet.classList.add('falling_object');
    objet.style.left = Math.floor(Math.random() * 350) + 'px';
    if(Math.random() < 0.2){
        objet.style.backgroundImage = "url('windows-logo.png')";
        objet.style.width = "55px";
        objet.style.height = "55px";
        objet.windows = true;
    }
    else{
        objet.windows = false;
    }
    fenetreJeu.appendChild(objet);

    const objectInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(objectInterval);
            return;
        }

        positionObjet += 5;
        objet.style.top = positionObjet + 'px';

        const playerRect = player.getBoundingClientRect();
        const objectRect = objet.getBoundingClientRect();

        // Collision
        if (
            objectRect.top <= playerRect.bottom &&
            objectRect.bottom >= playerRect.top &&
            objectRect.left <= playerRect.right &&
            objectRect.right >= playerRect.left
        ) {
            if(!objet.windows){
                score++;
                score_html.textContent = "Score : " + score;
                objet.remove();
                clearInterval(objectInterval);
            } else {
                lives--;
                updateLives();
                objet.remove();
                clearInterval(objectInterval);
                if (lives <= 0) {
                    gameOver();
                }
            }
        }

        // Objet manqué
        if (positionObjet > 600) {
            if(!objet.windows){
                lives--;
                updateLives();
                if (lives <= 0) {
                    gameOver();
                }
            }
            objet.remove();
            clearInterval(objectInterval);   
        }

    }, 50);
}
setInterval(createFallingObject, 1500);

function gameOver() {
    gameRunning = false;

    finalScore_html.textContent = "Votre score : " + score;
    gameOverScreen.style.display = "flex";

    if (score > bestScore) {
        localStorage.setItem("bestScore", score);
        best_html.textContent = "Meilleur score : " + score;
    }
    document.querySelectorAll('.falling_object').forEach(obj => obj.remove());

}

restartBtn.addEventListener("click", () => {
    score = 0;
    lives = 5;
    playerPosition = 175;
    gameRunning = true;

    score_html.textContent = "Score : 0";
    finalScore_html.textContent = "";
    updateLives();

    gameOverScreen.style.display = "none";
});