function makeGraphics(engine) {
    const res = {};

    /**
     * The `paint()` function can be used to create a image
     * using the canvas context or litecanvas' functions to draw graphics.
     * Then you draw that generated image using the `image(x, y, img)` function.
     */
    res.ship = engine.paint(60, 60, (ctx) => {
        const w = ctx.canvas.width,
            h = ctx.canvas.height;

        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, h);
        ctx.lineTo(w / 2, h * 0.75);
        ctx.lineTo(0, h);
        ctx.lineTo(w / 2, 0);

        engine.fill(4);
    });

    res.asteroidStage1 = engine.paint(160, 160, (ctx) => {
        _drawAsteroid(ctx, 6, ctx.canvas.width / 2);
        engine.fill(11);
    });

    res.asteroidStage2 = engine.paint(40, 40, (ctx) => {
        _drawAsteroid(ctx, 5, ctx.canvas.width / 2);
        engine.fill(11);
    });

    // return an object with all generated images
    return res;
}

function _drawAsteroid(ctx, sides, radius) {
    const points = _makeAsteroidShape(sides, radius);
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        if (0 === i) {
            ctx.moveTo(points[i][0], points[i][1]);
        } else {
            ctx.lineTo(points[i][0], points[i][1]);
        }
    }
    ctx.lineTo(points[0][0], points[0][1]);
}

function _makeAsteroidShape(sides, radius) {
    const points = [];
    const x = radius;
    const y = radius;
    const variation = radius * 0.1; // radius variation

    for (let i = 0; i < sides; i++) {
        const r = radius + engine.randi(-variation, variation);
        points.push([
            x + r * engine.cos((i * engine.TWO_PI) / sides),
            y + r * engine.sin((i * engine.TWO_PI) / sides),
        ]);
    }

    return points;
}
