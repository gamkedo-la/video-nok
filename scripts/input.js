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
	if(shooting){
		if(activePlayer == 1){
			let shootEnd = calculateMousePos(evt);

			let launchX = shootEnd.x - ballOne.x;
			let launchY = shootEnd.y - ballOne.y;
			
			ballOne.hold({x: launchX, y: launchY});
			ballOne.release();
	
			shooting = false;
		}
	} // end check if shooting
	if (scoreManager.winner) resetGame();

} // end handleMouseUp()