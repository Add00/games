const SCREEN_WIDTH = innerWidth > 800 ? 800 : innerWidth,
    SCREEN_HEIGHT = SCREEN_WIDTH * 0.75, // 4:3
    TURN_SPEED = 180, // degrees per second
    SHIP_SPEED = 100, // pixels per second
    BULLET_SPEED = 200, // pixels per second
    BULLET_RADIUS = 3,
    BULLET_DURATION = 3,
    SHOT_DELAY = 0.5,
    // sounds made with https://killedbyapixel.github.io/ZzFX/
    SOUND_SHOT = [,,659,.01,.04,,1,.4,,-75,179,.06,,,.2,,,.57], // prettier-ignore
    // game objects
    ship = {
        radius: 30,
        speed: {},
        lastShot: 0,
    },
    asteroids = [],
    bullets = [];

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
}

function update(dt) {
    updateShip(dt);
    handleShot(dt);
    updateBullets(dt);
}

function draw() {
    cls(0);
    drawShip();
    drawBullets();
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
    ship.x = wrap(ship.x, -ship.radius, WIDTH + ship.radius);
    ship.y = wrap(ship.y, -ship.radius, HEIGHT + ship.radius);
}

function handleShot(dt) {
    if (iskeydown("s") && ELAPSED > ship.lastShot + SHOT_DELAY) {
        let radians = deg2rad(ship.angle);
        bullets.push({
            x: ship.x + cos(radians) * (ship.radius + 10),
            y: ship.y + sin(radians) * (ship.radius + 10),
            angle: ship.angle,
            lifespan: 0,
        });
        ship.lastShot = ELAPSED;
        sfx(SOUND_SHOT);
    }
}

function updateBullets(dt) {
    // move
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        b.lifespan += dt;

        if (b.lifespan >= BULLET_DURATION) {
            // remove "old" bullets
            bullets.splice(i, 1);
            i--;
        } else {
            let radians = deg2rad(b.angle);
            b.x += cos(radians) * BULLET_SPEED * dt;
            b.y += sin(radians) * BULLET_SPEED * dt;

            b.x = wrap(b.x, 0, WIDTH);
            b.y = wrap(b.y, 0, HEIGHT);
        }
    }
}

function drawShip() {
    // draw a blue circle
    circfill(ship.x, ship.y, ship.radius, 6);

    // draw a line to indicate the ship angle
    let radians = deg2rad(ship.angle);
    linewidth(2);
    line(
        ship.x + cos(radians) * (ship.radius / 2),
        ship.y + sin(radians) * (ship.radius / 2),
        ship.x + cos(radians) * ship.radius,
        ship.y + sin(radians) * ship.radius,
        7
    );
}

function drawBullets() {
    // draw a white dot for each bullet
    for (let i = 0; i < bullets.length; i++) {
        const b = bullets[i];
        circfill(b.x, b.y, BULLET_RADIUS, 3);
    }
}
