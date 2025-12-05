var x = 0;
var y = 0;
var nb_mine = 0;

var terrain 	= new Array();
var affTerrain 	= new Array();

var continuerJeu = false;

/**
 *	==========================
 *	======= CONSTANTES =======
 *	==========================
 */
var DEFAUT 			= "N";
var CLICK_GAUCHE 	= "G";
var CLICK_DROIT 	= "D";

var MINE 	= "&loz;";
var VIDE 	= "&nbsp;";
var DRAPEAU = "&times;";

// var COULEUR_MINE 	= "#ff7f7f";
// var COULEUR_VIDE 	= "747.png";
// var COULEUR_DRAPEAU = "#87c4c2";
// var COULEUR_CHIFFRE = "#beffc0";

/**
 *	=============================
 *	========= FONCTIONS =========
 *	=============================
 */
/**
 *	Permet d'initialiser le terrain de jeu
 */
var changerTerrain = function(){
	difficulty = document.getElementById("difficulties").value;
	
	if(difficulty=="1"){
		for(var i = 0; i < 9; i++){
		terrain[i] 		= new Array();
		affTerrain[i]	= new Array();
		}
		x 		= 9;
		y 		= 9;
		nb_mine	= 10;
	}

	if(difficulty=="2"){
		for(var i = 0; i < 12; i++){
		terrain[i] 		= new Array();
		affTerrain[i]	= new Array();
		}
		x 		= 16;
		y 		= 16;
		nb_mine	= 40;
	}

	if(difficulty=="3"){
		for(var i = 0; i < 30; i++){
		terrain[i] 		= new Array();
		affTerrain[i]	= new Array();
		}
		x 		= 16;
		y 		= 30;
		nb_mine	= 99;
	}
	
	// let dessin = true;
	
	// if(nb_mine > parseInt(x) * parseInt(y)){
	// 	alert("Putain mais tu peux pas avoir plus de mines que la taille max du plateau, connard!");
	// 	dessin = false;
	// }
	
	// // Si tout est ok...
	// if(dessin){
	// 	// ... on dessine le terrain
	dessinTerrain();
	continuerJeu = true;
	// }
};

/**
 *	Permet de gérer le click sur un bouton
 *	@param	elt	L'élément
 */
var clicBouton = function(elt){
	if(continuerJeu){
		var ex = elt.dataset.x;
		var ey = elt.dataset.y;
		
		clicBoutonAux(ex, ey);
	}
	
	// On teste si le joueur a gagné
	testGagne();
};

/**
 *	Permet d'afficher les cases voisines si la case courante n'a aucune bombe à côté d'elle
 *	@param	cx	Coordonnée en x
 *	@param	cy	Coordonnée en y
 */
var clicBoutonAux = function(cx, cy){
	cx = parseInt(cx);
	cy = parseInt(cy);
	
	// Si on ne sort pas du plateau et que la case n'est pas déjà affichée...
	if( cx >= 0 && cy >= 0 && cx < x && cy < y && affTerrain[cx][cy] == DEFAUT){
		// ... on dit qu'on a affiché la case...
		affTerrain[cx][cy] = CLICK_GAUCHE;
		
		// ... on affiche ce qu'il y a dans la case courante...
		// document.getElementById("cell-" + cx + "-" + cy).style.backgroundColor = COULEUR_CHIFFRE;
		console.log("cell-" + cx + "-" + cy);
		var elt = document.getElementById("cell-" + cx + "-" + cy);

		if (terrain[cx][cy] == MINE) {
		    elt.innerHTML = "<img src='img/Tile_apple.png'>"; // Bombe
		} 
		else if (terrain[cx][cy] == 0) {
    		elt.innerHTML = "<img src='img/Tile_0.png'>";  // Case vide
		} 
		else {
    		elt.innerHTML = "<img src='img/Tile_" + terrain[cx][cy] + ".png'>"; // Chiffre
		}
		
		// ... et si la case courante n'a aucune bombe autour d'elle...
		if(terrain[cx][cy] == 0){
			// ... on regarde celle d'au-dessus...
			clicBoutonAux(cx-1, cy);
			
			// ... puis celle d'en-dessous...
			clicBoutonAux(cx+1, cy);
			
			// ... puis celle d'à gauche...
			clicBoutonAux(cx, cy-1);
			
			// ... puis celle d'à droite...
			clicBoutonAux(cx, cy+1);
			
			// ... puis celle d'en haut à gauche...
			clicBoutonAux(cx-1, cy-1);
			
			// ... puis celle d'en haut à droite...
			clicBoutonAux(cx-1, cy+1);
			
			// ... puis celle d'en bas à gauche...
			clicBoutonAux(cx+1, cy-1);
			
			// ... puis celle d'en bas à droite...
			clicBoutonAux(cx+1, cy+1);
		} 
		// ... et si la case est une bombe
		else if(terrain[cx][cy] == MINE){
			// document.getElementById("cell-" + cx + "-" + cy).style.backgroundColor = COULEUR_MINE;
			document.getElementById("WIN").innerHTML="PERDU :(";
			continuerJeu = false;
		}
	}
};

/**
 *	Permet de gérer le click droit sur le bouton
 *	@param	cx	La coordonnée en x du bouton
 *	@param	cy	La coordonnée en y du bouton
 */
var clicDroitBouton = function(cx, cy){
	// Si on peut continuer le jeu et que la case n'a pas déjà été cochée...
	if(continuerJeu && affTerrain[cx][cy] != "0"){
		var elt = document.getElementById("cell-" + cx + "-" + cy);
		
		if(affTerrain[cx][cy] == DEFAUT){
    		affTerrain[cx][cy] = CLICK_DROIT;
    		elt.innerHTML = "<img src='img/Tile_flag.png'>";
		} 
		else if(affTerrain[cx][cy] == CLICK_DROIT){
    		affTerrain[cx][cy] = DEFAUT;
    		elt.innerHTML = "<img src='img/Tile_full.png'>";
		}
	}
	
	// On teste si le joueur a gagné
	testGagne();
};

/**
 *	Permet de dessiner le terrain de jeu
 */
var dessinTerrain = function(){
	// On met à jour le plateau
	var plateau = document.getElementById("plateau");
	plateau.innerHTML = "";

	// On parcourt les lignes...
	for(var i = 0; i < x; i++){
	// ... et les colonnes...
		for(var j = 0; j < y; j++){
		// ... puis on affiche le bouton
			plateau.innerHTML += "\
									<button 	class='button'\
												onClick='clicBouton(this)' \
												id='cell-" + i + "-" + j + "' \
												data-x='" + i + "' \
												data-y='" + j + "' \
												onContextMenu='clicDroitBouton(" + i + ", " + j + ")'>\
												<img src='img/Tile_full.png'>\
										 \</button>";
		
			var elt = document.getElementById("cell-" + i + "-" + j);

			// if (terrain[i][j] == MINE) {
			//     elt.innerHTML="<img src='img/Tile_apple.png'>";
			// } else if (affTerrain[i][j] == CLICK_DROIT) {
			//     elt.innerHTML="<img src='img/Tile_full.png'>";
			// } else if (terrain[i][j] == 0) {
			//     elt.innerHTML="<img src='img/Tile_full.png'>";
			// } else {
			//     elt.innerHTML="<img src='img/Tile_full.png'>";
			// }
		}
		plateau.innerHTML += "<br/>";
	}
	
	// On génère la position des mines
	genererMines();
};

/**
 *	Permet de générer les autres cases
 */
genererAutresCases = function(){
	for(var i = 0; i < x; i++){
		for(var j = 0; j < y; j++){
			terrain[i][j] = terrain[i][j] == undefined ? minesAutour(i, j) : terrain[i][j];
			affTerrain[i][j] = DEFAUT;
		}
	}
};

/**
 *	Permet la génération des mines
 */
genererMines = function(){
	var continuer = false;
	
	for(var i = 0; i < nb_mine; i++){
		
		while(!continuer){
			var tx = parseInt(Math.random() * (x));
			var ty = parseInt(Math.random() * (y));
			
			if(terrain[tx][ty] == undefined){
				terrain[tx][ty] = MINE;
				
				continuer = true;
			}
		}
		
		continuer = false;
	}
	
	// On génère les autres cases
	genererAutresCases();

	document.getElementById("nombre-pommes").innerHTML="Il y a "+nb_mine+" pommes en tout";
};

/**
 *	Permet d'avoir le nombre de mines autour de la case voulue
 *	@param		cx	Coordonnée x
 *	@param		cy	Coordonnée y
 *	@returns 	Le nombre de mines autour
 */
minesAutour = function(cx, cy){
	var res = 0;
	
	// On regarde en haut
	res += cx == 0 		? 0 : terrain[cx-1][cy] == MINE ? 1 : 0;
	
	// On regarde en bas
	res += cx == x-1 	? 0 : terrain[cx+1][cy] == MINE ? 1 : 0;
	
	// On regarde à gauche
	res += cy == 0 		? 0 : terrain[cx][cy-1] == MINE ? 1 : 0;
	
	// On regarde à gauche
	res += cy == y-1 	? 0 : terrain[cx][cy+1] == MINE ? 1 : 0;
	
	// On regarde en haut à gauche
	res += cx == 0 	 	|| cy == 0 		? 0 : terrain[cx-1][cy-1] == MINE ? 1 : 0;
	
	// On regarde en haut à droite
	res += cx == 0 		|| cy == y-1 	? 0 : terrain[cx-1][cy+1] == MINE ? 1 : 0;
	 
	// On regarde en bas à gauche
	res += cx == x-1 	|| cy == 0 		? 0 : terrain[cx+1][cy-1] == MINE ? 1 : 0;
	
	// On regarde en haut à droite
	res += cx == x-1 	|| cy == y-1 	? 0 : terrain[cx+1][cy+1] == MINE ? 1 : 0;
	
	return res;
};

/**
 *	Permet de tester si le joueur a gagné
 *	@returns	TRUE	Si oui
 *				FALSE	Sinon
 */
var testGagne = function(){
	for(var i = 0; i < x; i++){
		for(var j = 0; j < y; j++){
			if(affTerrain[i][j] == DEFAUT || (affTerrain[i][j] == CLICK_DROIT && terrain[i][j] != MINE) || (affTerrain[i][j] == CLICK_GAUCHE && terrain[i][j] == MINE)){
				return false;
			}
		}
	}
	
	document.getElementById("WIN").innerHTML="GAGN&Eacute; :D";
	continuerJeu = false;
}

/**
 *	=================================
 *	===== Chargement du terrain ===== 
 *	=================================
 */
changerTerrain();

// Désactivation du clic droit sur la page

document.addEventListener('contextmenu', function (event) {
  event.preventDefault()
  return false
})
