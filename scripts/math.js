function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function clampVector2(vector, min, max) {
    if (min < 0 || max < 0 || max < min) return {x: 0, y: 0};

    let magnitude = Math.hypot(vector.x, vector.y);
    let unit;
    if (magnitude === 0) unit = {x: 0, y: 0}
    else unit = {x: vector.x/magnitude, y: vector.y/magnitude};

    if (magnitude < min) {
        return {x: unit.x * min, y: unit.y * min};
    }
    if (magnitude > max) {
        return {x: unit.x * max, y: unit.y * max};
    }

    else return vector;
}

function pointInCircle(point, circle) {
    //point = {x, y};
    //circle = {x, y, radius};

    let delta = {x: circle.x - point.x, y: circle.y - point.y};
    if (delta.x > circle.radius && delta.y > circle.readius) return false;
    
    let distance = Math.hypot(delta.x, delta.y);

    return distance <= circle.radius;
}

function pointInRect(point, rect) {
    if (point.x < rect.x ||
        point.x > rect.x + rect.width ||
        point.y < rect.y ||
        point.y > rect.y + rect.height) {
            return false;
        }
    return true;
}

function circleRectCollision(circle, rect) {
    //Rect center point
    let rWidth = rect.width/2;
    let rHeight = rect.height/2;
    let rx = rect.x + rWidth;
    let ry = rect.y + rHeight;

    //Difference between rect and circle positions
    let deltaX = circle.x - rx;
    let deltaY = circle.y - ry;

    if (deltaX > rWidth + circle.radius || deltaY > rHeight + circle.radius) return false;

    //Determine the closest edge of the rectangle
    let clampX = clamp(deltaX, -rWidth, rWidth);
    let clampY = clamp(deltaY, -rHeight, rHeight);

    clampX += rx - circle.x;
    clampY += ry - circle.y;

    if (Math.hypot(clampX, clampY) <= circle.radius) return new Vector2(clampX, clampY);
    return false;
}

function circleDiamondCollision(circle, diamond){
    let deltaX = circle.x - diamond.x;
    let deltaY = circle.y - diamond.y;
    let diamondDist = Math.abs(deltaX) + Math.abs(deltaY);
    return (deltaX + deltaY < circle.radius + diamond.radius);
}

function vectorDirection(vector) {
    const compass = [
        new Vector2(1, 0),
        new Vector2(-1, 0),
        new Vector2(0, -1),
        new Vector2(0, 1),
    ];

    let max = 0;
    let match = 0;
    for (let i = 0; i < compass.length; i++) {
        let dp = compass[i].dotProduct(vector);
        if (dp > max) {
            max = dp;
            match = i;
        }
    }
    return compass[match];
}

class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clamp(min, max) {
        let magnitude = this.length;
        if (magnitude < min) {
            //A negative value would flip the vector direction
            this.length = min > 0 ? min : 0;
        } else if (magnitude > max) {
            this.length = max;
        }
    }

    get length() {
        if (this.x === 0 && this.y === 0) return 0;
        return Math.hypot(this.x, this.y);
    }

    set length(scalar) {
        if (scalar <= 0) {
            this.x = 0;
            this.y = 0;
        } else {
            let unit = this.normalize();
            this.x = unit.x * scalar;
            this.y = unit.y * scalar;
        }
    }

    dotProduct(vector) {
        let unit = this.normalize();
        let vu = vector.normalize();

        return unit.x * vu.x + unit.y * vu.y;
    }

    normalize() {
        let magnitude = this.length;
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    rotate(angle) {
        let x = this.x * Math.cos(angle) - this.y * Math.sin(angle),
            y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
             
        return new Vector2(x, y);
    }
}

function lerp (start, end, weight) {
    return (1 - weight) * start + weight * end;
}

function smoothStart(weight) {
    return weight * weight;
}

function smoothStop(weight) {
    return 1 - (1-weight) * (1-weight);
}