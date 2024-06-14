// Récupérer le canvas par son ID
const canvas = document.getElementById("simulateur");

// Obtenir le contexte de rendu 2D du canvas
const ctx = canvas.getContext("2d");

// Définir la taille de la matrice
const matrixWidth = 20;
const matrixHeight = 20;

// Définir la taille des tuiles
const tileWidth = 50;
const tileHeight = 25;

// Presets pour les cases
const WATER = 0;
const GRASS = 1;
const SAND = 2;


// Créer une matrice vide
const matrix = [];
for (let i = 0; i < matrixHeight; i++) {
    matrix[i] = [];
    for (let j = 0; j < matrixWidth; j++) {
        matrix[i][j] = 0;
    }
}

// Ajouter une île au milieu de la matrice
const islandSize = 3;
const islandStartX = Math.floor(matrixWidth / 2) - Math.floor(islandSize / 2);
const islandStartY = Math.floor(matrixHeight / 2) - Math.floor(islandSize / 2);
for (let i = islandStartY; i < islandStartY + islandSize; i++) {
    for (let j = islandStartX; j < islandStartX + islandSize; j++) {
        matrix[i][j] = 2;
        if (i === islandStartY + 1 && j === islandStartX + 1) {
            matrix[i][j] = 1;
        }
    }
}

// Fonction pour afficher la matrice isométrique
function drawIsometricMatrix() {
    for (let i = 0; i < matrixHeight; i++) {
        for (let j = 0; j < matrixWidth; j++) {
            const x = (j - i) * tileWidth + (matrixWidth * tileWidth) / 2;
            const y = (j + i) * tileHeight / 2;

            // Dessiner chaque tuile en fonction de sa valeur dans la matrice
            if (matrix[i][j] === 0) {
                // Dessiner une tuile d'eau (bleue)
                ctx.fillStyle = "blue";
                ctx.fillRect(x, y, tileWidth, tileHeight);
            } else if (matrix[i][j] === 1) {
                // Dessiner une tuile d'île (verte)
                ctx.fillStyle = "green";
                ctx.fillRect(x, y, tileWidth, tileHeight);
            }
            else if(matrix[i][j] === 2){
                // Dessiner une tuile de sable (jaune)
                ctx.fillStyle = "yellow";
                ctx.fillRect(x, y, tileWidth, tileHeight);
            }
        }
    }
}

// Appeler la fonction pour afficher la matrice isométrique
drawIsometricMatrix();

// Ajouter une boite contenant les boutons de déplacement
const buttonContainer = document.createElement("div");
buttonContainer.style.position = "absolute";
buttonContainer.style.top = "80%";
buttonContainer.style.left = "25%";
document.body.appendChild(buttonContainer);


// Ajouter les boutons de déplacement
const moveUpButton = document.createElement("button");
moveUpButton.textContent = "Up";
moveUpButton.style.position = "absolute";
moveUpButton.style.top = "-50px";
moveUpButton.style.left = "50%";
moveUpButton.style.transform = "translateX(-50%)";
buttonContainer.appendChild(moveUpButton);
moveUpButton.addEventListener("click", moveUp);

const moveDownButton = document.createElement("button");
moveDownButton.textContent = "Down";
moveDownButton.style.position = "absolute";
moveDownButton.style.bottom = "-50px";
moveDownButton.style.left = "50%";
moveDownButton.style.transform = "translateX(-50%)";
buttonContainer.appendChild(moveDownButton);
moveDownButton.addEventListener("click", moveDown);

const moveLeftButton = document.createElement("button");
moveLeftButton.textContent = "Left";
moveLeftButton.style.position = "absolute";
moveLeftButton.style.top = "50%";
moveLeftButton.style.left = "-50px";
moveLeftButton.style.transform = "translateY(-50%)";
buttonContainer.appendChild(moveLeftButton);
moveLeftButton.addEventListener("click", moveLeft);

const moveRightButton = document.createElement("button");
moveRightButton.textContent = "Right";
moveRightButton.style.position = "absolute";
moveRightButton.style.top = "50%";
moveRightButton.style.right = "-50px";
moveRightButton.style.transform = "translateY(-50%)";
buttonContainer.appendChild(moveRightButton);
moveRightButton.addEventListener("click", moveRight);


// Fonctions de déplacement des tuiles
function moveUp() {
    const firstRow = matrix.shift();
    matrix.push(firstRow);
    drawIsometricMatrix();
}

function moveDown() {
    const lastRow = matrix.pop();
    matrix.unshift(lastRow);
    drawIsometricMatrix();
}

function moveLeft() {
    for (let i = 0; i < matrixHeight; i++) {
        const firstElement = matrix[i].shift();
        matrix[i].push(firstElement);
    }
    drawIsometricMatrix();
}

function moveRight() {
    for (let i = 0; i < matrixHeight; i++) {
        const lastElement = matrix[i].pop();
        matrix[i].unshift(lastElement);
    }
    drawIsometricMatrix();
}