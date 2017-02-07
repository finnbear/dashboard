var Game = {objects: []}
var Display = {canvas: null, context: null, width: 0, height: 0, backgroundColor: "gray"}
var Keyboard = {keys: []}
var Mouse = {x:0, y:0, left: false, middle: false, right: false}

Game.initialize = function() {
	Display.canvas = document.getElementById("viewport");
	Display.context = Display.canvas.getContext("2d");
	Display.width = Display.canvas.width;
	Display.height = Display.canvas.height;	
	Display.canvas.addEventListener('mousemove',
	function(e) {
		var canvasRectangle = Display.canvas.getBoundingClientRect();
		var docX = e.clientX - canvasRectangle.left;
		var docY = e.clientY - canvasRectangle.top;
		Mouse.x = translate(docX, 0, canvasRectangle.width, 0, Display.width);
		Mouse.y = translate(docY, 0, canvasRectangle.height, 0, Display.height);
	},
	false);
	Display.canvas.addEventListener('mousedown',
	function(e) {
		switch (e.button)
		{
			case 0: // Left Click
				Mouse.left = true;
				break;
			case 1: // Middle Click
				Mouse.middle = true;
				break;
			case 2: // Right Click
				Mouse.right = true;
				break;
			default:
				alert("Thats one button you actually shouldn't press!");
		}
	},
	false);
	Display.canvas.addEventListener('mouseup',
	function(e) {
		switch (e.button)
		{
			case 0: // Left Click
				Mouse.left = false;
				break;
			case 1: // Middle Click
				Mouse.middle = false;
				break;
			case 2: // Right Click
				Mouse.right = false;
				break;
			default:
				alert("Thats one button you actually shouldn't press!");
		}
	},
	false);
	
	$.getJSON("objects.json", function(json) {
		Game.objects = json;
		
		Game.objects.forEach(function(object) {
			object.sprite.image = new Image();
			object.sprite.image.src = "textures/" + object.sprite.source;
		});
	});
}

Game.update = function() {
	Game.objects.forEach(function(object) {
		
	});
}

Game.draw = function() {
	Display.context.clearRect(0, 0, Display.width, Display.height);
	Display.context.fillStyle = Display.backgroundColor;
	Display.context.fillRect(0, 0, Display.width, Display.height);
	
	Game.objects.forEach(function(object) {
		if (object.enabled)
		{
			var frame = 0;
		
			if (mouseInRect(object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight))
			{
				if (Mouse.left)
				{
					frame = 2;
				}
				else
				{
					frame = 1
				}
			}
			
			Display.context.drawImage(object.sprite.image, object.sprite.frameWidth * frame, 0, object.sprite.frameWidth, object.sprite.frameHeight, object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight);
		}
	});
}

window.addEventListener("keydown",
    function(e){
        Keyboard.keys[e.keyCode] = true;
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        	e.preventDefault();
    	}
    },
    false);

window.addEventListener('keyup',
	function(e){
		Keyboard.keys[e.keyCode] = false;
	},
	false);
	
// Utility Functions
var translate = function(value, inMin, inMax, outMin, outMax)
{
	return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

var inRange = function(value, bound1, bound2)
{
	return (value >= bound1) == (value <= bound2);
}

var inRect = function(x, y, rectX, rectY, rectWidth, rectHeight)
{
	return inRange(x, rectX, rectX + rectWidth) && inRange(y, rectY, rectY + rectHeight);
}

var mouseInRect = function(rectX, rectY, rectWidth, rectHeight)
{
	return inRect(Mouse.x, Mouse.y, rectX, rectY, rectWidth, rectHeight);
}


