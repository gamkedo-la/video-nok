var picsToLoad = 0;

var logoImg = document.createElement('img');
var p1winsImg = document.createElement('img');
var p2winsImg = document.createElement('img');
var creditsImg = document.createElement('img');
var faceOffImg = document.createElement('img');
var takeYourShotImg = document.createElement('img');
var score3Active = document.createElement('img');

function loadImages(){
    var imageList = [
        {varName: logoImg, theFile: 'logo.png'},
        {varName: p1winsImg, theFile: 'p1-wins.png'},
        {varName: p2winsImg, theFile: 'p2-wins.png'},
        {varName: creditsImg, theFile: 'credits.png'},
        {varName: faceOffImg, theFile: 'face-off.png'},
        {varName: takeYourShotImg, theFile: 'take-your-shot.png'},
        {varName: score3Active, theFile: 'score-3-active.png'},
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
    console.log('hello world');
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



