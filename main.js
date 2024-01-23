/**
 * @type HTMLCanvasElement
 */

const modal = document.getElementById("overlay-modal");
const playAgain = document.getElementById("playAgain");
const soundBtn = document.getElementById("soundBtn");
const gameSound = document.getElementById("gameSound");
const goalSound = document.getElementById("goalSound");
const congratSound = document.getElementById("congratSound");

// Toggle Game Sound
let isPlaying = false;

const toggleSound = () => {
  isPlaying ? (soundBtn.textContent = "🔇") : (soundBtn.textContent = "🔊");
  if (isPlaying) {
    gameSound.pause();
    goalSound.pause();
    isPlaying = false;
  } else {
    gameSound.play();
    isPlaying = true;
  }
};

soundBtn.addEventListener("click", toggleSound);

// Show Tutorial screen
let tutorialScreen = document.getElementsByClassName('tutorial')
let startPlayingBtn = document.getElementById('startPlayingBtn')
startPlayingBtn.addEventListener('click', () => {
  tutorialScreen[0].style.display = 'none'
})

const canvas = document.getElementById("footballCanvas");
const ctx = canvas.getContext("2d");


// Game Elements
const footballFieldColor = "green";
const goalpostColor = "white";
const footballColor = "#000000";
const penaltySpotColor = "#FFFFFF";

const footballField = {
  width: canvas.width,
  height: canvas.height,
  goalpostWidth: 20,
  goalpostHeight: 100,
  centerCircleRadius: 30,
  penaltyAreaWidth: 200,
  penaltyAreaHeight: 300,
};

const goalPosts = [
  { x: 0, y: canvas.height / 2 - footballField.goalpostHeight / 2 },
  {
    x: canvas.width - footballField.goalpostWidth,
    y: canvas.height / 2 - footballField.goalpostHeight / 2,
  },
];

const leftPenaltyBox = {
  x: 0,
  y: canvas.height / 2 - footballField.penaltyAreaHeight / 2,
  width: footballField.penaltyAreaWidth,
  height: footballField.penaltyAreaHeight,
};

const rightPenaltyBox = {
  x: canvas.width - footballField.penaltyAreaWidth,
  y: canvas.height / 2 - footballField.penaltyAreaHeight / 2,
  width: footballField.penaltyAreaWidth,
  height: footballField.penaltyAreaHeight,
};

const leftPenaltySpot = { x: leftPenaltyBox.x + 50, y: canvas.height / 2 };

const rightPenaltySpot = {
  x: rightPenaltyBox.x + rightPenaltyBox.width - 50,
  y: canvas.height / 2,
};

// Football
const football = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: 0,
  dy: 0,
};

// Scores
let scores = [0, 0];

// User Interaction with keyboard
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  // Handle arrow key input to move the football
  switch (e.key) {
    case "ArrowUp":
      football.dy = -football.speed;
      break;
    case "ArrowDown":
      football.dy = football.speed;
      break;
    case "ArrowLeft":
      football.dx = -football.speed;
      break;
    case "ArrowRight":
      football.dx = football.speed;
      break;
  }
}

document.addEventListener("keyup", handleKeyUp);

function handleKeyUp(e) {
  // Stop football movement when the key is released
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
      football.dy = 0;
      break;
    case "ArrowLeft":
    case "ArrowRight":
      football.dx = 0;
      break;
  }
}

// User Interaction with onscreen keyboard
let screenBtns = document.querySelectorAll(".screenBtn");
screenBtns.forEach((btn) => {
  // Handle onScreeen arrow key click to move the football
  btn.addEventListener("mousedown", (e) => {
    switch (e.target.innerHTML) {
      case "⬆️":
        football.dy = -football.speed;
        break;
      case "⬇️":
        football.dy = football.speed;
        break;
      case "⬅️":
        football.dx = -football.speed;
        break;
      case "➡️":
        football.dx = football.speed;
        break;
    }
  });

  // Stop football movement when the mouse click is released
  btn.addEventListener("mouseup", (e) => {
    switch (e.target.innerHTML) {
      case "⬆️":
      case "⬇️":
        football.dy = 0;
        break;
      case "⬅️":
      case "➡️":
        football.dx = 0;
        break;
    }
  });
});

// User Interaction with Football drag
let isMouseDown = false;
let lastMouseX;
let lastMouseY;

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const unitVectorX = dx / distance;
      const unitVectorY = dy / distance;

      football.dx = football.speed * unitVectorX;
      football.dy = football.speed * unitVectorY;

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  }
});

// Goal System
function checkGoal() {
  for (let i = 0; i < goalPosts.length; i++) {
    const goalpost = goalPosts[i];
    if (
      football.x + football.radius > goalpost.x &&
      football.x - football.radius < goalpost.x + footballField.goalpostWidth &&
      football.y + football.radius > goalpost.y &&
      football.y - football.radius < goalpost.y + footballField.goalpostHeight
    ) {
      // Goal scored
      scores[i]++;
      isPlaying ? goalSound.play() : goalSound.pause();
      resetFootball();
      updateScores();

      // Check if a team has scored 5 goal and display congratulatory modal
      const scoreText = document.getElementById("scoreText");
      if (scores[0] === 5) {
        scoreText.textContent = `Home team won ${scores[0]}-${scores[1]} `;
        isPlaying ? congratSound.play() : congratSound.pause();
        modal.classList.add("showModal");
        football.speed = 0;
        resetGame();
      } else if (scores[1] === 5) {
        scoreText.textContent = `Away team won ${scores[0]}-${scores[1]}`;
        isPlaying ? congratSound.play() : congratSound.pause();
        modal.classList.add("showModal");
        football.speed = 0;
        resetGame();
      }
    }
  }
}

// Remove Congratulatory modal and update ball speed
playAgain.addEventListener("click", () => {
  modal.classList.remove("showModal");
  football.speed = 5;
});

// Game Logic
function updateGame() {
  football.x += football.dx;
  football.y += football.dy;

  // Check for collisions with the field boundaries
  if (
    football.x - football.radius < 0 ||
    football.x + football.radius > canvas.width ||
    football.y - football.radius < 0 ||
    football.y + football.radius > canvas.height
  ) {
    resetFootball();
  }

  checkGoal();
}

function drawGame() {
  // Draw football field
  ctx.fillStyle = footballFieldColor;
  ctx.fillRect(0, 0, footballField.width, footballField.height);

  // Draw goalposts
  ctx.fillStyle = goalpostColor;
  for (const goalpost of goalPosts) {
    ctx.fillRect(
      goalpost.x,
      goalpost.y,
      footballField.goalpostWidth,
      footballField.goalpostHeight
    );
  }

  // Draw penalty boxes
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.strokeRect(
    leftPenaltyBox.x,
    leftPenaltyBox.y,
    leftPenaltyBox.width,
    leftPenaltyBox.height
  );

  ctx.strokeRect(
    rightPenaltyBox.x,
    rightPenaltyBox.y,
    rightPenaltyBox.width,
    rightPenaltyBox.height
  );
  // Draw penalty boxes Insides
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.strokeRect(
    footballField.width,
    footballField.height / 2 - 70,
    footballField.goalpostWidth - 130,
    footballField.goalpostHeight + 50
  );

  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.strokeRect(
    0,
    footballField.height / 2 - 70,
    footballField.goalpostWidth + 100,
    footballField.goalpostHeight + 50
  );

  // Draw penalty spots
  ctx.fillStyle = penaltySpotColor;
  ctx.beginPath();
  ctx.arc(leftPenaltySpot.x, leftPenaltySpot.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(rightPenaltySpot.x, rightPenaltySpot.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw center circle
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    footballField.centerCircleRadius,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.closePath();

  // Draw vertical line through the center circle
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.strokeStyle = "white";
  ctx.closePath();

  // Draw football
  ctx.beginPath();
  ctx.arc(football.x, football.y, football.radius, 0, Math.PI * 2);
  ctx.fillStyle = footballColor;
  ctx.fill();
  ctx.closePath();
}

function resetFootball() {
  football.x = canvas.width / 2;
  football.y = canvas.height / 2;
  football.dx = 0;
  football.dy = 0;
}

function updateScores() {
  document.getElementById(
    "score"
  ).innerText = `Home ${scores[0]} - ${scores[1]} Away `;
}

function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  scores = [0, 0];
  resetFootball();
  updateScores();
  isPlaying ? goalSound.play() : goalSound.pause();
}

// Initial score display
updateScores();
// Start the game loop
gameLoop();
