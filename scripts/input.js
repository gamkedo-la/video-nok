let input, touch;

function initInput() {
	input = new Input(canvas);
	input.init();
}

function playerControl() {
	if (!shooting && input.clicked() && pointInCircle(input.pointer.position, ballOne)) {
		shooting = true;
	}
	
	if (shooting) {
		if (input.held()) {
			let aim = {x: input.pointer.x - ballOne.x, y: input.pointer.y - ballOne.y};
			ballOne.hold(aim);
		}
		
		if (input.released()) {
			ballOne.release();
			shooting = false;
		}
	}
	
	if (scoreManager.winner) resetGame();
}

class Input {
	constructor (target) {
		this.pointer = null;
		this.mouse = new Mouse(target);
		this.touch = new TouchManager(target)
	}

	init() {
		this.mouse.init();
		this.touch.init();
	}

	update() {
		this.mouse.update(1);
		this.touch.update(1);
	}

	clicked() {
		if (this.mouse.mouseClicked(0)) {
			this.pointer = this.mouse;
			return true;
		} else if (this.touch.justTouched()) {
			this.pointer = this.touch;
			return true;
		}

		return false;
	}

	held() {
		return this.mouse.mouseHeld(0) || this.touch.touchHeld();
	}

	released() {
		return this.mouse.mouseReleased(0) || this.touch.touchReleased();
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

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
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
			if (this.buttonStates[m] < 0 && this.buttonStates[m] >= -1 - this.transitionTime) this.buttonStates[m] -= dt;
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
	constructor(element) {
		this.target = element ? element : window;
		this.position = {x: 0, y: 0};
		this.transitionTime = 2;
		this.endedTouches = [];
		this.currentTouches = [];
		this.init();
	}

	get active() {
		return this.currentTouches.length > 0;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	init() {
		this.target.addEventListener('touchstart', this.handleTouchStart.bind(this));
		this.target.addEventListener('touchmove', this.handleTouchMove.bind(this));
		this.target.addEventListener('touchend', this.handleTouchEnd.bind(this));
	}

	update(dt) {
		if (this.currentTouches.length > 0) {
			for (let touch of this.currentTouches) {
				if (touch.lifetime <= this.transitionTime) touch.lifetime += dt;
			}
		}
		for (let i = this.endedTouches.length - 1; i >= 0; i--) {
			let touch = this.endedTouches[i];
			if (touch.lifetime <= this.transitionTime) touch.lifetime += dt;
			else this.endedTouches.splice(i, 1);
		}
	}

	draw() {
		for (let touch of this.currentTouches) {
			colorCircle(touch.pageX - canvas.offsetLeft, touch.pageY - canvas.offsetTop, 5, 'dimgrey');
		}
	}

	justTouched() {
		if (this.currentTouches.length > 0) {
			if (this.currentTouches.find(e => e.lifetime <= this.transitionTime)) return true;	
		}
		return false;
	}

	touchHeld() {
		if (this.currentTouches.length > 0) return true;
		return false;
	}

	touchReleased() {
		if (this.endedTouches.length > 0) return true;
		return false;
	}

	handleTouchStart(evt) {
		evt.preventDefault();
		for (let touch of evt.changedTouches) {
			if (!this.currentTouches.find(e => e.identifier === touch.identifier)) {
				let newTouch = copyTouch(touch);
				newTouch.lifetime = 0;
				this.currentTouches.push(newTouch);
			}
		}
		this.position = this.calculateTouchPos(this.currentTouches[0]);
	}
	
	handleTouchMove(evt) {
		evt.preventDefault();
		for (let touch of evt.changedTouches) {
			let current = this.currentTouches.find(e => e.identifier === touch.identifier);
			if (current) {
				current.pageX = touch.pageX;
				current.pageY = touch.pageY;
			}
		}
		this.position = this.calculateTouchPos(this.currentTouches[0]);
	}
	
	handleTouchEnd(evt) {
		evt.preventDefault();
		for (let touch of evt.changedTouches) {
			for (let i = this.currentTouches.length-1; i >= 0; i--) {
				let current = this.currentTouches[i];
				if (touch.identifier === current.identifier) {
					this.endedTouches.push(touch);
					this.currentTouches.splice(i, 1);
					touch.lifetime = 0;
				}
			}
		}
	}
	
	calculateTouchPos(touch) {
		return {x: touch.pageX - this.target.offsetLeft, y: touch.pageY - this.target.offsetTop}
	}
}

function copyTouch({ identifier, pageX, pageY }) {
	return { identifier, pageX, pageY };
}