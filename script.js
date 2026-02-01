/* ========= GLOBAL STATE ========= */

let board = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0]
];

let solving = false;
let solutionMoves = [];

let moveCount = 0;
let startTime = null;
let timerInterval = null;

/* ========= RENDER ========= */

function render() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  board.flat().forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = value === 0 ? "tile empty" : "tile";
    tile.textContent = value === 0 ? "" : value;
    tile.onclick = () => handleClick(index);
    grid.appendChild(tile);
  });
}

/* ========= CLICK MOVE ========= */

function handleClick(index) {
  if (solving) return;

  const r = Math.floor(index / 4);
  const c = index % 4;
  const empty = findEmpty();

  if (Math.abs(empty.row - r) + Math.abs(empty.col - c) === 1) {
    board[empty.row][empty.col] = board[r][c];
    board[r][c] = 0;

    moveCount++;
    document.getElementById("moves").textContent = `Moves: ${moveCount}`;

    if (!timerInterval) startTimer();

    render();

    if (isSolved()) {
      stopTimer();
      celebrate();
    }
  }
}

/* ========= FIND EMPTY ========= */

function findEmpty() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return { row: i, col: j };
    }
  }
}

/* ========= SHUFFLE ========= */

function shuffle() {
  stopTimer();
  moveCount = 0;
  document.getElementById("moves").textContent = "Moves: 0";
  document.getElementById("time").textContent = "Time: 00:00";

  for (let i = 0; i < 100; i++) {
    const empty = findEmpty();
    const moves = [];

    if (empty.row > 0) moves.push({ r: empty.row - 1, c: empty.col });
    if (empty.row < 3) moves.push({ r: empty.row + 1, c: empty.col });
    if (empty.col > 0) moves.push({ r: empty.row, c: empty.col - 1 });
    if (empty.col < 3) moves.push({ r: empty.row, c: empty.col + 1 });

    const m = moves[Math.floor(Math.random() * moves.length)];
    board[empty.row][empty.col] = board[m.r][m.c];
    board[m.r][m.c] = 0;
  }

  render();
}

/* ========= AUTO SOLVE ========= */

async function autoSolve() {
  if (solving) return;
  solving = true;

  const res = await fetch("http://127.0.0.1:5000/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board })
  });

  const data = await res.json();
  solutionMoves = data.moves;

  animateSolution();
}

/* ========= ANIMATION ========= */

function animateSolution() {
  if (solutionMoves.length === 0) {
    solving = false;
    stopTimer();
    if (isSolved()) celebrate();
    return;
  }

  applyMove(solutionMoves.shift());
  render();
  setTimeout(animateSolution, 300);
}

/* ========= APPLY MOVE ========= */

function applyMove(move) {
  const e = findEmpty();
  let t = null;

  if (move === "up" && e.row < 3) t = { r: e.row + 1, c: e.col };
  if (move === "down" && e.row > 0) t = { r: e.row - 1, c: e.col };
  if (move === "left" && e.col < 3) t = { r: e.row, c: e.col + 1 };
  if (move === "right" && e.col > 0) t = { r: e.row, c: e.col - 1 };

  if (t) {
    board[e.row][e.col] = board[t.r][t.c];
    board[t.r][t.c] = 0;
  }
}

/* ========= SOLVED CHECK ========= */

function isSolved() {
  let n = 1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === 3 && j === 3) return board[i][j] === 0;
      if (board[i][j] !== n++) return false;
    }
  }
  return true;
}

/* ========= CELEBRATION ========= */

function celebrate() {
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  setTimeout(() => {
    confetti({ particleCount: 100, spread: 120, origin: { y: 0.4 } });
  }, 300);
}

/* ========= TIMER ========= */

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const t = Math.floor((Date.now() - startTime) / 1000);
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    document.getElementById("time").textContent = `Time: ${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

/* ========= INIT ========= */

render();
