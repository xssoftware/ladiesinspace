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

// enemyBullet image
var enemyBulletReady = false;
var enemyBulletImage = new Image();
enemyBulletImage.onload = function(){
    enemyBulletReady = true;
};
enemyBulletImage.src = "img/enemyBullet.png";

// enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function(){
    enemyReady = true;
};
enemyImage.src = "img/enemy.png";

// asteroid image
var asteroidReady = false;
var asteroidImage = new Image();
asteroidImage.onload = function(){
    asteroidReady = true;
};
asteroidImage.src = "img/asteroid.png";

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
});

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
});


// Game objects

var bullets = [],
    asteroids = [],
    enemies = [],
    enemyBullets = [],
    time = 120,
    gap = 70;

var ship = {

    // Properties
    speed: 256, // movement speed
    health: 100,

    // Methods
    update: function (modifier) {

        var r = Math.random() * 100000;

        if (r > 99700) {
            var newAsteroid = asteroid.newAsteroid();
            asteroids.push(newAsteroid);
        }

        if (r > 99200 && r < 99370) {
            var newEnemy = enemy.newEnemy();
            enemies.push(newEnemy);

            var newEnemyBul = bullet.newBullet(enemies[enemies.length - 1].x + 20, enemies[enemies.length - 1].y + 55);
            enemyBullets.push(newEnemyBul);
        }

        if (gap > time) {
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].y < 900) {
                    newEnemyBul = bullet.newBullet(enemies[i].x + 20, enemies[i].y + 55);
                    enemyBullets.push(newEnemyBul);
                }
            }
            gap = 0;
        }
        else {
            gap++;
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
            var newBul = bullet.newBullet(ship.x + 30, ship.y - 40);
            bullets.push(newBul);
        }
    },

    reset: function () {
        ship.x = canvas.width / 2;
        ship.y = canvas.height - canvas.height / 6;
        ship.health = 100;
    }
};

var bullet = {

   move: function (bul, dir){
       if (dir == 1) {
           bul.y -= bul.speed * 0.008;
       }

       if (dir == 2) {
           bul.y += bul.speed * 0.007;
       }
   },

    newBullet: function(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 256;

        return {x: this.x, y: this.y, speed: this.speed};
        }
};

//{(speed, endurance, direction, size)

var asteroid = {

    rand: getRandomInt(1, 3),

    newAsteroid: function() {
        this.health = this.rand;
        this.size = this.rand;
        this.x = getRandomInt(50, 800);
        this.y = getRandomInt(1, 20);

        return {x: this.x, y: this.y, health: this.health, size: this.size};
    },

    move: function(ast) {
        ast.y += 1;
    }
};

var enemy = {

    newEnemy: function() {
        this.health = 1;
        this.x = getRandomInt(50, 800);
        this.y = getRandomInt(1, 20);

        return {x: this.x, y: this.y, health: this.health};
    },

    move: function(enemy) {
        enemy.y += 1;
    }
};



// FUNCTIONS

//Random
//Returns a random integer between min (inclusive) and max (inclusive)
//Using Math.round() will give you a non-uniform distribution!

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Draw everything

function draw (obj, image, input, dir) {
    for (var i = 0; i < input.length; i++) {
        if (input[i].y > 600) {
            input.splice(i, 1);
            console.log(input.length)
        } else {
            context.drawImage(image, input[i].x, input[i].y);
            obj.move(input[i], dir);
        }
    }
}

var render = function () {
    if (bgReady) {
        context.drawImage(bgImage, 0, 0);
    }

    if (shipReady) {
        context.drawImage(shipImage, ship.x, ship.y);
    }

    if (bulletReady) {
        draw (bullet, bulletImage, bullets, 1);
    }

    if (asteroidReady) {
        console.log (asteroids.length);
        draw (asteroid, asteroidImage, asteroids, 2);
        console.log (asteroids.length);
    }

    if (enemyReady) {
        draw (enemy, enemyImage, enemies, 2);
    }

    if (enemyBulletReady) {
        draw (bullet, enemyBulletImage, enemyBullets, 2);
    }
};

//detect collision between two objects
function detectCollision(firstObj, secondObj)
{
    return ((firstObj.x <= secondObj.x && firstObj.x + 32 >= secondObj.x) &&
        (firstObj.y <= secondObj.y && secondObj.y + 32 >= secondObj));
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
