var Game = {objects: []}
var Display = {canvas: null, context: null, width: 0, height: 0, backgroundColor: "white"}
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
		Mouse.x = e.clientX - canvasRectangle.left;
		Mouse.y = e.clientY - canvasRectangle.top;
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
		alert(json);
	});
}

Game.update = function() {
	
}

Game.draw = function() {
	Display.context.clearRect(0, 0, Display.width, Display.height);
	Display.context.fillStyle = Display.backgroundColor;
	Display.context.fillRect(0, 0, Display.width, Display.height);
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

