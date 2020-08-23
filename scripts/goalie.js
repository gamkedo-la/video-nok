const GOAL_POST_SIZE = 160;
const GOALIE_SIZE = 55;
const railThickness = 30;

let obstacles = [];
let obstaclesDiamonds = [];

function initBoard() {
    obstacles = [
        //rails
        {x: 0, y: 0, width: canvas.width, height: railThickness, color: railColor},//Top
        {x: 0, y: canvas.height - railThickness, width: canvas.width, height: railThickness, color: railColor},//Bottom
        {x: 0, y: 0, width: railThickness, height: canvas.height/2 - GOAL_POST_SIZE/2, color: railColor},//Top left
        {x: 0, y: canvas.height/2 + GOAL_POST_SIZE/2, width: railThickness, height: canvas.height/2 - GOAL_POST_SIZE/2, color: railColor},//Bottom left
        {x: canvas.width-railThickness, y: 0, width: railThickness, height: canvas.height/2 - GOAL_POST_SIZE/2, color: railColor},//Top right
        {x: canvas.width-railThickness, y: canvas.height/2 + GOAL_POST_SIZE/2, width: railThickness, height: canvas.height/2 - GOAL_POST_SIZE/2, color: railColor},//Bottom right
        //goalies

    ]

    obstaclesDiamonds = [
        {x: railThickness*4, y: canvas.height/2, radius: GOALIE_SIZE, color: 'yellow'},
        {x: canvas.width-(railThickness*4), y: canvas.height/2, radius: GOALIE_SIZE, color: 'yellow'},
    ];
}

function drawBoard() {
    for (let i of obstacles) {
        colorRect(i.x, i.y, i.width, i.height, i.color);
    }
    for (let i of obstaclesDiamonds) {
        colorDiamond(i.x, i.y, i.radius, i.color);
    }
}

