var AIdebugPosShotToggle = false;
var mouseX = 0;
var mouseY = 0;
let touch;

function initInput() {
    canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mouseup', handleMouseUp);
	canvas.addEventListener('mousemove', handleMouseMove);
	touch = new TouchManager(canvas);
	touch.init();
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

function handleMouseDown(evt) {
	let shootStart = {x: mouseX, y: mouseY};
	if (pointInCircle(shootStart, ballOne)) {
        shooting = true;
	}
}

function handleMouseMove(evt) {
	calculateMousePos(evt);
    if (shooting) {
        let aim = {x: mouseX - ballOne.x, y: mouseY - ballOne.y};
        ballOne.hold(aim);
    }
}

function handleMouseUp(evt){
	if(activePlayer == 1){
		if(shooting){
	
			let launchX = mouseX - ballOne.x;
			let launchY = mouseY - ballOne.y;
			
			ballOne.hold({x: launchX, y: launchY});
			ballOne.release();
			console.log(activePlayer);
	
			shooting = false;
		} // end check if shooting
	}

	if(activePlayer == 2){	//&& vel != 0 
		AIMove();
		AIdebugPosShotToggle = !AIdebugPosShotToggle;
	} // end check if activePlayer == 2
	if (scoreManager.winner) resetGame();

} // end handleMouseUp()


class TouchManager {
	constructor(element) {
		this.target = element ? element : window;
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