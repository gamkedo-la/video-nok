function aiControl() {
    if (input.mouse.mouseClicked(2) || input.touch.currentTouches.length + input.touch.endedTouches.length > 1) {
        puckOne.x = input.pointer.x;
        puckOne.y = input.pointer.y;
        puckOne.velX = puckOne.velY = 0;
        return;
    }
    
    var aimAtX = 0;
    var aimAtY = (-canvas.height/2) + 145;  //aim at upper mirror
    // for testing, aiming at a fixed, constant based point below center, and increasing the goal size
    if(Math.random() < 0.5){
        aimAtY = (1.5 * canvas.height); - 145 ; //aim at lower mirror world. 
    }

    //var randomAngle = Math.random() * Math.PI * 2.0; //in radians //a full circle of range 
    var randomSpeed = Math.random() * 40.0 + 500.0; //min and randomized range, at least 4, up to 12 

    var aimAngle = Math.atan2(puckOne.y - aimAtY, puckOne.x - aimAtX); 

    // check if I can get straight to goal from here (is goalie block in the way) SKIP FOR RN
    // if yes, then shoot at aimAngle
    // if no, then calc new aimAtX, aimAtY, for where to bounce off wall.  

    let launchX = Math.cos(aimAngle) * randomSpeed;
    let launchY = Math.sin(aimAngle) * randomSpeed;

    puckOne.hold({x: launchX, y: launchY});
 
    //maybe try tweaking these numbers first, from various court positions
    if (input.clicked()) {
        puckOne.release();

        shooting = false;
        console.log('vector: x:' + launchX + ' y:' + launchY);	
    }
}