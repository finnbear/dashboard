/*
 * © 2017 Finn Bear All Rights Reserved
 */

var Display = {canvas: null, context: null, width: 0, height: 0, backgroundColor: "gray"};
var Keyboard = {keys: []};
var Mouse = {x:0, y:0, left: false, middle: false, right: false};
var Memory = {objects: []}

Display.initialize = function() {
	Display.canvas = document.getElementById("viewport");
	Display.context = Display.canvas.getContext("2d");
	Display.width = Display.canvas.width;
	Display.height = Display.canvas.height;

	Display.canvas.addEventListener('mousemove', function(e) {
		var canvasRectangle = Display.canvas.getBoundingClientRect();
		var docX = e.clientX - canvasRectangle.left;
		var docY = e.clientY - canvasRectangle.top;
		Mouse.x = translate(docX, 0, canvasRectangle.width, 0, Display.width);
		Mouse.y = translate(docY, 0, canvasRectangle.height, 0, Display.height);
	},
	false);
	
	Display.canvas.addEventListener('touchmove', function(e) {
		var canvasRectangle = Display.canvas.getBoundingClientRect();
		var docX = e.touches[0].clientX - canvasRectangle.left;
		var docY = e.touches[0].clientY - canvasRectangle.top;
		Mouse.x = translate(docX, 0, canvasRectangle.width, 0, Display.width);
		Mouse.y = translate(docY, 0, canvasRectangle.height, 0, Display.height);
	},
	false);
	
	Display.canvas.addEventListener('mousedown', function(e) {
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
				alert("That's one button you actually shouldn't press!");
		}
	},
	false);
	
	Display.canvas.addEventListener('touchstart', function(e) {
		setTimeout(function() {
		Mouse.left = true;
		}, 10);
	},
	false);
	
	Display.canvas.addEventListener('mouseup', function(e) {
		setTimeout(function() {
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
					alert("That's one button you actually shouldn't press!");
			}
		}, 20);
	},
	false);
	
	Display.canvas.addEventListener('touchend', function(e) {
		setTimeout(function() {
			Mouse.left = false;
		}, 20);
	},
	false);
};

Display.clear = function() {
	Display.context.clearRect(0, 0, Display.width, Display.height);
	Display.context.fillStyle = Display.backgroundColor;
	Display.context.fillRect(0, 0, Display.width, Display.height);
};

Memory.setObjects = function(objects) {
	this.objects = objects;
	this.objects.forEach(function(object) {
		// Initilize the object's sprite by loading its image
		object.sprite.image = new Image();
		object.sprite.image.src = "textures/" + object.sprite.source;
	});
}

Memory.load = function() {
	if(typeof(Storage) !== "undefined") {
		if (localStorage.getItem("objects") === null) {
			return false;
		} else {
			this.setObjects(JSON.parse(localStorage.getItem("objects")));
			return true;
		}
	}
	return null;
};

Memory.save = function() {
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("objects", JSON.stringify(this.objects));
	}
};

window.addEventListener("keydown",
    function(e){
        Keyboard.keys[e.keyCode] = true;

        // Prevent scrolling from ocurring due to arrow keys
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

// Scale a value from one range to another
var translate = function(value, inMin, inMax, outMin, outMax)
{
	return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// Check if a value is in a certain range
var inRange = function(value, bound1, bound2)
{
	return (value >= bound1) == (value <= bound2);
}

// Check if a point is in a certain rectangle
var inRect = function(x, y, rectX, rectY, rectWidth, rectHeight)
{
	return inRange(x, rectX, rectX + rectWidth) && inRange(y, rectY, rectY + rectHeight);
}

// Check if the mouse is in a certain rectangle
var mouseInRect = function(rectX, rectY, rectWidth, rectHeight)
{
	return inRect(Mouse.x, Mouse.y, rectX, rectY, rectWidth, rectHeight);
}

// Check if a point is in a certain circle
var inCircle = function(x, y, circleX, circleY, circleRadius)
{
	return Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2)) <= circleRadius;
}

// Check if the mouse is in a certain circle
var mouseInCircle = function(circleX, circleY, circleRadius)
{
	return inCircle(Mouse.x, Mouse.y, circleX, circleY, circleRadius);
}