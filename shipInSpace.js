//add canvas
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "black";
context.strokeStyle = "red";
canvas.width = 900;
canvas.height = 600;
canvas.style.border = "1px solid black";
canvas.style.display = "block";
canvas.style.margin = "20px auto";
document.getElementById("game").appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "img/background.jpg";

// ship image
var shipReady = false;
var shipImage = new Image();
shipImage.onload = function () {
    shipReady = true;
};
shipImage.src = "img/spaceship1_final.png";

// Game objects
var ship = {
    speed: 256 // movement speed
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
});

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
});

var reset = function () {
    ship.x = canvas.width / 2;
    ship.y = canvas.height - canvas.height/6;
};

// Update game objects
var update = function (modifier) {

    if (38 in keysDown) { // Player holding up
        ship.y -= ship.speed * modifier;

    }
    if (40 in keysDown) { // Player holding down
        ship.y += ship.speed * modifier;

    }
    if (37 in keysDown) { // Player holding left
        ship.x -= ship.speed * modifier;

    }
    if (39 in keysDown) { // Player holding right
        ship.x += ship.speed * modifier;

    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        context.drawImage(bgImage, 0, 0);
    }

    if (shipReady) {
        context.drawImage(shipImage, ship.x, ship.y);
    }

};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};
var then = Date.now();
reset();
main();

