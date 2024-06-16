// Récupérer le canvas par son ID
const canvas = document.getElementById("simulateur");

// Obtenir le contexte de rendu 2D du canvas
const ctx = canvas.getContext("2d");

// Définir la taille de la matrice

let step = 1;
const size = 2;
const matrixWidth = 2**(size) + 1;
const matrixHeight = 2**(size) + 1;

// Définir la taille des tuiles
const tileWidth = 1050/matrixWidth;
const tileHeight = 1050/matrixHeight;

// Presets pour les cases
const ABYSS = 1;
const DEEPWATER = 2;
const WATER = 3;
const HALFWATER = 4;
const PUDDLE = 5;
const SAND = 6;
const COAST = 7;
const DIRT = 8;
const DARKDIRT = 9;
const GRASS = 10;
const FOREST = 11;
const ROCK = 12;
const LIGHTROCK = 13;
const HALFROCK = 14;
const LIGHTSNOW = 15;
const SNOW = 16;

const randomRange = [0,size];
current_range_random = randomRange;
const shrinkCoef = 0.8;



// Créer une matrice vide
const matrix = [];
for (let i = 0; i < matrixHeight; i++) {
	matrix[i] = [];
	for (let j = 0; j < matrixWidth; j++) {
		matrix[i][j] = 0;
	}
}

// Initialisation des coins
matrix[0][0] = getRandomHeight();
matrix[0][matrixWidth - 1] = getRandomHeight();
matrix[matrixHeight - 1][0] = getRandomHeight();
matrix[matrixHeight - 1][matrixWidth - 1] = getRandomHeight();


// Fonction pour obtenir une hauteur aléatoire
function getRandomHeight() {
    return Math.floor(Math.random() * 15)+1;
}

// Fonction pour baisser le coefficient de réduction
function shrinkRangeRandom() {
    current_range_random[0] = current_range_random[0] * shrinkCoef;
    current_range_random[1] = current_range_random[1] * shrinkCoef;
}


// Fonction pour dessiner la matrice
function drawMatrix() {
    for (let i = 0; i < matrixHeight; i++) {
        for (let j = 0; j < matrixWidth; j++) {
			console.log(i,j,matrix[i][j]);
            switch (matrix[i][j]) {
                case ABYSS:
                    ctx.fillStyle = "midnightblue";
                    break;
                case DEEPWATER:
                    ctx.fillStyle = "darkblue";
                    break;
                case WATER:
                    ctx.fillStyle = "blue";
                    break;
                case HALFWATER:
                    ctx.fillStyle = "lightblue";
                    break;
                case PUDDLE:
                    ctx.fillStyle = "cyan";
                    break;
                case SAND:
                    ctx.fillStyle = "yellow";
                    break;
                case COAST:
                    ctx.fillStyle = "orange";
                    break;
                case DIRT:
                    ctx.fillStyle = "brown";
                    break;
                case DARKDIRT:
                    ctx.fillStyle = "darkbrown";
                    break;
                case GRASS:
                    ctx.fillStyle = "green";
                    break;
                case FOREST:
                    ctx.fillStyle = "darkgreen";
                    break;
                case ROCK:
                    ctx.fillStyle = "gray";
                    break;
                case LIGHTROCK:
                    ctx.fillStyle = "lightgray";
                    break;
                case HALFROCK:
                    ctx.fillStyle = "darkgray";
                    break;
                case LIGHTSNOW:
                    ctx.fillStyle = "lightblue";
                    break;
                case SNOW:
                    ctx.fillStyle = "white";
                    break;
                default:
                    ctx.fillStyle = "black";
                    break;
            }
            ctx.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
        }
    }
}

// Fonction pour dessiner la grille

function drawmatrix() {
    ctx.strokeStyle = "black";
    for (let i = 0; i < matrixHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tileHeight);
        ctx.lineTo(matrixWidth * tileWidth, i * tileHeight);
        ctx.stroke();
    }
    for (let i = 0; i < matrixWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileWidth, 0);
        ctx.lineTo(i * tileWidth, matrixHeight * tileHeight);
        ctx.stroke();
    }
}

// Fonction pour obtenir les coordonnées de la souris
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((evt.clientX - rect.left) / tileWidth),
        y: Math.floor((evt.clientY - rect.top) / tileHeight)
    };
}

// Fonction pour dessiner la matrice et la grille
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMatrix();
    drawmatrix();
}



// Fonction pour gérer les clics de souris
canvas.addEventListener("click", function (evt) {
    const mousePos = getMousePos(canvas, evt);
    changeTile(mousePos.x, mousePos.y);
    draw();
});

// Fonction diamondSquare pour générer un terrain

function diamondSquare(x, y, size) {
	console.log(x,y,size);
	square(x,y,size);
    diamond(x,y,size);
    shrinkRangeRandom();
    if (size > 1) {
		console.log("diving");
        diamondSquare(x,y,(size+1)/2);
        diamondSquare(x + (size+1)/2,y,(size+1)/2);
        diamondSquare(x,y + (size+1)/2,(size+1)/2);
        diamondSquare(x + (size+1)/2, y + (size+1)/2,(size+1)/2);
    }
}

// Fonction pour les carrés
function square(topX, topY, size) {
    let rd = getRdm();
    let index = {};
    index.x = Math.floor((size)  / 2 + topX);
    index.y = Math.floor((size)  / 2 + topY);
	console.log("index",topX,topY, matrix[topX][topY]);
    matrix[index.x][index.y] = clamp(Math.floor(calculateAverage([
        matrix[topX][topY], 
        matrix[topX + size][topY], 
        matrix[topX + size][topY + size],
        matrix[topX][topY + size] 
    ]) + rd), 1, 16);
	console.log("square",index.x,index.y,matrix[index.x][index.y]);
}

// Fonction pour les diamants
function diamond(topX, topY, size) {
    let tl = matrix[topX][topY];
    let tr = matrix[topX + size][topY]; 
    let br = matrix[topX + size][topY + size];
    let bl = matrix[topX][topY + size];
    let center = matrix[Math.floor((size) / 2 + topX) ][Math.floor((size) / 2 + topY)];

    let rd = getRdm();
	let x = Math.floor((size) / 2 + topX);
	let y = topY;
	console.log("diamond",x,y,matrix[x][y]);
    matrix[x][y] = clamp(calculateAverage([tl,tr,center]) + rd,1,16);
    
    rd = getRdm();
	x = topX + size;
	y = Math.floor((size) / 2 + topY);
    matrix[x][y] = clamp(calculateAverage([tr,br,center]) + rd,1,16);
	console.log("diamond",x,y,matrix[x][y]);
   
    rd = getRdm();
	x = Math.floor((size) / 2 + topX);
	y = topY + size;
	console.log("diamond",x,y,matrix[x][y]);
    matrix[x][y] = clamp(calculateAverage([br,bl,center]) + rd,1,16);

    rd = getRdm();
	x = topX;
	y = Math.floor((size) / 2 + topY);
	console.log("diamond",x,y,matrix[x][y]);
    matrix[x][y] = clamp(calculateAverage([bl,tl,center]) + rd,1,16);
}

// Fonction pour changer la tuile
function changeTile(x, y) {
	matrix[y][x] = getRandomHeight();
}



// Fonction pour calculer la moyenne
function calculateAverage(array) { 
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return Math.floor(sum / array.length);
}


// Fonction pour obtenir un nombre aléatoire
function getRdm() {
    return Math.floor(Math.random() * (current_range_random[1] - current_range_random[0]) + current_range_random[0]);
}


// Fonction pour garder une valeur entre deux bornes
function clamp(value, min, max) {
    return Math.floor(Math.min(Math.max(value, min), max));
}

// Fonction pour générer un terrain aléatoire
function randomTerrain(matrix) {
    for (let i = 0; i < matrixHeight; i++) {
        for (let j = 0; j < matrixWidth; j++) {
            matrix[i][j] = Math.floor(Math.random() * 5);
        }
    }
}



// Dessiner la matrice et la grille
draw();
diamondSquare(0, 0, matrixHeight);
draw();
