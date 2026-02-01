/***********************
 * GLOBAL VARIABLES
 ***********************/
const size = 4;
let board = [];
let emptyIndex = 15;
let moveCount = 0;
let timer = 0;
let timerInterval = null;
let isAutoSolving = false;

const BACKEND_URL = "https://15-puzzle-backend.onrender.com/solve";

/***********************
 * INIT GAME
 ***********************/
window.onload = () => {
  initBoard();
  startTimer();
};

/***********************
 * BOARD SETUP
 ***********************/
function initBoard() {
  board = [...Array(16).keys()];
  shuffleBoard();
  emptyIndex = board.indexOf(0);
  moveCount = 0;
  updateMoves();
  renderBoard();
}

function shuffleBoard() {
  do {
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable());
}

function isSolvable() {
  let inv = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = i + 1; j < 16; j++) {
      if (board[i] && board[j] && board[i] > board[j]) inv++;
    }
  }
  const rowFromBottom = 4 - Math.floor(board.indexOf(0) / 4);
  return rowFromBottom % 2 === 0 ? inv % 2 === 1 : inv % 2 === 0;
}

/***********************
 * RENDER BOARD
 ***********************/
function renderBoard() {
  const container = document.getElementById("puzzle");
  container.innerHTML = "";

  board.forEach((num, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (num === 0) tile.classList.add("empty");
    else tile.innerText = num;

    tile.onclick = () => {
      if (!isAutoSolving) moveTile(index);
    };

    container.appendChild(tile);
  });
}

/***********************
 * TILE MOVEMENT
 ***********************/
function moveTile(index) {
  const validMoves = [
    emptyIndex - 1,
    emptyIndex + 1,
    emptyIndex - 4,
    emptyIndex + 4
  ];

  if (validMoves.includes(index)) {
    [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];
    emptyIndex = index;
    moveCount++;
    updateMoves();
    renderBoard();

    if (checkWin()) celebrate();
  }
}

function checkWin() {
  for (let i = 0; i < 15; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[15] === 0;
}

/***********************
 * MOVE COUNTER
 ***********************/
function updateMoves() {
  document.getElementById("moves").innerText = moveCount;
}

/***********************
 * TIMER
 ***********************/
function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").innerText = formatTime(timer);
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/***********************
 * AUTO SOLVE (BACKEND)
 ***********************/
async function autoSolve() {
  if (isAutoSolving) return;

  isAutoSolving = true;
  disableClicks(true);

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board: board.flat() })
    });

    const data = await response.json();
    console.log("Backend response:", data);

    const moves = data.solution || data.moves;
    await playMoves(moves);

  } catch (err) {
    console.error("Auto solve failed:", err);
  }

  disableClicks(false);
  isAutoSolving = false;
}

/***********************
 * PLAY SOLUTION MOVES
 ***********************/
async function playMoves(moves) {
  for (let move of moves) {
    const index = board.indexOf(move);
    moveTile(index);
    await sleep(300);
  }
}

/***********************
 * HELPERS
 ***********************/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function disableClicks(state) {
  document.getElementById("puzzle").style.pointerEvents =
    state ? "none" : "auto";
}

/***********************
 * CELEBRATION 🎉
 ***********************/
function celebrate() {
  clearInterval(timerInterval);
  const msg = document.createElement("div");
  msg.className = "celebrate";
  msg.innerText = "🎉 Puzzle Solved!";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

/***********************
 * RESET GAME
 ***********************/
function resetGame() {
  initBoard();
  startTimer();
}
