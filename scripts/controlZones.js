const controlZones = [document.getElementById('controlzoneleft'), document.getElementById('controlzoneright')];
const zoneShotVectors = [
	{ start: new Vector2(), end: new Vector2() },
	{ start: new Vector2(), end: new Vector2() },
];

function handleZoneTouch(event) {
	if (gameState != state.game || puckOne.inPlay) return;
	
	let zone = event.target == controlZones[0] ? 0 : 1;

	if (preFaceOff) {
		if (event.type == 'touchend') {
			preFaceOff = false;
			faceOffActive = true;
		}
	} else if (faceOffActive || zone === activePlayer) {
		handleZoneShot(zone, event);
	} else {
		console.log('zone ' + zone + ' inactive');
	}
}

function handleZoneShot(zone, event) {
	if (event.type == 'touchcancel' || event.type == 'touchleave') {
		puckOne.shotVector.length = 0;
	}

	let position = zoneTouchPos(zone, event.changedTouches[0]);
	let start = zoneShotVectors[zone].start;
	let end = zoneShotVectors[zone].end;

	if (event.type == 'touchstart') {
		start.x = position.x;
		start.y = position.y;	
	}

	end.x = position.x;
	end.y = position.y;

	if (start.x === end.x && start.y === end.y) return;

	let sv = new Vector2(end.x - start.x, end.y - start.y);
		sv.clamp(0, MAX_SHOT_VELOCITY)

	if (event.type == 'touchmove') {
		puckOne.shotVectors[zone] = sv;
	}

	if (event.type == 'touchend') {
		puckOne.hold(sv);
		puckOne.release();
		puckOne.shotVectors.length = 0;
	
		if (faceOffActive) {
			activePlayer = zone;
			faceOffActive = false;
		}
	}
}


function zoneTouchPos(zone, touch) {
	let x = touch.pageX - controlZones[zone].offsetLeft;
	let y = touch.pageY - controlZones[zone].offsetTop;

	return { x: x / gameWindow.scale, y: y / gameWindow.scale };
}