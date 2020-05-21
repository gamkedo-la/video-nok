function initInput() {
    canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mouseup', handleMouseUp);

	canvas.addEventListener('mousemove', handleMouseMove);
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseDown(evt) {
	let shootStart = calculateMousePos(evt);
	if (pointInCircle(shootStart, ballOne)) {
        shooting = true;
	}
}

function handleMouseMove(evt) {
    if (shooting) {
        let mouse = calculateMousePos(evt);
        let aim = {x: mouse.x - ballOne.x, y: mouse.y - ballOne.y};
        ballOne.hold(aim);
    }
}

function handleMouseUp(evt){
	if(activePlayer == 1){
		if(shooting){
			let shootEnd = calculateMousePos(evt);
	
			let launchX = shootEnd.x - ballOne.x;
			let launchY = shootEnd.y - ballOne.y;
			
			ballOne.hold({x: launchX, y: launchY});
			ballOne.release();
	
			shooting = false;
		} // end check if shooting
	}

	if(activePlayer == 2){
		if(shooting){
			
			var randomFloat = Math.random();
			var randomFloat2 = Math.random();
			var posNeg1;
			var posNeg2;

			if(randomFloat > .5){
				posNeg1 = 1
			}
			else {
				posNeg1 = -1
			}

			if(randomFloat2 > .5){
				posNeg2 = 1
			}
			else {
				posNeg2 = -1
			}


			let launchX = randomFloat * 300 * posNeg1;
			let launchY = randomFloat2 * 300 * posNeg2;
			
			ballOne.hold({x: launchX, y: launchY});
			ballOne.release();
	
			shooting = false;
			console.log('vector: x:' + launchX + ' y:' + launchY);
		} // end check if shooting
	}
	if (scoreManager.winner) resetGame();

} // end handleMouseUp()