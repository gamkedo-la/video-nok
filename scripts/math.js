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

function subtractAbsValPoints(point1, point2){
	point1XAbs = Math.abs(point1.x);
	point2XAbs = Math.abs(point2.x);
	largerXVal = Math.max(point1XAbs, point2XAbs);
	smallerXVal = Math.min(point1XAbs, point2XAbs);

	point1YAbs = Math.abs(point1.y);
	point2YAbs = Math.abs(point2.y);
	largerYVal = Math.max(point1YAbs, point2YAbs);
	smallerYVal = Math.min(point1YAbs, point2YAbs);


	xDiff = largerXVal - smallerXVal;
	yDiff = largerYVal - smallerYVal;

	return {
		x: xDiff,
		y: yDiff
	}
}

function circleRectCollision(circle, rect) {
    //Rect center point
    let rx = rect.x + rect.width/2;
    let ry = rect.y + rect.height/2;

    //Difference between rect and circle positions
    let deltaX = circle.x - rx;
    let deltaY = circle.y - ry;

    //Determine the closest edge of the rectangle
    let clampX = clamp(deltaX, -rect.width/2, rect.width/2);
    let clampY = clamp(deltaY, -rect.height/2, rect.height/2);

    clampX += rx - circle.x;
    clampY += ry - circle.y;

    if (Math.hypot(clampX, clampY) <= circle.radius) return new Vector2(clampX, clampY);
    return false;
}

function vectorDirection(vector) {
    const compass = [
        new Vector2(1, 0),
        new Vector2(-1, 0),
        new Vector2(0, -1),
        new Vector2(0, 1),
    ];

    const sides = ['Right', 'Left', 'Up', 'Down'];

    let max = 0;
    let match = 0;
    for (let i = 0; i < compass.length; i++) {
        let dp = compass[i].dotProduct(vector);
        if (dp > max) {
            max = dp;
            match = i;
        }
    }
    return sides[match];
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