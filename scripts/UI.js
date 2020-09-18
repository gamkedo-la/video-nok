var menu_elements = [];

function controlMenu() {
	ctrlAtUIControl = true;
	ctrlAtplayerControl = false;
	ctrlAIControl = false;
	for (let element of this.elements) {
		if (pointInRect(input.pointer, element)) {
			element.hover = true;
			if (input.clicked()) element.onPress();
			else if (input.held()) continue;
			else if (input.released()) element.onRelease();
		} else {
			element.hover = false;
		}
	}
}

function drawMenu() {
	for (let element of this.elements) {
		element.draw();
	}
}

class InterfaceElement {
	constructor(properties) {
		this.parent = properties.parent;
		this.alignment = properties.alignment;//alignment to parent edges
		this.position = properties.position;//relative to parent
		this.width = properties.dimensions.x || {x: 1, y: 2};
		this.height = properties.dimensions.y;
		this.hover = false;
	}

	get x () {
		return this.origin.x + this.position.x;  
	}

	set x (value) {
		this.position.x = value - this.origin.x;
	}

	set y (value) {
		this.position.y = value - this.origin.y;
	}

	get y () {
		return this.origin.y + this.position.y;  
	}

	get origin () {
		if (!this.parent) this.parent = canvas;
		let originX, originY;

		switch (this.alignment.x) {
			case 'left':
				originX = 0;
				break;
			case 'right':
				originX = this.parent.width;
				break;
			case 'center':
				originX = this.parent.width / 2;
				break;
			default: 
				originX = 0;
		}

		switch (this.alignment.y) {
			case 'top':
				originY = 0;
				break;
			case 'bottom':
				originY = this.parent.height;
				break;
			case 'center':
				originY = this.parent.height / 2;
				break;
			default:
				originY = 0;
		}

		return {x: originX, y: originY};
	}

	onPress() {return;}

	onRelease() {return;}

	draw() {return;}
}

class InterfaceButton extends InterfaceElement {
	constructor(properties) {
		super(properties);
		this.colors = properties.colors;
		this.font = properties.font;
		this.label = properties.label;
		this.callback = properties.callback;
	}

	onRelease() {
		this.callback();
	}

	draw() {
		canvasContext.save();
		canvasContext.beginPath();
		canvasContext.fillStyle = this.hover ? this.colors.hoverBackground : this.colors.background;
		canvasContext.strokeStyle = this.hover ? this.colors.hoverBorder : this.colors.border;
		canvasContext.lineWidth = 1;
		canvasContext.rect(this.x, this.y, this.width, this.height);
		canvasContext.fill();
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.fillStyle = this.hover ? this.colors.hoverText : this.colors.text;
		canvasContext.font = this.font;
		canvasContext.textAlign = 'center';
		canvasContext.textBaseline = 'middle';
		canvasContext.fillText(this.label, this.x + this.width/2, this.y + this.height/2, this.width * 0.9);
		canvasContext.restore();
	}
}

console.log(onMobile);

//1: position: new Vector2(-37, 100),
//2: position: new Vector2(57, 100),
//3: position: new Vector2(147, 100),

if(window.innerWidth < 1100){
	//console.log('reached');
	menu_elements = [
		/*
		new InterfaceText({
			parent: canvas,
			alignment: {x: 'center', y: 'top'},
			position: new Vector2(-25, 130),
			dimensions: new Vector2(50, 25),
			colors: {text: 'white'},
			font: '80px Arial',
			label: 'VIDEO-NOK',
		}),
		*/

		/* ZERO PLAYER MODE
		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(-37, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: '0 PLAYERS',
			callback: () => {newGame(0)},
		}),
		*/
		
		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(-37, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: '1 PLAYERS',
			callback: () => {newGame(1)},
		}),

		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(57, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: '2 PLAYERS',
			callback: () => {newGame(2)},
		}),

		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(147, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: 'CREDITS',
			callback: () => { credits.reset(); gameState = state.credits },
		})
	];

} if(window.innerWidth > 1100) {
	console.log('reached');
	menu_elements = [

		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(-37, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: '1 PLAYERS',
			callback: () => {newGame(1)},
		}),

		new InterfaceButton({
			parent: canvas,
			alignment: {x: 'center', y: 'center'},
			position: new Vector2(57, 100),
			dimensions: new Vector2(75, 30),
			colors: {text: 'white', border: blue, background: bgColor, hoverText: 'white', hoverBorder: 'white', hoverBackground: railColor},
			font: '12Px Nunito',
			label: 'CREDITS',
			callback: () => { credits.reset(); gameState = state.credits },
		})
	];
}

let ui = {
	elements: menu_elements,
	control: controlMenu,
	draw: drawMenu,
}