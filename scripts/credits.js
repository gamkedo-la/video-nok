class Credits {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }

    update() {
        --this.y
    }

    draw() {
        colorRect(0,0, canvas.width, canvas.height, 'Black');
        canvasContext.save()
        canvasContext.font = '120px Arial';
        canvasContext.textAlign = 'center';
        canvasContext.fillText(this.text, this.x, this.y);
        canvasContext.restore();      
    }
}