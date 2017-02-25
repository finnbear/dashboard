/*
 * © 2017 Finn Bear All Rights Reserved
 */

var Editor = {running: false, objects: []};

var gridSizeX = 50;
var gridSizeY = 50;

Editor.initialize = function() {

};

Editor.update = function() {

};

Editor.draw = function() {
	// Clear the canvas
	Display.clear();

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

var gridLine = function(x1, y1, x2, y2) {
	Display.context.beginPath();
	Display.context.moveTo(x1, y1);
	Display.context.lineTo(x2, y2);
	Display.context.stroke();
};