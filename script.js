const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");

const imageURL = "https://placekitten.com/300/300";  // Use any image URL here
let tiles = [];

// Function to initialize the game
function initGame() {
    // Create an array with 8 tiles + 1 empty tile for a 3x3 grid
    tiles = Array.from({ length: 9 }, (_, i) => ({
        index: i,
        element: createTile(i),
    }));

    // Shuffle tiles except the last empty one
    shuffleArray(tiles);

    // Render the tiles on the game board
    tiles.forEach(tile => gameBoard.appendChild(tile.element));
}

// Function to create a tile
function createTile(index) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    // The last tile will be the empty space
    if (index === 8) {
        tile.classList.add("empty");
        return tile;
    }

    // Set background image and position for the other tiles
    const row = Math.floor(index / 3);
    const col = index % 3;
    tile.style.backgroundImage = `url(${imageURL})`;
    tile.style.backgroundPosition = `${-col * 100}px ${-row * 100}px`;

    // Enable drag-and-drop functionality
    tile.setAttribute("draggable", true);
    tile.addEventListener("dragstart", handleDragStart);
    tile.addEventListener("dragover", handleDragOver);
    tile.addEventListener("drop", handleDrop);

    return tile;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Handle the drag start event
function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.target.classList.add("dragging");
}

// Handle drag over event to allow dropping
function handleDragOver(e) {
    e.preventDefault();
}

// Handle drop event
function handleDrop(e) {
    e.preventDefault();
    const draggedTileIndex = e.dataTransfer.getData("text/plain");
    const draggedTile = tiles[draggedTileIndex];
    const targetTile = e.target;

    if (targetTile.classList.contains("empty")) {
        swapTiles(draggedTile.element, targetTile);
        checkWinCondition();
    }
}

// Function to swap two tiles
function swapTiles(tile1, tile2) {
    const tempIndex = tile1.dataset.index;
    tile1.dataset.index = tile2.dataset.index;
    tile2.dataset.index = tempIndex;

    const temp = tiles[tile1.dataset.index];
    tiles[tile1.dataset.index] = tiles[tile2.dataset.index];
    tiles[tile2.dataset.index] = temp;

    gameBoard.appendChild(tile1);
    gameBoard.appendChild(tile2);
}

// Check if the player has won by checking the order of the tiles
function checkWinCondition() {
    if (tiles.every((tile, i) => tile.index === i)) {
        message.textContent = "Congratulations! You solved the puzzle!";
    }
}

// Initialize the game on page load
window.onload = initGame;
