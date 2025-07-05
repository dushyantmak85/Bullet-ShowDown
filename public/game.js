const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 100, bullets: [], angle: 0 };
let others = {};

window.addEventListener("keydown", (e) => {
  const speed = 5;
  if (e.key === "ArrowUp") player.y -= speed;
  if (e.key === "ArrowDown") player.y += speed;
  if (e.key === "ArrowLeft") player.x -= speed;
  if (e.key === "ArrowRight") player.x += speed;
  if (e.key === " ") shoot();
});

function shoot() {
  player.bullets.push({ x: player.x, y: player.y, angle: player.angle });
}

function drawPlayer(p, color = "lime") {
  ctx.fillStyle = color;
  ctx.fillRect(p.x, p.y, 20, 20);
  p.bullets.forEach((b) => {
    ctx.fillRect(b.x, b.y, 5, 5);
  });
}

function updateBullets(p) {
  p.bullets.forEach((b) => {
    b.x += Math.cos(b.angle) * 10;
    b.y += Math.sin(b.angle) * 10;
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBullets(player);
  drawPlayer(player, "lime");

  for (let id in others) {
    if (id !== socket.id) {
      drawPlayer(others[id], "red");
    }
  }

  socket.emit("update", player);
  requestAnimationFrame(gameLoop);
}

socket.on("state", (players) => {
  others = players;
});

socket.on("full", () => {
  alert("Room full. Only 2 players allowed.");
});

gameLoop();
