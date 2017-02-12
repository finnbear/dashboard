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
	
	Display.canvas.addEventListener('touchstart',
	function(e) {
		Mouse.left = true;
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
		}, 50);
	},
	false);
	
	Display.canvas.addEventListener('touchend',
	function(e) {
		setTimeout(function() {
			Mouse.left = false;
		}, 50);
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
		if (object.enabled)
		{
			var hovered = false;
			switch (object.sprite.shape)
			{
				case "rect":
					hovered = mouseInRect(object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight);
					break;
				case "circle":
					hovered = mouseInCircle(object.sprite.displayX + object.sprite.displayWidth / 2, object.sprite.displayY + object.sprite.displayHeight / 2, object.sprite.hoverRadius * 0.25 * (object.sprite.displayWidth + object.sprite.displayHeight));
					break;
			}
			
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
										Game.objects[action.id].sprite.pressed = false;
										break;
									case "disable":
										Game.objects[action.id].enabled = false;
										Game.objects[action.id].clicks = 0;
										Game.objects[action.id].sprite.pressed = false;
										break;
									case "defaultFrame":
										Game.objects[action.id].sprite.defaultFrame = action.value;
										break;
								}
								
							}
						});
					}
					object.sprite.pressed = true;
					object.lastPressed = +new Date();
				}
				else if (+new Date() - object.lastPressed < 150)
				{
					object.sprite.frame =  object.sprite.pressedFrame;
					object.sprite.pressed = false;
				}
				else
				{
					object.sprite.frame = object.sprite.hoveredFrame;
					object.sprite.pressed = false;
				}	
			}
			else
			{
				object.sprite.frame = object.sprite.defaultFrame;
				object.sprite.pressed = false;
			}
		}
	});
}

Game.draw = function() {
	Display.context.clearRect(0, 0, Display.width, Display.height);
	Display.context.fillStyle = Display.backgroundColor;
	Display.context.fillRect(0, 0, Display.width, Display.height);
	
	Game.objects.forEach(function(object) {
		if (object.enabled)
		{	
			Display.context.drawImage(object.sprite.image, object.sprite.frameWidth * object.sprite.frame, 0, object.sprite.frameWidth, object.sprite.frameHeight, object.sprite.displayX, object.sprite.displayY, object.sprite.displayWidth, object.sprite.displayHeight);
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

var inCircle = function(x, y, circleX, circleY, circleRadius)
{
	return Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2)) <= circleRadius;
}

var mouseInCircle = function(circleX, circleY, circleRadius)
{
	return inCircle(Mouse.x, Mouse.y, circleX, circleY, circleRadius);
}

