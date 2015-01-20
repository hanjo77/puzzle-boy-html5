var canvas, context, sprites;

var currentPlayer = 0;

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

var levelMap = [];

var rotation = 0;

var players = [];
var playerIndexes = ["0", "*"];

var player = {

	"pos": [0, 0],
	"goal": [0, 0],
};

var blocks = {};

var levelArray = [];

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
			+ "111111111111111",]

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
				"url": "puzzle-boy-right-1.png",
			}
		],
		"down": [
			{
				"index": "0",
				"url": "puzzle-boy-down-1.png",
			},
			{
				"url": "puzzle-boy-down-1.png",
			}
		],
		"left": [
			{
				"url": "puzzle-boy-left-1.png",
			},
			{
				"url": "puzzle-boy-left-1.png",
			}
		]
	},
	"puzzle-girl": {
		
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
				"url": "puzzle-boy-right-1.png",
			}
		],
		"down": [
			{
				"index": "*",
				"url": "puzzle-boy-down-1.png",
			},
			{
				"url": "puzzle-boy-down-1.png",
			}
		],
		"left": [
			{
				"url": "puzzle-boy-left-1.png",
			},
			{
				"url": "puzzle-boy-left-1.png",
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
			"index": "o",
			"url": "rot-4.png",
			"collisionMap": "=+=\n"
				+ "-0+\n"
				+ "=-="
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

function loadLevel(level) {
	
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
						"direction": null
					};
					players.push(tmpPlayer);
					player = players[0];
				}
				else if (spriteMap[char].spriteClass == "rotation") {
			
					spriteMap[char].topLeft = [col-1, row-1];
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
	
	updateCollisionMaps();
}

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

	loadLevel(levels[5]);
	canvas = $("#playground").get(0);
	canvas.width = fieldSize[0];
	canvas.height = fieldSize[1];
	context = canvas.getContext("2d");
	window.setInterval(drawPlayground, 10);
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
			var sprite = levelRow[col].sprite;
			if (sprite && sprite.spriteClass == "rotation") {
		
				var collisionMap = sprite.collisionMap.split("\n");
				for (var innerRow = 0; innerRow < collisionMap.length; innerRow++) {
				
					var collisionRow = collisionMap[innerRow];
					for (var innerCol = 0; innerCol < collisionRow.length; innerCol++) {
					
						levelMap[(row-1)+innerRow][(col-1)+innerCol].collision = collisionRow.charAt(innerCol);
						levelMap[(row-1)+innerRow][(col-1)+innerCol].collider = sprite;
					}
				}
			}
		}
	}
}

function drawPlayground() {
	
	animate();
	context.clearRect(0, 0, fieldSize[0], fieldSize[1]);
	for (var row = 0; row < levelMap.length; row++) {
		
		var levelRow = levelMap[row];
		for (var col = 0; col < levelRow.length; col++) {
			
			var sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing && sprite.index != " ") {

				var pos = [
					(tileSize / 2)+(col*tileSize), 
					(tileSize / 2)+(row*tileSize)
				];
				if (sprite.index == "0") {
					
					players[0].sprite = sprite;
				}
				else if (sprite.index == "*") {
					
					players[1].sprite = sprite;
				}
				else if (sprite && sprite.spriteClass == "block") {
				
					for (var elem in blocks) {
					
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
	if (player.sprite) {
		
		context.drawImage(player.sprite.drawing, (player.pos[0]*tileSize)+player.offsetX, (player.pos[1]*tileSize)+player.offsetY);			
	}
	if (players.length > 1) {
	
		var otherPlayer = (currentPlayer+1)%players.length;
		context.drawImage(players[otherPlayer].sprite.drawing, (players[otherPlayer].pos[0]*tileSize)+players[otherPlayer].offsetX, (players[otherPlayer].pos[1]*tileSize)+players[otherPlayer].offsetY);			
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
		
				if (rotation.direction > 0) {

					if (rotation.current < rotation.goal) {
				
						rotation.current += 0.05;
					}
					else {
					
						var index = rotationIndexByKey(sprite.key);
						index = (index+1)%rotations.length;
						sprite = sprite.altSprites[rotations[index].key];
						levelRow[col].rotation = {
							"current": 0,
							"goal": 0,
							"direction": 0
						};
						sprite.topLeft = [col-1, row-1];
						levelRow[col].sprite = sprite;
					}
				}
				else if (rotation.direction < 0) {

					if (rotation.current > rotation.goal) {
				
						rotation.current -= 0.05;
					}
					else {
					
						var index = rotationIndexByKey(sprite.key);
						index--;
						if (index < 0) {
						
							index = 3;
						}
						sprite = sprite.altSprites[rotations[index].key];
						levelRow[col].rotation = {
							"current": 0,
							"goal": 0,
							"direction": 0
						};
						sprite.topLeft = [col-1, row-1];
						levelRow[col].sprite = sprite;
					}
				}
			}
		}
	}
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
	
	if (player.direction) {
	
		var oldPos = [player.pos[0], player.pos[1]];
		switch (player.direction.key) {
		
			case "up":
				player.offsetY -= playerSpeed;
				break;
				
			case "right":
				player.offsetX += playerSpeed;
				break;
				
			case "down":
				player.offsetY += playerSpeed;
				break;
				
			case "left":
				player.offsetX -= playerSpeed;
				break;
		}
		if (player.offsetX > tileSize) {
		
			player.offsetX -= tileSize;
			player.pos[0]++;
		}
		if (player.offsetX < (-1*tileSize)) {
		
			player.offsetX += tileSize;
			player.pos[0]--;
		}
		if (player.offsetY > tileSize) {
		
			player.offsetY -= tileSize;
			player.pos[1]++;
		}
		if (player.offsetY < (-1*tileSize)) {
		
			player.offsetY += tileSize;
			player.pos[1]--;
		}
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

	if (direction) {
	
		var tmpGoal = [player.goal[0], player.goal[1]];
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
			
			levelMap[afterNext[1]][afterNext[0]];
		}
		var goalField = levelMap[tmpGoal[1]][tmpGoal[0]];
		var centerField = null;
		if (goalField.collision) {
		
			for (var tmpRow = tmpGoal[1]-1; tmpRow < tmpGoal[1]+2; tmpRow++) {
			
				for (var tmpCol = tmpGoal[0]-1; tmpCol < tmpGoal[0]+2; tmpCol++) {
				
					if (levelMap[tmpRow][tmpCol].sprite.spriteClass == "rotation") {
					
						centerField = levelMap[tmpRow][tmpCol];
					}
				}
			}
		}

		if (
			(goalField.sprite.index == " ") &&
			(levelArray[tmpGoal[1]][tmpGoal[0]] == " ") &&
			(
				!goalField.collision || 
				goalField.collision == " " || 
				goalField.collision == "=" || 
				goalField.collision == "r" || 
				goalField.collision == "l"
			)
			){
		
			player.goal = tmpGoal;
		}
		else if (centerField && (goalField.collision == "+")) {
		
			if (!afterNextField || afterNextField.collision != "0") {
			
				player.goal = tmpGoal;
				switch(direction.key) {
				
					case "up":
						if (levelMap[tmpGoal[1]-1][tmpGoal[0]].collision != "0") {
						
							rotateBlock(centerField, -1);
						}
						break;
				
					case "right":
						if (levelMap[tmpGoal[1]][tmpGoal[0]+1].collision != "0") {
						
							rotateBlock(centerField, 1);
						}
						break;
				
					case "down":
						if (levelMap[tmpGoal[1]+1][tmpGoal[0]].collision != "0") {
						
							rotateBlock(centerField, 1);
						}
						break;
				
					case "left":
						if (levelMap[tmpGoal[1]][tmpGoal[0]-1].collision != "0") {
						
							rotateBlock(centerField, -1);
						}
						break;
				}
			}
		}
		else if (centerField && (goalField.collision == "-")) {
		
			if (!afterNextField || afterNextField.collision != "0") {
			
				player.goal = tmpGoal;
				switch(direction.key) {
				
					case "up":
						if (levelMap[tmpGoal[1]-1][tmpGoal[0]].collision != "0") {
						
							rotateBlock(centerField, 1);
						}
						break;
				
					case "right":
						if (levelMap[tmpGoal[1]][tmpGoal[0]+1].collision != "0") {
						
							rotateBlock(centerField, -1);
						}
						break;
				
					case "down":
						if (levelMap[tmpGoal[1]+1][tmpGoal[0]].collision != "0") {
						
							rotateBlock(centerField, -1);
						}
						break;
				
					case "left":
						if (levelMap[tmpGoal[1]][tmpGoal[0]-1].collision != "0") {
						
							rotateBlock(centerField, 1);
						}
						break;
				}
			}
		}
		else if (goalField.sprite.index == "2") {
		
			player.goal = tmpGoal;
			console.log("LEVEL SOLVED");
		}
		else if (goalField.sprite.spriteClass == "block") {
			
			if (levelArray[tmpGoal[1]][tmpGoal[0]] != "3") {
			
				var block = blocks[goalField.key];
				switch (direction.key) {
			
					case "up":
						var canPass = true;
						for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
							
							if (
								(levelMap[block.pos[1]-1][col].sprite.index != " " &&
								levelMap[block.pos[1]-1][col].sprite.index != "3") ||
								levelMap[block.pos[1]-1][col].collision == "+" ||
								levelMap[block.pos[1]-1][col].collision == "-"
								) {
								
								canPass = false;
							}
						}
						if (canPass) {
							
							player.goal = tmpGoal;
							block.goal = [block.pos[0], block.pos[1]-1];
							block.direction = direction;
						}
						break;
					
					case "right":
						var canPass = true;
						for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
							
							if (
								(levelMap[row][block.pos[0]+block.size[0]].sprite.index != " " &&
								levelMap[row][block.pos[0]+block.size[0]].sprite.index != "3") ||
								levelMap[row][block.pos[0]+block.size[0]].collision == "+" ||
								levelMap[row][block.pos[0]+block.size[0]].collision == "-"
								) {
								
								canPass = false;
							}
						}
						if (canPass) {
							
							player.goal = tmpGoal;
							block.goal = [block.pos[0]+1, block.pos[1]];
							block.direction = direction;
						}
						break;
					
					case "down":
						var canPass = true;
						for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
							
							if ((levelMap[block.pos[1]+block.size[1]][col].sprite.index != " " &&
								levelMap[block.pos[1]+block.size[1]][col].sprite.index != "3") ||
								levelMap[block.pos[1]+block.size[1]][col].collision == "+" ||
								levelMap[block.pos[1]+block.size[1]][col].collision == "-"
								) {
								
								canPass = false;
							}
						}
						if (canPass) {
							
							player.goal = tmpGoal;
							block.goal = [block.pos[0], block.pos[1]+1];
							block.direction = direction;
						}
						break;
					
					case "left":
						var canPass = true;
						for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
							
							if ((levelMap[row][block.pos[0]-1].sprite.index != " " &&
								levelMap[row][block.pos[0]-1].sprite.index != "3") ||
								levelMap[row][block.pos[0]-1].collision == "+" ||
								levelMap[row][block.pos[0]-1].collision == "-"
								) {
								
								canPass = false;
							}
						}
						if (canPass) {
							
							player.goal = tmpGoal;
							block.goal = [block.pos[0]-1, block.pos[1]];
							block.direction = direction;
						}
						break;
				}
			}
		}
	}
}

function rotateBlock(field, direction) {

	if (!field.rotation) {
	
		field.rotation = {
			"goal": 0,
			"current": 0,
			"direction": direction
		};
	}
	var index = 0;
	field.rotation.direction = direction;
	
	if (direction > 0) {
	
		field.rotation.goal += Math.PI/2;
		index = rotationIndexByKey(field.sprite.key);
		index = (index+1)%rotations.length;
	}
	else if (direction < 0) {
	
		field.rotation.goal -= Math.PI/2;
		index = rotationIndexByKey(field.sprite.key);
		index--;
		if (index < 0) {
		
			index = 3;
		}
	}

	sprite = field.sprite.altSprites[rotations[index].key];
	if (blockCanRotate(field, direction, sprite)) {
	
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
}

function blockCanRotate(field, direction, sprite) {

	var canGo = true;
	var thisCollisionMap = field.sprite.collisionMap.split("\n");
	var collisionMap = sprite.collisionMap.split("\n");
	for (var row = 0; row < collisionMap.length; row++) {
	
		var thisCollisionRow = thisCollisionMap[row];
		var collisionRow = collisionMap[row];
		for (var col = 0; col < collisionRow.length; col++) {
		
			var thisCollisionChar = thisCollisionRow.charAt(col);
			var collisionChar = collisionRow.charAt(col);
			var char = levelMap[field.sprite.topLeft[1]+row][field.sprite.topLeft[0]+col].sprite.index;
			if (
				(direction > 0 && thisCollisionChar == "r" && char && char != " ") ||
				(direction < 0 && thisCollisionChar == "l" && char && char != " ") ||
				(
					(collisionChar == "-" || collisionChar == "+") &&
					(char && char != " ")
				)
			   ) {
			
				canGo = false;
			}
		}
	}
	if (!canGo) {
	
		field.rotation.goal = field.rotation.current;
		player.goal = player.pos;
	}
	return canGo;
}

$(document).keyup(function(e) {

	if (!player.direction) {
		
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
		player.sprite.index = " ";
		if (player.direction) {
		
			var sprite = sprites[player.sprite.spriteClass][player.direction.key][0];
			sprite.index = playerIndexes[currentPlayer];
			player.sprite = sprite;
		}
	}
});