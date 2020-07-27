const KEY_Debug = 68; //Press 'D' for Debug to put puck anywhere
const KEY_Replicate_game_scenario = 69 //press 'E' to replicate a game scenario, set puck position and active plaer to specfic values
const KEY_pre_face_off  = 32;

const gameWindow = {
	scale: 1,
	left: 0,
	top: 0,
}

let input;

function initInput() {
	input = new Input(canvas);
	input.init();
}

function playerControl() {
	ctrlAtUIControl = false;
	ctrlAtplayerControl = true;
	ctrlAIControl = false;

	//put a 'tick' for ctrl reaching the function body of player control
	if (!shooting && input.clicked() && pointInCircle(input.pointer.position, puckOne)) {
		shooting = true;
	}
	
	if (shooting) {
		if (input.held()) {
			let aim = new Vector2(input.pointer.x - puckOne.x, input.pointer.y - puckOne.y);
			puckOne.hold(aim);
		}
		
		if (input.released()) {
			let launchVector = new Vector2(input.pointer.x - puckOne.x, input.pointer.y - puckOne.y);
			launchVector.length = clamp(launchVector.length, 0, MAX_SHOT_VELOCITY);
			puckRelease(launchVector);
			shooting = false;
			faceOffActive = false;
		}
	}
}

class Input {
	constructor (target) {
		this.gamepads = new GamePadManager();
		this.keyboard = new Keyboard();
		this.mouse = new Mouse(target);
		this.touch = new TouchManager(target);
		this.pointer = this.mouse;
	}

	init() {
		this.gamepads.init();
		this.keyboard.init();
		this.mouse.init();
		this.touch.init();
	}

	update() {
		this.gamepads.update();
		this.keyboard.update();
		this.mouse.update(1);
		this.touch.update(1);
		if (this.touch.active) this.pointer = this.touch;
		else this.pointer = this.mouse;
	}

	anyPressed() {
		//console.log(this.clicked() + ', ' + this.gamepads.anyPressed() + ', ' + this.keyboard.anyPressed());

		return	(
			this.clicked() ||
			this.gamepads.anyPressed() ||
			this.keyboard.anyPressed()
		);
	}

	clicked() {
		if (this.mouse.mouseClicked(0)) {
			return true;
		} else if (this.touch.justTouched()) {
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

class Keyboard {
	constructor() {
		this._keysPressed = new Set();
		this._keysHeld = new Set();
		this._keysReleased = new Set();
	}

	init() {
		document.addEventListener('keydown', this.keyDown.bind(this));
		document.addEventListener('keyup', this.keyUp.bind(this));
	}

	keyDown(evt) {
		if (!this._keysHeld.has(evt.keyCode)) {
			this._keysPressed.add(evt.keyCode);
		}
	}

	keyUp(evt) {
		this._keysReleased.add(evt.keyCode);
	}

	anyPressed() {
		return (this._keysPressed.size > 0);
	}

	keyPressed(key) {
		//key down this frame, but not last frame
		return (this._keysPressed.has(key));
	}

	keyHeld(key) {
		//key down this frame or last frame
		return (this._keysHeld.has(key));
	}

	keyReleased(key) {
		//key NOT down this frame, but down last frame
		return (this._keysReleased.has(key));
	}

	update() {
		let iterator = this._keysPressed.values();
		let key;
		while((key = iterator.next()).done === false) {
			//Key not held last frame
			if (!this._keysHeld.has(key.value)) {
				this._keysHeld.add(key.value);
			} else {
				//Remove from pressed next frame
				this._keysPressed.delete(key.value);
			}
		}

		iterator = this._keysReleased.values();
		while((key = iterator.next()).done === false) {
			if (this._keysHeld.has(key.value)) {
				this._keysHeld.delete(key.value);
			} else {
				//delete from released the frame after deleting from held
				this._keysReleased.delete(key.value);
			}
		}
	}
}

class Mouse {
	constructor(target) {
		this.sensitivity = 1;
		this.transitionTime = 2;//Number of frames/ticks that will as clicked/released
		this.target = target ? target : document.documentElement;
		this.moveBuffer = { x: 0, y: 0 };
		this.position = { x: 0, y: 0 };
		this.buttonStates = [0, 0, 0];
	}

	init(target) {
		if (target) this.target = target;
		document.addEventListener("contextmenu", this.contextMenu.bind(this), false);
		document.addEventListener("mousemove", this.moveMouse.bind(this), false);
		document.addEventListener("mousedown", this.mouseDown.bind(this), false);
		document.addEventListener("mouseup", this.mouseUp.bind(this), false);
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
		const 	rect = this.target.getBoundingClientRect(),
				root = document.documentElement;

		let mX = evt.clientX - rect.left - root.scrollLeft,
			mY = evt.clientY - rect.top - root.scrollTop;
			
		return {
			x: mX / gameWindow.scale,
			y: mY / gameWindow.scale
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
		return (this.currentTouches.length + this.endedTouches.length) > 0;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	init() {
		window.addEventListener('visibilitychange', () => { this.clearTouches(); })
		window.addEventListener('blur', () => { this.clearTouches(); })
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
			let pos = this.calculateTouchPos(touch);
			colorCircle(pos.x, pos.y, 5, 'dimgrey');
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

	clearTouches() {
		this.currentTouches.length = 0;
		this.endedTouches.length = 0;
	}
	
	calculateTouchPos(touch) {
		let x = touch.pageX - this.target.offsetLeft;
		let y = touch.pageY - this.target.offsetTop;
		
		return {x: x / gameWindow.scale, y: y / gameWindow.scale};
	}
}

class GamePadManager {
	constructor() {
		this.enabled = false;
		this.pads = [];
		this.xboxButtonLabels = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'Down', 'Left', 'Right'];
		this.playstationButtonLabels = ['X', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Select', 'Start', 'L3', 'R3', 'Down', 'Left', 'Right'];
	}

	init() {
		window.addEventListener('gamepadconnected', function (e) {
			let gamepads = navigator.getGamepads();
			for (let g = 0; g < gamepads.length; g++) {
				if (!gamepads[g]) continue;
				if (!this.pads[g]) { //No GamePad object currently created for this index
					let newGP = new GamePad(g);
					newGP.init();
					this.pads.push(newGP);
				} else if (this.pads[g].target === null) {//Previously recognized gamepad
					this.pads[g].target = g;
				}
			}
			this.enabled = true;
        }.bind(this));

		window.addEventListener('gamepaddisconnected', function (e) {
			let gamepads = navigator.getGamepads();
			for (let i = 0; i < gamepads.length; i++) {
				if (!gamepads[i] && this.pads[i]) {
					this.pads[i].target = null;
				}
			}
			
			//Disabled manager if no pads are connected
			for(let pad of gamepads) {if (pad != null) return}
			this.enabled = false;
		}.bind(this))
	}

	update() {
        if (!this.enabled) return;
        for (let gp of this.pads) {
			gp.update();
		}
	}

	anyPressed() {
		for (pad of this.pads) { if (pad.anyPressed()) return true; }
		return false;
	}

	buttonPressed(padIndex, buttonIndex) {
		if (!this.enabled) return false;
		return this.pads[padIndex].buttonPressed(buttonIndex);
	}

	buttonHeld(padIndex, buttonIndex) {
		if (!this.enabled) return false;
		return this.pads[padIndex].buttonHeld(buttonIndex);
	}

	buttonReleased(padIndex, buttonIndex) {
		if (!this.enabled) return false;
		return this.pads[padIndex].buttonReleased(buttonIndex);
    }
    
    padAxis(axis, padIndex) {
		if (!this.enabled) return false;
		let index = padIndex ? padIndex : 0;
        return this.pads[index].padAxes[axis];
    }

}

class GamePad {
	constructor(target) {
        this.target = target;
        this.lastUpdate = null;
		this._buttonsPressed = new Set();
		this._buttonsHeld = new Set();
		this._buttonsReleased = new Set();
		this.padAxes = [];
    }

	init() {
        return;
	}

	anyPressed() {
		return (this._buttonsPressed.size > 0);
	}

	buttonPressed(button) {
		return (this._buttonsPressed.has(button));
	}

	buttonHeld(button) {
		return (this._buttonsHeld.has(button));
	}

	buttonReleased(button) {
		return (this._buttonsReleased.has(button));
	}

	update() {
        let navPads = navigator.getGamepads();
		let gp = navPads[this.target];
		if (gp != null) {
			//Only update control values if the controller data has been updated
			if (!this.lastUpdate || gp.timestamp >= this.lastUpdate) this.lastUpdate = gp.timestamp;
			else return;

			this._buttonsPressed.clear();
			
			for (let b = 0; b < gp.buttons.length; b++) {
				if (gp.buttons[b].pressed) this._buttonsPressed.add(b);
			}
			for (let a = 0; a < gp.axes.length; a++) {
				this.padAxes[a] = gp.axes[a];
			}
		}

		this._buttonsReleased.clear();		
		
		let iterator, button;
		iterator = this._buttonsHeld.values();
		while((button = iterator.next()).done === false) {
			if (this._buttonsHeld.has(button.value) && !this._buttonsPressed.has(button.value)) {
                this._buttonsReleased.add(button.value)
                this._buttonsHeld.delete(button.value);
			}
        }
        
        iterator = this._buttonsPressed.values();
		while((button = iterator.next()).done === false) {
			if (!this._buttonsHeld.has(button.value)) {
				this._buttonsHeld.add(button.value);
			} else {
                this._buttonsPressed.delete(button.value);
            }
		}
	}
}

function copyTouch({ identifier, pageX, pageY }) {
	return { identifier, pageX, pageY };
}