const controlZones = [document.getElementById('controlzoneleft'), document.getElementById('controlzoneright')];
const zoneShotVectors = [
	{ start: new Vector2(), end: new Vector2() },
	{ start: new Vector2(), end: new Vector2() },
];

function handleZoneTouch(event) {
	if (gameState != state.game) return;
	//    console.log(event);
	let zone = event.target == controlZones[0] ? 0 : 1;

	if (!preFaceOff && (zone === activePlayer || faceOffActive)) {
		switch (event.type) {
			case 'touchstart':
				handleTouchStart(zone, event);
				break;
			case 'touchmove':
				handleTouchMove(zone, event);
				break;
			case 'touchend':
			case 'touchcancel':
			case 'touchleave':
			default:
				handleTouchEnd(zone, event);
				break;
		}
	} else {
		console.log('zone ' + zone + ' inactive');
	}
}

function handleTouchStart(zone, event) {
	let position = zoneTouchPos(zone, event.changedTouches[0]);
	let start = zoneShotVectors[zone].start;
	let end = zoneShotVectors[zone].end;

	start.x = position.x;
	start.y = position.y;
	end.x = position.x;
	end.y = position.y;

	let sv = new Vector2(end.x - start.x, end.y - start.y);
	sv.clamp(0, MAX_SHOT_VELOCITY)
	puckOne.shotVectors[zone] = sv;
}

function handleTouchMove(zone, event) {
	let position = zoneTouchPos(zone, event.changedTouches[0]);
	let start = zoneShotVectors[zone].start;
	let end = zoneShotVectors[zone].end;

	end.x = position.x;
	end.y = position.y;

	let sv = new Vector2(end.x - start.x, end.y - start.y);
	sv.clamp(0, MAX_SHOT_VELOCITY);
	puckOne.shotVectors[zone] = sv;
}

function handleTouchEnd(zone, event) {
	let position = zoneTouchPos(zone, event.changedTouches[0]);
	let start = zoneShotVectors[zone].start;
	let end = zoneShotVectors[zone].end;

	end.x = position.x;
	end.y = position.y;

	let sv = new Vector2(end.x - start.x, end.y - start.y);
	sv.clamp(0, MAX_SHOT_VELOCITY)

	console.log('shoot ' + (zone + 1));
	puckOne.hold(sv);
	puckOne.release();
	puckOne.shotVectors.length = 0;

	if (faceOffActive) {
		activePlayer = zone;
		faceOffActive = false;
	}
}

function zoneTouchPos(zone, touch) {
	let x = touch.pageX - controlZones[zone].offsetLeft;
	let y = touch.pageY - controlZones[zone].offsetTop;

	return { x: x / gameWindow.scale, y: y / gameWindow.scale };
}