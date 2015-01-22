var canvas, context, sprites, levelMap, blocks, levelArray, players, player, gameLoop;

var currentPlayer = 0;

var animSpeed = 10;

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

var playerSpeed = 2;

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

var levelNr = 6;


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

function loadLevel(level) {
	
	getImages(sprites);

	players = [];
	player = null;
	levelMap = [];
	blocks = {};
	levelArray = [];
	
	var levelRows = level.split("\n");
	var row, col;
	
	fieldSize[1] = levelRows.length*tileSize;
	for (row = 0; row < levelRows.length; row++) {
		
		var levelRow = [];
		var rawLevelRow = [];
		var rowString = levelRows[row];
		if (rowString.length > fieldSize[0]) {
			
			fieldSize[0] = rowString.length*tileSize;
		}
		for (col = 0; col < rowString.length; col++) {
			
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
			
				if (spriteMap[char].index == "0" || spriteMap[char].index == "*") {
				
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
	
	gameLoop = window.setInterval(drawPlayground, gameSpeed);
}

function switchPlayers() {

	currentPlayer = (currentPlayer+1)%players.length;
	console.log(player);
	console.log(levelMap);
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

	loadLevel(levels[levelNr]);
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
		
			for (var i = 0; i < players.length; i++) {
			
				var tmpPlayer = players[i];
			}
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
					
					players[1].sprite = sprite;
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
			// console.log(rotation);
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
				
						rotation.current += 0.05;
					}
					else {
					
						// increase rotation index
						index = (index+1)%rotations.length;
					}
				}
				// rotation counter-clockwise
				else if (rotation.direction < 0) {

					if (rotation.current > rotation.goal) {
				
						rotation.current -= 0.05;
					}
					else {
					
						// decrease rotation index
						index--;
						if (index < 0) {
						
							index = rotations.length-1;
						}
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
		
			levelMap[oldPos[1]][oldPos[0]].sprite = spriteMap[" "];
			levelMap[player.pos[1]][player.pos[0]].sprite = player.sprite;
			player.offsetX = 0;
			player.offsetY = 0;
			player.direction = null;
		}
		
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
				afterNext[1] -= 2;
				break;
				
			case "right":
				tmpGoal[0]++;
				afterNext[0] += 2;
				break;
				
			case "down":
				tmpGoal[1]++;
				afterNext[1] += 2;
				break;
				
			case "left":
				tmpGoal[0]--;
				afterNext[0] -= 2;
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
				console.log(centerField);
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
									(collisionChar == "l" && rotDirection < 0)
									){
								
									var currentSprite = levelMap[centerField.row+(row-1)][centerField.col+(col-1)];
									if (currentSprite.sprite.index != " " && currentSprite.sprite.index != "3") {
									
										canPass = false;
									}
									if (currentSprite.collisions) {
									
										for (var collisionCount = 0; collisionCount < currentSprite.collisions.length; collisionCount++) {
										
											if (currentSprite.collisions[collisionCount].key == "+" || currentSprite.collisions[collisionCount].key == "-") {
											
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
							player.goal = tmpGoal;
							centerField.rotation.direction = rotDirection;
							rotateBlock(centerField, rotDirection);
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
			
				levelNr++;
				clearInterval(gameLoop);
				loadLevel(levels[levelNr]);
				console.log("LEVEL SOLVED");
			}
			else if (goalField.sprite.spriteClass == "block") {
				
				if (levelArray[tmpGoal[1]][tmpGoal[0]] != "3") {
				
					var block = blocks[goalField.key];
					var neighbour;
					switch (direction.key) {
				
						case "up":
							
							neighbour = levelMap[block.pos[1]-1][block.pos[0]];
							break;
						
						case "right":
							
							neighbour = levelMap[block.pos[1]][block.pos[0]+block.size[0]];
							break;
						
						case "down":
							
							neighbour = levelMap[block.pos[1]+block.size[1]][block.pos[0]];
							break;
						
						case "left":

							neighbour = levelMap[block.pos[1]][block.pos[0]-1];
							break;
					}
					for (var collisionCount = 0; collisionCount < neighbour.collisions.length; collisionCount++) {
						
						if (
							(neighbour.sprite.index != " " && neighbour.sprite.index != "3") ||
							neighbour.collisions[collisionCount].key == "+" ||
							neighbour.collisions[collisionCount].key == "-"
							) {
						
							canPass = false;
						}
					}
					if (canPass) {
						
						block.goal = afterNext;
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

function rotateBlock(field, direction) {

	var sprite = field.sprite;
	if (sprite) {
		
		var startRow = field.row-1;
		var startCol = field.col-1;
		var collisionMap = sprite.collisionMap.split("\n");
		for (var tmpRow = 0; tmpRow < collisionMap.length; tmpRow++) {
		
			for (var tmpCol = 0; tmpCol < collisionMap[tmpRow].length; tmpCol++) {
			
				if (
					(player.goal[1] == startRow+tmpRow) &&
					(player.goal[0] == startCol+tmpCol)
					) {
					
					var tmpChar = collisionMap[tmpRow].charAt(tmpCol);
					if (
						(tmpChar == "+") ||
						(tmpChar == "-")
						) {
						
						switch (player.direction.key) {
						
							case "up":
								player.goal[1]--;
								break;
						
							case "right":
								player.goal[0]++;
								break;
						
							case "down":
								player.goal[1]++;
								break;
						
							case "left":
								player.goal[0]--;
								break;
						}
					}
				}
			}
		}
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
		if (player) {
			
			player.sprite.index = " ";
			if (player.direction) {
		
				var sprite = sprites[player.sprite.spriteClass][player.direction.key][0];
				sprite.index = playerIndexes[currentPlayer];
				player.sprite = sprite;
			}
		}
	}
});