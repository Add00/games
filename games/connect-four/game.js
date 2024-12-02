const SCREEN_WIDTH = innerWidth > 800 ? 800 : innerWidth,
    SCREEN_HEIGHT = SCREEN_WIDTH * 0.75; // 4:3

let gameState = "",
    engine = litecanvas({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        canvas: "#game canvas",
        autoscale: false,
    }),
    graphics = makeGraphics(engine);

function init() {
    bg = 0;
    blue = 6;
    red = 4;
    yellow = 5;
    radius = 30;
    posx = CENTERX;
    posy = CENTERY;
    boardh = 480;
    colh = boardh / 6;
    boardw = 570;
    colw = boardw / 7;
    // Set up the board
    game_board = [];
    for (let i = 0; i < 6; i++) {
        game_board.push([0, 0, 0, 0, 0, 0, 0]);
    }
    p1_wins = 0;
    p2_wins = 0;
    player = 1;

    gameState = "playing";
}

function update(dt) {
    if (gameState !== "playing") return;
}

function draw() {
    cls(bg); // clear the screen
    text(SCREEN_WIDTH / 2.5, 10, "Connect Four Demo", 3);
    text(SCREEN_WIDTH / 2.35, 35, "Player ", 3);
    text(SCREEN_WIDTH / 2.35 + 50, 35, player, 3);
    text(SCREEN_WIDTH / 2.35 + 60, 35, "'s turn.", 3);
    drawBoard();
    drawPieces();
    drawSelector();

    if (gameState !== "playing") {
        push();
        alpha(0.75);
        cls(bg);
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
    // text(0, 0, "FPS: " + FPS);
}

function update() {
    if (gameState !== "playing") return;
    updateSelector();
}

function drawPieces() {
    for (let row = 0; row < game_board.length; row++) {
        for (let col = 0; col < game_board[row].length; col++) {
            let x = colw * col + colw / 2 + 111; // Adjusted for alignment
            let y = colh * row + colh / 2 + 90; // Adjusted for alignment
            if (game_board[row][col] === 0) {
                // Draw an empty spot
                circfill(x, y, radius, bg);
            } else if (game_board[row][col] === 1) {
                // Draw player 1's piece
                circfill(x, y, radius, red);
            } else if (game_board[row][col] === 2) {
                // Draw player 2's piece
                circfill(x, y, radius, yellow);
            }
        }
    }
}

function drawBoard() {
    // draw the board borders
    rectfill(110, 90, boardw, boardh, blue);
    // Draw the board feet
    rectfill(30, 571, 200, 20, blue, radius);
    rectfill(boardw - 5, 571, 200, 20, blue, radius);
    /*
    // Draw the vertical cols
    rectfill(colw + 30, 90, colw, boardh, blue);
    rectfill(colw * 2 + 30, 90, colw, boardh, blue);
    rectfill(colw * 3 + 30, 90, colw, boardh, blue);
    rectfill(colw * 4 + 30, 90, colw, boardh, blue);
    rectfill(colw * 5 + 30, 90, colw, boardh, blue);
    rectfill(colw * 6 + 30, 90, colw, boardh, blue);
    rectfill(colw * 7 + 30, 90, colw, boardh, blue);
    // Draw the horizontal cols
    rect(colw + 30, 90 + colh, boardw, colw, blue);
    rect(colw + 30, 90 + colh * 2, boardw, colw, blue);
    rect(colw + 30, 90 + colh * 3, boardw, colw, blue);
    rect(colw + 30, 90 + colh * 4, boardw, colw, blue);
    */
}

// this function detect taps/clicks
function tapped(x, y) {
    if (player == 1) {
        player = 2;
    } else {
        player = 1;
    }
}

let selector = {
    // Middle of columns are: 142, 225, 305, 388, 468, 550, 630
    x: [142, 225, 305, 388, 468, 550],
    y: 55,
    angle: 0,
};

let selected = 0;

function drawSelector() {
    const sprite = graphics.selector;
    const radians = deg2rad(selector.angle);
    push();
    translate(selector.x[selected], selector.y);
    rotate(HALF_PI + radians);
    image(-sprite.width / 2, -sprite.height / 2, sprite);
    pop();
}

function updateSelector() {
    // Move selector left
    if (iskeydown("ArrowLeft")) {
        if (selected > 0) {
            selected--;
        }
    }
    // Move selector right
    if (iskeydown("ArrowRight")) {
        if (selected < 6) {
            selected++;
        }
    }
}
