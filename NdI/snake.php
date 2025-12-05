<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Snake avec son de défaite</title>
<style>
    canvas{
        border: 2px solid #333;
        display: block;
        margin: 0 auto;
        background-color: #f0f0f0;
    }
    body {
        margin: 0;
        background-color: #f0f0f0;
    }
</style>
</head>
<body>
<canvas width="600" height="600"></canvas>

<script>
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

let box = 30;
let snake = [{ x: 10*box, y: 10*box }];
let food = {
    x: Math.floor(Math.random() * 15 + 1)*box,
    y: Math.floor(Math.random() * 15 + 1)*box
};

let score = 0;
let d;
let headScale = 1;
let borderWidth = 2;

// vitesse initiale en ms
let speed = 150;
let gameOver = false;

// Son de défaite
const loseSound = new Audio('lose.mp3');

// Charger l'image de fond
const background = new Image();
background.src = 'pinguin.webp';

document.addEventListener("keydown", direction);

function direction(event){
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

// Dessiner rectangle arrondi
function roundRect(x, y, w, h, r, fillColor, strokeColor, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
}

function draw(){
    // Dessiner l'image de fond
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if(gameOver){
        // Afficher "PERDU" au centre
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, canvas.height/2 - 50, canvas.width, 100);
        ctx.fillStyle = "red";
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PERDU", canvas.width/2, canvas.height/2);
        return;
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    let ateFood = false;

    // Manger la nourriture
    if(snakeX == food.x && snakeY == food.y){
        score++;
        headScale = 1.5;
        borderWidth = 6;
        ateFood = true;
        food = {
            x: Math.floor(Math.random() * 15 + 1)*box,
            y: Math.floor(Math.random() * 15 + 1)*box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeY < 0 || snakeX >= 20*box || snakeY >= 20*box || collision(newHead, snake)){
        gameOver = true;
        loseSound.play(); // jouer le son de défaite
        return;
    }

    snake.unshift(newHead);

    // Dessiner la nourriture
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI*2);
    ctx.fill();

    // Dessiner le serpent
    for(let i=0; i<snake.length; i++){
        if(i==0){
            let size = box * headScale;
            let grad = ctx.createRadialGradient(snake[i].x+box/2, snake[i].y+box/2, 2, snake[i].x+box/2, snake[i].y+box/2, box);
            grad.addColorStop(0, "#00ff00");
            grad.addColorStop(1, "#006600");

            ctx.shadowColor = "#00ff00";
            ctx.shadowBlur = 10;

            roundRect(snake[i].x - (size-box)/2, snake[i].y - (size-box)/2, size, size, 6, grad, "red", borderWidth);

            headScale -= 0.1;
            if(headScale<1) headScale=1;
            borderWidth -= 0.8;
            if(borderWidth<2) borderWidth=2;

            ctx.shadowBlur = 0;
        } else {
            let greenValue = 150 + Math.floor((i/snake.length)*105);
            let fillColor = `rgb(0, ${greenValue}, 0)`;
            roundRect(snake[i].x, snake[i].y, box, box, 4, fillColor, "red", 2);
        }
    }

    // Afficher le score avec fond violet
    let scoreX = 15;
    let scoreY = 25;
    let padding = 8;
    ctx.font = "24px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    let text = score.toString();
    let textWidth = ctx.measureText(text).width;

    ctx.fillStyle = "rgba(128,0,128,0.5)";
    ctx.beginPath();
    ctx.moveTo(scoreX - padding, scoreY - 20);
    ctx.lineTo(scoreX + textWidth + padding, scoreY - 20);
    ctx.lineTo(scoreX + textWidth + padding, scoreY + 10);
    ctx.lineTo(scoreX - padding, scoreY + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;
    ctx.fillText(text, scoreX, scoreY - 5);
    ctx.shadowBlur = 0;

    // Accélération uniquement si on a mangé
    if(ateFood && speed > 30){
        speed -= 2;
        clearInterval(game);
        game = setInterval(draw, speed);
    }
}

function collision(head, array){
    return array.some(cell => head.x == cell.x && head.y == cell.y);
}

let game = setInterval(draw, speed);
</script>
</body>
</html>
