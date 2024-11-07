const SCREEN_WIDTH = innerWidth > 800 ? 800 : innerWidth,
    SCREEN_HEIGHT = SCREEN_WIDTH * 0.75, // 4:3
    TURN_SPEED = 180, // degrees per second
    SHIP_SPEED = 100, // pixels per second
    BULLET_SPEED = 500, // pixels per second
    BULLET_RADIUS = 3,
    BULLET_DURATION = 3,
    BULLET_DELAY = 0.5,
    ASTEROID_STAGES = [
        {
            size: 80,
            speed: 125,
        },
        {
            size: 20,
            speed: 500,
        },
    ],
    // sounds made with https://killedbyapixel.github.io/ZzFX/
    SOUND_SHOT = [,,659,.01,.04,,1,.4,,-75,179,.06,,,.2,,,.57], // prettier-ignore
    SOUND_ASTEROID_DESTROYED = [,,30,.09,.12,.35,4,3,4,,,,,1.3,,.6,,.36,.21], // prettier-ignore
    SOUND_VICTORY = [,,284,.08,.2,.25,1,3,,,50,.09,.06,,,,,.6,.28,.03,-1391], // prettier-ignore
    // game objects
    ship = {
        size: 30,
        speed: {},
        lastShot: 0,
    },
    asteroids = new Set(),
    bullets = new Set();

let gameState = "";

litecanvas({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    canvas: "#game canvas",
    autoscale: false,
});

function init() {
    ship.x = CENTERX;
    ship.y = CENTERY;
    ship.speed.x = 0;
    ship.speed.y = 0;
    ship.angle = 0;

    asteroids.add(createAsteroid(100, 100));
    asteroids.add(createAsteroid(WIDTH - 100, 100));
    asteroids.add(createAsteroid(CENTERX, HEIGHT - 100));

    gameState = "playing";
}

function update(dt) {
    if (gameState !== "playing") return;

    if (iskeydown("s") && ELAPSED > ship.lastShot + BULLET_DELAY) {
        ship.lastShot = ELAPSED;
        shotBullet();
    }

    updateShip(dt);
    updateBullets(dt);
    updateAsteroids(dt);
}

function draw() {
    cls(0);

    drawShip();
    drawBullets();
    drawAsteroids();

    if (gameState !== "playing") {
        push();
        alpha(0.75);
        cls(0);
        alpha(1);
        textalign("center", "middle");
        textsize(96);

        if (gameState === "game-over") {
            text(CENTERX, CENTERY, "GAME OVER!");
        } else if (gameState === "victory") {
            text(CENTERX, CENTERY, "YOU WIN!");
        }
        pop();
    }

    textsize(16);
    text(0, 0, "FPS: " + FPS);
}

function updateShip(dt) {
    // rotate to right
    if (iskeydown("ArrowRight")) {
        ship.angle += TURN_SPEED * dt;
    }

    // rotate to left
    if (iskeydown("ArrowLeft")) {
        ship.angle -= TURN_SPEED * dt;
    }

    // accelerate
    if (iskeydown("ArrowUp")) {
        let radians = deg2rad(ship.angle);
        ship.speed.x += cos(radians) * SHIP_SPEED * dt;
        ship.speed.y += sin(radians) * SHIP_SPEED * dt;
    }

    // move
    ship.x += ship.speed.x * dt;
    ship.y += ship.speed.y * dt;

    // wrap inside the screen
    ship.x = wrap(ship.x, -ship.size, WIDTH + ship.size);
    ship.y = wrap(ship.y, -ship.size, HEIGHT + ship.size);
}

function drawShip() {
    // draw a blue circle
    circfill(ship.x, ship.y, ship.size, 6);

    // draw a line to indicate the ship angle
    let radians = deg2rad(ship.angle);
    linewidth(2);
    line(
        ship.x + cos(radians) * (ship.size / 2),
        ship.y + sin(radians) * (ship.size / 2),
        ship.x + cos(radians) * ship.size,
        ship.y + sin(radians) * ship.size,
        7
    );
}

function shotBullet(dt) {
    let radians = deg2rad(ship.angle);
    bullets.add({
        x: ship.x + cos(radians) * (ship.size + 10),
        y: ship.y + sin(radians) * (ship.size + 10),
        size: BULLET_RADIUS,
        angle: ship.angle,
        lifespan: BULLET_DURATION,
    });
    sfx(SOUND_SHOT);
}

function updateBullets(dt) {
    // move
    for (const b of bullets) {
        b.lifespan -= dt;
        if (b.lifespan > 0) {
            let radians = deg2rad(b.angle);
            b.x += cos(radians) * BULLET_SPEED * dt;
            b.y += sin(radians) * BULLET_SPEED * dt;

            b.x = wrap(b.x, -b.size, WIDTH + b.size);
            b.y = wrap(b.y, -b.size, HEIGHT + b.size);

            // check collision between bullets and asteroids
            for (const a of asteroids) {
                const collision = colcirc(b.x, b.y, b.size, a.x, a.y, a.size);
                if (collision) {
                    destroyBullet(b);
                    destroyAsteroid(a);
                    break;
                }
            }
        } else {
            destroyBullet(b);
        }
    }
}

function destroyBullet(bullet) {
    bullets.delete(bullet);
}

function drawBullets() {
    // draw a white dot for each bullet
    for (const b of bullets) {
        circfill(b.x, b.y, b.size, 3);
    }
}

function createAsteroid(x, y, stage = 1) {
    return {
        x,
        y,
        stage,
        size: ASTEROID_STAGES[stage - 1].size,
        speed: ASTEROID_STAGES[stage - 1].speed,
        angle: rand(0, 360),
    };
}

function updateAsteroids(dt) {
    for (const a of asteroids) {
        let radians = deg2rad(a.angle);
        a.x += cos(radians) * a.speed * dt;
        a.y += sin(radians) * a.speed * dt;

        a.x = wrap(a.x, -a.size, WIDTH + a.size);
        a.y = wrap(a.y, -a.size, HEIGHT + a.size);

        // check collision between bullets and the ship
        const collision = colcirc(ship.x, ship.y, ship.size, a.x, a.y, a.size);
        if (collision) {
            sfx(SOUND_ASTEROID_DESTROYED);
            gameState = "game-over";
            break;
        }
    }
}

function drawAsteroids() {
    for (const a of asteroids) {
        circfill(a.x, a.y, a.size, 5);
    }
}

function destroyAsteroid(asteroid) {
    asteroids.delete(asteroid);
    if (asteroid.stage === 1) {
        const { x, y } = asteroid;
        asteroids.add(createAsteroid(x, y, 2));
        asteroids.add(createAsteroid(x, y, 2));
    }
    if (asteroids.size === 0) {
        gameState = "victory";
        sfx(SOUND_VICTORY);
    }
    sfx(SOUND_ASTEROID_DESTROYED);
}

function removeBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        if (b.lifespan <= 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}
