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

// asteroid images
//var asteroidReady = false;
//var asteroidImage = new Image();
//asteroidImage.onload = function(){
//    asteroidReady = true;
//};
////asteroidImage.src = "img/big.png";

// big asteroid image
var bigReady = false;
var bigImage = new Image();
bigImage.onload = function(){
    bigReady = true;
};
bigImage.src = "img/big.png";

// middle asteroid image
var middleReady = false;
var middleImage = new Image();
middleImage.onload = function(){
    middleReady = true;
};
middleImage.src = "img/middle.png";

// small asteroid image
var smallReady = false;
var smallImage = new Image();
smallImage.onload = function(){
    smallReady = true;
};
smallImage.src = "img/small.png";

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
                var newBul = bullet.newBullet(ship.x + 30, ship.y - 40, 1);
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

    newBullet: function(x, y, dir) {
        this.x = x;
        this.y = y;
        this.speed = 256;
        this.dir = dir;

        if (dir == 1) {
            this.image = bulletImage;
        } else {
            this.image = enemyBulletImage;
        }

        return {x: this.x, y: this.y, speed: this.speed, image: this.image, dir: this.dir};
    },

    move: function (bul){
        if (bul.dir == 1) {
            bul.y -= bul.speed * 0.008;
        }

        if (bul.dir == 2) {
            bul.y += bul.speed * 0.007;
        }
    },

    update: function() {
        if (bullet.gap > bullet.time) {
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].y < 900) {
                    var newEnemyBul = bullet.newBullet(enemies[i].x + 20, enemies[i].y + 55, 2);
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

    newAsteroid: function() {
        var rand = getRandomInt(1, 30);
        var x = getRandomInt(50, 800);
        var y = getRandomInt(1, 20);

        if (checkForObjects(x, y, enemies) && checkForObjects(x, y, asteroids)) {
            this.x = x;
            this.y = y;
        }

        this.size = rand;

        if (rand < 10) {
            this.health = 0;
        } else {
            this.health = getRandomInt(1, 5);
        }

        this.dir = 2;

        if (rand <= 10) {
            this.image = smallImage;
        }

        if (rand > 10 && rand <= 20) {
            this.image = middleImage;
        }

        if (rand > 20 && rand <= 30) {
            this.image = bigImage;
        }

         return {x: this.x, y: this.y, health: this.health, size: this.size, image: this.image, dir: this.dir};
    },

    move: function(ast) {
        ast.y += 1;
    },

    update: function () {
        var r = Math.random() * 100000;

        if (r > 99250) {
            var newAsteroid = asteroid.newAsteroid();
            asteroids.push(newAsteroid);
        }

        var small = [],
            medium = [],
            obj = {};

       for (var i = bullets.length - 1; i >= 0; i--) {
           for (var j = asteroids.length - 1; j >= 0; j--) {
               if (map.collision(bullets[i], asteroids[j], 32, 32) && asteroids[j].size <= 10) {
                   asteroids.splice(j, 1);
                   bullets.splice(i, 1);
               }

               else if (map.collision(bullets[i], asteroids[j], 50, 50) && asteroids[j].size > 10 && asteroids[j].size <= 20) {
                   small.push(j);
                   bullets.splice(i, 1);
               }

               else if (map.collision(bullets[i], asteroids[j], 64, 64) && asteroids[j].size > 20 && asteroids[j].size <= 30) {
                   medium.push(j);
                   bullets.splice(i, 1);
               }
           }
       }

        if (small.length > 0) {
            for (var s = small.length - 1; s >= 0; s--) {
                if (asteroids[small[s]] != undefined && asteroids[small[s]].health == 0) {
                    var x = asteroids[small[s]].x;
                    var y = asteroids[small[s]].y;
                    obj = asteroid.newAsteroid();
                    obj.x = x - 30;
                    obj.y = y + 5;
                    obj.size = 5;
                    obj.image = smallImage;
                    asteroids.splice(small[s] + i + 1, 1); //= false;
                    asteroids.push(obj);
                    obj = asteroid.newAsteroid();
                    obj.x = x + 30;
                    obj.y = y + 5;
                    obj.size = 5;
                    obj.image = smallImage;
                    asteroids.push(obj);
                }

                else {
                    asteroids[small[s]].health--;
                }
            }
        }


        if (medium.length > 0) {
            for (var s = medium.length - 1; s >= 0; s--) {
                if (asteroids[medium[s]] != undefined && asteroids[medium[s]].health == 0) {
                    var x = asteroids[medium[s]].x;
                    var y = asteroids[medium[s]].y;
                    obj = asteroid.newAsteroid();
                    obj.x = x - 50;
                    obj.y = y + 5;
                    obj.size = 15;
                    obj.image = middleImage;
                    asteroids.splice(medium[s] + i + 1, 1); //= false;
                    asteroids.push(obj);
                    obj = asteroid.newAsteroid();
                    obj.x = x + 50;
                    obj.y = y + 5;
                    obj.size = 15;
                    obj.image = middleImage;
                    asteroids.push(obj);
                }

                else {
                    asteroids[medium[s]].health--;
                }
            }
        }
   }
};

var enemy = {

    newEnemy: function() {
        var x = getRandomInt(50, 800);
        var y = getRandomInt(1, 20);
        if (checkForObjects(x, y, enemies) && checkForObjects(x, y, asteroids)) {
            this.x = x;
            this.y = y;
        }
        this.image = enemyImage;
        this.dir = 2;
        this.health = 2;

        return {x: this.x, y: this.y, health: this.health, image: this.image, dir: this.dir};
    },

    move: function(enemy) {
        enemy.y += 1;
    },

    update: function() {
        var r = Math.random() * 100000;

        if (r > 99250 && r < 99470) {
            var newEnemy = enemy.newEnemy();
            enemies.push(newEnemy);

            var newEnemyBul = bullet.newBullet(enemies[enemies.length - 1].x + 20, enemies[enemies.length - 1].y + 55, 2);
            enemyBullets.push(newEnemyBul);
        }

        for (var i = bullets.length - 1; i >= 0; i--) {
            for (var j = enemies.length - 1; j >= 0; j--) {
                if (map.collision(bullets[i], enemies[j], 50, 50)) {
                    if ( enemies[j].health == 0) {
                        enemies.splice(j, 1);
                        bullets.splice(i, 1);
                    } else {
                        enemies[j].health--;
                        bullets.splice(i, 1);
                    }
                }
            }
        }
    }
};

var map = {
    collision: function (firstObj, secondObj, w, h)
    {
        if (firstObj != undefined && secondObj != undefined) {
            return (firstObj.y <= secondObj.y + h && firstObj.x > secondObj.x && firstObj.x <= secondObj.x + w);
        }
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

function checkForObjects (x, y,  arr1) {
    var check = true;
    var o = {x: x, y: y};

    for (var i = 0; i < arr1.length; i++) {
        check = check && !map.collision(o, arr1[i], 65, 65);
    }

    return check;
}

// Draw everything

function draw (obj, input) {
    if (input.length > 0) {
        for (var i = 0; i < input.length; i++) {
            if (input[i].y > 600 && input[i].dir == 2 && input[i] != undefined) {
                input.splice(i, 1);
            }

            else if (input[i].y < 0 && input[i].dir == 1 && input[i] != undefined) {
                input.splice(i, 1);
            }

            else {
                if (input[i] != undefined) {
                    context.drawImage(input[i].image, input[i].x, input[i].y);
                    obj.move(input[i], input[i].dir);
                }
            }
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
        draw (bullet, bullets);
    }

    if (smallReady && middleReady && bigReady) {
        draw (asteroid, asteroids);
    }

    if (enemyReady) {
        draw (enemy, enemies);
    }

    if (enemyBulletReady) {
        draw (bullet, enemyBullets);
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