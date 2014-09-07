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
