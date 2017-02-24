/*
 * © 2017 Finn Bear All Rights 
 */

var Game = {objects: []};
var Display = {canvas: null, context: null, width: 0, height: 0, backgroundColor: "gray"};
var Keyboard = {keys: []};
var Mouse = {x:0, y:0, left: false, middle: false, right: false};

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
	
	Display.canvas.addEventListener('touchmove',
	function(e) {
		var canvasRectangle = Display.canvas.getBoundingClientRect();
		var docX = e.touches[0].clientX - canvasRectangle.left;
		var docY = e.touches[0].clientY - canvasRectangle.top;
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
	
	Display.canvas.addEventListener('touchstart',
	function(e) {
		setTimeout(function() {
		Mouse.left = true;
		}, 10);
	},
	false);
	
	Display.canvas.addEventListener('mouseup',
	function(e) {
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
					alert("Thats one button you actually shouldn't press!");
			}
		}, 20);
	},
	false);
	
	Display.canvas.addEventListener('touchend',
	function(e) {
		setTimeout(function() {
			Mouse.left = false;
		}, 20);
	},
	false);
	
	$.getJSON("objects.json", function(json) {
		Game.objects = json;
		
		Game.objects.forEach(function(object) {
			// Initilize the object's sprite by loading its image
			object.sprite.image = new Image();
			object.sprite.image.src = "textures/" + object.sprite.source;
		});
	});
}

Game.update = function() {
	Game.objects.forEach(function(object) {
		if (object.enabled)
		{
			// Check if the mouse is hovering over the object based on the shape of the object
			var hovered = false;
			switch (object.sprite.shape)
			{
				case "rectangle":
					hovered = mouseInRect(object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight);
					break;
				case "circle":
					hovered = mouseInCircle(object.sprite.displayX + object.sprite.displayWidth / 2, object.sprite.displayY + object.sprite.displayHeight / 2, object.sprite.hoverRadius * 0.25 * (object.sprite.displayWidth + object.sprite.displayHeight));
					break;
			}
			
			// Apply any clicks to the object
			if (object.clickable)
			{
				if (hovered)
				{
					if (Mouse.left)
					{
						object.sprite.frame = object.sprite.pressedFrame;
						if (!object.sprite.pressed && !(+new Date() - object.lastPressed < 150))
						{
							object.clicks += 1;
							object.actions.forEach(function(action) {
								if (object.clicks == action.clicks)
								{
									switch (action.type)
									{
										case "enable":
											Game.objects[action.id].enabled = true;
											Game.objects[action.id].clicks = 0;
											Game.objects[action.id].state = "default";
											break;
										case "disable":
											Game.objects[action.id].enabled = false;
											Game.objects[action.id].clicks = 0;
											Game.objects[action.id].sprite = "default";
											break;
										case "state":
											Game.objects[action.id].state = action.value;
											break;
									}
									
								}
							});
						}
						object.state = "pressed";
						object.lastPressed = +new Date();
					}
					else if (+new Date() - object.lastPressed < 150)
					{
						object.state = "pressed";
						object.sprite.pressed = false;
					}
					else
					{
						object.state = "hovered";
						object.sprite.pressed = false;
					}	
				}
				else
				{
					object.state = "default";
					object.sprite.pressed = false;
				}
			}
		}
	});
}

Game.draw = function() {
	// Clear the canvas
	Display.context.clearRect(0, 0, Display.width, Display.height);
	Display.context.fillStyle = Display.backgroundColor;
	Display.context.fillRect(0, 0, Display.width, Display.height);
	
	// Draw all the objects
	Game.objects.forEach(function(object) {
		if (object.enabled)
		{	
			// Smoothing is enabled on a per-object basis due to sampling errors
			Display.context.imageSmoothingEnabled = object.sprite.smoothing;

			// Draw the current frame of the object
			Display.context.drawImage(object.sprite.image, object.sprite.frameWidth * object.states[object.state], 0, object.sprite.frameWidth, object.sprite.frameHeight, object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight);
		}
	});
}

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

