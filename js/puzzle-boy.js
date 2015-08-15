var canvas, context, bgSprite, sprites, levelMap, blocks, tmpBlock, rotators, currentId,
levelArray, players, player, goalPos, undoSteps, gameLoop, dragStartPos, 
backgroundCanvas, isGoingBack, enteredGoal, playerCount, firstTouch, isJumping, jumpAcceleration, startTime,
mousePressed, draggable, isPaused;

var jumpSpeed = 8;

var currentPlayer = 0;

var animSpeed = 1;

var swipeTolerance = 50;

var rotationSpeed = 0.1;

var playerSpeed = 4;

var gameSpeed = 1000/60;

var fieldSize = [0, 0];

var spritePath = "sprites/";

var topBlockChar = String.fromCharCode(128);

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

var maxDimensions = 20;

var spriteMap = {};

var rotation = 0;

var playerKeys = "0*#$";

var bgKeys = "123 ";

var playerIndexes = [];

var levelNr = 1;

var levelString = "";


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
		
	"block": {
		"index": "Z",
		"url": "block-small.png"
	},
	"brick": {
		"index": "1",
		"url": "brick.png",
	},
	"floor": {
		"index": " ",
		"url": "floor.png",
	},
	"hole": {
		"index": "3",
		"url": "hole.png",
	},
	"goal": {
		"index": "2",
		"url": "goal.png",
	},
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

function drawLevel(level, loadOnly) {
	
	levelString = level;
	players = [];
	player = {};
	levelMap = [];
	blocks = {};
	rotators = [];
	levelArray = [];
	undoSteps = [];
	playerIndexes = [];
	fieldSize = [0, 0];

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
				if (char.charCodeAt(0) > 190) {
					
					char = String.fromCharCode(char.charCodeAt(0)-64);
				}
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
					blocks[char].canvas = getBlockCanvas(blocks[blockField.key]);
				}
				levelRow.push(blockField);
			}
		}
		levelMap.push(levelRow);
		levelArray.push(rawLevelRow);
	}

	if (!loadOnly) {
		
		$("body").html('<canvas id="playground"></canvas><img id="btnHelp" src="img/btn-help.png"/>');
		canvas = $("#playground").get(0);
		canvas.width = fieldSize[0];
		canvas.height = fieldSize[1];
		context = canvas.getContext("2d");

		updateCollisionMaps();
		resize();
		$("#btnHelp").click(function() {

			openHelp();
		});
		$("#btnHelp").touchstart(function() {

			openHelp(true);
		});

		backgroundCanvas = drawBackground();
		drawPlayground();
		isJumping = true;
		if (!startTime) {
		
			startTime = new Date();
		}
	}
}

function startEditor() {
	
	levelString = "";
	players = [];
	player = {};
	levelMap = [];
	blocks = {};
	rotators = [];
	levelArray = [];
	undoSteps = [];
	playerIndexes = [];
	fieldSize = [maxDimensions, maxDimensions];
	for (var row = 0; row < fieldSize[1]; row++) {
	
		var levelRow = [];
		var rawLevelRow = [];
		for (var col = 0; col < fieldSize[0]; col++) {
		
			var defaultTile = "1";
			levelRow.push({
				"sprite": spriteMap[defaultTile],
				"col": col,
				"row": row
			});
			rawLevelRow.push(defaultTile);
			levelString += defaultTile;
		}
		levelMap.push(levelRow);
		levelArray.push(rawLevelRow);
		levelString += "\n";
	}

	canvas = $("#playground").get(0);
	canvas.width = fieldSize[0]*tileSize;
	canvas.height = fieldSize[1]*tileSize;
	context = canvas.getContext("2d");

	drawEditorMenu();
	setTimeout(drawEditor, 1000);
}

function openHelp(isTouch) {

	var url = "help.php";
	if (isTouch) {

		url = "help-mobile.php";
	}
	if (!isPaused) {

		isPaused = true;
		$.ajax({
		  url: url,
		  context: document.body
		}).done(function(data) {
		
			$("body").append(data);
			resize();
			$(window).click(function() {

				closeHelp();
			});
		});
	}
}

function closeHelp() {

	$("#help").remove();
	isPaused = false;
}

function drawEditorMenu() {
	
	var $container = $("#controls");
	$container.html("");
	for (var cat in sprites) {
		
		var $catNode = $('<div id="' + cat + '"></div>');
		switch (cat) {
			
		case "rotation":
			
			for (var type in sprites[cat]) {
				
				var first;
				for (first in sprites[cat][type]) break;
				if (sprites[cat][type][first].url) {
					
					$catNode.append('<img src="' + spritePath + sprites[cat][type][first].url + 
						'" id="' + sprites[cat][type][first].index + '" data-type="' + type + '" data-cat="' + first + '" />')
				}
			}
			break;
			
		default:

			var url = sprites[cat].url;
			var index = sprites[cat].index;
			if (!url) {
				
				if (sprites[cat]["down"] && sprites[cat]["down"][0].url) {
					
					url = sprites[cat]["down"][0].url;
					index = sprites[cat]["down"][0].index;
				}
			}
			if (url) {
			
				$catNode.append('<img src="' + spritePath + url + '" id="' + index + '" data-cat="' + cat + '" />')
			}
			break;
		}
		$container.append($catNode);
		
	}
	$form = $("#options");
	$form.append('<input type="text" id="levelName" placeholder="Level name" />');
	$form.append('<button id="saveLevel" onclick="saveLevel()">Save</button>');
	$form.append('<button id="deleteLevel" onclick="window.location.reload()">Clear</button>');
}

function saveLevel() {
	
	var levelString = "";
	var hasStarted = false;
	var lowestRow = -1;
	var highestRow = 0;
	var lowestCol = -1;
	var highestCol = 0;
	for (var row = 0; row < levelArray.length; row++) {

		var isEmpty = true;
		for (var col = 0; col < levelArray[row].length; col++) {
		
			var char = levelArray[row][col];
			if (char != "1") {
				
				isEmpty = false;
				hasStarted = true;
			}
		}
		if (isEmpty) {
			
			if (!hasStarted) {
				
				lowestRow = row;
			}
			else {
				
				highestRow = row;
				break;
			}
		}
	}
	hasStarted = false;
	for (var col = 0; col < levelArray[0].length; col++) {

		var isEmpty = true;
		for (var row = 0; row < levelArray.length; row++) {
		
			var char = levelArray[row][col];
			if (char != "1") {
				
				isEmpty = false;
				hasStarted = true;
			}
		}
		if (isEmpty) {
			
			if (!hasStarted) {
				
				lowestCol = col;
			}
			else {
				
				highestCol = col;
				break;
			}
		}
	}
	for (var elem in blocks) {

		var block = blocks[elem];
		for (var row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
		
			for (var col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
		
				if (levelArray[row][col] == "3") {
					
					levelArray[row][col] = String.fromCharCode(elem.charCodeAt(0)+64);
				}
				else {
					
					levelArray[row][col] = elem;
				}
			}
		}
	}
	if (lowestRow < 0) {
	
		if (lowestCol < 0) {
		
			levelString += "1";
		}
		for (var col = lowestCol; col <= highestCol; col++) {
			
			levelString += "1";
		}
		levelString += "\n";
	}
	for (var row = lowestRow; row <= highestRow; row++) {
		
		if (row > lowestRow) {
			
			levelString += "\n";
		}
		if (lowestCol < 0) {
		
			levelString += "1";
		}
		for (var col = lowestCol; col <= highestCol; col++) {
			
			var char = levelArray[row][col];
			levelString += char;
		}
	}
	var data = {
		"data": levelString
	};
	if (currentId) {
	
		data.id = currentId;
	}
	$.ajax({
	  type: "POST",
	  url: "level.php",
	  data: data,
	  success: function(data) {
	  	
		  currentId = parseInt(data, 10);
	  }
	});
	console.log(levelString);
}

function drawEditor() {
	
	context.clearRect(0, 0, fieldSize[0], fieldSize[1]);
	// draw background
	context.drawImage(drawBackground(), 0, 0);
	context.drawImage(drawPlaygroundCanvas(), 0, 0);
	updateCollisionMaps();
	window.setTimeout(resize, 1000);
}

function drawGameSelection() {
	
	$.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
	$.getJSON( "games.php", function(games) {

		$("body").html('<div class="selectionWrapper">'
			+ '<div class="selection">'
			+ '<h1>Choose game:</h1>'
			+ '<ul class="selection" id="gameSelection"></ul>'
			+ '<a class="backLink" href="#">Back</a>'
			+ '</div>'
			+ '</div>');
		var $container = $("#gameSelection");
		for (var i = 0; i < games.length; i++) {
			
			$container.append('<li style="background-image: url(' + games[i].background + ')"><a href="#game' + games[i].id + '">' + games[i].name + '</a></li>');
		}
	});
}

function drawDifficultySelection(originId) {
	
	$.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
	$.getJSON( "difficulties.php?origin=" + originId, function(difficulties) {

		$("body").html('<div class="selectionWrapper">'
			+ '<div class="selection">'
			+ '<h1>Choose difficulty:</h1>'
			+ '<ul class="selection" id="difficultySelection"></ul>'
			+ '<a class="backLink" href="#games">Back</a>'
			+ '</div>'
			+ '</div>');
		var $container = $("#difficultySelection");
		for (var i = 0; i < difficulties.length; i++) {
			
			$container.append('<li><a href="#difficulty' + originId + '|' + difficulties[i].id + '">' + difficulties[i].name + '</a></li>');
		}
	});
}

function drawLevelSelection(originId, difficultyId) {
	
	$.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
	$.getJSON( "level.php?origin=" + originId + "&difficulty=" + difficultyId, function(levels) {

		$("body").html('<div class="selectionWrapper">'
			+ '<div class="selection">'
			+ '<h1>Choose level:</h1>'
			+ '<ul id="levelSelection"></ul>'
			+ '<a class="backLink" href="#game' + originId + '">Back</a>'
			+ '</div>'
			+ '</div>');
		var $container = $("#levelSelection");
		for (var i = 0; i < levels.length; i++) {
			
			$container.append('<li id="levelLink' + levels[i].id + '">'
				+ '<a href="#level' + levels[i].id + '">'
				+ '<div class="canvasContainer"></div>'
				+ levels[i].number
				+ '</a>'
				+ '</li>');
			drawLevel(levels[i].data, true);
			var iconCanvas = document.createElement("canvas");
			iconCanvas.width = levelMap[0].length*tileSize;
			iconCanvas.height = levelMap.length*tileSize;
			var iconContext = iconCanvas.getContext("2d");			
			iconContext.drawImage(drawBackground(), 0, 0);
			iconContext.drawImage(drawPlaygroundCanvas(), 0, 0);
			
	        // translate context to center of canvas
	        iconContext.translate(iconCanvas.width / 2, iconCanvas.height / 2);

	        // scale y component
	        // iconContext.scale(1, 0.5);			
			
			iconContext.scale(1/tileSize, 1/tileSize);
			$("#levelLink"+levels[i].id+" .canvasContainer").first().append(iconCanvas);
		}
	});
}

function drawPlaygroundCanvas() {
	
	var playgroundCanvas = document.createElement("canvas");
	playgroundCanvas.width = levelMap[0].length*tileSize;
	playgroundCanvas.height = levelMap.length*tileSize;
	var playgroundContext = playgroundCanvas.getContext("2d");	
	var col, row;
	for (var row = 0; row < levelArray.length; row++) {
		
		var levelRow = levelArray[row];
		for (var col = 0; col < levelRow.length; col++) {
			
			var sprite = spriteMap[levelArray[row][col]];
			if (sprite && sprite.drawing && sprite.index != " " && sprite.index != "3" && sprite.index != "Z" && spriteMap[sprite.index] && (bgKeys.indexOf(sprite.index) == -1)) {

				var tmpRow = row;
				var tmpCol = col;
				if (sprite.spriteClass == "rotation") {
					
					tmpCol--;
					tmpRow--;
				}
				playgroundContext.drawImage(sprite.drawing, (tmpCol*tileSize), (tmpRow*tileSize));
			}
		}
	}
	if (tmpBlock) {
		
		playgroundContext.drawImage(tmpBlock.canvas, tmpBlock.pos[0]*tileSize, tmpBlock.pos[1]*tileSize);
	}
	for (var elem in blocks) {

		var block = blocks[elem];
		var startX = block.pos[0]*tileSize;
		var startY = block.pos[1]*tileSize;
		playgroundContext.drawImage(block.canvas, startX+block.offsetX, startY+block.offsetY);
	}
	return playgroundCanvas;
}

function loadLevel(levelId) {
	
	levelNr = levelId;
	$.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
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
					
					if (sprite.index.charCodeAt(0) > 190) {
						
						drawing = spriteMap["3"].drawing;
					}
					else {
						
						drawing = spriteMap[" "].drawing;
					}
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

function getBlockCanvas(block) {
	
	var blockCanvas = document.createElement("canvas");
	var blockContext = blockCanvas.getContext("2d");
	var sprite = spriteMap["Z"];
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
	blockContext.drawImage(sprite.drawing, (tileSize/2), 0, (tileSize/2), (tileSize/2), 
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
		blockContext.drawImage(sprite.drawing, (tileSize/2), (tileSize/2), (tileSize/2), 1, 
			((block.size[0]-1)*tileSize)+(tileSize/2), 
			(tileSize/2), 
			(tileSize/2), 
			(block.size[1]-1)*tileSize);
	// }
	// bottom
	blockContext.drawImage(sprite.drawing, 0, (tileSize/2), (tileSize/2), (tileSize/2), 
		0, 
		((block.size[1]-1)*tileSize)+(tileSize/2), 
		(tileSize/2), 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2), (tileSize/2), 1, (tileSize/2), 
		(tileSize/2), 
		((block.size[1]-1)*tileSize)+(tileSize/2), 
		(block.size[0]-1)*tileSize, 
		(tileSize/2));
	blockContext.drawImage(sprite.drawing, (tileSize/2), (tileSize/2), (tileSize/2), (tileSize/2), 
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
		if (centerField) {
			
			centerField.rotation = {
				"goal": 0,
				"current": 0,
				"direction": 0
			};
		}
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
			isJumping = true;
		}
		else {
		
			endLevel();
		}
		enteredGoal = false;
	}, 2000);
}

function endLevel() {
	
	enteredGoal = false;
	if (startTime) {
		
		var timeSpent = Math.floor((new Date()-startTime)/1000);
		startTime = null;
		var playersQuery = "";
		for (var i = 0; i < playerKeys.length; i++) {
		
			var key = playerKeys[i];
			if (levelString.indexOf(key) > -1) {
			
				playersQuery += "&" + spriteMap[key].spriteClass.replace("player-", "") + "=true";
			}
		}
		cancelAnimationFrame(gameLoop);
		$.ajax({
		  url: "level-solved.php?level=" + levelNr + "&time=" + timeSpent + "&moves=" + undoSteps.length + playersQuery,
		  context: document.body
		}).done(function(data) {
		
			$("body").html(data);
			$(".btnRetry").click(function() {

				loadLevel(levelNr);
			});
		});
	}
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

	if (playerCount > 1) {
		
		currentPlayer = (currentPlayer+1)%playerCount;
		player = players[currentPlayer];
		isJumping = true;
	}
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

	checkHash();
	window.onhashchange = checkHash;
	resize();
});

function checkHash() {
	
	levelNr = parseInt(window.location.hash.replace("#level", ""), 10);
	if (window.location.hash.indexOf("#level") > -1 && !isNaN(levelNr)) {
		
		$("body").html("");
		loadLevel(levelNr);
	}
	else if (window.location.hash.indexOf("#editor") > -1) {
		
		$("body").html("");
		$.ajax("editor.php").done(function(data) {
			
			$("body").html(data);
			startEditor();
		});
	}
	else if (window.location.hash.indexOf("#games") > -1) {
		
		$("body").html("");
		drawGameSelection();
	}
	else if (window.location.hash.indexOf("#game") > -1) {
		
		$("body").html("");
		var game = parseInt(window.location.hash.replace("#game", ""), 10);
		if (!isNaN(game)) {
			
			drawDifficultySelection(game);
		}
	}
	else if (window.location.hash.indexOf("#difficulty") > -1) {
		
		$("body").html("");
		var difficulty = window.location.hash.replace("#difficulty", "").split("|");
		if (difficulty.length > 1) {
			
			drawLevelSelection(difficulty[0], difficulty[1]);
		}
	}
	else {
		
		window.location.hash = "";
		levelNr = 1;
		$("body").html('<a href="#games" id="title"><img src="img/title.png" /></a>');
	}
	resize();
}

$(window).resize(function() {
	
	resize();
});

window.addEventListener("orientationchange", function() {
	
	resize();
}, false);

function resize() {
	
	if ($("#editor").length <= 0) {
		
		if ($(".selection").length <= 0) {
			
			if (canvas) {
		
				var offset = [($(window).width()-canvas.width)/2, ($(window).height()-canvas.height)/2];
				$(canvas).css({
		
					position: "absolute",
					top: offset[1],
					left: offset[0] 
				});
		
				$("body").css('background-position', offset[0] + "px " + offset[1] + "px");
				$("#btnHelp").css({
					'top': offset[1],
					'left': offset[0] });
				if ($("#help").length > 0) {

					$("#help .content").css({

						'top': Math.floor(($(window).height()-$("#help .content").height())/2),
						'left': Math.floor(($(window).width()-$("#help .content").width())/2)
					});
				}
			}
		}
	}
	else {
		
		$("#editor").css({
			
			position: "absolute",
			top: ($(window).height()-$("#editor").height())/2,
			left: ($(window).width()-$("#editor").width())/2
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

$(document).mousedown(function(e) {
	
	mousePressed = true;
	if ($("#editor").length > 0) {
		
		if ($(e.target).parent().parent().attr("id") == "controls") {
			
			$("#controls img").css({
			
				"box-shadow": "none",
				"background-color": "transparent"
			});
			if (draggable && (draggable.attr("src") == $(e.target).attr("src")) && ($(e.target).parent().attr("id") == "rotation")) {
				
				var rotation = rotationIndexByKey($(e.target).attr("data-cat"));
				var type = $(e.target).attr("data-type");
				rotation = rotations[(rotation+1)%rotations.length];
				draggable.attr("src", spritePath + sprites["rotation"][type][rotation.key].url);
				draggable.attr("id", sprites["rotation"][type][rotation.key].index);
				draggable.attr("data-cat", rotation.key);
			}
			else {
				
				draggable = $(e.target);
			}
			$(e.target).css({
				
				"box-shadow": "0 0 5px 5px #999",
				"background-color": "#999"
			});
		}
		else if (draggable && ($(e.target).attr("id") == "items" || $(e.target).parent().attr("id") == "items")) {
			
			addEditorItem(e);
		}
	}
});

function addEditorItem(event) {
	
	$target = $(event.target);
	event.preventDefault();
	var posX = Math.floor((event.offsetX)/tileSize);
	var posY = Math.floor((event.offsetY)/tileSize);
	if (draggable.parent().attr("id") == "block") {
		
		if (!tmpBlock) {
			
			tmpBlock = {
					"pos": [posX, posY],
					"goal": [posX, posY],
					"offsetX": 0,
					"offsetY": 0
			};
		}
		tmpBlock.size = [Math.abs((posX-tmpBlock.pos[0])+1), Math.abs((posY-tmpBlock.pos[1])+1)];
		if (posX < tmpBlock.pos[0]) {
		
			tmpBlock.pos[0] = posX;
		}
		if (posY < tmpBlock.pos[1]) {
		
			tmpBlock.pos[1] = posY;
		}
		tmpBlock.canvas = getBlockCanvas(tmpBlock);
	}
	else {
		
		levelArray[posY][posX] = draggable.attr("id");
		if (spriteMap[draggable.attr("id")]) {
		
			if (playerKeys.indexOf(draggable.attr("id")) > -1) {
			
				var player = players[draggable.attr("id")];
				if (player) {
				
					levelArray[player.row][player.col] = " ";
					levelMap[player.row][player.col] = {
						"sprite": spriteMap[" "],
						"col": player.col,
						"row": player.row
					};
				}
				players[draggable.attr("id")] = {
					"col": posX,
					"row": posY
				};
			}
			if (draggable.attr("id") == "2") {
			
				if (goalPos) {
				
					levelArray[goalPos.row][goalPos.col] = " ";
					levelMap[goalPos.row][goalPos.col] = {
						"sprite": spriteMap[" "],
						"col": goalPos.col,
						"row": goalPos.row
					};
				}
				goalPos = {
					"col": posX,
					"row": posY
				};
			}
			levelMap[posY][posX] = {
				"sprite": spriteMap[draggable.attr("id")],
				"col": posX,
				"row": posY
			};
		}
	}
	for (var elem in blocks) {
		
		var block = blocks[elem];
		if ((block.pos[0] <= posX) && ((block.pos[0]+block.size[0]) > posX) &&
			(block.pos[1] <= posY) && ((block.pos[1]+block.size[1]) > posY)) {
				
			delete blocks[elem];
		}
	}
	drawEditor();
}

$(document).mousemove(function(e) {
	
	if (mousePressed && draggable && ($(e.target).attr("id") == "items" || $(e.target).parent().attr("id") == "items")) {
		addEditorItem(e);
	}
});

$(document).mouseup(function(e) {
	
	mousePressed = false;
	if (tmpBlock) {
		
		blocks[topBlockChar] = tmpBlock;
		topBlockChar = String.fromCharCode(topBlockChar.charCodeAt(0)+1);
	}
	tmpBlock = null;
});

function hasParent($child, parentId) {
	
	while ($child) {
		
		if ($child.attr("id") == parentId) {
			
			return true;
		}
		$child = $child.parent();
	}
	return false;
}

$(document).keydown(function(e) {

	if($("#editor").length <= 0 && !isPaused) {
		
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
	}
});

$(document).keyup(function(e) {

	if($("#editor").length <= 0 && !isPaused) {
		
		e.preventDefault();
		if (player && player.pos && !player.direction && !enteredGoal && !isJumping &&
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

			case 72: // h
				openHelp();
				break;
			}
		}
	}
	else if (isPaused && e.keyCode == 72) {

		closeHelp();
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