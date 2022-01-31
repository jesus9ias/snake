var states = {
	playing: 'playing',
	paused: 'paused',
	ended: 'ended'
};

var gameProps = {
	context: '',
	snake: null,
	meat: null,
	t: null,
	time: 0,
	state: states.playing,
	points: 0
};

var keys = {
	enter: 13,
	left: 37,
	right: 39,
	pause: 80,
	restart: 82
};

function startGame() {
	stopTimeout();
	setPlayStatus();
	setContext();
	listenKeyboard();
	createSnake();
	createMeat();	
	cycle();
}

function stopTimeout() {
	clearTimeout(gameProps.t);
}

function setPlayStatus() {
	gameProps.state = states.playing;
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
		pauseGame();
	}

	if (key.keyCode == keys.restart) {
		startGame();
	}

	if (gameProps.state === states.paused) return;

	if (key.keyCode == keys.right) {
		gameProps.snake.turnRight();
	}

	if (key.keyCode == keys.left) {
		gameProps.snake.turnLeft();
	}
}

function pauseGame() {
	switch (gameProps.state) {
		case states.playing: gameProps.state = states.paused; stopTimeout(); break;
		case states.paused: gameProps.state = states.playing; cycle(); break;
	}
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

	drawSnake();
	drawMeat();
	tryEat();

	gameProps.t = setTimeout(cycle, 100);
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
	}
}


startGame();
