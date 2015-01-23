var canvas, context, sprites, levelMap, blocks, levelArray, players, player, gameLoop, undoSteps;

var currentPlayer = 0;

var animSpeed = 10;

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

var playerIndexes = ["0", "*"];

var levels = ["111111111111111111\n"
			+ "1   1        1   1\n"
			+ "1 2   l 11 n   0 1\n"
			+ "1   1        1   1\n"
			+ "111111111111111111",

			  "1111111111111111\n"
			+ "1   1  AA  1   1\n"
			+ "1 2    BB    0 1\n"
			+ "1   1  CC  1   1\n"
			+ "1111111111111111",
			
			  "11111111111111\n"
			+ "11111    1   1\n"
			+ "11111      0 1\n"
			+ "11111  AA1   1\n"
			+ "1   1e AA11111\n"
			+ "1 2      11111\n"
			+ "1   1    11111\n"
			+ "11111111111111",
						
			  "111111111111111111\n"
			+ "11111333     11111\n"
			+ "1   13333 AA 1   1\n"
			+ "1 2   333 AA   0 1\n"
			+ "1   13333 AA 1   1\n"
			+ "11111333     11111\n"
			+ "111111111111111111",
									
			  "1111111111111111\n"
			+ "11111      11111\n"
			+ "1   1      1   1\n"
			+ "1 2 3  iA    0 1\n"
			+ "1   1      1   1\n"
			+ "11111      11111\n"
			+ "1111111111111111",
									
			  "111111111111111\n"
			+ "1   1 1 1 1   1\n"
			+ "1   1     1 0 1\n"
			+ "1   3  1  A   1\n"
			+ "1 2 1     1 * 1\n"
			+ "1   1 1 1 1   1\n"
			+ "111111111111111",
									
			  "111111111111111\n"
			+ "11111     11111\n"
			+ "1     i d     1\n"
			+ "1             1\n"
			+ "1 2  o  d   0 1\n"
			+ "1             1\n"
			+ "1     i d     1\n"
			+ "11111     11111\n"
			+ "111111111111111",];

var levelNr = 0;


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
		
	"puzzle-boy": {
		
		"up": [
			{
				"url": "puzzle-boy-up-1.png",
			},
			{
				"url": "puzzle-boy-up-2.png",
			}
		],
		"right": [
			{
				"url": "puzzle-boy-right-1.png",
			},
			{
				"url": "puzzle-boy-right-2.png",
			}
		],
		"down": [
			{
				"index": "0",
				"url": "puzzle-boy-down-1.png",
			},
			{
				"url": "puzzle-boy-down-2.png",
			}
		],
		"left": [
			{
				"url": "puzzle-boy-left-1.png",
			},
			{
				"url": "puzzle-boy-left-2.png",
			}
		]
	},
	"puzzle-girl": {
		
		"up": [
			{
				"url": "puzzle-girl-up-1.png",
			},
			{
				"url": "puzzle-girl-up-2.png",
			}
		],
		"right": [
			{
				"url": "puzzle-girl-right-1.png",
			},
			{
				"url": "puzzle-girl-right-2.png",
			}
		],
		"down": [
			{
				"index": "*",
				"url": "puzzle-girl-down-1.png",
			},
			{
				"url": "puzzle-girl-down-2.png",
			}
		],
		"left": [
			{
				"url": "puzzle-girl-left-1.png",
			},
			{
				"url": "puzzle-girl-left-2.png",
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

function resize() {
	
	if (canvas) {
		
		var offset = [($(document).width()-canvas.width)/2, ($(document).height()-canvas.height)/2];
		$(canvas).css({
		
			position: "absolute",
			top: offset[1],
			left: offset[0] 
		});
		
		$("body").css('background-position', offset[0] + "px " + offset[1] + "px");
	}
}

function loadLevel(level) {
	
	players = [];
	player = {};
	levelMap = [];
	blocks = {};
	levelArray = [];
	undoSteps = [];
	
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
				
				if (char != "0" && char != "*") {
				
					rawLevelRow.push(char);
				}
				else {
				
					rawLevelRow.push(" ");
				}
				
				levelRow.push({
					"sprite": spriteMap[char],
					"col": col,
					"row": row
				});
			
				if (char == "0" || char == "*") {
				
					var tmpPlayer = {
						"pos": [col, row],
						"goal": [col, row],
						"offsetX": 0,
						"offsetY": 0,
						"direction": null,
						"animFrame": 0
					};
					players.push(tmpPlayer);
					player = players[0];
				}
			}
			else {
			
				rawLevelRow.push(" ");
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
				}
				levelRow.push({
					"sprite": spriteMap["Z"],
					"col": col,
					"row": row,
					"key": char
				});
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
	
	gameLoop = window.setInterval(drawPlayground, gameSpeed);
}

$(window).resize(function() {
	
	resize();
});

function switchPlayers() {

	currentPlayer = (currentPlayer+1)%players.length;
	player = players[currentPlayer];
}

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

$(document).ready(function() {

	levelNr = parseInt(window.location.hash.replace("#level", ""), 10);
	if (!isNaN(levelNr)) {
		
		if (levelNr >= levels.length) {
			
			window.location.hash = "";
			levelNr = 0;
		}
		else {
			
			loadLevel(levels[levelNr]);
		}
	}
	else {
		
		levelNr = 0;
	}
});

function updateBlocks() {

	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
		
			var sprite = levelRow[col].sprite;
			if (sprite.spriteClass == "block") {
							
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
		if (blockFills) {
		
			for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
			
				for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
					
					delete(levelMap[row][col].key);
					levelArray[row][col] = " ";
					levelMap[row][col] = {
						"sprite": spriteMap[" "],
						"col": col,
						"row": row
					}
				}
			}
			delete(blocks[elem]);
		}
	}
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

function drawPlayground() {
	
	animate();
	context.clearRect(0, 0, fieldSize[0], fieldSize[1]);
	// draw background
	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
			
			levelRow[col].collisions = [];
			var sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing && sprite.index != " ") {

				var pos = [
					(tileSize / 2)+(col*tileSize), 
					(tileSize / 2)+(row*tileSize)
				];
				// first player
				if (sprite.index == "0") {
					
					players[0].sprite = sprite;
				}
				// second player
				else if (sprite.index == "*") {
					
					players[players.length-1].sprite = sprite;
				}
				// draw moveable blocks
				else if (sprite && sprite.spriteClass == "block") {
				
					for (var elem in blocks) {
					
						// Draw a hole tile if it's under the block
						if (levelArray[row][col] != " ") {
						
							var bgSprite = spriteMap[levelArray[row][col]];
							context.drawImage(bgSprite.drawing, pos[0]-(bgSprite.drawing.width/2), pos[1]-(bgSprite.drawing.height/2));
						}
					
						var block = blocks[elem];
						var startX = block.pos[0]*tileSize;
						var startY = block.pos[1]*tileSize;
						// top
						context.drawImage(sprite.drawing, 0, 0, 16, 16, 
							startX+block.offsetX, 
							startY+block.offsetY, 
							16, 
							16);
						context.drawImage(sprite.drawing, 16, 0, 1, 16, 
							startX+16+block.offsetX, 
							startY+block.offsetY, 
							(block.size[0]-1)*32, 
							16);
						context.drawImage(sprite.drawing, 48, 0, 16, 16, 
							startX+((block.size[0]-1)*32)+16+block.offsetX, 
							startY+block.offsetY, 
							16, 
							16);
						// middle
						//if (block.size[1] > 1) {
								
							context.drawImage(sprite.drawing, 0, 16, 16, 1, 
								startX+block.offsetX, 
								startY+16+block.offsetY, 
								16, 
								(block.size[1]-1)*32);
							context.drawImage(sprite.drawing, 16, 16, 1, 1, 
								startX+16+block.offsetX, 
								startY+16+block.offsetY, 
								(block.size[0]-1)*32, 
								(block.size[1]-1)*32);
							context.drawImage(sprite.drawing, 48, 16, 16, 1, 
								startX+((block.size[0]-1)*32)+16+block.offsetX, 
								startY+16+block.offsetY, 
								16, 
								(block.size[1]-1)*32);
						//}
						// bottom
						context.drawImage(sprite.drawing, 0, 48, 16, 16, 
							startX+block.offsetX, 
							startY+((block.size[1]-1)*32)+16+block.offsetY, 
							16, 
							16);
						context.drawImage(sprite.drawing, 16, 48, 1, 16, 
							startX+16+block.offsetX, 
							startY+((block.size[1]-1)*32)+16+block.offsetY, 
							(block.size[0]-1)*32, 
							16);
						context.drawImage(sprite.drawing, 48, 48, 16, 16, 
							startX+((block.size[0]-1)*32)+16+block.offsetX, 
							startY+((block.size[1]-1)*32)+16+block.offsetY, 
							16, 
							16);
					}
				}
				// all others
				else {
					
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
	// draw players
	if (player.sprite) {
		
		context.drawImage(player.sprite.altSprites[Math.round(player.animFrame/animSpeed)].drawing, 				(player.pos[0]*tileSize)+player.offsetX, 
				(player.pos[1]*tileSize)+player.offsetY);			
	}
	if (players.length > 1) {
	
		var otherPlayer = players[(currentPlayer+1)%players.length];
		context.drawImage(otherPlayer.sprite.drawing, 			(otherPlayer.pos[0]*tileSize)+otherPlayer.offsetX, 			(otherPlayer.pos[1]*tileSize)+otherPlayer.offsetY);			
	}
	updateCollisionMaps();
}

function animate() {

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
			if ((block.pos[0] == block.goal[0]) && (block.pos[1] == block.goal[1])) {
		
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
		}
		
		if (oldPos[0] != player.pos[0] || oldPos[1] != player.pos[1]) {
		
			levelMap[oldPos[1]][oldPos[0]].sprite = spriteMap[" "];
			oldPos = [player.pos[0], player.pos[1]];
		}
		levelMap[player.pos[1]][player.pos[0]].sprite = player.sprite;
	}
}

function checkPlayerCanMove(direction) {

	var canPass = true;
	var tmpGoal = [player.goal[0], player.goal[1]];
	if (direction) {
	
		// define temporary goal position

		// find sprite 2 ahead in the same direction
		var afterNext = [player.goal[0], player.goal[1]];
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
									 	currentSprite.sprite.index != "0") {
										canPass = false;
									}
									else if (currentSprite.collisions) {
									
										for (var c = 0; c < currentSprite.collisions.length; c++) {
										
											if ((currentSprite.collisions[c].collider != centerField) &&
												(currentSprite.collisions[c].key == "+" || 												currentSprite.collisions[c].key == "-")) {
											
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
							}
						}
					}
				}
			}
		}
		
		if (canPass) {
		
			if (
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
			else if (goalField.sprite.spriteClass == "goal") {
			
				if (players.length > 1) {
					
					levelMap[player.pos[1]][player.pos[0]] = {
						
						"sprite": spriteMap[" "],
						"col": player.pos[0],
						"row": player.pos[1]
					};
					players.splice(currentPlayer, 1);
					currentPlayer = 0;
					player = players[currentPlayer];
					tmpGoal = [player.pos[0], player.pos[1]];
				}
				else {
					
					levelNr++;
					clearInterval(gameLoop);
					window.location.hash = "level"+levelNr;
					window.location.reload();
				}
			}
			else if (goalField.sprite.spriteClass == "block") {
				
				if (levelArray[tmpGoal[1]][tmpGoal[0]] != "3") {
				
					var block = blocks[goalField.key];
					var neighbour;
					var newPos = [block.pos[0], block.pos[1]];
					switch (direction.key) {
				
						case "up":
							
							neighbour = levelMap[block.pos[1]-1][block.pos[0]];
							newPos[1]--;
							break;
						
						case "right":
							
							neighbour = levelMap[block.pos[1]][block.pos[0]+block.size[0]];
							newPos[0]++;
							break;
						
						case "down":
							
							neighbour = levelMap[block.pos[1]+block.size[1]][block.pos[0]];
							newPos[1]++;
							break;
						
						case "left":

							neighbour = levelMap[block.pos[1]][block.pos[0]-1];
							newPos[0]--;
							break;
					}
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
					if (canPass) {
						
						block.goal = newPos;
						block.direction = direction;
					}
					
				}
			}
			else {
			
				canPass = false;
			}
		}
	}
	if (canPass) {
		
		player.goal = tmpGoal;
	}
	else {
		
		player.goal = player.pos;
	}
}

$(document).keyup(function(e) {

	if (player && !player.direction) {
		
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

		case 16: // shift
			switchPlayers();
			break;
		}
		checkPlayerCanMove(player.direction);
		if (player && player.sprite) {
			
			if (player.direction) {
		
				var sprite = sprites[player.sprite.spriteClass][player.direction.key][0];
				sprite.index = playerIndexes[currentPlayer];
				player.sprite = sprite;
			}
		}
	}
});