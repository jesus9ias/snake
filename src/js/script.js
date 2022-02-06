var states = {
	playing: 'playing',
	paused: 'paused',
	ended: 'ended'
};

var gameProps = {
	t: null,
	context: '',
	meat: null,
	snake: null,
	time: 0,
	points: 0,
	startTime: 0,
	elapsedTime: 0,
	state: states.playing,
	timeLabel: document.getElementById('time'),
	stateLabel: document.getElementById('state'),
	pauseButton: document.getElementById('pause'),
	pointsLabel: document.getElementById('points')
};

var keys = {
	enter: 13,
	left: 37,
	right: 39,
	pause: 80,
	restart: 82
};

function startGame() {
	setStartTime();
	resetPoints();
	stopTimeout();
	setPlayStatus();
	setContext();
	listenKeyboard();
	createSnake();
	createMeat();	
	cycle();
}

function setStartTime() {
	gameProps.startTime = Date.now();
}

function resetPoints() {
	gameProps.points = 0;
	gameProps.pointsLabel.innerHTML = 0;
}

function stopTimeout() {
	clearTimeout(gameProps.t);
}

function setPlayStatus() {
	setState(states.playing);
}

function setState(state) {
	gameProps.stateLabel.innerHTML = state;
	gameProps.state = state;
}

function setContext() {
	var canvas = document.getElementById('game');
	gameProps.context = canvas.getContext('2d');
}

function listenKeyboard() {
	document.addEventListener('keydown', keyboard);
}

function keyboard(key) {
	if (key.keyCode == keys.pause) {
		pauseOrContinueGame();
	}

	if (key.keyCode == keys.restart) {
		startGame();
	}

	if ([states.paused, states.ended].indexOf(gameProps.state) > -1) return;

	if (key.keyCode == keys.right) {
		gameProps.snake.turnRight();
	}

	if (key.keyCode == keys.left) {
		gameProps.snake.turnLeft();
	}
}

function pauseOrContinueGame() {
	switch (gameProps.state) {
		case states.playing: setState(states.paused);
			printPauseStateText('Continue');
			stopTimeout();
			break;
		case states.paused: setState(states.playing);
			printPauseStateText('Pause');
			fixTime();
			cycle();
			break;
	}
}

function printPauseStateText(text) {
	gameProps.pauseButton.innerHTML = text;
}

function fixTime() {
	gameProps.startTime = Date.now() - gameProps.elapsedTime;
}

function endGame() {
	stopTimeout();
	setState(states.ended);
}

function createSnake() {
	gameProps.snake = new snake();
}

function snake() {
	this.segments = [{
		x: Math.floor(Math.random() * 50) * 10,
		y: Math.floor(Math.random() * 50) * 10
	}];

	this.direction = 'left';

	this.move = () => {
		let i;
		for (i = this.segments.length - 1; i >= 0; i--) {
			if (i === 0) {
				if (this.direction === 'top') {
					this.segments[0].y -= 10;
				}
				if (this.direction === 'right') {
					this.segments[0].x += 10;
				}
				if (this.direction === 'bottom') {
					this.segments[0].y += 10;
				}
				if (this.direction === 'left') {
					this.segments[0].x -= 10;
				}
				if (this.segments[0].x < 0) {
					this.segments[0].x = 490;
				}
				if (this.segments[0].x >= 500) {
					this.segments[0].x = 0;
				}
				if (this.segments[0].y < 0) {
					this.segments[0].y = 490;
				}
				if (this.segments[0].y >= 500) {
					this.segments[0].y = 0;
				}
				if (this.segments
					.filter((segment) => segment.x === this.segments[0].x
						&& segment.y === this.segments[0].y).length > 1) {
					endGame();
				}
			} else {
				this.segments[i].x = this.segments[i - 1].x;
				this.segments[i].y = this.segments[i - 1].y;
			}
		}
	}

	this.turnRight = () => {
		switch (this.direction) {
			case 'top': this.direction = 'right'; break;
			case 'right': this.direction = 'bottom'; break;
			case 'bottom': this.direction = 'left'; break;
			case 'left': this.direction = 'top'; break;
		}
	}

	this.turnLeft = () => {
		switch (this.direction) {
			case 'top': this.direction = 'left'; break;
			case 'left': this.direction = 'bottom'; break;
			case 'bottom': this.direction = 'right'; break;
			case 'right': this.direction = 'top'; break;
		}
	}

	this.tryEat = (theMeat) => {
		return theMeat.x === this.segments[0].x && theMeat.y === this.segments[0].y;
	}

	this.growUp = () => {
		var lastSegment = this.segments[this.segments.length - 1];
		this.segments.push({
			x: lastSegment.x,
			y: lastSegment.y
		});
	}
}

function createMeat() {
	gameProps.meat = new meat();
}

function meat() {
	this.x = Math.floor(Math.random() * 50) * 10;
	this.y = Math.floor(Math.random() * 50) * 10;
}

function cycle() {
	gameProps.context.clearRect(0, 0, 500, 500);
	gameProps.snake.move();

	printTime();
	drawSnake();
	drawMeat();
	tryEat();

	if (gameProps.state === states.playing) {
		gameProps.t = setTimeout(cycle, 100);
	}
}

function printTime() {
	gameProps.elapsedTime = Date.now() - gameProps.startTime;
	gameProps.timeLabel.innerHTML = gameProps.elapsedTime;
}

function drawSnake() {
	gameProps.snake.segments.forEach((segment, i) => {
		if (i === 0) {
			drawSquare(segment.x, segment.y, 10, 10, 'green');
		} else {
			drawSquare(segment.x, segment.y);
		}
	});
}

function drawSquare(x = 0, y = 0, width = 10, height = 10, color = 'black') {
	gameProps.context.fillStyle = color;
	gameProps.context.fillRect(x, y, width, height);
}

function drawMeat() {
	drawSquare(gameProps.meat.x, gameProps.meat.y, 10, 10, 'red');
}

function tryEat() {
	if (gameProps.snake.tryEat(gameProps.meat)) {
		createMeat();
		gameProps.snake.growUp();
		addPoints();
	}
}

function addPoints() {
	gameProps.points += 10;
	gameProps.pointsLabel.innerHTML = gameProps.points;
}


startGame();
