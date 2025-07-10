const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const finalScoreDisplay = document.getElementById('finalScore');
const gameOverText = document.getElementById('gameOverText');
const gameContainer = document.getElementById('game');
const startBtn = document.getElementById('startBtn');
const gunSound = document.getElementById('gunSound');

let score = 0;
let gameInterval = null;
let moveInterval = null;
let cooldown = false;
let timeLeft = 0;
let duration = null;
let difficultySpeed = null;
let selectedDifficulty = null;
let selectedDuration = null;
let gameActive = false;

const DIFFICULTY = {
  easy: 1000,
  medium: 700,
  hard: 400
};

function selectDifficulty(mode) {
  selectedDifficulty = mode;
  ['easyBtn', 'mediumBtn', 'hardBtn'].forEach(btn =>
    document.getElementById(btn).classList.remove('selected')
  );
  document.getElementById(`${mode}Btn`).classList.add('selected');
  enableStartIfReady();
}

function selectDuration(sec) {
  selectedDuration = sec;
  ['time10', 'time15', 'time30'].forEach(btn =>
    document.getElementById(btn).classList.remove('selected')
  );
  document.getElementById(`time${sec}`).classList.add('selected');
  timerDisplay.textContent = `Time: ${sec}`;
  enableStartIfReady();
}

function enableStartIfReady() {
  startBtn.disabled = !(selectedDifficulty && selectedDuration);
}

function randomPosition() {
  const maxX = gameContainer.clientWidth - 80;
  const maxY = gameContainer.clientHeight - 80;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

function moveTarget() {
  randomPosition();
}

function count() {
  if (!gameActive || cooldown || timeLeft <= 0) return;
  gunSound.currentTime = 0;
  gunSound.play();
  cooldown = true;
  score++;
  scoreDisplay.textContent = score;
  setTimeout(() => cooldown = false, 200);
}

function startGame() {
  if (!(selectedDifficulty && selectedDuration)) return;
  difficultySpeed = DIFFICULTY[selectedDifficulty];
  duration = selectedDuration;
  score = 0;
  timeLeft = duration;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  gameOverText.style.display = 'none';
  gameActive = true;

  clearInterval(moveInterval);
  clearInterval(gameInterval);

  moveTarget();
  moveInterval = setInterval(moveTarget, difficultySpeed);

  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) endGame();
  }, 1000);

  startBtn.disabled = true;
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(moveInterval);
  gameActive = false;
  gameOverText.style.display = 'block';
  finalScoreDisplay.textContent = score;
}

function restart() {
  score = 0;
  scoreDisplay.textContent = score;
  timeLeft = selectedDuration || 0;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  gameOverText.style.display = 'none';
  clearInterval(gameInterval);
  clearInterval(moveInterval);
  startBtn.disabled = !(selectedDifficulty && selectedDuration);
  gameActive = false;
}

target.onclick = count;
target.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') count();
});
