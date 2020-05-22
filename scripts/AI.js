function AIMove(){	
    if(AIdebugPosShotToggle){
        var aimAtX = 0;
        var aimAtY = -canvas.height/2 //negative world (-)
        if(Math.random() < 0.5){
            aimAtY = 1.5 * canvas.height;
        }
        
        //var randomAngle = Math.random() * Math.PI * 2.0; //in radians //a full circle of range 
        var randomSpeed = Math.random() * 40.0 + 500.0; //min and randomized range, at least 4, up to 12 

        var aimAngle = Math.atan2(ballOne.y - aimAtY, ballOne.x - aimAtX); 

        // check if I can get straight to goal from here (is goalie block in the way) SKIP FOR RN
        // if yes, then shoot at aimAngle
        // if no, then calc new aimAtX, aimAtY, for where to bounce off wall.  

        let launchX = Math.cos(aimAngle) * randomSpeed;
        let launchY = Math.sin(aimAngle) * randomSpeed;
        
        ballOne.hold({x: launchX, y: launchY});
        ballOne.release();

        shooting = false;
        console.log('vector: x:' + launchX + ' y:' + launchY);	
    }  
    else {
        ballOne.x = mouseX;
        ballOne.y = mouseY;
        ballOne.velX = ballOne.velY = 0;

    } 
}