let animations = [];

function updateAnimations() {
    for (let i = animations.length - 1; i >= 0; i--) {
        if (animations[i].complete) animations.splice(i, 1);
    }

    for (anim of animations) {
        anim.update();
    }
}

class LerpAnimation {
    constructor(lifetime, curve, animation, callback, args) {
        this.lifetime = lifetime;
        this.curve = curve;//A function that takes a value between 0 and 1 and returns a value between 0 and 1
        this.animate = animation;//A function updates an animation from start (0) to end (1);
        this.callback = callback;//Called when the animation completes
        this.args = args;//arguments object passed to animate
        this.timer = 0;
        this.complete = false;
    }

    update() {
        if (this.complete) return;
        if (this.timer < this.lifetime) {
            let t = this.curve(this.timer / this.lifetime);
            this.animate(t, this.args);
            this.timer++;
        } else {
            this.callback();
            this.complete = true;
        }
    }
}

function puckWindup(vector) {
    let windup = new LerpAnimation(24, smoothStop, windupAnimation,
        () => { puckRelease(vector) },
        { length: vector.length });
    animations.push(windup);
}

function puckRelease(vector) {
    let release = new LerpAnimation(5, smoothStart, releaseAnimation,
        () => { puckOne.hold(vector); puckOne.release(); shooting = false; },
        { length: vector.length });
    animations.push(release);
}

function windupAnimation(t, args) {
    let shot = lerp(1, args.length, t);
    if(puckOne.shotVector == null){
        //console.log('shotVector is null!');
        return;
    } 
    puckOne.shotVector.length = shot;
}

function releaseAnimation(t, args) {
    let shot = lerp(args.length, 1, t);
    if(puckOne.shotVector == null){
        //console.log('shotVector is null!');
        return;
    } 
    puckOne.shotVector.length = shot;
}