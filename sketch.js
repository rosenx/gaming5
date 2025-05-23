let ship;
let asteroids = [];
let lasers = [];
let score = 0;
let lives = 3;
let gameState = "start";

function setup() {
  createCanvas(800, 600);
  ship = new Ship();
  for (let i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);

  if (gameState === "start") {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("Press ENTER to Start", width / 2, height / 2);
    return;
  } else if (gameState === "end") {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("Game Over! Press ENTER to Restart", width / 2, height / 2);
    return;
  }

  // Display score and lives
  fill(255);
  textSize(16);
  text("Score: " + score, 20, 30);
  text("Lives: " + lives, width - 80, 30);

  ship.update();
  ship.show();
  ship.edges();

  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].show();
    asteroids[i].edges();

    if (ship.hits(asteroids[i])) {
      lives--;
      ship.reset();
      if (lives <= 0) {
        gameState = "end";
      }
    }
  }

  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    lasers[i].show();

    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (lasers[i].hits(asteroids[j])) {
        score += 10;
        let newAsteroids = asteroids[j].breakup();
        asteroids = asteroids.concat(newAsteroids);
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        break;
      }
    }

    if (lasers[i] && lasers[i].offscreen()) {
      lasers.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameState === "start" || gameState === "end") {
      resetGame();
    }
  }

  if (gameState === "play") {
    if (keyCode === RIGHT_ARROW) {
      ship.setRotation(0.1);
    } else if (keyCode === LEFT_ARROW) {
      ship.setRotation(-0.1);
    } else if (keyCode === UP_ARROW) {
      ship.boosting(true);
    } else if (key === ' ') {
      lasers.push(new Laser(ship.pos, ship.heading));
    }
  }
}

function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}

function resetGame() {
  gameState = "play";
  score = 0;
  lives = 3;
  ship = new Ship();
  asteroids = [];
  for (let i = 0; i < 5; i++) {
    asteroids.push(new Asteroid());
  }
  lasers = [];
}
