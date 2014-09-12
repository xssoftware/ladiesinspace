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
shipImage.src = "img/ship.png";

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
    enemyBullets = [];

var bg = {
    x: 0,
    y: 0,
    nextX: 0,
    nextY: 0 - 600
};

var ship = {

    // Properties
    speed: 256, // movement speed
    health: 100,
    time: 12,
    gap: 13,

    // Methods
    update: function (modifier) {

        if (38 in keysDown) { // Player holding up
             if (40 in keysDown) { // Player holding down
                 bg.y += ship.speed * modifier / 4.5;
                 bg.nextY += ship.speed * modifier / 4.5;
             }
             else {
                bg.y += ship.speed * modifier;
                bg.nextY += ship.speed * modifier;
             }
        }
        if (40 in keysDown) { // Player holding down
            bg.y += ship.speed * modifier / 4.5;
            bg.nextY += ship.speed * modifier / 4.5;
        }
        if (37 in keysDown) { // Player holding left
            ship.x -= ship.speed * modifier;

        }
        if (39 in keysDown) { // Player holding right
            ship.x += ship.speed * modifier;

        }
        if (32 in keysDown) {
            if (ship.gap > ship.time) {
                var newBul = bullet.newBullet(ship.x + 30, ship.y - 40);
                bullets.push(newBul);
                ship.gap = 0;
            } else {
                ship.gap++;
            }
        }
    },

    reset: function () {
        ship.x = canvas.width / 2;
        ship.y = canvas.height - canvas.height / 6;
        ship.health = 100;
        bg.x = 0;
        bg.y = 0;
    }
};

var bullet = {

    time: 120,
    gap: 70,

    newBullet: function(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 256;

        return {x: this.x, y: this.y, speed: this.speed};
    },

   move: function (bul, dir){
       if (dir == 1) {
           bul.y -= bul.speed * 0.008;
       }

       if (dir == 2) {
           bul.y += bul.speed * 0.007;
       }
   },

    update: function() {
        if (bullet.gap > bullet.time) {
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].y < 900) {
                    var newEnemyBul = bullet.newBullet(enemies[i].x + 20, enemies[i].y + 55);
                    enemyBullets.push(newEnemyBul);
                }
            }
            bullet.gap = 0;
        }
        else {
            bullet.gap++;
        }
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
    },

    update: function () {
        var r = Math.random() * 100000;

        if (r > 99700) {
            var newAsteroid = asteroid.newAsteroid();
            asteroids.push(newAsteroid);
        }
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
    },

    update: function() {
        var r = Math.random() * 100000;

        if (r > 99200 && r < 99370) {
            var newEnemy = enemy.newEnemy();
            enemies.push(newEnemy);

            var newEnemyBul = bullet.newBullet(enemies[enemies.length - 1].x + 20, enemies[enemies.length - 1].y + 55);
            enemyBullets.push(newEnemyBul);
        }

        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < enemies.length; j++) {
                if (map.collision(bullets[i], enemies[j], 7, 14)) {
                    enemies.splice(j, 1);
                }
            }
        }
    }
};

var map = {
    collision: function (firstObj, secondObj, w, h)
    {
        return (firstObj.y <= secondObj.y + 65 );
    },

    borders: function () {
        if (ship.x <= 0) {
            ship.x = 0;
        }

        if (ship.x >= 900 - 64) {
            ship.x = 900 - 64;
        }
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
        if (bg.y > 600) {
            bg.y = 0 - 600;
        }

        if (bg.nextY > 600) {
            bg.nextY = 0 - 600;
        }
        context.drawImage(bgImage, bg.nextX, bg.nextY);
        context.drawImage(bgImage, bg.x, bg.y);
    }

    if (shipReady) {
        context.drawImage(shipImage, ship.x, ship.y);
        map.borders();
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

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    ship.update(delta / 1000);
    asteroid.update();
    enemy.update();
    bullet.update();
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

var then = Date.now();
ship.reset();
main();
