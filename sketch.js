var trex, trexRun, edges, ground, groundInfinite, invisibleGround, clouds, randomNumber, cloudImage, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, obstacle,collide, restartImage, gameOverImage, restart, gameOver;

var cloudsGroup, cactusGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY

var score = 0;

var checkpointSound, dieSound, jumpSound;

function preload() {
  //loading animations and images
  trexRun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundInfinite = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  collide = loadAnimation("trex_collided.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");

}

function setup() {
  //setting up the canvas
  createCanvas(600, 200);

  //creating edges
  edges = createEdgeSprites();

  //creating the T-Rex
  trex = createSprite(50, 150, 40, 40);
  trex.scale = 0.5;
  trex.addAnimation("t1", trexRun);
  trex.addAnimation("t2",collide);

  //creating the ground
  ground = createSprite(200, 180, 600, 20);
  ground.addImage("g1", groundInfinite);
  ground.x = ground.width / 2;
  //console.log(ground.x)

  //making the T-Rex stay on the ground
  invisibleGround = createSprite(300, 190, 600, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  cactusGroup = new Group();
  
  restart = createSprite(300,100,20,20);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  
  gameOver = createSprite(300,50,20,20);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.75;
  
  trex.setCollider("rectangle", 0,0, 50,trex.height+50);
  //trex.debug = true;
  //var setupRange = "Testing";
  
}

function draw() {
  //clearing the background
  background("white");
  text('score:' + score, 525, 20)


  if (gamestate == PLAY) {
    //making the T-Rex jump
    if ((keyDown("space")||keyDown("up")) && trex.y >= 100) {
      trex.velocityY = -10;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 1;

    //console.log(trex.y);


    //making an infnite ground
    //ground.velocityX = -5;
    //increase ground velocity by score/100
    ground.velocityX = -(5 + score/25)
    if (ground.x <= 0) {
      ground.x = ground.width / 2;
    }
    if (frameCount % 50 == 0) {
      drawCactus();
    }
    score = score + Math.round(frameCount/250);
    console.log('score:' + score);
    
    if (score > 0 && score % 100 == 0){
      checkpointSound.play();
    }
    
    if (trex.isTouching(cactusGroup)){
      //link with AI
      //trex.velocityY = -10;
      //jumpSound.play();
      gamestate = END;
      score = 0;
      dieSound.play(); 
    }
    
    if (frameCount % 50 == 0) {
      drawClouds();
    }
    
    restart.visible = false;
    gameOver.visible = false;
  } 
  else if (gamestate == END) {
    ground.velocityX = 0;
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cactusGroup.setLifetimeEach(-1);
    trex.changeAnimation("t2",collide);
    restart.visible = true;
    gameOver.visible = true;
    score = 0;
    console.log(score);
  }
  
  //making sure the T-Rex doesn't fall off
    trex.collide(invisibleGround);
  
  if (mousePressedOver(restart)){
    restartGame();
  }
  
  //console.log(setuprange);
  drawSprites();
}

function restartGame (){
  gamestate = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("t1", trexRun)
}

function drawClouds() {
  randomNumber = Math.round(random(15, 100));
  cloud = createSprite(600, 100, 40, 60);
  cloud.addImage("c1", cloudImage);
  cloud.y = randomNumber;
  cloud.velocityX = -3;
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
  console.log("c" + cloud.depth);
  console.log("t" + trex.depth);
  cloud.lifetime = 200;

  cloudsGroup.add(cloud);
}

function drawCactus() {
  cactusNumber = Math.round(random(1, 6));
  obstacle = createSprite(600, 175, 30, 30);
  obstacle.velocityX = -(5+score/25);

  switch (cactusNumber) {
    case 1:
      obstacle.addImage(cactus1);
      break;
    case 2:
      obstacle.addImage(cactus2);
      break;
    case 3:
      obstacle.addImage(cactus3);
      break;
    case 4:
      obstacle.addImage(cactus4);
      break;
    case 5:
      obstacle.addImage(cactus5);
      break;
    case 6:
      obstacle.addImage(cactus6);
      break;
    default:
      break;
  }

  obstacle.scale = 0.5
  obstacle.lifetime = 150;
  cactusGroup.add(obstacle);
}