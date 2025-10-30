// 🧠 Detect connection
window.addEventListener("offline", () => {
  document.querySelector("#offlineGameContainer").style.display = "block";
  document.body.style.background = "#000"; // make background dark
  startSnakeGame();
});

window.addEventListener("online", () => {
  document.querySelector("#offlineGameContainer").style.display = "none";
  alert("✅ Connection restored! Mr. Kelly is back online.");
});

// 🐍 Snake Game
function startSnakeGame() {
  const canvas = document.getElementById("snakeGame");
  const ctx = canvas.getContext("2d");

  const box = 10;
  let snake = [];
  snake[0] = { x: 150, y: 150 };

  let direction;
  let food = {
    x: Math.floor(Math.random() * 30) * box,
    y: Math.floor(Math.random() * 30) * box,
  };

  document.addEventListener("keydown", directionControl);

  function directionControl(event) {
    if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
    else if (event.keyCode == 38 && direction != "DOWN") direction = "UP";
    else if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
    else if (event.keyCode == 40 && direction != "UP") direction = "DOWN";
  }

  function drawGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 300, 300);

    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i == 0 ? "#0ff" : "#0aa";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
      food = {
        x: Math.floor(Math.random() * 30) * box,
        y: Math.floor(Math.random() * 30) * box,
      };
    } else {
      snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (
      snakeX < 0 ||
      snakeY < 0 ||
      snakeX >= 300 ||
      snakeY >= 300 ||
      collision(newHead, snake)
    ) {
      clearInterval(game);
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText("Game Over 😢", 80, 150);
    }

    snake.unshift(newHead);
  }

  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x == array[i].x && head.y == array[i].y) {
        return true;
      }
    }
    return false;
  }

  const game = setInterval(drawGame, 100);
}
