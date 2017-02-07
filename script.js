var Game = {}
var Display = {canvas: null, context: null, width: 0, height: 0, backgroundColor: "white"}
var Keyboard = {keys: []}
var Mouse = {x:0, y:0, left: false, right: false}

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

