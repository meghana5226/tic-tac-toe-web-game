const board = document.getElementById("board");
const status = document.getElementById("status");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const draws = document.getElementById("draws");

let playerX = "Player X", playerO = "Player O";
let currentPlayer = "X";
let gameActive = false;
let boardState = Array(9).fill("");
let scores = { X: 0, O: 0, draws: 0 };

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame() {
  playerX = document.getElementById("playerX").value || "Player X";
  playerO = document.getElementById("playerO").value || "Player O";
  document.getElementById("playerXName").textContent = playerX;
  document.getElementById("playerOName").textContent = playerO;
  currentPlayer = Math.random() < 0.5 ? "X" : "O";
  resetGame();
  gameActive = true;
}

function createBoard() {
  board.innerHTML = "";
  boardState.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.dataset.index = i;
    div.textContent = val;
    div.addEventListener("click", handleClick);
    board.appendChild(div);
  });
}

function handleClick(e) {
  const idx = e.target.dataset.index;
  if (!gameActive || boardState[idx]) return;

  playSound("click");
  boardState[idx] = currentPlayer;
  createBoard();
  checkWin();
}

function checkWin() {
  let winner = null;
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
      winner = boardState[a];
      document.querySelectorAll(".cell")[a].classList.add("winning-cell");
      document.querySelectorAll(".cell")[b].classList.add("winning-cell");
      document.querySelectorAll(".cell")[c].classList.add("winning-cell");
      break;
    }
  }

  if (winner) {
    playSound("win");
    confetti();
    const name = winner === "X" ? playerX : playerO;
    status.textContent = `🎉 ${name} Wins!`;
    scores[winner]++;
    updateScores();
    gameActive = false;
  } else if (!boardState.includes("")) {
    playSound("draw");
    status.textContent = "🤝 It's a draw!";
    scores.draws++;
    updateScores();
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const name = currentPlayer === "X" ? playerX : playerO;
    status.textContent = `🎯 ${name}'s Turn`;
  }
}

function updateScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  draws.textContent = scores.draws;
}

function resetGame() {
  boardState = Array(9).fill("");
  createBoard();
  status.textContent = `${currentPlayer === "X" ? playerX : playerO}'s Turn`;
  gameActive = true;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function playSound(type) {
  const audio = new Audio();
  switch (type) {
    case "click": audio.src = "https://www.soundjay.com/buttons/button-4.mp3"; break;
    case "win": audio.src = "https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3"; break;
    case "draw": audio.src = "https://www.soundjay.com/button/beep-09.mp3"; break;
  }
  audio.play();
}
