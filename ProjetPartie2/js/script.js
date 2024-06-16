// Récupérer le canvas par son ID
const canvas = document.getElementById("simulateur");

// Obtenir le contexte de rendu 2D du canvas
const ctx = canvas.getContext("2d");

// Définir la taille de la matrice

let step = 1;
const size = 5;
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

const randomRange = [-4,4];
current_range_random = [...randomRange];
const shrinkCoef = 0.5;



// Créer une matrice vide
const matrix = [];
for (let i = 0; i < matrixHeight; i++) {
    matrix[i] = [];
}

// Initialisation des coins
matrix[0][0] = getRandomHeight();
matrix[0][matrixWidth - 1] = getRandomHeight();
matrix[matrixHeight - 1][0] = getRandomHeight();
matrix[matrixHeight - 1][matrixWidth - 1] = getRandomHeight();


// Fonction pour obtenir une hauteur aléatoire
function getRandomHeight() {
    return Math.floor(Math.random() * 16);
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
    for (let i = 0; i <= matrixHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tileHeight);
        ctx.lineTo(matrixWidth * tileWidth, i * tileHeight);
        ctx.stroke();
    }
    for (let i = 0; i <= matrixWidth; i++) {
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

function diamondSquare(size) {
    for(let x=0; x<2**(step-1);x++){
        for(let y=0; y<2**(step-1);y++){
            square(x*(size-1),y*(size-1),size);
            diamond(x*(size-1),y*(size-1),size);
        }
    }
    step++;
    shrinkRangeRandom();
    if (size > 3) {
        diamondSquare((size + 1) / 2);
    }
}

// Fonction pour les carrés
function square(topX, topY, size) {
    let rd = getRdm();
    let index = {};
    index.x = Math.floor((size + 1)  / 2 + topX - 1); 
    index.y = Math.floor((size + 1)  / 2 + topY - 1); 
    matrix[index.x][index.y] = calculateAverage([
        matrix[topX][topY], 
        matrix[topX + size-1][topY], 
        matrix[topX + size-1][topY + size - 1],
        matrix[topX][topY + size - 1] 
    ]) + rd;
}

// Fonction pour les diamants
function diamond(topX, topY, size) {
    let tl = matrix[topX][topY];
    let tr = matrix[topX + size-1][topY]; 
    let br = matrix[topX + size-1][topY + size - 1];
    let bl = matrix[topX][topY + size - 1];
    let center = matrix[Math.floor((size - 1) / 2 + topX)][Math.floor((size - 1) / 2 + topY)];

    let rd = getRdm();
    matrix[Math.floor((size - 1) / 2 + topX)][topY] = calculateAverage([tl,tr,center]) + rd;
    
    rd = getRdm();
    matrix[topX + size-1][Math.floor((size - 1) / 2 + topY)] = calculateAverage([tr,br,center]) + rd;
   
    rd = getRdm();
    matrix[Math.floor((size - 1) / 2 + topX)][size - 1 + topY] = calculateAverage([br,bl,center]) + rd;

    rd = getRdm();
    matrix[topX][Math.floor((size - 1) / 2 + topY)] = calculateAverage([bl,tl,center]) + rd;
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
    return Math.floor(Math.random() * (current_range_random[1] - current_range_random[0]));
}


// Fonction pour garder une valeur entre deux bornes
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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
diamondSquare(size);
draw();
