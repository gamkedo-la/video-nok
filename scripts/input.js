let input, touch;

function initInput() {
	input = new Input(canvas);
	input.init();
}

function playerControl() {
	if (!shooting && input.clicked() && pointInCircle(input.mouse.position, ballOne)) {
		shooting = true;
	}
	
	if (shooting) {
		if (input.mouse.mouseHeld(0)) {
			let aim = {x: input.mouseX - ballOne.x, y: input.mouseY - ballOne.y};
			ballOne.hold(aim);
		}
		
		if (input.released()) {
			console.log('released');
			ballOne.release();
			shooting = false;
		}
	}
	
	if (scoreManager.winner) resetGame();
}

class Input {
	constructor (target) {
		this.mouse = new Mouse(target);
		this.touch = new TouchManager(target)
	}

	init() {
		this.mouse.init();
		this.touch.init();
	}

	update() {
		this.mouse.update(1);
	}

	clicked() {
		return this.mouse.mouseClicked(0);
	}

	released() {
		return this.mouse.mouseReleased(0);
	}

	get mouseX () {
		return this.mouse.position.x;
	}

	get mouseY() {
		return this.mouse.position.y;
	}
}

class Mouse {
	constructor(target) {
		this.sensitivity = 1;
		this.transitionTime = 2;//Number of frames/ticks that will as clicked/released
		this.target = target ? target : window;
		this.moveBuffer = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };
		this.buttonStates = [0, 0, 0];
	}

	init(target) {
		if (target) this.target = target;
		this.target.addEventListener("contextmenu", this.contextMenu.bind(this), false);
		this.target.addEventListener("mousemove", this.moveMouse.bind(this), false);
		this.target.addEventListener("mousedown", this.mouseDown.bind(this), false);
		this.target.addEventListener("mouseup", this.mouseUp.bind(this), false);
	}

	enablePointerLock() {
		this.target.onclick = () => { this.target.requestPointerLock(); }
	}

	get locked() {
		return document.pointerLockElement === this.target;
	}

	contextMenu(evt) {
		evt.preventDefault();
	}

	moveMouse(evt) {
		if (this.locked) {
			this.clearBuffer();
			this.moveBuffer.x += evt.movementX;
			this.moveBuffer.y += evt.movementY;
		} else {
			this.position = this.calculateMousePos(evt);
		}
	}

	mouseDown(evt) {
		if (this.buttonStates[evt.button] < 1) this.buttonStates[evt.button] = 1;
	}

	mouseUp(evt) {
		if (this.buttonStates[evt.button] > -1) this.buttonStates[evt.button] = -1;
	}

	update(dt) {
		for (let m = 0; m < this.buttonStates.length; m++) {
			if (this.buttonStates[m] > 0 && this.buttonStates[m] <= 1 + this.transitionTime) this.buttonStates[m] += dt;
			if (this.buttonStates[m] < 0 && this.buttonStates[m] >= 1 + -this.transitionTime) this.buttonStates[m] -= dt;
		}
	}

	calculateMousePos(evt) {
		const rect = this.target.getBoundingClientRect(),
			root = document.documentElement;

		let mX = evt.clientX - rect.left - root.scrollLeft,
			mY = evt.clientY - rect.top - root.scrollTop;

		return {
			x: mX,
			y: mY
		};
	}

	clearBuffer() {
		this.moveBuffer = {
			x: 0,
			y: 0
		};
	}

	reset() {
		this.clearBuffer();
		this.buttonStates.fill(-1);
	}

	mouseClicked(button) {
		return (this.buttonStates[button] > 0 && this.buttonStates[button] < 1 + this.transitionTime);
	}

	mouseReleased(button) {
		return (this.buttonStates[button] < 0 && this.buttonStates[button] > -1 - this.transitionTime);
	}

	mouseHeld(button) {
		return this.buttonStates[button] > 0;
	}
}

class TouchManager {
	constructor(target) {
		this.target = target ? target : window;
		this.currentTouches = [];
		this.changedTouches = [];
		this.init();
	}

	get active() {
		return this.currentTouches.length > 0;
	}

	init() {
		this.target.addEventListener('touchstart', handleTouchStart.bind(this));
		this.target.addEventListener('touchmove', handleTouchMove.bind(this));
		this.target.addEventListener('touchend', handleTouchEnd.bind(this));
	}

	draw() {
		for (let touch of this.currentTouches) {
			colorCircle(touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop, 25, 'white');
		}
	}
}

function handleTouchStart(evt) {
	evt.preventDefault();
	for (let touch of evt.touches) {
		this.currentTouches.push(copyTouch(touch));

		if (scoreManager.winner) {
			resetGame();
		} else if (pointInCircle(calculateTouchPos(touch), ballOne)) {
			shooting = true;
		}
	}
}

function handleTouchMove(evt) {
	evt.preventDefault();
	for (let touch of evt.changedTouches) {
		for (let i = 0; i < this.currentTouches.length; i++) {
			let current = this.currentTouches[i];
			if (touch.identifier === current.identifier) {
				this.currentTouches[i] = copyTouch(touch);
				if (shooting) {
					let mouse = calculateTouchPos(touch);
					let aim = {x: mouse.x - ballOne.x, y: mouse.y - ballOne.y};
					ballOne.hold(aim);
				}
			}
		}
	}
}

function handleTouchEnd(evt) {
	evt.preventDefault();
	for (let touch of evt.changedTouches) {
		for (let i = this.currentTouches.length-1; i >= 0; i--) {
			let current = this.currentTouches[i];
			if (touch.identifier === current.identifier) {
				this.currentTouches.splice(i, 1);

				if (shooting) {
					let mouse = calculateTouchPos(touch);
					let aim = {x: mouse.x - ballOne.x, y: mouse.y - ballOne.y};
					ballOne.hold(aim);
					ballOne.release();
					shooting = false;
				}
			}
		}
	}
}

function calculateTouchPos(touch) {
	return {x: touch.pageX - canvas.offsetLeft, y: touch.pageY - canvas.offsetTop}
}

function copyTouch({ identifier, pageX, pageY }) {
	return { identifier, pageX, pageY };
}