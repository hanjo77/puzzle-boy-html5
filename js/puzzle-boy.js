var canvas, context, bgSprite, sprites, levelMap, blocks, rotators, 
levelArray, players, player, undoSteps, gameLoop, dragStartPos, 
backgroundCanvas, isGoingBack, enteredGoal, playerCount, firstTouch, isJumping, jumpAcceleration;

var jumpSpeed = 8;

var currentPlayer = 0;

var animSpeed = 3;

var swipeTolerance = 50;

var rotationSpeed = 0.1;

var playerSpeed = 4;

var gameSpeed = 1000/60;

var fieldSize = [0, 0];

var spritePath = "sprites/";

var rotations = [
	{
		"key": "up",
		"angle": 0,
	},
	{
		"key": "right",
		"angle": 90,
	},
	{
		"key": "down",
		"angle": 180,
	},
	{
		"key": "left",
		"angle": 270,
	}
];

function rotationIndexByKey(key) {

	var index = -1;
	switch (key) {
	
		case "up":
			index = 0;
			break;
	
		case "right":
			index = 1;
			break;
	
		case "down":
			index = 2;
			break;
	
		case "left":
			index = 3;
			break;
	}
	return index;
}

var tileSize = 32;

var spriteMap = {};

var rotation = 0;

var playerKeys = "0*#$";

var bgKeys = "123 ";

var playerIndexes = [];

var levelNr = 1;


/*
	collisionMap legend:
	-: rotates opposite direction of motion (x/y- = rotation+, x/y+ = rotation-)
	+: rotates same direction as motion (x/y+ = rotation+, x/y- = rotation-)
	r: blocks right rotation (rotation+)
	l: blocks left rotation (rotation-)
	=: blocks all rotation
	0: center
*/

var sprites = {
		
	"player-potato": {
		
		"up": [
			{
				"url": "player-potato-up-1.png",
			},
			{
				"url": "player-potato-up-2.png",
			}
		],
		"right": [
			{
				"url": "player-potato-right-1.png",
			},
			{
				"url": "player-potato-right-2.png",
			}
		],
		"down": [
			{
				"index": "0",
				"url": "player-potato-down-1.png",
			},
			{
				"url": "player-potato-down-2.png",
			}
		],
		"left": [
			{
				"url": "player-potato-left-1.png",
			},
			{
				"url": "player-potato-left-2.png",
			}
		]
	},
	"player-eggplant": {
		
		"up": [
			{
				"url": "player-eggplant-up-1.png",
			},
			{
				"url": "player-eggplant-up-2.png",
			}
		],
		"right": [
			{
				"url": "player-eggplant-right-1.png",
			},
			{
				"url": "player-eggplant-right-2.png",
			}
		],
		"down": [
			{
				"index": "*",
				"url": "player-eggplant-down-1.png",
			},
			{
				"url": "player-eggplant-down-2.png",
			}
		],
		"left": [
			{
				"url": "player-eggplant-left-1.png",
			},
			{
				"url": "player-eggplant-left-2.png",
			}
		]
	},
	"player-carrot": {
		
		"up": [
			{
				"url": "player-carrot-up-1.png",
			},
			{
				"url": "player-carrot-up-2.png",
			}
		],
		"right": [
			{
				"url": "player-carrot-right-1.png",
			},
			{
				"url": "player-carrot-right-2.png",
			}
		],
		"down": [
			{
				"index": "#",
				"url": "player-carrot-down-1.png",
			},
			{
				"url": "player-carrot-down-2.png",
			}
		],
		"left": [
			{
				"url": "player-carrot-left-1.png",
			},
			{
				"url": "player-carrot-left-2.png",
			}
		]
	},
	"player-pepper": {
		
		"up": [
			{
				"url": "player-pepper-up-1.png",
			},
			{
				"url": "player-pepper-up-2.png",
			}
		],
		"right": [
			{
				"url": "player-pepper-right-1.png",
			},
			{
				"url": "player-pepper-right-2.png",
			}
		],
		"down": [
			{
				"index": "$",
				"url": "player-pepper-down-1.png",
			},
			{
				"url": "player-pepper-down-2.png",
			}
		],
		"left": [
			{
				"url": "player-pepper-left-1.png",
			},
			{
				"url": "player-pepper-left-2.png",
			}
		]
	},
	"rotation": {
		"1": {
			"up": {
				"index": "a",
				"url": "rot-1-up.png",
				"collisionMap": "l+r\n"
					+ "l0r\n"
					+ "   "
			},
			"right": {
				"index": "b",
				"url": "rot-1-right.png",
				"collisionMap": " ll\n"
					+ " 0+\n"
					+ " rr"
			},
			"down": {
				"index": "c",
				"url": "rot-1-down.png",
				"collisionMap": "   \n"
					+ "r0l\n"
					+ "r-l"
			},
			"left": {
				"index": "d",
				"url": "rot-1-left.png",
				"collisionMap": "rr \n"
					+ "-0 \n"
					+ "ll "
			},
		},
		"2corner": {
			"up": {
				"index": "e",
				"url": "rot-2-up-right.png",
				"collisionMap": "l+=\n"
					+ "l0+\n"
					+ " rr"
			},
			"right": {
				"index": "f",
				"url": "rot-2-down-right.png",
				"collisionMap": " ll\n"
					+ "r0+\n"
					+ "r-="
			},
			"down": {
				"index": "g",
				"url": "rot-2-down-left.png",
				"collisionMap": "rr \n"
					+ "-0l\n"
					+ "=-l"
			},
			"left": {
				"index": "h",
				"url": "rot-2-up-left.png",
				"collisionMap": "=+r\n"
					+ "-0r\n"
					+ "ll "
			},
		},
		"2long": {
			"up": {
				"index": "i",
				"url": "rot-2-up-down.png",
				"collisionMap": "l+r\n"
					+ "=0=\n"
					+ "r-l"
			},
			"right": {
				"index": "j",
				"url": "rot-2-left-right.png",
				"collisionMap": "r=l\n"
					+ "-0+\n"
					+ "l=r"
			},
			"down": {
				"url": "rot-2-up-down.png",
				"collisionMap": "l+r\n"
					+ "=0=\n"
					+ "r-l"
			},
			"left": {
				"url": "rot-2-left-right.png",
				"collisionMap": "r=l\n"
					+ "-0+\n"
					+ "l=r"
			},
		},
		"3": {
			"up": {
				"index": "k",
				"url": "rot-3-up.png",
				"collisionMap": "=+=\n"
					+ "-0+\n"
					+ "l=r"
			},
			"right": {
				"index": "l",
				"url": "rot-3-right.png",
				"collisionMap": "l+=\n"
					+ "=0+\n"
					+ "r-="
			},
			"down": {
				"index": "m",
				"url": "rot-3-down.png",
				"collisionMap": "r=l\n"
					+ "-0+\n"
					+ "=-="
			},
			"left": {
				"index": "n",
				"url": "rot-3-left.png",
				"collisionMap": "=+r\n"
					+ "-0=\n"
					+ "=-l"
			},
		},
		"4": {
			"up": {
				"index": "o",
				"url": "rot-4.png",
				"collisionMap": "=+=\n"
					+ "-0+\n"
					+ "=-="
			},
			"right": {
				"index": "p",
				"url": "rot-4.png",
				"collisionMap": "=+=\n"
					+ "-0+\n"
					+ "=-="
			},
			"down": {
				"index": "q",
				"url": "rot-4.png",
				"collisionMap": "=+=\n"
					+ "-0+\n"
					+ "=-="
			},
			"left": {
				"index": "r",
				"url": "rot-4.png",
				"collisionMap": "=+=\n"
					+ "-0+\n"
					+ "=-="
			},
		},
	},
	"block": {
		"index": "Z",
		"url": "block.png"
	},
	"brick": {
		"index": "1",
		"url": "brick.png",
	},
	"floor": {
		"index": " ",
		"url": "floor.png",
	},
	"goal": {
		"index": "2",
		"url": "goal.png",
	},
	"hole": {
		"index": "3",
		"url": "hole.png",
	},
};

getImages(sprites);

function getImages(obj, className, catName) {
	
	var myClass = null;
	var myCat = null;
	if (className) {
	
		myClass = className;
		obj.spriteClass = className;
	}
	if (catName) {
	
		myCat = catName;
		obj.spriteCat = catName;
	}
	if (obj.url) {
		
		var drawing = new Image();
		drawing.src = spritePath + obj.url;
		obj.drawing = drawing;
		if (obj.index) {
		
			spriteMap[obj.index] = obj;
		}
	}
	else {
		
		for (var key in obj) {
			
			if (catName) {
			
				obj[key].altSprites = sprites[myClass][myCat];
			}			
			if (className && !catName) {
			
				myCat = key;
				getImages(obj[key], myClass, myCat);
			}
			if (!className) {
			
				myClass = key;
				getImages(obj[key], myClass);
			}
			if (typeof obj[key] == "object") {
			
				obj[key].key = key;
				getImages(obj[key], myClass, myCat);
			}
		}
	}
}

function drawLevel(level) {
	
	players = [];
	player = {};
	levelMap = [];
	blocks = {};
	rotators = [];
	levelArray = [];
	undoSteps = [];
	playerIndexes = [];

	var levelRows = level.split("\n");

	fieldSize[1] = levelRows.length*tileSize;
	for (var row = 0; row < levelRows.length; row++) {
	
		var levelRow = [];
		var rawLevelRow = [];
		var rowString = levelRows[row];
		if (rowString.length > fieldSize[0]) {
		
			fieldSize[0] = rowString.length*tileSize;
		}
		for (var col = 0; col < rowString.length; col++) {
		
			var char = rowString.charAt(col);
			if (spriteMap[char]) {
			
				if (playerKeys.indexOf(char) < 0) {
			
					rawLevelRow.push(char);
				}
				else {
			
					rawLevelRow.push(" ");
					playerIndexes.push(char);
					var tmpPlayer = {
						"sprite": spriteMap[char],
						"pos": [col, row],
						"goal": [col, row],
						"offsetX": 0,
						"offsetY": 0,
						"direction": null,
						"animFrame": 0,
						"spriteIndex": char
					};
					players.push(tmpPlayer);
					playerCount = players.length;
					if (char == "0") {
					
						player = tmpPlayer;
						currentPlayer = players.length-1;
					}
				}
				levelRow.push({
					"sprite": spriteMap[char],
					"col": col,
					"row": row
				});
			}
			else {
		
				rawLevelRow.push(" ");
				var blockField = {
					"sprite": spriteMap["Z"],
					"col": col,
					"row": row,
					"key": char
				};
				if (!blocks[char]) {
			
					var width = 0;
					var height = 0;
					var tmpRow = row;
					var tmpCol = col;
					while (levelRows[tmpRow] && levelRows[tmpRow].charAt(tmpCol) == char) {
					
						height++;
						tmpRow++;
					}
					while (rowString.charAt(tmpCol) == char) {
					
						width++;
						tmpCol++;
					}
					blocks[char] = {
						"size": [width, height],
						"pos": [col, row],
						"goal": [col, row],
						"offsetX": 0,
						"offsetY": 0
					};
					blocks[char].canvas = getBlockCanvas(blockField);
				}
				levelRow.push(blockField);
			}
		}
		levelMap.push(levelRow);
		levelArray.push(rawLevelRow);
	}

	$("body").html('<canvas id="playground"></canvas>');
	canvas = $("#playground").get(0);
	canvas.width = fieldSize[0];
	canvas.height = fieldSize[1];
	context = canvas.getContext("2d");

	updateCollisionMaps();
	resize();

	backgroundCanvas = drawBackground();
	drawPlayground();
}

function loadLevel(levelId) {
	
	$.getJSON( "level.php?id=" + levelId, function(level) {

		setTimeout(function() {
			
			drawLevel(level.data);
		}, 1000);
	});
}

function drawBackground() {
	
	var bgCanvas = document.createElement("canvas");
	bgCanvas.width = levelMap[0].length*tileSize;
	bgCanvas.height = levelMap.length*tileSize;
	var bgContext = bgCanvas.getContext("2d");	
	var col, row;
	for (row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (col = 0; col < levelRow.length; col++) {
			
			levelRow[col].collisions = [];
			var sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing) {

				var drawing = sprite.drawing;
				if (bgKeys.indexOf(sprite.index) == -1) {
					
					drawing = spriteMap[" "].drawing;
				}
				var pos = [
					((tileSize / 2)+(col*tileSize))-(tileSize/2), 
					((tileSize / 2)+(row*tileSize))-(tileSize/2)
				];
				bgContext.drawImage(drawing, pos[0], pos[1]);
			}
		}
	}
	return bgCanvas;
}

function getBlockCanvas(blockField) {
	
	var blockCanvas = document.createElement("canvas");
	var blockContext = blockCanvas.getContext("2d");
	var sprite = spriteMap["Z"];
	var block = blocks[blockField.key];
	blockCanvas.width = block.size[0]*tileSize;
	blockCanvas.height = block.size[1]*tileSize;
	blockContext.clearRect(0, 0, blockCanvas.width, blockCanvas.height);
		
	blockContext.drawImage(sprite.drawing, 0, 0, (tileSize/2), (tileSize/2), 
		0, 
		0, 
		(tileSize/2), 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2), 0, 1, (tileSize/2), 
		(tileSize/2), 
		0, 
		(block.size[0]-1)*tileSize, 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2)*3, 0, (tileSize/2), (tileSize/2), 
		((block.size[0]-1)*tileSize)+(tileSize/2), 
		0, 
		(tileSize/2), 
		(tileSize/2));
	// middle
	// if (block.size[1] > 2) {
		
		blockContext.drawImage(sprite.drawing, 0, (tileSize/2), (tileSize/2), 1, 
			0, 
			(tileSize/2), 
			(tileSize/2), 
			(block.size[1]-1)*tileSize);
		blockContext.drawImage(sprite.drawing, (tileSize/2), (tileSize/2), 1, 1, 
			(tileSize/2), 
			(tileSize/2), 
			(block.size[0]-1)*tileSize, 
			(block.size[1]-1)*tileSize);
		blockContext.drawImage(sprite.drawing, (tileSize/2)*3, (tileSize/2), (tileSize/2), 1, 
			((block.size[0]-1)*tileSize)+(tileSize/2), 
			(tileSize/2), 
			(tileSize/2), 
			(block.size[1]-1)*tileSize);
	// }
	// bottom
	blockContext.drawImage(sprite.drawing, 0, (tileSize/2)*3, (tileSize/2), (tileSize/2), 
		0, 
		((block.size[1]-1)*tileSize)+(tileSize/2), 
		(tileSize/2), 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2), (tileSize/2)*3, 1, (tileSize/2), 
		(tileSize/2), 
		((block.size[1]-1)*tileSize)+(tileSize/2), 
		(block.size[0]-1)*tileSize, 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2)*3, (tileSize/2)*3, (tileSize/2), (tileSize/2), 
		((block.size[0]-1)*tileSize)+(tileSize/2), 
		((block.size[1]-1)*tileSize)+(tileSize/2), 
		(tileSize/2), 
		(tileSize/2));

	return blockCanvas;
}

function drawPlayground() {
	
	gameLoop = requestAnimationFrame(drawPlayground);
	context.clearRect(0, 0, fieldSize[0], fieldSize[1]);
	// draw background
	context.drawImage(backgroundCanvas, 0, 0);
	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
			
			levelRow[col].collisions = [];
			var sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing && sprite.index != " " && sprite.index != "3") {

				var pos = [
					(tileSize / 2)+(col*tileSize), 
					(tileSize / 2)+(row*tileSize)
				];
				// player sprites
				var isPlayer = false;
				for (var i = 0; i < playerCount; i++) {
					
					if (sprite.index == players[i].spriteIndex) {
					
						isPlayer = true;
					}
				}
				// draw moveable blocks
				if (!isPlayer) {
					
					// all others
					if (bgKeys.indexOf(sprite.index) == -1 && playerKeys.indexOf(sprite.index) == -1 && sprite.spriteClass != "block") {
					
						context.save();
						context.translate(pos[0], pos[1]);
						if (levelRow[col].rotation) {
					
							context.rotate(levelRow[col].rotation.current);
						}
						context.drawImage(sprite.drawing, sprite.drawing.width/-2, sprite.drawing.height/-2);
						context.restore();
					}
				}
			}
		}
	}
	for (var elem in blocks) {

		var block = blocks[elem];
		var startX = block.pos[0]*tileSize;
		var startY = block.pos[1]*tileSize;
		context.drawImage(block.canvas, startX+block.offsetX, startY+block.offsetY);
	}
	// draw players
	for (var i = 0; i < playerCount; i++) {
		
		var otherPlayer = players[i];
		if (otherPlayer.sprite) {
				
			context.drawImage(otherPlayer.sprite.altSprites[Math.round(otherPlayer.animFrame/animSpeed)].drawing, (otherPlayer.pos[0]*tileSize)+otherPlayer.offsetX, (otherPlayer.pos[1]*tileSize)+otherPlayer.offsetY);	
		}
	}
	updateCollisionMaps();
	animate();
}

function animate() {

	if (isJumping) {
		
		if (jumpAcceleration == 1) {
			
			jumpAcceleration *= -1;
		}
		else if (jumpAcceleration <= -1*jumpSpeed) {
			
			jumpAcceleration = null;
			isJumping = false;
			player.offsetX = 0;
			player.offsetY = 0;
		}
		else if (jumpAcceleration > 0) {
			
			player.offsetX = 0;
			player.offsetY -= jumpAcceleration;
			jumpAcceleration /= 2;
		}
		else if (jumpAcceleration < 0) {
			
			player.offsetX = 0;
			player.offsetY -= jumpAcceleration;
			jumpAcceleration *= 2;
		}
		else {
			
			jumpAcceleration = jumpSpeed;
		}
	}
	if (!isGoingBack && !enteredGoal && levelArray[player.pos[1]][player.pos[0]] == "2") {
	
		enterGoal();
	}
	if (enteredGoal) {
		
		player.sprite.key++;
		var index = Math.floor(player.sprite.key/animSpeed);
		var direction = player.sprite.spriteCat;
		if (index >= player.sprite.altSprites.length) {
			
			player.sprite.key = 0;
			index = 0;
			direction = rotations[(rotationIndexByKey(player.sprite.spriteCat)+1)%rotations.length].key;
		}
		player.sprite = sprites[player.sprite.spriteClass][direction][index];
	}
	else {
		
		for (var row = 0; row < levelMap.length; row++) {
		
			var levelRow = levelMap[row];
			for (var col = 0; col < levelRow.length; col++) {
		
				var sprite = levelRow[col].sprite;
				var rotation = levelRow[col].rotation;
				if (rotation && (rotation.current != rotation.goal)) {
		
					// get current rotation index
					var index = rotationIndexByKey(sprite.key);
					var nextIndex = index + rotation.direction;
					if (nextIndex < 0) {
				
						nextIndex += rotations.length;
					}
					nextIndex = nextIndex % rotations.length;
				
					// rotation clockwise
					if (rotation.direction > 0) {

						if (rotation.current < rotation.goal) {
				
							rotation.current += rotationSpeed;
						}
						else {
					
							// increase rotation index
							index = (index+1)%rotations.length;
							rotation.current = rotation.goal;
						}
					}
					// rotation counter-clockwise
					else if (rotation.direction < 0) {

						if (rotation.current > rotation.goal) {
				
							rotation.current -= rotationSpeed;
						}
						else {
					
							// decrease rotation index
							index--;
							if (index < 0) {
						
								index = rotations.length-1;
							}
							rotation.current = rotation.goal;
						}
					}
					// reset stuff if index was changed
					if (nextIndex == index) {
					
						sprite = sprite.altSprites[rotations[index].key];
						levelRow[col].rotation = {
							"current": 0,
							"goal": 0,
							"direction": 0
						};
						levelRow[col].sprite = sprite;
					}
				}
			}
		}
		// move blocks
		for (var elem in blocks) {
		
			var block = blocks[elem];
			var oldPos = [block.pos[0], block.pos[1]];
			if (block.direction) {
			
				switch (block.direction.key) {
		
					case "up":
						block.offsetY -= playerSpeed;
						if (block.offsetY <= (-1*tileSize)) {
		
							block.offsetY += tileSize;
							block.pos[1]--;
						}
						break;
				
					case "right":
						block.offsetX += playerSpeed;
						if (block.offsetX >= tileSize) {
		
							block.offsetX -= tileSize;
							block.pos[0]++;
						}
						break;
				
					case "down":
						block.offsetY += playerSpeed;
						if (block.offsetY >= tileSize) {
		
							block.offsetY -= tileSize;
							block.pos[1]++;
						}
						break;
				
					case "left":
						block.offsetX -= playerSpeed;
						if (block.offsetX <= (-1*tileSize)) {
		
							block.offsetX += tileSize;
							block.pos[0]--;
						}
						break;
				}
				if (levelMap[oldPos[1]] && levelMap[oldPos[1]][oldPos[0]] && (block.pos[0] == block.goal[0]) && (block.pos[1] == block.goal[1])) {
		
					delete(levelMap[oldPos[1]][oldPos[0]].key);
					levelMap[oldPos[1]][oldPos[0]].sprite = spriteMap[levelArray[oldPos[1]][oldPos[0]]];
					levelMap[block.pos[1]][block.pos[0]].key = elem;
					levelMap[block.pos[1]][block.pos[0]].sprite = spriteMap["Z"];
					updateBlocks()
					block.offsetX = 0;
					block.offsetY = 0;
					block.direction = null;
				}			
			}
		}
	
		// move player
		if (player && player.direction) {
	
			player.animFrame = (player.animFrame+1)%animSpeed;
			var oldPos = [player.pos[0], player.pos[1]];
			switch (player.direction.key) {
		
				case "up":
					player.offsetY -= playerSpeed;
					if (player.offsetY < (-1*tileSize)) {
		
						player.offsetY += tileSize;
						player.pos[1]--;
					}
					break;
				
				case "right":
					player.offsetX += playerSpeed;
					if (player.offsetX > tileSize) {
		
						player.offsetX -= tileSize;
						player.pos[0]++;
					}
					break;
				
				case "down":
					player.offsetY += playerSpeed;
					if (player.offsetY > tileSize) {
		
						player.offsetY -= tileSize;
						player.pos[1]++;
					}
					break;
				
				case "left":
					player.offsetX -= playerSpeed;
					if (player.offsetX < (-1*tileSize)) {
		
						player.offsetX += tileSize;
						player.pos[0]--;
					}
					break;
			}
		
			// goal reached
			if ((player.pos[0] == player.goal[0]) && (player.pos[1] == player.goal[1])) {
		
				player.offsetX = 0;
				player.offsetY = 0;
				player.direction = null;
				isGoingBack = false;
			}
		
			if (oldPos[0] != player.pos[0] || oldPos[1] != player.pos[1]) {
		
				levelMap[player.pos[1]][player.pos[0]].sprite = levelMap[oldPos[1]][oldPos[0]].sprite;
				levelMap[oldPos[1]][oldPos[0]].sprite = spriteMap[" "];
				oldPos = [player.pos[0], player.pos[1]];
				isGoingBack = false;
			}
		}
	}
}

function checkPlayerCanMove(direction) {

	var undoMove = [];
	var canPass = true;
	var restorePlayerOnUndo;
	var tmpGoal = [player.pos[0], player.pos[1]];
	if (direction) {
	
		// define temporary goal position

		// find sprite 2 ahead in the same direction
		var afterNext = [tmpGoal[0], tmpGoal[1]];
		switch (direction.key) {
		
			case "up":
				tmpGoal[1]--;
				afterNext[1] = tmpGoal[1] - 1;
				break;
				
			case "right":
				tmpGoal[0]++;
				afterNext[0] = tmpGoal[0] + 1;
				break;
				
			case "down":
				tmpGoal[1]++;
				afterNext[1] = tmpGoal[1] + 1;
				break;
				
			case "left":
				tmpGoal[0]--;
				afterNext[0] = tmpGoal[0] - 1;
				break;
		}
		var afterNextField = null;
		if (afterNext && levelMap[afterNext[1]] && levelMap[afterNext[1]][afterNext[0]]) {
			
			afterNextField = levelMap[afterNext[1]][afterNext[0]];
		}
		var goalField = levelMap[tmpGoal[1]][tmpGoal[0]];
		var centerField, rotDirection;

		if (goalField.collisions && goalField.collisions.length > 0) {
			
			for (var collisionCount = 0; collisionCount < goalField.collisions.length; collisionCount++) {
	
				rotDirection = 0;
				var collision = goalField.collisions[collisionCount];
				centerField = collision.collider;
				if (centerField) {
					
					if (!centerField.rotation) {

						centerField.rotation = {
							"goal": 0,
							"current": 0,
							"direction": 0
						};
					}
					if (afterNextField.sprite.spriteClass != "rotation") {
					
						if (collision.key == "+") {
					
							switch (direction.key) {
						
								case "up":
									rotDirection--
									break;
						
								case "right":
									rotDirection++
									break;
						
								case "down":
									rotDirection++
									break;
						
								case "left":
									rotDirection--
									break;
							}
						}
						else if (collision.key == "-") {
					
							switch (direction.key) {
						
								case "up":
									rotDirection++
									break;
						
								case "right":
									rotDirection--
									break;
						
								case "down":
									rotDirection--
									break;
						
								case "left":
									rotDirection++
									break;
							}
						}
					}
					else if (collision.key == "-" || collision.key == "+") {
					
						canPass = false;
					}
					
					if (rotDirection != 0) {
				
						// check for blocking elements
						var collisionRows = centerField.sprite.collisionMap.split("\n");
						for (var row = 0; row < collisionRows.length; row++) {
						
							for (var col = 0; col < collisionRows[row].length; col++) {
							
								var collisionChar = collisionRows[row].charAt(col);
								if (
									(collisionChar == "r" && rotDirection > 0) ||
									(collisionChar == "l" && rotDirection < 0) ||
									(collisionChar == "=")
									){
								
									var currentSprite = levelMap[centerField.row+(row-1)][centerField.col+(col-1)];
									if (currentSprite.sprite.index != " " &&
									 	currentSprite.sprite.index != "3" &&
									 	currentSprite.sprite.index != player.sprite.index) {
										canPass = false;
									}
									else if (currentSprite.collisions) {
									
										for (var c = 0; c < currentSprite.collisions.length; c++) {
										
											if ((currentSprite.collisions[c].collider != centerField) &&
												(currentSprite.collisions[c].key == "+" || 
												currentSprite.collisions[c].key == "-")) {
											
												canPass = false;
											}
										}
									}
								}
							}
						}
						if (canPass) {
						
							var index = rotationIndexByKey(centerField.sprite.key);

							if (rotDirection > 0) {

								centerField.rotation.goal += Math.PI/2;
								index = (index+1)%rotations.length;
							}
							else if (rotDirection < 0) {

								centerField.rotation.goal -= Math.PI/2;
								index--;
								if (index < 0) {
				
									index = rotations.length-1;
								}
							}
							
							// check if the rotated block hits the player - if yes, move player one tile further
							var nextSprite = centerField.sprite.altSprites[rotations[index].key];
							var offset = [(tmpGoal[0] - centerField.col)+1, (tmpGoal[1] - centerField.row)+1];
							if (nextSprite) {
								
								var collisionRows = nextSprite.collisionMap.split("\n");
								var tmpCollision = collisionRows[offset[1]].charAt(offset[0]);
								if (
									(tmpCollision == "-") ||
									(tmpCollision == "+")
									) {
								
									switch (player.direction.key) {
					
										case "up":
											tmpGoal[1]--;
											break;
					
										case "right":
											tmpGoal[0]++;
											break;
					
										case "down":
											tmpGoal[1]++;
											break;
					
										case "left":
											tmpGoal[0]--;
											break;
									}									
								}
							}
							
							if (centerField.rotation.angle != 0) {
								
								centerField.rotation.direction = rotDirection;
								undoMove.push({
			
									"tile": centerField,
									"rotation": {
										"goal": centerField.rotation.goal * -1,
										"current": 0,
										"direction": (rotDirection * -1)
									}
								});
							}
						}
					}
				}
			}
		}
		
		if (canPass) {
		
			if (goalField.sprite.spriteClass == "goal" || levelArray[tmpGoal[1]][tmpGoal[0]] == "2") {
			
				canPass = true;
				restorePlayerOnUndo = currentPlayer;
			}
			else if (goalField.key) {
				
				if (levelArray[tmpGoal[1]][tmpGoal[0]] != "3") {
				
					var block = blocks[goalField.key];
					var neighbours = [];
					var newPos = [block.pos[0], block.pos[1]];
					switch (direction.key) {
				
						case "up":
							
							for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
								
								neighbours.push(levelMap[block.pos[1]-1][col]);
							}
							newPos[1]--;
							break;
						
						case "right":
							
							for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
								
								neighbours.push(levelMap[row][block.pos[0]+block.size[0]]);
							}
							newPos[0]++;
							break;
						
						case "down":
							
							for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
								
								neighbours.push(levelMap[block.pos[1]+block.size[1]][col]);
							}
							newPos[1]++;
							break;
						
						case "left":

							for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
								
								neighbours.push(levelMap[row][block.pos[0]-1]);
							}
							newPos[0]--;
							break;
					}
					for (var neighbourCount = 0; neighbourCount < neighbours.length; neighbourCount++) {
						
						var neighbour = neighbours[neighbourCount];
						if (neighbour.sprite.index != " " && neighbour.sprite.index != "3") {
						
							canPass = false;
						}
						if (neighbour && neighbour.collisions && neighbour.collisions.length) {
						
							for (var collisionCount = 0; collisionCount < neighbour.collisions.length; collisionCount++) {
						
								if (
									neighbour.collisions[collisionCount].key == "+" ||
									neighbour.collisions[collisionCount].key == "-"
									) {
						
									canPass = false;
								}
							}
						}
					}
					if (canPass) {
						
						undoMove.push({
							
							"key": goalField.key,
							"pos": [newPos[0], newPos[1]],
							"goal": [block.pos[0], block.pos[1]],
							"direction": rotations[(rotationIndexByKey(direction.key)+2)%rotations.length]
						});
						block.goal = newPos;
						block.direction = direction;
					}
					
				}
				else {
					
					canPass = false;
				}
			}
			else if (
				(goalField.sprite.index == " ") &&
				(levelArray[tmpGoal[1]][tmpGoal[0]] == " ")
				) {

				if (goalField.collisions && goalField.collisions.length > 0) {
					
					for (var collisionCount = 0; collisionCount < goalField.collisions.length; collisionCount++) {
					
						if (goalField.collisions[collisionCount].key == "+" &&
							goalField.collisions[collisionCount].key == "-") {
								
							canPass = false;
						}
					}	
				}
			}
			else {
			
				canPass = false;
			}
		}
	}
	if (!isGoingBack && canPass && (player.goal[0] != tmpGoal[0] || player.goal[1] != tmpGoal[1])) {
		
		undoMove.push({
			
			"playerIndex": currentPlayer,
			"restore": restorePlayerOnUndo,
			"tile": player,
			"pos": [tmpGoal[0], tmpGoal[1]],
			"goal": [player.pos[0], player.pos[1]],
			"direction": rotations[(rotationIndexByKey(player.direction.key)+2)%rotations.length]
		});
		player.goal = tmpGoal;
		undoSteps.push(undoMove);
	}
	else {
		
		player.goal = player.pos;
	}
}

function enterGoal() {
	
	enteredGoal = true;
	window.setTimeout(function() {
		
		if (playerCount > 1) {
		
			var sprite = levelMap[player.pos[1]][player.pos[0]].sprite;
			levelMap[player.pos[1]][player.pos[0]] = {
			
				"sprite": spriteMap["2"],
				"col": player.pos[0],
				"row": player.pos[1]
			};
			playerCount--;
			
			players.push(players.splice(currentPlayer, 1)[0]);
			players[players.length-1].pos = [-100, -100];
			players[players.length-1].goal = [-100, -100];
			players[players.length-1].sprite = sprite;
			currentPlayer = 0;
			player = players[currentPlayer];
		}
		else {
		
			levelNr++;
			cancelAnimationFrame(gameLoop);
			window.location.hash = "level"+levelNr;
			window.location.reload();
		}
		enteredGoal = false;
	}, 2000);
}

function updateBlocks() {

	var undo = [];
	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
		
			var sprite = levelRow[col].sprite;
			if (sprite.spriteClass == "block" || (levelRow[col].key && blocks[levelRow[col].key])) {
							
				levelRow[col].sprite = spriteMap[levelArray[row][col]];
				levelRow[col].col = col;
				levelRow[col].row = row;
				delete(levelRow[col].key);
			}
		}
	}
	for (var elem in blocks) {
	
		var block = blocks[elem];
		var blockFills = true;
		if (block.pos[1] >= 0) {
			
			for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
		
				for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
				
					if (levelArray[row][col] != "3") {
				
						blockFills = false;
					}
					levelMap[row][col] = {
						"sprite": spriteMap["Z"],
						"col": col,
						"row": row,
						"key": elem
					}
				}
			}
		}
		else {
			
			blockFills = false;
		}
		if (blockFills && !isGoingBack) {
		
			for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
			
				for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {

					undoSteps[undoSteps.length-1].push({
						"sprite": spriteMap["3"],
						"col": col,
						"row": row
					});
					var sprite = spriteMap[" "];
					delete(levelMap[row][col].key);
					levelArray[row][col] = " ";
					levelMap[row][col] = {
						"sprite": sprite,
						"col": col,
						"row": row
					}
					var pos = [
						((tileSize / 2)+(col*tileSize))-(tileSize/2), 
						((tileSize / 2)+(row*tileSize))-(tileSize/2)
					];
					backgroundCanvas.getContext("2d").drawImage(sprite.drawing, pos[0], pos[1]);
				}
			}
			blocks[elem].pos = [-100, -100];
			blocks[elem].goal = blocks[elem].pos;
		}
	}
	return undo;
}

function updateCollisionMaps() {

	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
		
			var sprite = levelRow[col];
			if (sprite && sprite.sprite.spriteClass == "rotation") {
		
				var collisionMap = sprite.sprite.collisionMap.split("\n");
				for (var innerRow = 0; innerRow < collisionMap.length; innerRow++) {
				
					var collisionRow = collisionMap[innerRow];
					for (var innerCol = 0; innerCol < collisionRow.length; innerCol++) {
					
						var collision = collisionRow.charAt(innerCol);
						var neighbourBlock = levelMap[row+(innerRow-1)][col+(innerCol-1)];
						if (neighbourBlock && neighbourBlock.collisions) {
							
							neighbourBlock.collisions.push({
								"key": collision,
								"collider": sprite
							});
						}
					}
				}
			}
		}
	}
}

function switchPlayers() {

	currentPlayer = (currentPlayer+1)%playerCount;
	player = players[currentPlayer];
	isJumping = true;
}

function goBack() {
	
	if (undoSteps.length > 0) {
		
		var undoStep = undoSteps.pop();
		for (var i = 0; i < undoStep.length; i++) {
		
			var undo = undoStep[i];
			if (undo.goal) {
			
				if (undo.playerIndex > -1) {
					
					if (undo.restore > -1) {
						
						players.splice(undo.playerIndex, 0, players.pop());
						playerCount++;
					}
					currentPlayer = undo.playerIndex;
					player = players[currentPlayer];
					player.pos = undo.pos;
					player.goal = undo.goal;
					player.direction = undo.direction;
					if (undo.sprite) {
						
						levelMap[undo.pos[1]][undo.pos[0]].sprite = undo.sprite;
					}
				}
				else if (undo.key && blocks[undo.key]) {
					
					var block = blocks[undo.key];
					block.pos = undo.pos;
					block.goal = undo.goal;
					block.direction = undo.direction;
					if (block.pos[0] >= 0) {
						
						levelMap[block.pos[1]][block.pos[0]].key = undo.key;
						levelMap[block.pos[1]][block.pos[0]].sprite = spriteMap["Z"];
					}
				}
			}
			else if (undo.rotation) {
			
				undo.tile.rotation = undo.rotation;
			}
			else {
				
				levelArray[undo.row][undo.col] = "3";
				var pos = [
					((tileSize / 2)+(undo.col*tileSize))-(tileSize/2), 
					((tileSize / 2)+(undo.row*tileSize))-(tileSize/2)
				];
				backgroundCanvas.getContext("2d").drawImage(undo.sprite.drawing, pos[0], pos[1]);
			}
		}
		isGoingBack = true;
		handlePlayerMovement();
		updateBlocks();
		updateCollisionMaps();
	}
}

$(document).ready(function() {

	levelNr = parseInt(window.location.hash.replace("#level", ""), 10);
	if (!isNaN(levelNr)) {
		
		$("body").html("");
		loadLevel(levelNr);
	}
	else {
		
		window.location.hash = "";
		levelNr = 1;
	}
	resize();
});

$(window).resize(function() {
	
	resize();
});

window.addEventListener("orientationchange", function() {
	
	resize();
}, false);

function resize() {
	
	if (canvas) {
		
		var offset = [($(window).width()-canvas.width)/2, ($(window).height()-canvas.height)/2];
		$(canvas).css({
		
			position: "absolute",
			top: offset[1],
			left: offset[0] 
		});
		
		$("body").css('background-position', offset[0] + "px " + offset[1] + "px");
	}
	else {
		
		$("#title").css({

			position: "absolute",
			top: ($(window).height()-$("#title img").height())/2,
			left: ($(window).width()-$("#title img").width())/2
		});
	}
}

document.addEventListener('touchstart', function(e) {
	
	if (player && !player.direction && !enteredGoal && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != "2") {
			
		if (firstTouch != null && new Date()-firstTouch < 300) {

			firstTouch = null;
			switchPlayers();
		}
		if (canvas) {
	
			e.preventDefault();
			if (e.touches.length > 1) {
	
				goBack();
			}
			else {
	
				var touch = e.touches[0];
				dragStartPos = [touch.pageX, touch.pageY]
			}
		}
	}	
}, false);

document.addEventListener('touchend', function(e) {
		
	if (canvas && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != "2") {
		
		if (e.touches.length > 1) {
		
			goBack();
		}
		else if (dragStartPos) {
		
			var touch = e.changedTouches[0];
			var distance = [touch.pageX-dragStartPos[0], touch.pageY-dragStartPos[1]];
			var direction = "";
			if (Math.abs(distance[0]) > Math.abs(distance[1])) { // horizontal movement
			
				if (distance[0] < -1*swipeTolerance) {
				
					direction = "left";
				}
				else if (distance[0] > swipeTolerance) {
				
					direction = "right";
				}
			}
			else {
			
				if (distance[1] < -1*swipeTolerance) {
				
					direction = "up";
				}
				else if (distance[1] > swipeTolerance) {
				
					direction = "down";
				}
			}
			if (direction != "" && player && !player.direction) {
				isGoingBack = false;
				player.direction = rotations[rotationIndexByKey(direction)];
				checkPlayerCanMove(player.direction);
				handlePlayerMovement();
			}
			else {
				
				firstTouch = new Date();
			}
			dragStartPos = null;
		}
	}
}, false);

$(document).keydown(function(e) {

	e.preventDefault();
	if (player && !player.direction && !enteredGoal && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != "2") {
		
		isGoingBack = false;
		console.log(e.keyCode);
		switch(e.keyCode) {
		
		case 37: // left
			player.direction = rotations[3];
			break;

		case 38: // up
			player.direction = rotations[0];
			break;

		case 39: // right
			player.direction = rotations[1];
			break;

		case 40: // down
			player.direction = rotations[2];
			break;
		}
		checkPlayerCanMove(player.direction);
		handlePlayerMovement();
	}
});

$(document).keyup(function(e) {

	e.preventDefault();
	if (player && !player.direction && !enteredGoal && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != "2") {
		
		switch(e.keyCode) {

		case 16: // shift
			switchPlayers();
			break;

		case 8: // backspace
			goBack();
			break;

		case 27: // escape
			window.location.reload();
			break;
		}
	}
});

function handlePlayerMovement() {
	
	if (player && player.sprite) {
		
		if (player.direction) {
	
			var sprite = sprites[player.sprite.spriteClass][player.direction.key][0];
			if (isGoingBack) {
				
				var direction = rotations[(rotationIndexByKey(player.direction.key)+2)%rotations.length].key
				sprite = sprites[player.sprite.spriteClass][direction][0];
			}
			sprite.index = playerIndexes[currentPlayer];
			player.sprite = sprite;
			players[currentPlayer].sprite = sprite;
		}
	}
}