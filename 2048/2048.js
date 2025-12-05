var board;
var score=0;
var rows=4;
var columns=4;


window.onload=function(){
    setGame();
}

function setGame(){
    board=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile= document.createElement("div");
            tile.id=r.toString() + "-" + c.toString();
            let num=board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTileScores() {
    const tileScores = document.getElementById("tile-scores");
    tileScores.innerHTML = ""; 

    
    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

    values.forEach(val => {
        const li = document.createElement("li");

        
        const img = document.createElement("img");
        img.src = "logo/" + val + ".png";
        img.classList.add("tile-img");
        img.style.width = "40px"; 
        img.style.height = "40px";
        img.style.marginRight = "10px";
        li.appendChild(img);
        li.appendChild(document.createTextNode(val));
        tileScores.appendChild(li);
    });
}

// Appeler une fois au début
updateTileScores();


function isEmpty(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            if(board[r][c]==0){
                return true;
            }
        }
    }
    return false;
}

function setTwo(){
    if(!isEmpty()){
        return;
    }
    let found=false;
    while(!found){
        let r=Math.floor(Math.random()*rows);
        let c=Math.floor(Math.random()*columns);

        if(board[r][c]==0){
            board[r][c]=2;
            let tile=document.getElementById(r.toString()+"-"+c.toString());
            updateTile(tile, 2);
            found=true;
        }
    }
}

function updateTile(tile,num){
    tile.innerHTML="";
    tile.classList.value="";//clear
    tile.classList.add("tile");
    if(num>0){
        let img=document.createElement("img");
        img.src="logo/"+ num + ".png";
        img.classList.add("tile-img");
        tile.appendChild(img);
    }
    if(num==2048){
        winGame();
    }
}

document.addEventListener("keyup",(e)=>{
    if(e.code=="ArrowLeft"){
        slideLeft();
        setTwo();
    }
    else if(e.code=="ArrowRight"){
        slideRight();
        setTwo();
    }
    else if(e.code=="ArrowUp"){
        slideUp();
        setTwo();
    }
    else if(e.code=="ArrowDown"){
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText=score;
})

function filterZero(row){
    return row.filter(num=> num!=0);//nouveau tableau
}

function slide(row){
    row=filterZero(row);

    for(let i=0; i<row.length-1;i++){
        if(row[i]==row[i+1]){
            row[i]*=2;
            row[i+1]=0;
            score+=row[i];
        }
    }

    row=filterZero(row);
    while(row.length<columns){
        row.push(0);
    }
    return row;
}

function slideLeft(){
    for(let r=0; r<rows;r++){
        let row=board[r];
        row=slide(row);
        board[r]=row;
        for(let c=0;c<columns;c++){
            let tile=document.getElementById(r.toString() + "-" + c.toString());
            let num=board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideRight(){
    for(let r=0; r<rows;r++){
        let row=board[r];
        row.reverse();
        row=slide(row);
        row.reverse();
        board[r]=row;
        for(let c=0;c<columns;c++){
            let tile=document.getElementById(r.toString() + "-" + c.toString());
            let num=board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideUp(){
    for(let c=0;c<columns;c++){
        let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
        row=slide(row);
        board[0][c]=row[0];
        board[1][c]=row[1];
        board[2][c]=row[2];
        board[3][c]=row[3];
        for(let r=0;r<rows;r++){
            board[r][c]=row[r];
            let tile=document.getElementById(r.toString() + "-" + c.toString());
            let num=board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideDown(){
    for(let c=0;c<columns;c++){
        let row=[board[0][c],board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row=slide(row);
        row.reverse();
        board[0][c]=row[0];
        board[1][c]=row[1];
        board[2][c]=row[2];
        board[3][c]=row[3];
        for(let r=0;r<rows;r++){
            board[r][c]=row[r];
            let tile=document.getElementById(r.toString() + "-" + c.toString());
            let num=board[r][c];
            updateTile(tile,num);
        }
    }
}

function winGame(){
    document.getElementById("board").style.filter="blur(5px)";
    const messageDiv=document.getElementById("congrats");
    messageDiv.style.display="block";
    messageDiv.innerText="🎉 Félicitations ! Vous avez atteint l'un des systèmes d'exploitation qui offre le plus de liberté ! 🎉";
}

const CLE_SCORE_3 = 'score_jeu_3';

if (score > 0) {
    localStorage.setItem(CLE_SCORE_3, score.toString());
    console.log(`Condition secondaire 3 enregistrée : ${score}`);
}
