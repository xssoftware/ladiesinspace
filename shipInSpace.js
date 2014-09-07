<<<<<<< HEAD
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.strokeStyle = "red";
canvas.width = 900;
canvas.height = 600;
canvas.style.border = "1px solid black";
canvas.style.display = "block";
canvas.style.margin = "20px auto";
document.getElementById("game").appendChild(canvas);
=======
// add canvas
var canvas = document.getElementById("shipInSpace");
var context = canvas.getContext("2d");

context.fillStyle = "black";
context.strokeStyle = "red";

// background image
var backgroundImage = new Image();
backgroundImage.onload = function () {
  context.drawImage(backgroundImage, -10, -10);
};
backgroundImage.src = "img/background.jpg";

// ship image
var shipImage = new Image();
shipImage.onload = function(){
  context.drawImage(shipImage, 480, 530);
};
shipImage.src = "img/spaceship1_final.png";
>>>>>>> 822f1f7ebe421b683bf455bdf512c04e9d1571d8
