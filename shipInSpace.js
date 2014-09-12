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

// bullet image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function(){
  bulletReady = true;
};
bulletImage.src = "img/bullet.png";

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
});

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
});


// Game objects

var bullets = [];

var ship = {

    // Properties
    speed: 256, // movement speed

    // Methods
    update: function (modifier) {

        if (38 in keysDown) { // Player holding up
             if (40 in keysDown) { // Player holding down
                 ship.y -= ship.speed * modifier / 4.5;
             }
             else {
              ship.y -= ship.speed * modifier;
             }
        }
        if (40 in keysDown) { // Player holding down
            ship.y -= ship.speed * modifier / 4.5;
        }
        if (37 in keysDown) { // Player holding left
            ship.x -= ship.speed * modifier;

        }
        if (39 in keysDown) { // Player holding right
            ship.x += ship.speed * modifier;

        }
        if (32 in keysDown) {
            var newBul = bullet.newBullet();
            bullets.push(newBul);
        }
    },

    reset: function () {
        ship.x = canvas.width / 2;
        ship.y = canvas.height - canvas.height / 6;
    }
};


var bullet = {

   move: function (bul){
      bul.y -= bul.speed * 0.008;
   },

    newBullet: function() {
        this.x = ship.x + 30;
        this.y = ship.y - 40;
        this.speed = 256;

        return {x: this.x, y: this.y, speed: this.speed};
    }
};

//function Asteroid(speed, endurance, direction, size){
//    this.speed = 0.04;
//    this.endurance = endurance;
//    this.direction = direction;
//    this.size = size;
//}



// FUNCTIONS
// Draw everything
var render = function () {
    if (bgReady) {
        context.drawImage(bgImage, 0, 0);
    }

    if (shipReady) {
        context.drawImage(shipImage, ship.x, ship.y);
    }

    if (bulletReady) {
        for (var i = 0; i < bullets.length; i++) {
            context.drawImage(bulletImage, bullets[i].x, bullets[i].y);
            bullet.move(bullets[i]);
        }
    }
};

//detect collision between two objects
function detectCollision(firstObj, secondObj)
{
    if ((firstObj.x <= secondObj.x && firstObj.x + 32 >= secondObj.x) &&
        (firstObj.y <= secondObj.y && secondObj.y + 32 >= secondObj)) {
        return true;
    }
    else {
        return false;
    }
}


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    ship.update(delta / 1000);
    render();


    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

var then = Date.now();
ship.reset();
main();
