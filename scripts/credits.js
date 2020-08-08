class Credits {
    constructor(x, y, text) {
        this.x = x;
        this.initialY = this.y = y;
        this.text = text;
    }

    reset() {
        this.y = this.initialY;
    }

    update() {
        --this.y
    }

    draw() {
        colorRect(0,0, canvas.width, canvas.height, 'white');
        canvasContext.save()
        canvasContext.drawImage(creditsImg, this.x, this.y);
        var creditsTextY = this.y + 100
        var skipY = 20;
        canvasContext.fillStyle = '#662e78';
        canvasContext.font = '16px nunito';
        canvasContext.textAlign = 'left';
        for (var i = 0; i<this.text.length; i++){
            creditsTextY += skipY;
            canvasContext.fillText(this.text[i], this.x + 20, creditsTextY);
        }
        canvasContext.restore();      
    }
}