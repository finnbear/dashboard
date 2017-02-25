/*
 * © 2017 Finn Bear All Rights Reserved
 */

var Game = {objects: []};

Game.initialize = function() {
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
	Display.clear();
	
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