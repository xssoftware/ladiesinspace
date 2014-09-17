//add canvas
var canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");

context.fillStyle = "black";
context.strokeStyle = "red";

canvas.setAttribute("class", "canvasss");
canvas.width = 900;
canvas.height = 600;
canvas.style.border = "1px solid black";
canvas.style.display = "block";
canvas.style.margin = "20px auto";

document.getElementById("game").appendChild(canvas);

// Background image
var bgReady = false,
    bgImage = new Image();

bgImage.onload = function () {
    bgReady = true;
};

bgImage.src = "img/background.jpg";

// ship image
var shipReady = false,
    shipImage = new Image();

shipImage.onload = function () {
    shipReady = true;
};

shipImage.src = "img/ship.png";

// bullet image
var bulletReady = false,
    bulletImage = new Image();

bulletImage.onload = function(){
    bulletReady = true;
};

bulletImage.src = "img/bullet.png";

// enemyBullet image
var enemyBulletReady = false,
    enemyBulletImage = new Image();

enemyBulletImage.onload = function(){
    enemyBulletReady = true;
};

enemyBulletImage.src = "img/enemyBullet.png";

// enemy image
var enemyReady = false,
    enemyImage = new Image();

enemyImage.onload = function(){
    enemyReady = true;
};

enemyImage.src = "img/enemy.png";

// asteroid images

// big asteroid image
var bigReady = false,
    bigImage = new Image();

bigImage.onload = function(){
    bigReady = true;
};

bigImage.src = "img/big.png";

// middle asteroid image
var middleReady = false,
    middleImage = new Image();

middleImage.onload = function(){
    middleReady = true;
};

middleImage.src = "img/middle.png";

// small asteroid image
var smallReady = false,
    smallImage = new Image();

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
    enemyBullets = [],
    smallChange = false,
    mediumChange = false,
    end = false;

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
    height: 50,
    width: 50,
    upBorder: 400,
    time: 12,
    gap: 13,
    collisionTime: 25,
    collisionGap: 26,
    lives: 3,
    score: 0,
    // Methods

    modifySpeed: function (mod) {
        return ship.speed * mod;
    },

    detectCollision: function (arr) {

        for (var i = 0; i < arr.length; i++) {

            if (arr[i].size < 10) {
                if (map.collision(ship, arr[i])) {
                    ship.health -= 5;
                }
            }

            else if (arr[i].size > 10 && arr[i].size <= 20) {
                if (map.collision(ship, arr[i])) {
                    ship.health -= 30;
                }
            }

            else if (arr[i].size > 20 && arr[i].size <= 30) {
                if (map.collision(ship, arr[i])) {
                    ship.health = 0;
                }
            }

            else if (arr[i].size == 32) {
                if (map.collision(ship, arr[i])) {
                    ship.health -= 10;
                }
            }

            else if (arr[i].size == 31) {
                if (map.collision(ship, arr[i])) {
                    ship.health--;
                }
            }
        }
    },

    update: function (modifier) {

        if (38 in keysDown) { // Player holding up
            if (16 in keysDown) { // Player holding down
                bg.y += ship.modifySpeed(modifier) / 4.5;
                bg.nextY += ship.modifySpeed(modifier) / 4.5;
                ship.y -= ship.modifySpeed(modifier) * 0.007;
            }
            else {
                bg.y += ship.modifySpeed(modifier);
                bg.nextY += ship.modifySpeed(modifier);
                ship.y -= ship.modifySpeed(modifier);
            }
        }
        if (40 in keysDown) { // Player holding down
            bg.y += ship.modifySpeed(modifier) / 4.5;
            bg.nextY += ship.modifySpeed(modifier) / 4.5;
            ship.y += ship.modifySpeed(modifier);
        }
        if (37 in keysDown) { // Player holding left
            ship.x -= ship.modifySpeed(modifier);
        }
        if (39 in keysDown) { // Player holding right
            ship.x += ship.modifySpeed(modifier);
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

        if (ship.collisionGap > ship.collisionTime) {
            ship.detectCollision(asteroids);
            ship.detectCollision(enemies);
            ship.detectCollision(enemyBullets);
            ship.collisionGap = 0;
        } else {
            ship.collisionGap++;
        }

        if (ship.health <= 0) {

            if (ship.lives > 1) {
                ship.reset();
                ship.lives--;
            }

            else {
                end = true;
            }
        }

    },

    reset: function () {
        ship.x = canvas.width / 2;
        ship.y = canvas.height - canvas.height / 6;
        ship.health = 100;
        bg.x = 0;
        bg.y = 0;
        bg.nextX = 0;
        bg.nextY = 0 - 600;
        bullets = [];
        enemyBullets = [];
        enemies = [];
        asteroids = [];
    }
};

var bullet = {

    time: 120,
    gap: 70,
    border: 70,

    newBullet: function(x, y, dir) {
        this.x = x;
        this.y = y;
        this.speed = 256;
        this.dir = dir;
        this.size = 31;

        if (dir == 1) {
            this.image = bulletImage;
            this.height = 14;
            this.width = 7;
        } else {
            this.image = enemyBulletImage;
            this.height = 7;
            this.width = 7;
        }

        return {x: this.x, y: this.y, speed: this.speed, image: this.image, dir: this.dir,
            height: this.height, width: this.width, size: this.size};
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

var asteroid = {

    newAsteroid: function() {

        var rand = map.randomInteger(1, 30),
            x = map.randomInteger(50, 800),
            y = map.randomInteger(1, 20);

        if (map.checkForObjects(x, y, enemies) && map.checkForObjects(x, y, asteroids)) {
            this.x = x;
            this.y = y;
        }

        this.size = rand;
        this.speed = 256;
        this.dir = 2;

        if (rand <= 10) {
            this.health = 0;
        } else {
            this.health = map.randomInteger(1, 3);
        }

        if (rand <= 10) {
            this.image = smallImage;
            this.height = 32;
            this.width = 32;
        }

        if (rand > 10 && rand <= 20) {
            this.image = middleImage;
            this.height = 50;
            this.width = 50;
        }

        if (rand > 20 && rand <= 30) {
            this.image = bigImage;
            this.height = 64;
            this.width = 64;
        }

        return {x: this.x, y: this.y, health: this.health, size: this.size, image: this.image, dir: this.dir,
            speed: this.speed, height: this.height, width: this.width};
    },

    tempObj: function (ast) {

        var obj = asteroid.newAsteroid();

        if (ast.size > 10 && ast.size <= 20) {
            obj.y = ast.y + 5;
            obj.size = 5;
            obj.image = smallImage;

            if (smallChange == false) {
                obj.x = ast.x - 30;
                smallChange = true;
            } else {
                obj.x = ast.x + 30;
                smallChange = false;
            }
        }

        if (ast.size > 20 && ast.size <= 30) {
            obj.y = ast.y + 5;
            obj.size = 15;
            obj.image = middleImage;

            if (mediumChange == false) {
                obj.x = ast.x - 50;
                mediumChange = true;
            } else {
                obj.x = ast.x + 50;
                mediumChange = false;
            }
        }

        return obj;
    },

    destroy: function (arr) {

        if (arr.length > 0) {

            for (var s = arr.length - 1; s >= 0; s--) {

                if (asteroids[arr[s]] != undefined && asteroids[arr[s]].health == 0) {
                    if (asteroids[arr[s]].size > 10 && asteroids[arr[s]].size <= 20) {
                        ship.score += 15;
                    }

                    if (asteroids[arr[s]].size > 20 && asteroids[arr[s]].size <= 30) {
                        ship.score += 20;
                    }

                    var temp = asteroids[arr[s]];
                    asteroids.splice(arr[s] + s, 1);
                    asteroids.push(this.tempObj(temp));
                    asteroids.push(this.tempObj(temp));
                }

                else {
                    asteroids[arr[s]].health--;

                    if (asteroids[arr[s]].size > 10 && asteroids[arr[s]].size <= 20) {
                        ship.score += 3;
                    }

                    if (asteroids[arr[s]].size > 20 && asteroids[arr[s]].size <= 30) {
                        ship.score += 5;
                    }
                }
            }
        }
    },

    move: function(ast) {
        ast.y += ast.speed * 0.006;
    },

    update: function () {

        var r = Math.random() * 100000,
            small = [],
            medium = [];

        if (r > 99250) {
            var newAsteroid = asteroid.newAsteroid();
            asteroids.push(newAsteroid);
        }

        for (var i = bullets.length - 1; i >= 0; i--) {
            for (var j = asteroids.length - 1; j >= 0; j--) {

              if(typeof bullets[i] == "undefined"){
                continue;
              }

                if (bullets[i].y > bullet.border) {
                    if (map.collision(bullets[i], asteroids[j]) && asteroids[j].size <= 10) {
                        ship.score += 10;
                        asteroids.splice(j, 1);
                        bullets.splice(i, 1);
                    }

                    else if (map.collision(bullets[i], asteroids[j]) && asteroids[j].size > 10 && asteroids[j].size <= 20) {
                        small.push(j);
                        bullets.splice(i, 1);
                    }

                    else if (map.collision(bullets[i], asteroids[j]) && asteroids[j].size > 20 && asteroids[j].size <= 30) {
                        medium.push(j);
                        bullets.splice(i, 1);
                    }
                }
            }
        }

        asteroid.destroy(small);
        asteroid.destroy(medium);
    }
};

var enemy = {

    newEnemy: function() {

        var x = map.randomInteger(50, 800),
            y = map.randomInteger(1, 20);

        if (map.checkForObjects(x, y, enemies) && map.checkForObjects(x, y, asteroids)) {
            this.x = x;
            this.y = y;
        }

        this.image = enemyImage;
        this.dir = 2;
        this.health = 2;
        this.speed = 256;
        this.height = 50;
        this.width = 50;
        this.size = 32;

        return {x: this.x, y: this.y, health: this.health, image: this.image, dir: this.dir, speed: this.speed,
            height: this.height, width: this.width, size: this.size};
    },

    move: function(enemy) {
        enemy.y += enemy.speed * 0.006;
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

                if (bullets[i].y > bullet.border) {
                    if (map.collision(bullets[i], enemies[j], 50, 50)) {
                        if (enemies[j].health == 0) {
                            ship.score += 15;
                            enemies.splice(j, 1);
                            bullets.splice(i, 1);
                        } else {
                            ship.score += 5;
                            enemies[j].health--;
                            bullets.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
};

var map = {

    startScreen: function(){
      function centerText(context, text, y) {
        var measurement = context.measureText(text);
        var x = (context.canvas.width - measurement.width) / 2;
        context.fillText(text, x, y);
      }

      context.fillStyle = "black";
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      context.fillStyle = "white";
      context.font = "48px monospace";
      centerText(context, "Ship in space", canvas.height / 2);

      context.fillStyle = "blue";
      context.font = "24px monospace";
      centerText(context, "click to begin", canvas.height / 2 + 40);

      $(".canvasss").on("click", function(){
        console.log("clickkk");
        var then = Date.now();
        ship.reset();
        main();
      });
    },

    collision: function (firstObj, secondObj) {

        if (firstObj != undefined && secondObj != undefined) {

            return firstObj.x <= (secondObj.x + secondObj.width)
                && secondObj.x <= (firstObj.x + firstObj.height)
                && firstObj.y <= (secondObj.y + secondObj.width)
                && secondObj.y <= (firstObj.y + firstObj.height);
        }
    },

    borders: function () {
        if (ship.x <= 0) {
            ship.x = 0;
        }

        if (ship.x >= 900 - 64) {
            ship.x = 900 - 64;
        }

        if (ship.y > 600 - 60) {
            ship.y = 600 - 60;
        }

        if (ship.y < ship.upBorder) {
            ship.y = ship.upBorder;
        }
    },

    checkForObjects: function (x, y,  arr1) {

        var check = true,
            obj = {x: x, y: y};

        for (var i = 0; i < arr1.length; i++) {
            check = check && !map.collision(obj, arr1[i], 65, 65);
        }

        return check;
    },

    //Random
    //Returns a random integer between min (inclusive) and max (inclusive)
    //Using Math.round() will give you a non-uniform distribution!

    randomInteger: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    draw: function (obj, input) {

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
    },

    render: function () {

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
            map.draw (bullet, bullets);
        }

        if (smallReady && middleReady && bigReady) {
            map.draw (asteroid, asteroids);
        }

        if (enemyReady) {
            map.draw (enemy, enemies);
        }

        if (enemyBulletReady) {
            map.draw (bullet, enemyBullets);
        }

        // UI
        context.fillStyle = "#000000";
        context.fillRect(0,0,canvas.width,50);

        // HEALTH BAR, DEATH and LEVEL

        if (ship.health > 0 && ship. lives >= 0) {
            context.fillStyle = "#FFffff";
            context.font = "20px Helvetica bold";
            context.textAlign = "left";
            context.fillText("lives: " + ship.lives, 50, 30);
            context.fillText("health: " + ship.health, 200, 30);
            context.fillText("score: " + ship.score, 400, 30);
        }

        else if (end == true) {
            //ship.score = 0;
            //window.location.href = "begin.html";
            context.fillRect(0,0,canvas.width,canvas.height);
            context.fillStyle = "red";
            context.font = "20px Helvetica bold";
            context.textAlign = "left";
            context.fillText("Game Over", 400, 300);
            // for (var i = 0; i < 100000000000; i++) {
            //   if (i == 99999999) {
            //     window.location.href = "begin.html";
            //   }
            // }
        }
    }
};

// The main game loop
var main = function () {

    var now = Date.now(),
        delta = now - then;

    asteroid.update();
    enemy.update();
    bullet.update();
    ship.update(delta / 1000);
    map.render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

var then = Date.now();
map.startScreen();
