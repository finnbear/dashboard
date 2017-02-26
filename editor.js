/*
 * © 2017 Finn Bear All Rights Reserved
 */

var Editor = {running: false, objects: []};

var gridSizeX = 50;
var gridSizeY = 50;

Editor.initialize = function() {
	
};

Editor.enable = function() {
	Editor.running = true;

	var toolBar = document.getElementById("tool-bar");
	addButton(toolBar, "Load", function() {
		Memory.load();
	});
	addButton(toolBar, "Save", function() {
		Memory.save();
	});
	addButton(toolBar, "Add Object", function() {
		Memory.addObject({
			"id": 3,
			"enabled": true,
			"lifespan": 5,
			"clickable": true,
			"clicks": 0,
			"state": "default",
			"states": {
				"default": 0,
				"hovered": 2,
				"pressed": 3
			},
			"actions": [],
			"sprite": {
				"source": "button_green.png",
				"shape": "rectangle",
				"smoothing": true,
				"frameWidth": 32,
				"frameHeight": 24,
				"displayX": 450,
				"displayY": 100,
				"displayWidth": 100,
				"displayHeight": 75
		    }
		});
	});
};

Editor.disable = function() {
	Editor.running = false;

	var toolBar = document.getElementById("tool-bar");
	while (toolBar.firstChild)
	{
		toolBar.removeChild(toolBar.firstChild);
	}
};

Editor.update = function() {

};

Editor.draw = function() {
	// Clear the canvas
	Display.clear();

	drawGrid();
};

var gridLine = function(x1, y1, x2, y2) {
	Display.context.beginPath();
	Display.context.moveTo(x1, y1);
	Display.context.lineTo(x2, y2);
	Display.context.stroke();
};

var drawGrid = function() {
	var gridSpacingX = Display.width / gridSizeX;
	var gridSpacingY = Display.height / gridSizeY;

	for (var x = 0; x < gridSizeX; x += 1)
	{
		gridLine(x * gridSpacingX, 0, x * gridSpacingX, Display.height);
	}

	for (var y = 0; y < gridSizeY; y += 1)
	{
		gridLine(0, y * gridSpacingY, Display.width, y * gridSpacingY);
	}
};

var addButton = function(parent, name, clickAction)
{
	var button = document.createElement("input");
	button.type = "button"
	button.value = name;
	parent.appendChild(button);
	button.addEventListener("click", clickAction);
}