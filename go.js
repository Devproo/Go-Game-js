// Set the board size to 9x9
const boardSize = 9;

// Initialize the current player to 'black'
let currentPlayer = "black";

// Create a 2D array to represent the board state
// 0: empty, 1: black stone, 2: white stone
let boardState = Array(boardSize)
  .fill(null)
  .map(() => Array(boardSize).fill(0));

// Get a reference to the board element from the HTML
const board = document.getElementById("board");

// Get a reference to the current player display element
const currentPlayerDisplay = document.getElementById("currentPlayer");

// Get a reference to the reset button element
const resetButton = document.getElementById("resetButton");

// Function to create the Go board grid
function createBoard() {
  // Clear the board content before creating it
  board.innerHTML = "";

  // Loop through each row and column to create the grid cells
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // Create a new div element for each cell
      const cell = document.createElement("div");
      // Add the 'cell' class to style the cell
      cell.classList.add("cell");
      // Store the row and column indices as data attributes
      cell.dataset.row = i;
      cell.dataset.col = j;
      // Add a click event listener to place a stone when the cell is clicked
      cell.addEventListener("click", () => placeStone(cell, i, j));
      // Append the cell to the board element
      board.appendChild(cell);
    }
  }
}

// Function to place a stone on the board
function placeStone(cell, row, col) {
  // Check if the cell is already occupied, if so, return early
  if (boardState[row][col] !== 0) return;

  // Create a new div element for the stone
  const stone = document.createElement("div");
  // Add the 'stone' class and the current player's class ('black' or 'white')
  stone.classList.add("stone", currentPlayer);
  // Append the stone to the clicked cell
  cell.appendChild(stone);

  // Update the board state with the current player's stone
  boardState[row][col] = currentPlayer === "black" ? 1 : 2;

  // Check if placing the stone captures any opponent stones
  checkCaptures(row, col);

  // Switch the current player to the other player
  currentPlayer = currentPlayer === "black" ? "white" : "black";
  // Update the current player display
  updateCurrentPlayerDisplay();
}

// Function to check if any stones should be captured
function checkCaptures(row, col) {
  // Determine the opponent's stone value (1 for black, 2 for white)
  const opponent = currentPlayer === "black" ? 2 : 1;

  // Define the directions to check for captured stones: right, down, left, up
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Loop through each direction to check for captured stones
  directions.forEach(([dx, dy]) => {
    const capturedStones = [];
    // If the opponent's stones are captured, remove them
    if (isCaptured(row + dx, col + dy, opponent, capturedStones)) {
      capturedStones.forEach(([r, c]) => removeStone(r, c));
    }
  });
}

// Function to check if a group of stones is captured
function isCaptured(row, col, opponent, capturedStones) {
  // Check if the position is out of bounds or the cell is empty
  if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) return false;
  if (boardState[row][col] === 0) return false;
  // If the stone is not an opponent's stone, return true (not captured)
  if (boardState[row][col] !== opponent) return true;

  // Add the stone to the list of potentially captured stones
  capturedStones.push([row, col]);

  // Temporarily mark the stone as empty to avoid infinite loops during the check
  boardState[row][col] = 0;

  // Define the directions to check: right, down, left, up
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  // Recursively check all adjacent stones in each direction
  for (let [dx, dy] of directions) {
    // If any stone in the group is not captured, restore the board state and return false
    if (!isCaptured(row + dx, col + dy, opponent, capturedStones)) {
      capturedStones.forEach(([r, c]) => (boardState[r][c] = opponent));
      return false;
    }
  }

  // If all stones in the group are surrounded and captured, return true
  return true;
}

// Function to remove a captured stone from the board
function removeStone(row, col) {
  // Clear the stone from the board state
  boardState[row][col] = 0;
  // Find the cell element corresponding to the stone's position
  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
  // If the cell has a child element (the stone), remove it from the DOM
  if (cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }
}

// Function to update the current player display
function updateCurrentPlayerDisplay() {
  // Set the display text to the current player's name ('Black' or 'White')
  currentPlayerDisplay.textContent =
    currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1);
}

// Function to reset the game
function resetGame() {
  // Reset the board state to all empty cells
  boardState = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(0));
  // Set the current player back to 'black'
  currentPlayer = "black";
  // Update the current player display
  updateCurrentPlayerDisplay();
  // Recreate the board to remove all stones and reset the game
  createBoard();
}

// Initialize the Go board when the page loads
createBoard();
// Update the current player display when the game starts
updateCurrentPlayerDisplay();

// Add an event listener to the reset button to trigger the resetGame function when clicked
resetButton.addEventListener("click", resetGame);
