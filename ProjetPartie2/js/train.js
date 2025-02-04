/************************************************************/
/**
 * Université Sorbonne Paris Nord, Programmation Web
 * Auteurs                       : Étienne André
 * Création                      : 2023/12/11
 * Dernière modification         : 2024/06/16 par Denis Linde et Timothée M'Bassidje
 */
/************************************************************/

'use strict'

/************************************************************/
/* Constantes */
/************************************************************/

/*------------------------------------------------------------*/
// Dimensions du plateau
/*------------------------------------------------------------*/

// Définir la taille de la matrice
let dispersion = 16;
let step = 1;
const size = 7;

// Nombre de cases par défaut du simulateur
const LARGEUR_PLATEAU	= 2**size + 1;
const HAUTEUR_PLATEAU	= 2**size + 1;

// Dimensions des cases par défaut en pixels
const LARGEUR_CASE	= 1050/30;
const HAUTEUR_CASE	= 1050/30;


const randomRange = [-4,4];
let current_range_random = randomRange;
const shrinkCoef = 0.5;

/*------------------------------------------------------------*/
// Types des cases
/*------------------------------------------------------------*/
class Type_de_case{
	static Foret					= new Type_de_case('foret');

	static Eau						= new Type_de_case('eau');

	static Rail_horizontal			= new Type_de_case('rail horizontal');

	static Rail_vertical			= new Type_de_case('rail vertical');

	// NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le haut (ou de vertical vers horizontal en allant de bas vers gauche)
	static Rail_droite_vers_haut	= new Type_de_case('rail droite vers haut');

	// NOTE: faisant la jonction de vertical à horizontal en allant vers le haut puis vers la droite (ou de horizontal à vertical en allant de gauche vers le bas)
	static Rail_haut_vers_droite	= new Type_de_case('rail haut vers droite');

	// NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le bas (ou de vertical vers horizontal en allant de haut vers gauche)
	static Rail_droite_vers_bas		= new Type_de_case('rail droite vers bas');

	// NOTE: faisant la jonction de vertical à horizontal en allant vers le bas puis vers la droite (ou de horizontal à vertical en allant de gauche vers le haut)
	static Rail_bas_vers_droite		= new Type_de_case('rail bas vers droite');

	static Terrain1					= new Type_de_case('1');

	static Terrain2					= new Type_de_case('2');

	static Terrain3					= new Type_de_case('3');

	static Terrain4					= new Type_de_case('4');

	static Terrain5					= new Type_de_case('5');

	static Terrain6					= new Type_de_case('6');

	static Terrain7					= new Type_de_case('7');

	static Terrain8					= new Type_de_case('8');

	static Terrain9					= new Type_de_case('9');

	static Terrain10					= new Type_de_case('10');

	static Terrain11					= new Type_de_case('11');

	static Terrain12					= new Type_de_case('12');

	static Terrain13					= new Type_de_case('13');

	static Terrain14					= new Type_de_case('14');

	static Terrain15					= new Type_de_case('15');

	static Terrain16					= new Type_de_case('16');

	constructor(nom){
		this.nom = nom;
		this.valeur = 0;
	}

	setValeur(valeur){
		this.valeur = valeur;
		this.nom = Math.round(valeur).toString();
	}

	getValeur(){
		return this.valeur;
	}

	clone(){
		let res = new Type_de_case(this.nom);
		res.valeur = this.valeur;
		return res;
	}
}





/*------------------------------------------------------------*/
// Images
/*------------------------------------------------------------*/
const IMAGE_EAU = new Image();
IMAGE_EAU.src = 'images/eau.png';

const IMAGE_FORET = new Image();
IMAGE_FORET.src = 'images/foret.png';

const IMAGE_LOCO = new Image();
IMAGE_LOCO.src = 'images/locomotive.png';

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = 'images/rail-horizontal.png';

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = 'images/rail-vertical.png';

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = 'images/rail-bas-vers-droite.png';

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = 'images/rail-droite-vers-bas.png';

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = 'images/rail-droite-vers-haut.png';

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = 'images/rail-haut-vers-droite.png';

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = 'images/wagon.png';

const IMAGE_TERRAIN1 = new Image();
IMAGE_TERRAIN1.src = 'images/1.png';

const IMAGE_TERRAIN2 = new Image();
IMAGE_TERRAIN2.src = 'images/2.png';

const IMAGE_TERRAIN3 = new Image();
IMAGE_TERRAIN3.src = 'images/3.png';

const IMAGE_TERRAIN4 = new Image();
IMAGE_TERRAIN4.src = 'images/4.png';

const IMAGE_TERRAIN5 = new Image();
IMAGE_TERRAIN5.src = 'images/5.png';

const IMAGE_TERRAIN6 = new Image();
IMAGE_TERRAIN6.src = 'images/6.png';

const IMAGE_TERRAIN7 = new Image();
IMAGE_TERRAIN7.src = 'images/7.png';

const IMAGE_TERRAIN8 = new Image();
IMAGE_TERRAIN8.src = 'images/8.png';

const IMAGE_TERRAIN9 = new Image();
IMAGE_TERRAIN9.src = 'images/9.png';

const IMAGE_TERRAIN10 = new Image();
IMAGE_TERRAIN10.src = 'images/10.png';

const IMAGE_TERRAIN11 = new Image();
IMAGE_TERRAIN11.src = 'images/11.png';

const IMAGE_TERRAIN12 = new Image();
IMAGE_TERRAIN12.src = 'images/12.png';

const IMAGE_TERRAIN13 = new Image();
IMAGE_TERRAIN13.src = 'images/13.png';

const IMAGE_TERRAIN14 = new Image();
IMAGE_TERRAIN14.src = 'images/14.png';

const IMAGE_TERRAIN15 = new Image();
IMAGE_TERRAIN15.src = 'images/15.png';

const IMAGE_TERRAIN16 = new Image();
IMAGE_TERRAIN16.src = 'images/16.png';



/************************************************************/
// Variables globales
/************************************************************/

let currentCase = null;
let plateau;
let contexte = document.getElementById('simulateur').getContext("2d");
let playing;
let TickRate = 1000;


/************************************************************/
/* Classes */
/************************************************************/

/*------------------------------------------------------------*/
// Plateau
/*------------------------------------------------------------*/

class Plateau{
	/* Constructeur d'un plateau vierge */
	constructor(){
		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;

		// NOTE: à compléter…

		// État des cases du plateau
		// NOTE: tableau de colonnes, chaque colonne étant elle-même un tableau de cases (beaucoup plus simple à gérer avec la syntaxe case[x][y] pour une coordonnée (x,y))
		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = Type_de_case.Foret.clone();
			}
		}

		
		// Initialisation des coins
		const defaultHeight = getRandomHeight();
		this.cases[0][0].setValeur(defaultHeight);
		this.cases[0][HAUTEUR_PLATEAU - 1].setValeur(defaultHeight);
		this.cases[HAUTEUR_PLATEAU - 1][0].setValeur(defaultHeight);
		this.cases[HAUTEUR_PLATEAU - 1][HAUTEUR_PLATEAU - 1].setValeur(defaultHeight);




		this.trains = [];
	}

	ajouterTrain(x, y, train){
		this.trains.push(train);
	}
}


/*------------------------------------------------------------*/
// Train
/*------------------------------------------------------------*/

class Train{
	constructor(nbWagon, isLoco){
		this.x = -1;
		this.y = -1;
		this.oldX = 0;
		this.oldY = 0;
		if(isLoco){
			this.image = IMAGE_LOCO;
			this.vector = [1,0];
		}
		else{
			this.image = IMAGE_WAGON;
		}
		this.nbWagon = nbWagon;
		this.isLoco = isLoco;
		if(nbWagon > 0)
			this.next = new Train(nbWagon-1, false);
	}

	avancer(x, y){
        if(x<0)
            x = plateau.largeur - 1;
        if(x>=plateau.largeur)
            x = 0;
        if(y<0)
            y = plateau.hauteur - 1;
        if(y>=plateau.hauteur)
            y = 0;
		this.oldX = this.x;
		this.oldY = this.y;
		this.x = x;
		this.y = y;
		if(this.nbWagon > 0){
			this.next.avancer(this.oldX, this.oldY);
		}
    }
}


/************************************************************/
// Méthodes
/************************************************************/



// Fonction pour obtenir une hauteur aléatoire
function getRandomHeight() {
    return Math.floor(Math.random() * 15)+1;
}


// Fonction pour baisser le coefficient de réduction
function shrinkRangeRandom(size) {
    current_range_random[0] = -dispersion * size/HAUTEUR_PLATEAU;
    current_range_random[1] = dispersion * size/LARGEUR_PLATEAU;
}


// Fonction diamondSquare pour générer un terrain
function diamondSquare(x, y, size) {
	square(x,y,size);
    diamond(x,y,size);
    shrinkRangeRandom(size);
	step++;
    if (size > 4) {
        diamondSquare(x,y,(size+1)/2);
        diamondSquare(x + (size+1)/2 -1,y,(size+1)/2);
        diamondSquare(x,y + (size+1)/2 -1,(size+1)/2);
        diamondSquare(x + (size+1)/2 -1, y + (size+1)/2 - 1,(size+1)/2);
    }
}

// Fonction pour les carrés
function square(topX, topY, size) {
    let rd = getRdm();
    let index = {};
    index.x = topX + (size-1)/2;
    index.y = topY + (size-1)/2;

    size = size - 1;
    plateau.cases[index.x][index.y].setValeur(clamp(calculateAverage([
        plateau.cases[topX][topY].getValeur(), 
        plateau.cases[topX + size][topY].getValeur(), 
        plateau.cases[topX + size][topY + size].getValeur(),
        plateau.cases[topX][topY + size].getValeur() 
    ]) + rd, 1, 16));

}

// Fonction pour les diamants
function diamond(topX, topY, size) {

    size = size - 1;
    let tl = plateau.cases[topX][topY].getValeur();
    let tr = plateau.cases[topX + size][topY].getValeur(); 
    let br = plateau.cases[topX + size][topY + size].getValeur();
    let bl = plateau.cases[topX][topY + size].getValeur();
    let center = plateau.cases[ topX + (size)/2 ][ topY + (size)/2].getValeur();

    let rd = getRdm();
	let x = topX + (size)/2;
	let y = topY;
    if(plateau.cases[x][y].getValeur() == 0) {
        plateau.cases[x][y].setValeur(clamp(calculateAverage([tl,tr,center]) + rd,1,16));
    }
    
    rd = getRdm();
	x = topX + size;
	y = topY + (size)/2;
    if(plateau.cases[x][y].getValeur() == 0) {
        plateau.cases[x][y].setValeur(clamp(calculateAverage([tr,br,center]) + rd,1,16));
    }
 

   
    rd = getRdm();
	x = topX + (size)/2;
	y = topY + size;

   if(plateau.cases[x][y].getValeur() == 0) {
        plateau.cases[x][y].setValeur(clamp(calculateAverage([bl,br,center]) + rd,1,16));
    }

    rd = getRdm();
	x = topX;
	y = topY + (size)/2;

   if(plateau.cases[x][y].getValeur() == 0) {
        plateau.cases[x][y].setValeur(clamp(calculateAverage([tl,bl,center]) + rd,1,16));
    }
}


// Fonction pour calculer la moyenne
function calculateAverage(array) { 
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}

// Fonction pour obtenir un nombre aléatoire
function getRdm() {
    return Math.random() * (current_range_random[1] - current_range_random[0]) + current_range_random[0];
}


// Fonction pour garder une valeur entre deux bornes
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


function image_of_case(type_de_case){
	switch(type_de_case.nom){
		case 'Foret': return IMAGE_FORET;
		case 'Eau': return IMAGE_EAU;
		case 'rail horizontal': return IMAGE_RAIL_HORIZONTAL;
		case 'rail vertical': return IMAGE_RAIL_VERTICAL;
		case 'rail droite vers haut': return IMAGE_RAIL_DROITE_VERS_HAUT;
		case 'rail haut vers droite': return IMAGE_RAIL_HAUT_VERS_DROITE;
		case 'rail droite vers bas': return IMAGE_RAIL_DROITE_VERS_BAS;
		case 'rail bas vers droite': return IMAGE_RAIL_BAS_VERS_DROITE;
		case '1': return IMAGE_TERRAIN1;
		case '2': return IMAGE_TERRAIN2;
		case '3': return IMAGE_TERRAIN3;
		case '4': return IMAGE_TERRAIN4;
		case '5': return IMAGE_TERRAIN5;
		case '6': return IMAGE_TERRAIN6;
		case '7': return IMAGE_TERRAIN7;
		case '8': return IMAGE_TERRAIN8;
		case '9': return IMAGE_TERRAIN9;
		case '10': return IMAGE_TERRAIN10;
		case '11': return IMAGE_TERRAIN11;
		case '12': return IMAGE_TERRAIN12;
		case '13': return IMAGE_TERRAIN13;
		case '14': return IMAGE_TERRAIN14;
		case '15': return IMAGE_TERRAIN15;
		case '16': return IMAGE_TERRAIN16;
    }
}


function dessine_case(contexte, plateau, x, y){
	const la_case = plateau.cases[x][y];
	let image_a_afficher = image_of_case(la_case);
	// Affiche l'image concernée
	contexte.drawImage(image_a_afficher, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}

function dessine_plateau(page, plateau){
	// Dessin du plateau avec paysages et rails
	for (let x = 0; x < plateau.largeur; x++) {
		for (let y = 0; y < plateau.hauteur; y++) {
			dessine_case(page, plateau, x, y);
		}
	}
}

function peindre(x, y, typeCase, plateau){
	// Peindre la case x, y du plateau en typeCase
	plateau.cases[x][y] = typeCase;
}


function selectionnerCase(event){
	if(event.target.nodeName === 'BUTTON'){
		if(event.target.textContent === 'Pause'){
			event.target.textContent = "Reprendre";
			clearInterval(playing);
		}else{
			event.target.textContent = "Pause";
			playing = setInterval(tick, TickRate);
		}
	}
	if(currentCase !== null){
		if(event.target.nodeName === 'CANVAS'){
			let x = Math.floor(event.offsetX / LARGEUR_CASE);
			let y = Math.floor(event.offsetY / HAUTEUR_CASE);
			let newCase = getTypeFromBouton(currentCase);
			if(typeof newCase === 'number'){
				poserTrain(x, y, plateau, new Train(newCase, true));
			}
			else{
				peindre(x, y, newCase, plateau);
				dessine_case(event.target.getContext("2d"), plateau, x, y);
			}
		}
		else if(event.target.nodeName === 'INPUT'){
			currentCase.disabled = false;
			currentCase = event.target;
			event.target.disabled = true;
		}
	}
	else{
		if(event.target.nodeName === 'INPUT'){
			currentCase = event.target;
			event.target.disabled = true;
		}
	}
}

function poserTrain(x, y, plateau, train){
	switch(plateau.cases[x][y]){
		case Type_de_case.Rail_horizontal:
			for(let i = 0; i <= train.nbWagon; i++){
				if(x-i < 0){
					console.log("Impossible de poser le train ici");
					return;
				}
				console.log(plateau.cases[x-i][y]);
				if((plateau.cases[x-i][y] !== Type_de_case.Rail_horizontal) || (plateau.trains[[x-i,y]] !== undefined)){
					console.log("Impossible de poser le train ici");
					return;
				}
			}
			train.x = x;
			train.y = y;
			plateau.ajouterTrain(x, y, train);
			dessinerTrain(plateau, train);
			let tempTrain = train;
			while(tempTrain.nbWagon > 0){
				tempTrain = tempTrain.next;
				plateau.ajouterTrain(--x, y, tempTrain);
				tempTrain.x = x;
				tempTrain.y = y;
				dessinerTrain(plateau, tempTrain);
			}
			break;
		default:
			console.log("Impossible de poser le train ici");
	}
}

function dessinerTrain(plateau){
	let context = document.getElementById('simulateur').getContext("2d");
	dessine_plateau(context, plateau);
	plateau.trains.forEach((train) => {
		if(train !== undefined)
			context.drawImage(train.image, train.x * LARGEUR_CASE, train.y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
	});
}

function getTypeFromBouton(bouton){
	let res;
	switch(bouton.id){
		case 'bouton_foret':
			res = Type_de_case.Foret;
			break;
		case 'bouton_eau':
			res = Type_de_case.Eau;
			break;
		case 'bouton_rail_horizontal':
			res = Type_de_case.Rail_horizontal;
			break;
		case 'bouton_rail_vertical':
			res = Type_de_case.Rail_vertical;
			break;
		case 'bouton_rail_droite_vers_haut':
			res = Type_de_case.Rail_droite_vers_haut;
			break;
		case 'bouton_rail_haut_vers_droite':
			res = Type_de_case.Rail_haut_vers_droite;
			break;
		case 'bouton_rail_droite_vers_bas':
			res = Type_de_case.Rail_droite_vers_bas;
			break;
		case 'bouton_rail_bas_vers_droite':
			res = Type_de_case.Rail_bas_vers_droite;
			break;
		case 'bouton_train_1':
			res = 0;
			break;
		case 'bouton_train_2':
			res = 1;
			break;
		case 'bouton_train_4':
			res = 3;
			break;
		case 'bouton_train_6':
			res = 5;
			break;
		default:
			console.log("Train séléctionné");
			res = null;
	}
	return res;
}


function tick(){
	Object.values(plateau.trains).forEach((train) => {
		if(train !== undefined  && train.isLoco){
			console.log(train);
			let tmp = plateau.cases[train.x][train.y];
			let coord = [];
			switch(tmp.nom){
				case "rail droite vers haut":
					if(train.vector[0] === 1){
						coord = [0,-1];
					}
					else if(train.vector[0] === -1 || train.vector[1] === -1){
						exploserTrain(train);
						return;
					}
					else{
						coord = [-1,0];
					}
					break;
				case "rail haut vers droite":
					if(train.vector[0] === -1){
						coord = [0,1];
					}
					else if(train.vector[0] === 1 || train.vector[1] === 1){
						exploserTrain(train);
						return;
					}
					else{
						coord = [1,0];
					}
					break;
				case "rail droite vers bas":
					if(train.vector[0] === 1){
						coord = [0,1];
					}
					else if(train.vector[0] === -1 || train.vector[1] === 1){
						exploserTrain(train);
						return;
					}
					else{
						coord = [-1,0];
					}
					break;
				case "rail bas vers droite":
					if(train.vector[0] === -1){
						coord = [0,-1];
					}
					else if(train.vector[0] === 1 || train.vector[1] === -1){
						exploserTrain(train);
						return;
					}
					else{
						coord = [1,0];
					}
					break;
				case "rail horizontal":
					coord = train.vector;
					break;
				case "rail vertical":
					coord = train.vector;
					break;
				default:
					exploserTrain(train);
					return;
			}
			train.vector = [coord[0], coord[1]];
			console.log(coord);
			console.log(tmp);
			train.avancer(train.x + coord[0], train.y + coord[1]);
			dessinerTrain(plateau, train);
		}
	});
}

function start(){
	playing = setInterval(tick, TickRate);
}


function exploserTrain(train){
	if(train.nbWagon > 0){
		exploserTrain(train.next);
	}
	if(train.isLoco){
		plateau.trains[plateau.trains.indexOf(train)] = undefined;
	}
	dessine_case(contexte, plateau, train.x, train.y);
	train.next = undefined;
	train = undefined;
}

/************************************************************/
// Auditeurs
/************************************************************/

window.addEventListener('click', selectionnerCase);let keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    if(keys['ArrowLeft']){
        plateau.cases.unshift(plateau.cases.pop());
        dessine_plateau(contexte, plateau);
		plateau.trains.forEach((train) => {
			if(train === undefined)
				return;
			train.avancer(train.x + 1, train.y);
			dessinerTrain(plateau, train);
		});
    }
    if(keys['ArrowRight']){
        plateau.cases.push(plateau.cases.shift());
		dessine_plateau(contexte, plateau);
		plateau.trains.forEach((train) => {
			if(train === undefined)
				return;
			train.avancer(train.x - 1, train.y);
			dessinerTrain(plateau, train);
		});
    }
    if(keys['ArrowUp']){
        plateau.cases.forEach((colonne) => {
            colonne.unshift(colonne.pop());
        });
		dessine_plateau(contexte, plateau);
		plateau.trains.forEach((train) => {
			if(train === undefined)
				return;
			train.avancer(train.x, train.y + 1);
			dessinerTrain(plateau, train);
		});
    }
    if(keys['ArrowDown']){
        plateau.cases.forEach((colonne) => {
            colonne.push(colonne.shift());
        });
		dessine_plateau(contexte, plateau);
		plateau.trains.forEach((train) => {
			if(train === undefined)
				return;
			train.avancer(train.x, train.y - 1);
			dessinerTrain(plateau, train);
		});
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});


/************************************************************/
// Plateau de jeu initial
/************************************************************/


// NOTE : ne pas modifier le plateau initial
function cree_plateau_initial(plateau){
	diamondSquare(0, 0, LARGEUR_PLATEAU);
}

/************************************************************/
// Fonction principale
/************************************************************/

function tchou(){
	console.log("Tchou, attention au départ !");
	/*------------------------------------------------------------*/
	// Variables DOM
	/*------------------------------------------------------------*/

	// NOTE: ce qui suit est sûrement à compléter voire à réécrire intégralement

	// Création du plateau
	plateau = new Plateau()
	cree_plateau_initial(plateau);
	let othercontexte = document.getElementById('simulateur').getContext("2d");
	// Dessine le plateau
	dessine_plateau(othercontexte, plateau);

}

/************************************************************/
// Programme principal
/************************************************************/
// NOTE: rien à modifier ici !
window.addEventListener("load", () => {
	// Appel à la fonction principale
	tchou();
	start();
});
