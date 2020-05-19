var ballX = 500;
var ballY = 333;
var ballSpeedX = 0;
var ballSpeedY = 0;

function ballReset() {
	if(player1Score >= WINNING_SCORE ||
		player2Score >= WINNING_SCORE) {

		showingWinScreen = true;

	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}