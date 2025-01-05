const swipeTolerance = 50;

const rotationSpeed = 0.1;

const playerSpeed = 4;

const gameSpeed = 1000/60;

const spritePath = 'sprites/';

let canvas, context, bgSprite, levelMap, blocks, tmpBlock, rotators, currentId,
levelArray, players, player, goalPos, undoSteps, gameLoop, dragStartPos, 
backgroundCanvas, isGoingBack, enteredGoal, playerCount, firstTouch, isJumping, jumpAcceleration, startTime,
mousePressed, draggable, isPaused;

let jumpSpeed = 8;

let currentPlayer = 0;

let animSpeed = 1;

let topBlockChar = String.fromCharCode(128);

let fieldSize = [0, 0];

const rotations = [
	{
		'key': 'up',
		'angle': 0,
	},
	{
		'key': 'right',
		'angle': 90,
	},
	{
		'key': 'down',
		'angle': 180,
	},
	{
		'key': 'left',
		'angle': 270,
	}
];

const rotationIndexByKey = (key) => {

	let index = -1;
	switch (key) {
	
		case 'up':
			index = 0;
			break;
	
		case 'right':
			index = 1;
			break;
	
		case 'down':
			index = 2;
			break;
	
		case 'left':
			index = 3;
			break;
	}
	return index;
}

const tileSize = 32;

const maxDimensions = 20;

let spriteMap = {};

let rotation = 0;

let playerKeys = '0*#$';

let bgKeys = '123 ';

let playerIndexes = [];

let levelNr = 1;

let levelData = [];

let levelOriginData = [];

let difficultyData = [];

let originData = [];

let levelString = '';

function setCookie(cookieName, cookieValue) {
    const date = new Date();
    date.setTime(date.getTime() + (100 * 365 * 24 * 60 * 60 * 1000));
    const expires = "expires="+ date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

const getCookie = (cookieName) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

const requestOptions = new Headers();

const cookieProgress = getCookie('progress');
if (cookieProgress?.indexOf('|')) {
	const values = cookieProgress.split('|');
	values.forEach((value, index) => {
		sessionStorage.setItem('maxLevel_' + index, value);
	});
} 

if (!sessionStorage.getItem('maxLevel_0')) {
	sessionStorage.setItem('maxLevel_0', 1);
	sessionStorage.setItem('maxLevel_1', 31);
}

fetch('data/level.json', requestOptions)
    .then(response => {
		return response.json();
	})
    .then(data => {
        levelData = data;
    });    

fetch('data/puzzleboy-level_origin.json', requestOptions)
    .then(response => response.json())
    .then(data => {
        levelOriginData = data;
    });

fetch('data/puzzleboy-difficulty.json', requestOptions)
    .then(response => response.json())
    .then(data => {
        difficultyData = data;
    });

fetch('data/puzzleboy-origin.json', requestOptions)
    .then(response => response.json())
    .then(data => {
        originData = data;
    });


const getNumberByLevelId = (id) => {
    for (let row of levelOriginData) {
        if (parseInt(row.level_id, 10) === parseInt(id, 10)) {
            return row.number;
        }
    }
}

const getLevelById = (id) => {
    for (let level of levelData) {
        if (parseInt(level.id, 10) === parseInt(id, 10)) {
            level.number = getNumberByLevelId(id);
            return level;
        }
    }
    return null;
}

const getDifficultyById = (id) => {
    for (let difficulty of difficultyData) {
        if (difficulty && parseInt(difficulty.id, 10) === parseInt(id, 10)) {
            return difficulty;
        }
    }
    return null;
}

const getLevelsByOriginDifficulty = (origin, difficulty) => {
    const response = [];
    for (let row of levelOriginData) {
        if (parseInt(row.origin_id, 10) === parseInt(origin, 10) && parseInt(row.difficulty_id, 10) === parseInt(difficulty, 10)) {
            response.push(getLevelById(parseInt(row.level_id, 10)));
        }
    }
    return response;
}

const getDifficultiesByOrigin = (origin) => {
    const ids = [];
    for (let index in levelOriginData) {
        const row = levelOriginData[index];
        if (parseInt(row.origin_id, 10) === parseInt(origin, 10) && ids.indexOf(parseInt(row.difficulty_id, 10)) < 0) {
            ids.push(parseInt(row.difficulty_id, 10));
        }
    }
    return ids.map(id => getDifficultyById(id));
}

/*
	collisionMap legend:
	-: rotates opposite direction of motion (x/y- = rotation+, x/y+ = rotation-)
	+: rotates same direction as motion (x/y+ = rotation+, x/y- = rotation-)
	r: blocks right rotation (rotation+)
	l: blocks left rotation (rotation-)
	=: blocks all rotation
	0: center
*/

const sprites = {
		
	'block': {
		'index': 'Z',
		'url': 'block-small.png',
		'up': {
			'index': '',
			'url': '',
		}
	},
	'brick': {
		'index': '1',
		'url': 'brick.png',
	},
	'floor': {
		'index': ' ',
		'url': 'floor.png',
	},
	'hole': {
		'index': '3',
		'url': 'hole.png',
	},
	'goal': {
		'index': '2',
		'url': 'goal.png',
	},
	'player-potato': {
		
		'up': [
			{
				'url': 'player-potato-up-1.png',
			},
			{
				'url': 'player-potato-up-2.png',
			}
		],
		'right': [
			{
				'url': 'player-potato-right-1.png',
			},
			{
				'url': 'player-potato-right-2.png',
			}
		],
		'down': [
			{
				'index': '0',
				'url': 'player-potato-down-1.png',
			},
			{
				'url': 'player-potato-down-2.png',
			}
		],
		'left': [
			{
				'url': 'player-potato-left-1.png',
			},
			{
				'url': 'player-potato-left-2.png',
			}
		]
	},
	'player-eggplant': {
		
		'up': [
			{
				'url': 'player-eggplant-up-1.png',
			},
			{
				'url': 'player-eggplant-up-2.png',
			}
		],
		'right': [
			{
				'url': 'player-eggplant-right-1.png',
			},
			{
				'url': 'player-eggplant-right-2.png',
			}
		],
		'down': [
			{
				'index': '*',
				'url': 'player-eggplant-down-1.png',
			},
			{
				'url': 'player-eggplant-down-2.png',
			}
		],
		'left': [
			{
				'url': 'player-eggplant-left-1.png',
			},
			{
				'url': 'player-eggplant-left-2.png',
			}
		]
	},
	'player-carrot': {
		
		'up': [
			{
				'url': 'player-carrot-up-1.png',
			},
			{
				'url': 'player-carrot-up-2.png',
			}
		],
		'right': [
			{
				'url': 'player-carrot-right-1.png',
			},
			{
				'url': 'player-carrot-right-2.png',
			}
		],
		'down': [
			{
				'index': '#',
				'url': 'player-carrot-down-1.png',
			},
			{
				'url': 'player-carrot-down-2.png',
			}
		],
		'left': [
			{
				'url': 'player-carrot-left-1.png',
			},
			{
				'url': 'player-carrot-left-2.png',
			}
		]
	},
	'player-pepper': {
		
		'up': [
			{
				'url': 'player-pepper-up-1.png',
			},
			{
				'url': 'player-pepper-up-2.png',
			}
		],
		'right': [
			{
				'url': 'player-pepper-right-1.png',
			},
			{
				'url': 'player-pepper-right-2.png',
			}
		],
		'down': [
			{
				'index': '$',
				'url': 'player-pepper-down-1.png',
			},
			{
				'url': 'player-pepper-down-2.png',
			}
		],
		'left': [
			{
				'url': 'player-pepper-left-1.png',
			},
			{
				'url': 'player-pepper-left-2.png',
			}
		]
	},
	'rotation': {
		'1': {
			'up': {
				'index': 'a',
				'url': 'rot-1-up.png',
				'collisionMap': 'l+r\n'
					+ 'l0r\n'
					+ '   '
			},
			'right': {
				'index': 'b',
				'url': 'rot-1-right.png',
				'collisionMap': ' ll\n'
					+ ' 0+\n'
					+ ' rr'
			},
			'down': {
				'index': 'c',
				'url': 'rot-1-down.png',
				'collisionMap': '   \n'
					+ 'r0l\n'
					+ 'r-l'
			},
			'left': {
				'index': 'd',
				'url': 'rot-1-left.png',
				'collisionMap': 'rr \n'
					+ '-0 \n'
					+ 'll '
			},
		},
		'2corner': {
			'up': {
				'index': 'e',
				'url': 'rot-2-up-right.png',
				'collisionMap': 'l+=\n'
					+ 'l0+\n'
					+ ' rr'
			},
			'right': {
				'index': 'f',
				'url': 'rot-2-down-right.png',
				'collisionMap': ' ll\n'
					+ 'r0+\n'
					+ 'r-='
			},
			'down': {
				'index': 'g',
				'url': 'rot-2-down-left.png',
				'collisionMap': 'rr \n'
					+ '-0l\n'
					+ '=-l'
			},
			'left': {
				'index': 'h',
				'url': 'rot-2-up-left.png',
				'collisionMap': '=+r\n'
					+ '-0r\n'
					+ 'll '
			},
		},
		'2long': {
			'up': {
				'index': 'i',
				'url': 'rot-2-up-down.png',
				'collisionMap': 'l+r\n'
					+ '=0=\n'
					+ 'r-l'
			},
			'right': {
				'index': 'j',
				'url': 'rot-2-left-right.png',
				'collisionMap': 'r=l\n'
					+ '-0+\n'
					+ 'l=r'
			},
			'down': {
				'url': 'rot-2-up-down.png',
				'collisionMap': 'l+r\n'
					+ '=0=\n'
					+ 'r-l'
			},
			'left': {
				'url': 'rot-2-left-right.png',
				'collisionMap': 'r=l\n'
					+ '-0+\n'
					+ 'l=r'
			},
		},
		'3': {
			'up': {
				'index': 'k',
				'url': 'rot-3-up.png',
				'collisionMap': '=+=\n'
					+ '-0+\n'
					+ 'l=r'
			},
			'right': {
				'index': 'l',
				'url': 'rot-3-right.png',
				'collisionMap': 'l+=\n'
					+ '=0+\n'
					+ 'r-='
			},
			'down': {
				'index': 'm',
				'url': 'rot-3-down.png',
				'collisionMap': 'r=l\n'
					+ '-0+\n'
					+ '=-='
			},
			'left': {
				'index': 'n',
				'url': 'rot-3-left.png',
				'collisionMap': '=+r\n'
					+ '-0=\n'
					+ '=-l'
			},
		},
		'4': {
			'up': {
				'index': 'o',
				'url': 'rot-4.png',
				'collisionMap': '=+=\n'
					+ '-0+\n'
					+ '=-='
			},
			'right': {
				'index': 'p',
				'url': 'rot-4.png',
				'collisionMap': '=+=\n'
					+ '-0+\n'
					+ '=-='
			},
			'down': {
				'index': 'q',
				'url': 'rot-4.png',
				'collisionMap': '=+=\n'
					+ '-0+\n'
					+ '=-='
			},
			'left': {
				'index': 'r',
				'url': 'rot-4.png',
				'collisionMap': '=+=\n'
					+ '-0+\n'
					+ '=-='
			},
		},
	},
};

const getImages = (obj, className, catName) => {
	
	let myClass = null;
	let myCat = null;
	if (className) {
	
		myClass = className;
		obj.spriteClass = className;
	}
	if (catName) {
	
		myCat = catName;
		obj.spriteCat = catName;
	}
	if (obj.url) {
		
		const drawing = new Image();
		drawing.src = spritePath + obj.url;
		obj.drawing = drawing;
		if (obj.index) {
		
			spriteMap[obj.index] = obj;
		}
	}
	else {
		
		for (let key in obj) {
			
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
			if (typeof obj[key] === 'object') {
			
				obj[key].key = key;
				getImages(obj[key], myClass, myCat);
			}
		}
	}
}

getImages(sprites);

const drawLevel = (level, loadOnly) => {
	
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

	const levelRows = level.split('\n');

	fieldSize[1] = levelRows.length*tileSize;
	for (let row = 0; row < levelRows.length; row++) {
	
		let levelRow = [];
		let rawLevelRow = [];
		const rowString = levelRows[row];
		if (rowString.length > fieldSize[0]) {
		
			fieldSize[0] = rowString.length*tileSize;
		}
		for (let col = 0; col < rowString.length; col++) {
		
			let char = rowString.charAt(col);
			if (spriteMap[char]) {
			
				if (playerKeys.indexOf(char) < 0) {
			
					rawLevelRow.push(char);
				}
				else {
			
					rawLevelRow.push(' ');
					playerIndexes.push(char);
					const tmpPlayer = {
						'sprite': spriteMap[char],
						'pos': [col, row],
						'goal': [col, row],
						'offsetX': 0,
						'offsetY': 0,
						'direction': null,
						'animFrame': 0,
						'spriteIndex': char
					};
					players.push(tmpPlayer);
					playerCount = players.length;
					if (char == '0') {
					
						player = tmpPlayer;
						currentPlayer = players.length-1;
					}
				}
				levelRow.push({
					'sprite': spriteMap[char],
					'col': col,
					'row': row
				});
			}
			else {
		
				rawLevelRow.push(' ');
				const blockField = {
					'sprite': spriteMap['Z'],
					'col': col,
					'row': row,
					'key': char
				};
				if (char.charCodeAt(0) > 190) {
					
					char = String.fromCharCode(char.charCodeAt(0)-64);
				}
				if (!blocks[char]) {
			
					let width = 0;
					let height = 0;
					let tmpRow = row;
					let tmpCol = col;
					while (levelRows[tmpRow] && levelRows[tmpRow].charAt(tmpCol) == char) {
					
						height++;
						tmpRow++;
					}
					while (rowString.charAt(tmpCol) == char) {
					
						width++;
						tmpCol++;
					}
					blocks[char] = {
						'size': [width, height],
						'pos': [col, row],
						'goal': [col, row],
						'offsetX': 0,
						'offsetY': 0
					};
					const tmpCanvas = getBlockCanvas(blocks[char]);
					if (tmpCanvas) {
						blocks[char].canvas = tmpCanvas;
					}
				}
				levelRow.push(blockField);
			}
		}
		levelMap.push(levelRow);
		levelArray.push(rawLevelRow);
	}

	if (!loadOnly) {
		
        document.body.innerHTML = '<canvas id="playground"></canvas><img id="btnHelp" src="img/btn-help.png"/>';
		canvas = document.getElementById('playground');
		canvas.width = fieldSize[0];
		canvas.height = fieldSize[1];
		context = canvas.getContext('2d');

		updateCollisionMaps();
		resize();
        document.getElementById('btnHelp').addEventListener(('ontouchstart' in window) ? 'touchstart' : 'click', (e) => {

            openHelp(e.type === 'touchstart');
        }, ('ontouchstart' in window) ? {passive: true} : false);    

		backgroundCanvas = drawBackground();
		drawPlayground();
		isJumping = true;
		if (!startTime) {
		
			startTime = new Date();
		}
	}
}

const openHelp = (isTouch) => {

	if (!isPaused) {

		isPaused = true;

        const helpContainer = document.createElement('div');
        helpContainer.id = 'help';
        ['click', 'touchtart'].forEach(eventName => {
            helpContainer.addEventListener(eventName, closeHelp);
        });
        helpContainer.style.display = 'block';

        const helpContent = document.createElement('div');
        helpContent.className = 'content';

        const helpTitle = document.createElement('h1');
        helpTitle.innerText = 'Controls';

        const helpTable = document.createElement('table');
        const helpTableBody = document.createElement('tbody');

        [{
            imgSrc: isTouch ? 'img/touch-swipe.png' : 'img/keys-cursor.png',
            text: 'Moves your vegetable up, right, down or left'
        }, {
            imgSrc: isTouch ? 'img/touch-double-tap.png' : 'img/keys-shift.png',
            text: 'Switches to next vegetable if available'
        }, {
            imgSrc: isTouch ? 'img/touch-multi-tap.png' : 'img/keys-backspace.png',
            text: 'Makes your last move undone'
        }].forEach(rowContent => {
            const helpTableRow = document.createElement('tr');

            const rowHeader = document.createElement('th');

            const rowImage = document.createElement('img');
            rowImage.src = rowContent.imgSrc;

            const rowData = document.createElement('td');
            rowData.innerText = rowContent.text;

            rowHeader.appendChild(rowImage);
            helpTableRow.appendChild(rowHeader);
            helpTableRow.appendChild(rowData);
            helpTableBody.appendChild(helpTableRow);
        });

        helpContainer.appendChild(helpContent);
        helpContent.appendChild(helpTitle);
        helpContent.appendChild(helpTable);
        helpTable.appendChild(helpTableBody);

        document.body.insertAdjacentElement('beforeend', helpContainer);

        resize();
	}
	else {

		closeHelp();
	}
}

const closeHelp = () => {

    const helpNode = document.getElementById('help');
    helpNode.parentNode.removeChild(helpNode);
	isPaused = false;
}

const drawGameSelection = () => {
	
    const divSelectionWrapper = document.createElement('div');
    divSelectionWrapper.className = 'selectionWrapper';

    const divSelection = document.createElement('div');
    divSelection.className = 'selection';

    const titleElem = document.createElement('h1');
    titleElem.innerText = 'Choose game:';

    const gamesList = document.createElement('ul');
    gamesList.id = 'gameSelection';
    gamesList.className = 'selection';

    const backLink = document.createElement('a');
    backLink.className = 'backLink';
    backLink.href = '#';
    backLink.innerText = 'Back';

    for (var i = 0; i < originData.length; i++) {
        
        const listEntry = document.createElement('li');
        listEntry.style.backgroundImage = 'url(' + originData[i].background + ')';

		const gameLink = document.createElement('a');
		gameLink.href = '#game' + originData[i].id;
		gameLink.innerText = originData[i].name;	
		listEntry.appendChild(gameLink);

        gamesList.appendChild(listEntry);
    }

    divSelectionWrapper.appendChild(divSelection);
    divSelection.appendChild(titleElem);
    divSelection.appendChild(gamesList);
    divSelection.appendChild(backLink);
    document.body.appendChild(divSelectionWrapper);
}

const drawDifficultySelection = (originId) => {
	
    const difficulties = getDifficultiesByOrigin(originId);

    const divSelectionWrapper = document.createElement('div');
    divSelectionWrapper.className = 'selectionWrapper';

    const divSelection = document.createElement('div');
    divSelection.className = 'selection';

    const titleElem = document.createElement('h1');
    titleElem.innerText = 'Choose difficulty:';

    const difficultiesList = document.createElement('ul');
    difficultiesList.id = 'difficultySelection';
    difficultiesList.className = 'selection';

    const backLink = document.createElement('a');
    backLink.className = 'backLink';
    backLink.href = '#games';
    backLink.innerText = 'Back';

	const maxLevel = sessionStorage.getItem('maxLevel_' + (originId - 1));
	const maxDifficulty = parseInt(maxLevel, 10) / 10;

    for (let i = 0; i < difficulties.length; i++) {

        const listEntry = document.createElement('li');

        const gameLink = document.createElement('a');
		if (i <= maxDifficulty) {
			gameLink.href = '#difficulty' + originId + '|' + difficulties[i].id;
		}
        gameLink.innerText = difficulties[i].name;

        listEntry.appendChild(gameLink);
        difficultiesList.appendChild(listEntry);
    }

    divSelectionWrapper.appendChild(divSelection);
    divSelection.appendChild(titleElem);
    divSelection.appendChild(difficultiesList);
    divSelection.appendChild(backLink);
    document.body.appendChild(divSelectionWrapper);        
}

const drawLevelSelection = (originId, difficultyId) => {
	
    const levels = getLevelsByOriginDifficulty(originId, difficultyId);

    const divSelectionWrapper = document.createElement('div');
    divSelectionWrapper.className = 'selectionWrapper';

    const divSelection = document.createElement('div');
    divSelection.className = 'selection';

    const titleElem = document.createElement('h1');
    titleElem.innerText = 'Choose level:';

    const levelList = document.createElement('ul');
    levelList.id = 'levelSelection';

    const backLink = document.createElement('a');
    backLink.className = 'backLink';
    backLink.href = '#game' + originId;
    backLink.innerText = 'Back';

	const maxLevel = sessionStorage.getItem('maxLevel_' + (originId - 1));

    for (let i = 0; i < levels.length; i++) {

        const listEntry = document.createElement('li');
        listEntry.id = 'levelLink' + levels[i].id;

        const gameLink = document.createElement('a');
		if (parseInt(levels[i].id, 10) <= maxLevel) {
			gameLink.href = '#level' + levels[i].id;
		}

        const gamePreview = document.createElement('div');
        gamePreview.className = 'canvasContainer';

        drawLevel(levels[i].data, true);
        const iconCanvas = document.createElement('canvas');
        iconCanvas.width = levelMap[0].length*tileSize;
        iconCanvas.height = levelMap.length*tileSize;

        const iconContext = iconCanvas.getContext('2d');			
        iconContext.drawImage(drawBackground(), 0, 0);
        iconContext.drawImage(drawPlaygroundCanvas(), 0, 0);
        
        // translate context to center of canvas
        iconContext.translate(iconCanvas.width / 2, iconCanvas.height / 2);

        // scale y component
        // iconContext.scale(1, 0.5);			
        
        iconContext.scale(1/tileSize, 1/tileSize);

        gamePreview.append(iconCanvas);
        gameLink.appendChild(gamePreview);
        gameLink.insertAdjacentText('beforeend', levels[i].number);
        listEntry.appendChild(gameLink);
        levelList.appendChild(listEntry);
    }

    divSelectionWrapper.appendChild(divSelection);
    divSelection.appendChild(titleElem);
    divSelection.appendChild(levelList);
    divSelection.appendChild(backLink);
    document.body.appendChild(divSelectionWrapper);
}

const drawPlaygroundCanvas = () => {
	
	const playgroundCanvas = document.createElement('canvas');
	playgroundCanvas.width = levelMap[0].length*tileSize;
	playgroundCanvas.height = levelMap.length*tileSize;
	const playgroundContext = playgroundCanvas.getContext('2d');	
	let col, row;
	for (row = 0; row < levelArray.length; row++) {
		
		const levelRow = levelArray[row];
		for (col = 0; col < levelRow.length; col++) {
			
			const sprite = spriteMap[levelArray[row][col]];
			if (sprite && sprite.drawing && sprite.index != ' ' && sprite.index != '3' && sprite.index != 'Z' && spriteMap[sprite.index] && (bgKeys.indexOf(sprite.index) == -1)) {

				let tmpRow = row;
				let tmpCol = col;
				if (sprite.spriteClass == 'rotation') {
					
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
	for (let elem in blocks) {

		const block = blocks[elem];
		const startX = block.pos[0]*tileSize;
		const startY = block.pos[1]*tileSize;
		try {
			playgroundContext.drawImage(block.canvas, startX + block.offsetX, startY + block.offsetY);
		} catch (e) {
			// console.log(elem);
		}
	}
	return playgroundCanvas;
}

const loadLevel = (levelId) => {
	
	levelNr = levelId;
    level = getLevelById(levelId);
    setTimeout(function() {
        
        drawLevel(level.data);
    }, 1000);
}

const drawBackground = () => {
	
	const bgCanvas = document.createElement('canvas');
	bgCanvas.width = levelMap[0].length*tileSize;
	bgCanvas.height = levelMap.length*tileSize;
	const bgContext = bgCanvas.getContext('2d');	
	let col, row;
	for (row = 0; row < levelMap.length; row++) {
		
		const levelRow = levelMap[row];
		for (col = 0; col < levelRow.length; col++) {
			
			levelRow[col].collisions = [];
			const sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing) {

				let drawing = sprite.drawing;
				if (bgKeys.indexOf(sprite.index) == -1) {
					
					if (sprite.index.charCodeAt(0) > 190) {
						
						drawing = spriteMap['3'].drawing;
					}
					else {
						
						drawing = spriteMap[' '].drawing;
					}
				}
				const pos = [
					((tileSize / 2)+(col*tileSize))-(tileSize/2), 
					((tileSize / 2)+(row*tileSize))-(tileSize/2)
				];
				bgContext.drawImage(drawing, pos[0], pos[1]);
			}
		}
	}
	return bgCanvas;
}

const getBlockCanvas = (block) => {
	
	if (block) {
		const blockCanvas = document.createElement('canvas');
		const blockContext = blockCanvas.getContext('2d');
		const sprite = spriteMap['Z'];
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
	else {
		return null;
	}
}

const drawPlayground = () => {
	
	gameLoop = requestAnimationFrame(drawPlayground);
	context.clearRect(0, 0, fieldSize[0], fieldSize[1]);
	// draw background
	context.drawImage(backgroundCanvas, 0, 0);
	for (let row = 0; row < levelMap.length; row++) {
		
		const levelRow = levelMap[row];
		for (let col = 0; col < levelRow.length; col++) {
			
			levelRow[col].collisions = [];
			const sprite = levelRow[col].sprite;
			if (sprite && sprite.drawing && sprite.index != ' ' && sprite.index != '3') {

				const pos = [
					(tileSize / 2)+(col*tileSize), 
					(tileSize / 2)+(row*tileSize)
				];
				// player sprites
				let isPlayer = false;
				for (let i = 0; i < playerCount; i++) {
					
					if (sprite.index == players[i].spriteIndex) {
					
						isPlayer = true;
					}
				}
				// draw moveable blocks
				if (!isPlayer) {
					
					// all others
					if (bgKeys.indexOf(sprite.index) == -1 && playerKeys.indexOf(sprite.index) == -1 && sprite.spriteClass != 'block') {
					
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
	for (let elem in blocks) {

		const block = blocks[elem];
		const startX = block.pos[0]*tileSize;
		const startY = block.pos[1]*tileSize;
		try {
			context.drawImage(block.canvas, startX+block.offsetX, startY+block.offsetY);
		} catch (e) {
			// console.log(blocks, block);
		}
	}
	// draw players
	for (let i = 0; i < playerCount; i++) {
		
		const otherPlayer = players[i];
		if (otherPlayer.sprite) {
				
			context.drawImage(otherPlayer.sprite.altSprites[Math.round(otherPlayer.animFrame/animSpeed)].drawing, (otherPlayer.pos[0]*tileSize)+otherPlayer.offsetX, (otherPlayer.pos[1]*tileSize)+otherPlayer.offsetY);	
		}
	}
	updateCollisionMaps();
	animate();
}

const animate = () => {

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
	if (!isGoingBack && !enteredGoal && levelArray[player.pos[1]][player.pos[0]] == '2') {
	
		enterGoal();
	}
	if (enteredGoal) {
		
		player.sprite.key++;
		let index = Math.floor(player.sprite.key/animSpeed);
		let direction = player.sprite.spriteCat;
		if (index >= player.sprite.altSprites.length) {
			
			player.sprite.key = 0;
			index = 0;
			direction = rotations[(rotationIndexByKey(player.sprite.spriteCat)+1)%rotations.length].key;
		}
		player.sprite = sprites[player.sprite.spriteClass][direction][index];
	}
	else {
		
		for (let row = 0; row < levelMap.length; row++) {
		
			const levelRow = levelMap[row];
			for (let col = 0; col < levelRow.length; col++) {
		
				let sprite = levelRow[col].sprite;
				const rotation = levelRow[col].rotation;
				if (rotation && (rotation.current != rotation.goal)) {
		
					// get current rotation index
					let index = rotationIndexByKey(sprite.key);
					let nextIndex = index + rotation.direction;
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
							'current': 0,
							'goal': 0,
							'direction': 0
						};
						levelRow[col].sprite = sprite;
					}
				}
			}
		}
		// move blocks
		for (let elem in blocks) {
		
			const block = blocks[elem];
			const oldPos = [block.pos[0], block.pos[1]];
			if (block.direction) {
			
				switch (block.direction.key) {
		
					case 'up':
						block.offsetY -= playerSpeed;
						if (block.offsetY <= (-1*tileSize)) {
		
							block.offsetY += tileSize;
							block.pos[1]--;
						}
						break;
				
					case 'right':
						block.offsetX += playerSpeed;
						if (block.offsetX >= tileSize) {
		
							block.offsetX -= tileSize;
							block.pos[0]++;
						}
						break;
				
					case 'down':
						block.offsetY += playerSpeed;
						if (block.offsetY >= tileSize) {
		
							block.offsetY -= tileSize;
							block.pos[1]++;
						}
						break;
				
					case 'left':
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
					levelMap[block.pos[1]][block.pos[0]].sprite = spriteMap['Z'];
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
			let oldPos = [player.pos[0], player.pos[1]];
			switch (player.direction.key) {
		
				case 'up':
					player.offsetY -= playerSpeed;
					if (player.offsetY < (-1*tileSize)) {
		
						player.offsetY += tileSize;
						player.pos[1]--;
					}
					break;
				
				case 'right':
					player.offsetX += playerSpeed;
					if (player.offsetX > tileSize) {
		
						player.offsetX -= tileSize;
						player.pos[0]++;
					}
					break;
				
				case 'down':
					player.offsetY += playerSpeed;
					if (player.offsetY > tileSize) {
		
						player.offsetY -= tileSize;
						player.pos[1]++;
					}
					break;
				
				case 'left':
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
				levelMap[oldPos[1]][oldPos[0]].sprite = spriteMap[' '];
				oldPos = [player.pos[0], player.pos[1]];
				isGoingBack = false;
			}
		}
	}
}

const checkPlayerCanMove = (direction) => {

	const undoMove = [];
	let canPass = true;
	let restorePlayerOnUndo;
	let tmpGoal = [player.pos[0], player.pos[1]];
    let centerField, rotDirection;
	if (direction) {
	
		// define temporary goal position

		// find sprite 2 ahead in the same direction
		let afterNext = [tmpGoal[0], tmpGoal[1]];
		switch (direction.key) {
		
			case 'up':
				tmpGoal[1]--;
				afterNext[1] = tmpGoal[1] - 1;
				break;
				
			case 'right':
				tmpGoal[0]++;
				afterNext[0] = tmpGoal[0] + 1;
				break;
				
			case 'down':
				tmpGoal[1]++;
				afterNext[1] = tmpGoal[1] + 1;
				break;
				
			case 'left':
				tmpGoal[0]--;
				afterNext[0] = tmpGoal[0] - 1;
				break;
		}
		let afterNextField = null;
		if (afterNext && levelMap[afterNext[1]] && levelMap[afterNext[1]][afterNext[0]]) {
			
			afterNextField = levelMap[afterNext[1]][afterNext[0]];
		}
		let goalField = levelMap[tmpGoal[1]][tmpGoal[0]];

		if (goalField.collisions && goalField.collisions.length > 0) {
			
			for (let collisionCount = 0; collisionCount < goalField.collisions.length; collisionCount++) {
	
				rotDirection = 0;
				let collision = goalField.collisions[collisionCount];
				centerField = collision.collider;
				if (centerField) {
					
					if (!centerField.rotation) {

						centerField.rotation = {
							'goal': 0,
							'current': 0,
							'direction': 0
						};
					}
					if (afterNextField.sprite.spriteClass != 'rotation') {
					
						if (collision.key == '+') {
					
							switch (direction.key) {
						
								case 'up':
									rotDirection--
									break;
						
								case 'right':
									rotDirection++
									break;
						
								case 'down':
									rotDirection++
									break;
						
								case 'left':
									rotDirection--
									break;
							}
						}
						else if (collision.key == '-') {
					
							switch (direction.key) {
						
								case 'up':
									rotDirection++
									break;
						
								case 'right':
									rotDirection--
									break;
						
								case 'down':
									rotDirection--
									break;
						
								case 'left':
									rotDirection++
									break;
							}
						}
					}
					else if (collision.key == '-' || collision.key == '+') {
					
						canPass = false;
					}
					
					if (rotDirection != 0) {
				
						// check for blocking elements
						const collisionRows = centerField.sprite.collisionMap.split('\n');
						for (let row = 0; row < collisionRows.length; row++) {
						
							for (let col = 0; col < collisionRows[row].length; col++) {
							
								const collisionChar = collisionRows[row].charAt(col);
								if (
									(collisionChar == 'r' && rotDirection > 0) ||
									(collisionChar == 'l' && rotDirection < 0) ||
									(collisionChar == '=')
									){
								
									const currentSprite = levelMap[centerField.row+(row-1)][centerField.col+(col-1)];
									if (currentSprite.sprite.index != ' ' &&
									 	currentSprite.sprite.index != '3' &&
									 	currentSprite.sprite.index != player.sprite.index) {
										canPass = false;
									}
									else if (currentSprite.collisions) {
									
										for (let c = 0; c < currentSprite.collisions.length; c++) {
										
											if ((currentSprite.collisions[c].collider != centerField) &&
												(currentSprite.collisions[c].key == '+' || 
												currentSprite.collisions[c].key == '-')) {
											
												canPass = false;
											}
										}
									}
								}
							}
						}
						if (canPass) {
						
							let index = rotationIndexByKey(centerField.sprite.key);

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
							const nextSprite = centerField.sprite.altSprites[rotations[index].key];
							const offset = [(tmpGoal[0] - centerField.col)+1, (tmpGoal[1] - centerField.row)+1];
							if (nextSprite) {
								
								const collisionRows = nextSprite.collisionMap.split('\n');
								const tmpCollision = collisionRows[offset[1]].charAt(offset[0]);
								if (
									(tmpCollision == '-') ||
									(tmpCollision == '+')
									) {
								
									switch (player.direction.key) {
					
										case 'up':
											tmpGoal[1]--;
											break;
					
										case 'right':
											tmpGoal[0]++;
											break;
					
										case 'down':
											tmpGoal[1]++;
											break;
					
										case 'left':
											tmpGoal[0]--;
											break;
									}									
								}
							}
							
							if (centerField.rotation.angle != 0) {
								
								centerField.rotation.direction = rotDirection;
								undoMove.push({
			
									'tile': centerField,
									'rotation': {
										'goal': centerField.rotation.goal * -1,
										'current': 0,
										'direction': (rotDirection * -1)
									}
								});
							}
						}
					}
				}
			}
		}
		
		if (canPass) {
		
			if (goalField.sprite.spriteClass == 'goal' || levelArray[tmpGoal[1]][tmpGoal[0]] == '2') {
			
				canPass = true;
				restorePlayerOnUndo = currentPlayer;
			}
			else if (goalField.key) {
				
				if (levelArray[tmpGoal[1]][tmpGoal[0]] != '3') {
				
					const block = blocks[goalField.key];
					let neighbours = [];
					let newPos = [block.pos[0], block.pos[1]];
					switch (direction.key) {
				
						case 'up':
							
							for (let col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
								
								neighbours.push(levelMap[block.pos[1]-1][col]);
							}
							newPos[1]--;
							break;
						
						case 'right':
							
							for (let row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
								
								neighbours.push(levelMap[row][block.pos[0]+block.size[0]]);
							}
							newPos[0]++;
							break;
						
						case 'down':
							
							for (let col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
								
								neighbours.push(levelMap[block.pos[1]+block.size[1]][col]);
							}
							newPos[1]++;
							break;
						
						case 'left':

							for (let row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
								
								neighbours.push(levelMap[row][block.pos[0]-1]);
							}
							newPos[0]--;
							break;
					}
					for (let neighbourCount = 0; neighbourCount < neighbours.length; neighbourCount++) {
						
						const neighbour = neighbours[neighbourCount];
						if (neighbour.sprite.index != ' ' && neighbour.sprite.index != '3') {
						
							canPass = false;
						}
						if (neighbour && neighbour.collisions && neighbour.collisions.length) {
						
							for (let collisionCount = 0; collisionCount < neighbour.collisions.length; collisionCount++) {
						
								if (
									neighbour.collisions[collisionCount].key == '+' ||
									neighbour.collisions[collisionCount].key == '-'
									) {
						
									canPass = false;
								}
							}
						}
					}
					if (canPass) {
						
						undoMove.push({
							
							'key': goalField.key,
							'pos': [newPos[0], newPos[1]],
							'goal': [block.pos[0], block.pos[1]],
							'direction': rotations[(rotationIndexByKey(direction.key)+2)%rotations.length]
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
				(goalField.sprite.index == ' ') &&
				(levelArray[tmpGoal[1]][tmpGoal[0]] == ' ')
				) {

				if (goalField.collisions && goalField.collisions.length > 0) {
					
					for (let collisionCount = 0; collisionCount < goalField.collisions.length; collisionCount++) {
					
						if (goalField.collisions[collisionCount].key == '+' &&
							goalField.collisions[collisionCount].key == '-') {
								
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
			
			'playerIndex': currentPlayer,
			'restore': restorePlayerOnUndo,
			'tile': player,
			'pos': [tmpGoal[0], tmpGoal[1]],
			'goal': [player.pos[0], player.pos[1]],
			'direction': rotations[(rotationIndexByKey(player.direction.key)+2)%rotations.length]
		});
		player.goal = tmpGoal;
		undoSteps.push(undoMove);
	}
	else {
		
		player.goal = player.pos;
		if (centerField) {
			
			centerField.rotation = {
				'goal': 0,
				'current': 0,
				'direction': 0
			};
		}
	}
}

const enterGoal = () => {
	
	enteredGoal = true;
	window.setTimeout(() => {
		
		if (playerCount > 1) {
		
			const sprite = levelMap[player.pos[1]][player.pos[0]].sprite;
			levelMap[player.pos[1]][player.pos[0]] = {
			
				'sprite': spriteMap['2'],
				'col': player.pos[0],
				'row': player.pos[1]
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

const endLevel = () => {
	
	enteredGoal = false;
	if (startTime) {
		
		const timeSpent = Math.floor((new Date()-startTime)/1000);
		startTime = null;
		cancelAnimationFrame(gameLoop);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'contentWrapper';

        for (let i = 0; i < playerKeys.length; i++) {

            const key = playerKeys[i];
            if (levelString.indexOf(key) > -1) {

                const player = spriteMap[key].spriteClass.replace('player-', '');
                const playerImage = document.createElement('img');
                playerImage.src = 'img/' + player + '.png';
                playerImage.className = player;
                contentWrapper.appendChild(playerImage);
            }
        }

        const contentNode = document.createElement('div');
        contentNode.className = 'content';

        contentWrapper.appendChild(contentNode);

        const contentTitle = document.createElement('h1');
        contentTitle.innerText = 'Well done!';

        contentNode.appendChild(contentTitle);

        const contentTable = document.createElement('table');

        [{
            title: 'Moves:',
            content: undoSteps.length
        }, {
            title: 'Time:',
            content: timeSpent ? timeSpent : '0:00'
        }].forEach(data => {
            const tableRow = document.createElement('tr');

            const tableRowHeading = document.createElement('th');
            tableRowHeading.innerText = data.title;

            const tableRowData = document.createElement('td');
            tableRowData.innerText = data.content;

            tableRow.appendChild(tableRowHeading);
            tableRow.appendChild(tableRowData);
            contentTable.appendChild(tableRow);
        });

        contentNode.appendChild(contentTable);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';

		const maxLevel = sessionStorage.getItem('maxLevel_' + (levelNr > 30 ? 1 : 0));

		if (maxLevel <= levelNr) {
			const nextLevel = levelNr + 1;
			sessionStorage.setItem('maxLevel_' + (levelNr > 30 ? 1 : 0), nextLevel);
			setCookie(
				"progress",
				levelNr > 30
					? sessionStorage.getItem('maxLevel_0') + '|' + nextLevel
					: nextLevel + '|' + sessionStorage.getItem('maxLevel_1')
			  );
		}

        const retryButton = document.createElement('a');
        retryButton.className = 'btnRetry';
        retryButton.innerText = 'Retry';
        retryButton.href = '#level' + levelNr;
        retryButton.addEventListener(
            ('ontouchstart' in window) ? 'touchstart' : 'click',
            () => { window.location.reload(); },
            ('ontouchstart' in window) ? {passive: true} : false
        );

        const continueButton = document.createElement('a');
        continueButton.className = 'btnContinue';
        continueButton.innerText = 'Continue';
        continueButton.href = '#level' + (levelNr + 1);

        buttonContainer.appendChild(retryButton);
        buttonContainer.appendChild(continueButton);
        contentNode.appendChild(buttonContainer);
        document.body.innerHTML = '';
        document.body.appendChild(contentWrapper);
	}
}

const updateBlocks = () => {

	const undo = [];
	for (let row = 0; row < levelMap.length; row++) {
		
		const levelRow = levelMap[row];
		for (let col = 0; col < levelRow.length; col++) {
		
			const sprite = levelRow[col].sprite;
			if (sprite.spriteClass == 'block' || (levelRow[col].key && blocks[levelRow[col].key])) {
							
				levelRow[col].sprite = spriteMap[levelArray[row][col]];
				levelRow[col].col = col;
				levelRow[col].row = row;
				delete(levelRow[col].key);
			}
		}
	}
	for (let elem in blocks) {
	
		const block = blocks[elem];
		let blockFills = true;
		if (block.pos[1] >= 0) {
			
			for (let row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
		
				for (let col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {
				
					if (levelArray[row][col] != '3') {
				
						blockFills = false;
					}
					levelMap[row][col] = {
						'sprite': spriteMap['Z'],
						'col': col,
						'row': row,
						'key': elem
					}
				}
			}
		}
		else {
			
			blockFills = false;
		}
		if (blockFills && !isGoingBack) {
		
			for (let row = block.pos[1]; row < block.pos[1]+block.size[1]; row++) {
			
				for (let col = block.pos[0]; col < block.pos[0]+block.size[0]; col++) {

					undoSteps[undoSteps.length-1].push({
						'sprite': spriteMap['3'],
						'col': col,
						'row': row
					});
					const sprite = spriteMap[' '];
					delete(levelMap[row][col].key);
					levelArray[row][col] = ' ';
					levelMap[row][col] = {
						'sprite': sprite,
						'col': col,
						'row': row
					}
					const pos = [
						((tileSize / 2)+(col*tileSize))-(tileSize/2), 
						((tileSize / 2)+(row*tileSize))-(tileSize/2)
					];
					backgroundCanvas.getContext('2d').drawImage(sprite.drawing, pos[0], pos[1]);
				}
			}
			blocks[elem].pos = [-100, -100];
			blocks[elem].goal = blocks[elem].pos;
		}
	}
	return undo;
}

const updateCollisionMaps = () => {

	for (let row = 0; row < levelMap.length; row++) {
		
		const levelRow = levelMap[row];
		for (let col = 0; col < levelRow.length; col++) {
		
			const sprite = levelRow[col];
			if (sprite && sprite.sprite.spriteClass == 'rotation') {
		
				const collisionMap = sprite.sprite.collisionMap.split('\n');
				for (let innerRow = 0; innerRow < collisionMap.length; innerRow++) {
				
					const collisionRow = collisionMap[innerRow];
					for (let innerCol = 0; innerCol < collisionRow.length; innerCol++) {
					
						const collision = collisionRow.charAt(innerCol);
						const neighbourBlock = levelMap[row+(innerRow-1)][col+(innerCol-1)];
						if (neighbourBlock && neighbourBlock.collisions) {
							
							neighbourBlock.collisions.push({
								'key': collision,
								'collider': sprite
							});
						}
					}
				}
			}
		}
	}
}

const switchPlayers = () => {

	if (playerCount > 1) {
		
		currentPlayer = (currentPlayer+1)%playerCount;
		player = players[currentPlayer];
		isJumping = true;
	}
}

const goBack = () => {
	
	if (undoSteps.length > 0) {
		
		const undoStep = undoSteps.pop();
		for (let i = 0; i < undoStep.length; i++) {
		
			const undo = undoStep[i];
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
					
					const block = blocks[undo.key];
					block.pos = undo.pos;
					block.goal = undo.goal;
					block.direction = undo.direction;
					if (block.pos[0] >= 0) {
						
						levelMap[block.pos[1]][block.pos[0]].key = undo.key;
						levelMap[block.pos[1]][block.pos[0]].sprite = spriteMap['Z'];
					}
				}
			}
			else if (undo.rotation) {
			
				undo.tile.rotation = undo.rotation;
			}
			else {
				
				levelArray[undo.row][undo.col] = '3';
				const pos = [
					((tileSize / 2)+(undo.col*tileSize))-(tileSize/2), 
					((tileSize / 2)+(undo.row*tileSize))-(tileSize/2)
				];
				backgroundCanvas.getContext('2d').drawImage(undo.sprite.drawing, pos[0], pos[1]);
			}
		}
		isGoingBack = true;
		handlePlayerMovement();
		updateBlocks();
		updateCollisionMaps();
	}
}

const checkHash = () => {
	levelNr = parseInt(window.location.hash.replace('#level', ''), 10);
	const maxLevel = sessionStorage.getItem('maxLevel_' + [levelNr > 30 ? 1 : 0]);
	if (window.location.hash.indexOf('#level') > -1 && !isNaN(levelNr) && levelNr <= maxLevel) {		
        document.body.innerHTML = '';
		loadLevel(levelNr);
	}
	else if (window.location.hash.indexOf('#games') > -1) {
		
        document.body.innerHTML = '';
		drawGameSelection();
	}
	else if (window.location.hash.indexOf('#game') > -1) {
		
        document.body.innerHTML = '';
		const game = parseInt(window.location.hash.replace('#game', ''), 10);
		if (!isNaN(game)) {
			
			drawDifficultySelection(game);
		}
	}
	else if (window.location.hash.indexOf('#difficulty') > -1) {
		
        document.body.innerHTML = '';
		const difficulty = window.location.hash.replace('#difficulty', '').split('|');
		if (difficulty.length > 1) {
			
			drawLevelSelection(difficulty[0], difficulty[1]);
		}
	}
	else {
		
        document.body.innerHTML = '';
		window.location.hash = '';
		levelNr = 1;

        const titleLink = document.createElement('a');
        titleLink.href = '#games';
        titleLink.id = 'title';

        const titleImage = document.createElement('img');
        titleImage.src = 'img/title.png';

        titleLink.appendChild(titleImage);
        document.body.appendChild(titleLink);
	}
	resize();
}

const resize = () => {
	
    if (!document.querySelector('.selection')) {
        
        if (canvas) {
    
            const offset = [(window.innerWidth-canvas.width)/2, (window.innerHeight-canvas.height)/2];
            canvas.style.position = 'absolute';
            canvas.style.top = offset[1] + 'px';
            canvas.style.left = offset[0] + 'px';
    
            document.body.style.backgroundPosition = offset[0] + 'px ' + offset[1] + 'px';

            const btnHelp = document.getElementById('btnHelp');
            if (btnHelp) {
                btnHelp.style.top = offset[1] + 'px';
                btnHelp.style.left = offset[0] + 'px';    
            }
            
            const helpContainer = document.getElementById('help');
            if (helpContainer) {

                helpContainer.style.height = window.clientHeight + 'px';
            }

            const helpContent = document.querySelector('#help .content');
            if (helpContent) {
                helpContent.style.marginTop = Math.floor((helpContainer.clientHeight-helpContent.clientHeight)/2) + 'px';
                helpContent.style.marginLeft = Math.floor((helpContainer.clientWidth-helpContent.clientWidth)/2)-(tileSize/2) + 'px';    
            }
        }
    }
}

const handlePlayerMovement = () => {
	
	if (player && player.sprite) {
		
		if (player.direction) {
	
			let sprite = sprites[player.sprite.spriteClass][player.direction.key][0];
			if (isGoingBack) {
				
				const direction = rotations[(rotationIndexByKey(player.direction.key)+2)%rotations.length].key
				sprite = sprites[player.sprite.spriteClass][direction][0];
			}
			sprite.index = playerIndexes[currentPlayer];
			player.sprite = sprite;
			players[currentPlayer].sprite = sprite;
		}
	}
}



['resize', 'orientationchange'].forEach(eventName => {

    window.addEventListener(eventName, resize);
})


document.addEventListener('touchstart', (e) => {
	
	if (player && !player.direction && !enteredGoal && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != '2') {
			
		if (firstTouch != null && new Date()-firstTouch < 300) {

			firstTouch = null;
			switchPlayers();
		}
		if (canvas) {
	
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

document.addEventListener('touchend', (e) => {
		
	if (canvas && !isJumping &&
		levelArray[player.pos[1]][player.pos[0]] != '2') {
		
		if (e.touches.length > 1) {
		
			goBack();
		}
		else if (dragStartPos) {
		
			const touch = e.changedTouches[0];
			const distance = [touch.pageX-dragStartPos[0], touch.pageY-dragStartPos[1]];
			let direction = '';
			if (Math.abs(distance[0]) > Math.abs(distance[1])) { // horizontal movement
			
				if (distance[0] < -1*swipeTolerance) {
				
					direction = 'left';
				}
				else if (distance[0] > swipeTolerance) {
				
					direction = 'right';
				}
			}
			else {
			
				if (distance[1] < -1*swipeTolerance) {
				
					direction = 'up';
				}
				else if (distance[1] > swipeTolerance) {
				
					direction = 'down';
				}
			}
			if (direction != '' && player && !player.direction) {
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

document.addEventListener('mouseup', (e) => {

	mousePressed = false;
	if (tmpBlock) {
		
		blocks[topBlockChar] = tmpBlock;
		topBlockChar = String.fromCharCode(topBlockChar.charCodeAt(0)+1);
	}
	tmpBlock = null;
});

document.addEventListener('keydown', (e) => {

	if(!isPaused) {
		
		e.preventDefault();
		if (player && !player.direction && !enteredGoal && !isJumping &&
			levelArray[player.pos[1]][player.pos[0]] != '2') {
		
			isGoingBack = false;
			switch(e.key) {
		
			case "ArrowLeft":
				player.direction = rotations[3];
				break;

			case 'ArrowUp':
				player.direction = rotations[0];
				break;

			case 'ArrowRight': 
				player.direction = rotations[1];
				break;

			case 'ArrowDown':
				player.direction = rotations[2];
				break;
			}
			checkPlayerCanMove(player.direction);
			handlePlayerMovement();
		}
	}
});

document.addEventListener('keyup', (e) => {

    if(!isPaused) {
		
		e.preventDefault();
		if (player && player.pos && !player.direction && !enteredGoal && !isJumping &&
			levelArray[player.pos[1]][player.pos[0]] != '2') {
		
			switch(e.key) {

			case 'Shift':
				switchPlayers();
				break;

			case 'Backspace':
				goBack();
				break;

			case 'Escape':
				window.location.reload();
				break;

			case 'h':
				openHelp();
				break;
			}
		}
	}
	else if (isPaused && e.keyCode == 72) {

		closeHelp();
	}
});

window.addEventListener('load', () => {

    checkHash();
	window.onhashchange = checkHash;
	resize();
})

