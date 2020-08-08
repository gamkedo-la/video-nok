var picsToLoad = 0;

var logoImg = document.createElement('img');
var p1winsImg = document.createElement('img');
var p2winsImg = document.createElement('img');
var creditsImg = document.createElement('img');
var faceOffImg = document.createElement('img');
var takeYourShotImg = document.createElement('img');
var score0Inactive = document.createElement('img');
var score0Active = document.createElement('img');
var score1Inactive = document.createElement('img');
var score1Active = document.createElement('img');
var score2Inactive = document.createElement('img');
var score2Active = document.createElement('img');
var outOfBoundsTxt = document.createElement('img');

function loadImages(){
    var imageList = [
        {varName: logoImg, theFile: 'logo.png'},
        {varName: p1winsImg, theFile: 'p1-wins.png'},
        {varName: p2winsImg, theFile: 'p2-wins.png'},
        {varName: creditsImg, theFile: 'credits.png'},
        {varName: faceOffImg, theFile: 'face-off.png'},
        {varName: takeYourShotImg, theFile: 'take-your-shot.png'},
        {varName: score0Inactive, theFile: 'score-0-inactive.png'},
        {varName: score0Active, theFile: 'score-0-active.png'},
        {varName: score1Inactive, theFile: 'score-1-inactive.png'},
        {varName: score1Active, theFile: 'score-1-active.png'},
        {varName: score2Inactive, theFile: 'score-2-inactive.png'},
        {varName: score2Active, theFile: 'score-2-active.png'},
        {varName: outOfBoundsTxt, theFile: 'outofbounds.png'},
    ];

    picsToLoad = imageList.length;

    for(var i=0;i<picsToLoad;i++){
        beginImageLoading(imageList[i].varName, imageList[i].theFile);
    }
}

function beginImageLoading(imgVar, fileName){
    //picsToLoad++
    imgVar.src = 'assets/' + fileName;
    imgVar.onload = countLoadedImageAndLaunchIfReady;
}


function loadingDoneSoStartGame(){
    initGame();
    const framesPerSecond = 30;
    setInterval(main, 1000/framesPerSecond);
}

function countLoadedImageAndLaunchIfReady(){
    
    picsToLoad--;
    if(picsToLoad == 0){
        loadingDoneSoStartGame(); //is not defined yet!
    }
}



