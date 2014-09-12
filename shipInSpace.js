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

// asteroid image
var asteroidReady = false;
var asteroidImage = new Image();
asteroidImage.onload = function(){
    asteroidReady = true;
};
asteroidImage.src = "img/asteroid.png";

// enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function(){
    enemyReady = true;
};
enemyImage.src = "img/enemy.png";

// enemyBullet image
var enemyBulletReady = false;
var enemyBulletImage = new Image();
enemyBulletImage.onload = function(){
    enemyBulletReady = true;
};
enemyBulletImage.src = "img/enemyBullet.png";

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
var asteroids = [];
var enemies = [];
var enemyBullets = [];

var ship = {

    // Properties
    speed: 256, // movement speed
    health: 100,

    // Methods
    update: function (modifier) {

        var r = Math.random() * 100000;
        if (r > 99370) {
            var newAsteroid = asteroid.newAsteroid();
            asteroids.push(newAsteroid);
        }

        if (r > 99270 && r < 99370) {
            var newEnemy = enemy.newEnemy();
            enemies.push(newEnemy);
        }

        for (var i = 0; i < enemies.length; i++) {
            var newEnemyBul = bullet.newEnemyBullet(enemies[i]);
            enemyBullets.push(newEnemyBul);
        }

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

   bulMove: function (bul){
      bul.y -= bul.speed * 0.008;
   },

    enemyBulMove: function (bul){
        bul.y += 85;
    },

    newBullet: function() {
        this.x = ship.x + 30;
        this.y = ship.y - 40;
        this.speed = 256;

        return {x: this.x, y: this.y, speed: this.speed};
    },

    newEnemyBullet: function(enemy) {
        this.x = enemy.x + 30;
        this.y = enemy.y - 40;
        this.speed = 256;

        return {x: this.x, y: this.y, speed: this.speed};
    }
};

////{(speed, endurance, direction, size)

var asteroid = {

    rand: getRandomInt(1, 3),

    newAsteroid: function() {
        this.speed = 0.04;
        this.health = this.rand;
        this.size = this.rand;
        this.x = getRandomInt(50, 800);
        this.y = getRandomInt(1, 100);

        return {x: this.x, y: this.y, speed: this.speed, health: this.health, size: this.size};
    },

    astMove: function(ast) {
        ast.y += 1;
    }
};

var enemy = {

    rand: getRandomInt(1, 3),

    newEnemy: function() {
        this.speed = 0.04;
        this.health = this.rand;
        this.size = this.rand;
        this.x = getRandomInt(50, 800);
        this.y = getRandomInt(1, 100);

        return {x: this.x, y: this.y, speed: this.speed, health: this.health, size: this.size};
    },

    enemyMove: function(enemy) {
        enemy.y += 1;
    }
};



// FUNCTIONS

//Random
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
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
//            if (bullets[i].y < 0 && i > 1) {
//                //delete bullets[i];
//            }
            context.drawImage(bulletImage, bullets[i].x, bullets[i].y);
            bullet.bulMove(bullets[i]);
        }
    }

    if (asteroidReady) {
        for (var i = 0; i < asteroids.length; i++) {
//            if (asteroids[i].y > 600) {
//                delete bullets[i];
//            }
            context.drawImage(asteroidImage, asteroids[i].x, asteroids[i].y);
            asteroid.astMove(asteroids[i]);
        }
    }

    if (enemyReady) {
        for (var i = 0; i < enemies.length; i++) {
//            if (asteroids[i].y > 600) {
//                delete bullets[i];
//            }
            context.drawImage(enemyImage, enemies[i].x, enemies[i].y);
            enemy.enemyMove(enemies[i]);
        }
    }

    if (enemyBulletReady) {
        for (var i = 0; i < enemyBullets.length; i++) {
//            if (bullets[i].y < 0 && i > 1) {
//                //delete bullets[i];
//            }
            context.drawImage(enemyBulletImage, enemyBullets[i].x, enemyBullets[i].y);
            bullet.enemyBulMove(enemyBullets[i]);
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
