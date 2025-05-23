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

// Define Ship, Asteroid, and Laser classes below (can be added later for full functionality)
class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
  }

  update() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  boost(b = true) {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }

  boosting(b) {
    this.isBoosting = b;
  }

  hits(ast) {
    let d = dist(this.pos.x, this.pos.y, ast.pos.x, ast.pos.y);
    return d < this.r + ast.r;
  }

  reset() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.heading = 0;
  }

  setRotation(a) {
    this.rotation = a;
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    fill(0);
    stroke(255);
    triangle(-this.r, this.r, this.r, 0, -this.r, -this.r);
    pop();
    this.heading += this.rotation;
  }
}

class Asteroid {
  constructor(pos, r) {
    if (pos) {
      this.pos = pos.copy();
    } else {
      this.pos = createVector(random(width), random(height));
    }
    this.vel = p5.Vector.random2D();
    this.r = r || random(15, 50);
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.r * 2);
    pop();
  }

  breakup() {
    if (this.r < 20) return [];
    let newA = [];
    newA.push(new Asteroid(this.pos, this.r / 2));
    newA.push(new Asteroid(this.pos, this.r / 2));
    return newA;
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }
}

class Laser {
  constructor(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);
  }

  update() {
    this.pos.add(this.vel);
  }

  offscreen() {
    return (
      this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0
    );
  }

  hits(ast) {
    let d = dist(this.pos.x, this.pos.y, ast.pos.x, ast.pos.y);
    return d < ast.r;
  }

  show() {
    push();
    stroke(255, 0, 0);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  }
}
