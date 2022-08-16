var PLAY = 1;
var END = 0;
var gameState = PLAY;

var running_horse, jumping_horse, standing_horse;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var jumps;

var score;
var gameOverImg,restartImg

function preload(){

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  running_horse = loadImage("Trotting Horse.gif");
  jumping_horse = loadImage("Horse jumping.jpg");
  standing_horse = loadImage("Horse Standing.jpg");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  jumps = loadImage("Jump.png")
  
}

function setup() {
  createCanvas(600, 200);

  var message = "Horses Rule Suckas";
 console.log(message)
  
  horse = createSprite(160,50,20,50);
  horse.addAnimation("running", running_horse);
  horse.addAnimation("jumping", jumping_horse);
  horse.addAnimation("standing", standing_horse);
  

  horse.scale = 0.25;
  
  ground = createSprite(200,180, 600 ,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  horse.setCollider("rectangle",0,0,horse.width,horse.height);
  horse.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -6;
    //scoring
    score = score + Math.round(getFrameRate()/16);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& horse.y >= 100) {
        horse.velocityY = -16;
        ground.velocityX = ground.velocityX-0.65;
        obstaclesGroup.setVelocityXEach(-6.65);
        cloudsGroup.setVelocityXEach(-6.65);
        horse.changeAnimation("jumping", jumping_horse);
    }

  if(horse.isTouching(ground)){
    horse.changeAnimation("running", running_horse);
    ground.velocityX = ground.velocityX+0.65;
        obstaclesGroup.setVelocityXEach(-6);
        cloudsGroup.setVelocityXEach(-6);
  }

    
    //add gravity
    horse.velocityY = horse.velocityY + 1
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnJumps();
    
    if(obstaclesGroup.isTouching(horse)){
        //trex.velocityY = -12;
        gameState = END;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      horse.changeAnimation("standing", standing_horse);
      horse.velocityX=0;
      horse.velocityY=0;
    
     
     
      ground.velocityX = 0;
      horse.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);    

    if(mousePressedOver(restart)) {
      reset();
    }

   }
  
 
  //stop trex from falling down
  horse.collide(invisibleGround);



  drawSprites();
}

function reset(){
  
  gameState=PLAY;

  score=0;

  horse.changeAnimation("running", running_horse);

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

}


function spawnJumps(){
 if (frameCount % 60 === 0){
   var jump = createSprite(600,165,10,40);
   jump.velocityX = -6;
   jump.addImage("fence", jumps);
   jump.setCollider("rectangle", 0,0,100,50);
    
   
    //assign scale and lifetime to the obstacle           
    jump.scale = 0.25;
    jump.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(jump);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -6;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = horse.depth;
    horse.depth = horse.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}