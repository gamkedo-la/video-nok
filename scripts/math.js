function circleRectOverlap(circle, rect) {
    //Assuming rect position in center
    //circle = {x, y, radius}
    //rect = {x, y, width, height}
    
    let x = 0, y = 0;
    let xOverlap = rect.x - circle.x;
    let yOverlap = rect.y - circle.y;

    let width = rect.width/2 + circle.radius;
    let height = rect.height/2 + circle.radius;
    
    if (Math.abs(xOverlap) > width)
        x = x > 0 ? x - width : x + width;
    if (Math.abs(yOverlap) > height)
        y = y > 0 ? y - height : y + height;

    return {x: x, y: y};
}

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