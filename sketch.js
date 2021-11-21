var bgimg,planeimg,corona1img,corona2img,corona3img, healthylungimg, worselungimg, worstlungimg, bulletimg, pillimg, oxygenimg
var noLifeImg,oneLifeImg,twoLifeImg,fullLifeImg,muteimg, mute_btn, arrowkeyimg, arrow, spacebarimg, space
var bulletGroup, virusGroup,treatmentGroup
var pingSound,gameoverSound, winSound, hittreatmentsound, bgsound
var virus,treatment
var score = 0
var viruscounter = 0
var treatmentcounter = 0
var lifecounter = 3
var gameState = "play"

function preload(){
  bgimg = loadImage("assets/bg.gif")
  planeimg = loadImage("./assets/plane2.png")
  corona1img = loadImage("./assets/corona1.png")
  corona2img = loadImage("./assets/corona2.png")
  corona3img = loadImage("./assets/corona3.png")
  pillimg = loadImage("./assets/pills.png")
  oxygenimg = loadImage("./assets/oxygen.png")
  bulletimg = loadImage("./assets/bullet.png")
  muteimg = loadImage("./assets/muteimage.png")

  healthylungimg = loadImage("./assets/healthylung.png")
  worselungimg = loadImage("./assets/worselung.png")
  worstlungimg = loadImage("./assets/worstlung.png")

  arrowkeyimg = loadImage("./assets/arrowkeys.png")
  spacebarimg = loadImage("./assets/space.png")
  
  noLifeImg = loadAnimation("./assets/nolife.png")
  oneLifeImg = loadAnimation("./assets/1life.png")
  twoLifeImg = loadAnimation("./assets/2life.png")
  fullLifeImg = loadImage("./assets/3life.png")

  gameoverSound = loadSound("./assets/Gameover.m4a")
  winSound = loadSound("./assets/Win.m4a")
  pingSound = loadSound("./assets/Ping.m4a")
  hittreatmentsound = loadSound("./assets/hittreatment.wav")
  bgsound = loadSound("./assets/Gamemusic.m4a")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  bgsound.play()
  bgsound.setVolume(0.5);
// creating the main playing character
  plane = createSprite(800,495,100,100)
  plane.addImage(planeimg);
  plane.scale = 0.6
//creating the lung 
  lung = createSprite(550, 230, 50, 50);
  lung.scale = 0.8
  lung.addAnimation("healthy",healthylungimg);
  lung.addAnimation("worse",worselungimg);
  lung.addAnimation("worst",worstlungimg);
  lung.scale = 0.3
  lung.setCollider("rectangle",0,20,775,775)
//creating the heart
  heart = createSprite(50,100,20,20)
  heart.scale = 0.2
  heart.addAnimation("full",fullLifeImg)
  heart.addAnimation("one",oneLifeImg)
  heart.addAnimation("two",twoLifeImg)
  heart.addAnimation("no",noLifeImg)
  heart.changeAnimation("full")
//creating the mute button for user to mute the music
  mute_btn = createImg("./assets/muteimage.png")
  mute_btn.position(1200,40)
  mute_btn.size(50,50)
  mute_btn.mouseClicked(muteSound)

  arrow = createSprite(370,50,50,50)
  arrow.addImage(arrowkeyimg)
  arrow.scale = 0.3

  space = createSprite(550,50,50,50)
  space.addImage(spacebarimg)
  space.scale = 0.4

  virusGroup = new Group()
  bulletGroup = new Group()
  treatmentGroup = new Group()
}

function draw() {
  background("#A6E9EC");  
if(gameState == "play"){
//Add movement to the plane
  if(keyIsDown(RIGHT_ARROW)){
    plane.x += 5
  }
  if(keyIsDown(LEFT_ARROW)){
    plane.x -= 5
  }

//Colliding virus with lung to add score system
  if(virusGroup.collide(lung)){
    virusGroup[0].destroy();
    score = score - 1
    viruscounter += 1 
  }

  if(viruscounter === 4){
    lung.changeAnimation("worse")
  }

  if(viruscounter === 8){
    lung.changeAnimation("worst")
    treatmentcounter = 0
  }

  if (treatmentGroup.collide(lung)){
    treatmentGroup[0].destroy();
    score += 1
    treatmentcounter += 1
  }

 if(treatmentcounter === 5){
  lung.changeAnimation("healthy")
  viruscounter = 0
 }
 //colliding with bullets
  if (bulletGroup.collide(virusGroup)){
    virusGroup[0].destroy();
    bulletGroup.destroyEach();
    score = score + 1
    pingSound.play()
  }

  if (bulletGroup.collide(treatmentGroup)){
    treatmentGroup[0].destroy();
    bulletGroup.destroyEach();
    score = score - 1
    hittreatmentsound.play()
  }
  
  if(keyDown("space")){
    shootBullet();
  }

  if( score === 30){
    winSound.play()
    gameState = "win"
  }

  if(score == -5){
    heart.changeAnimation("two")
  }

  if(score == -10){
    heart.changeAnimation("one")
  }

  if(score == -15){
    heart.changeAnimation("no")
    gameoverSound.play()
    gameState = "end"
  }

  SpawnViruses()
  SpawnTreatment()

  textSize(19.5)
  fill("#731C18")
  text("Welcome to your body help your lungs stay virus free! Use your plane to shoot the viruses but dont shoot the pills or oxygen they help your lungs.",10,20)
  text("Good luck CORONA WARRIOR!",10,50)
  text("Score: " +score,10,80)
  text("To move the plane",290,90)
  text("To shoot",510,90)
  drawSprites();
}

if(gameState == "end"){
  gameOver()
}
if(gameState == "win"){
  win()
}
}
//creating random viruses appear on screen
function SpawnViruses(){
  images = Math.round(random(1,3))
  y = Math.round(random(110,350))
if(frameCount % 60 == 0){ 
virus = createSprite(1600,y,20,20)
virus.setCollider("rectangle",0,0,150,150)
switch(images){
  case 1: virus.addImage(corona1img)
 break;
 case 2:virus.addImage(corona2img)
  break;
 case 3: virus.addImage(corona3img)
  break;
  default:
   break;
}
if(score % 10 == 0){
  virus.velocityX += 2 
}

virus.scale = 0.2
if(score <= 10){
  virus.velocityX = -3
  virus.lifetime = 450;
}
else if(score <= 20){
  virus.velocityX = -6
  virus.lifetime = 300;
}
else if(score <= 30){
  virus.velocityX = -7
  virus.lifetime = 300;
}
virusGroup.add(virus)
}
}

//creating random Treatments appear on screen
function SpawnTreatment(){
  treatmentimages = Math.round(random(1,2))
  y = Math.round(random(120,300))
if(frameCount % 150 == 0){
  treatment = createSprite(1600,y,20,20)
  treatment.setCollider("rectangle",0,0,150,150)
  switch(treatmentimages){
case 1 : treatment.addImage(pillimg)
  break;
case 2 : treatment.addImage(oxygenimg)
  break;
default:
  break;
}
treatment.scale = 0.3
if(score <= 10){
  treatment.velocityX = -2
  treatment.lifetime = 450;
}
else if(score <= 20){
  treatment.velocityX = -5
  treatment.lifetime = 300;
}
else if(score <= 30){
  treatment.velocityX = -6
  treatment.lifetime = 300;
}
treatmentGroup.add(treatment)
}
}

function shootBullet(){
  bullet = createSprite(plane.x,plane.y,50,20)
  bullet.setCollider("rectangle",0,0,300,500)
  bullet.y = plane.y - 100
  bullet.addImage(bulletimg)
  bullet.scale = 0.09
  bullet.velocityY = -7
  bullet.lifetime = 450;
  bulletGroup.add(bullet)
}

function muteSound()
{
  if(bgsound.isPlaying())
     {
      bgsound.stop();
     }
     else{
      bgsound.play();
     }
}

function win(){
  swal({ 
    title: `YOU WIN!!!`,
    text: "WELL DONE!! You saved your lungs! Dont forget to wear you mask and stay safe! ",
    imageUrl: "https://media.istockphoto.com/vectors/emoticon-wearing-surgical-protective-mask-emoji-isolated-on-white-vector-id1219738109?k=20&m=1219738109&s=612x612&w=0&h=8SkTsfm0qjAPLEXVZSNqBsMdfYAjrU-xW2ndLDqIlsY=",
    imageSize: "150x150", 
    confirmButtonText: "Play Again" 
  },
  function(isConfirm){
  if(isConfirm) {
  window.location.reload()
  }})

  virus.velocityX = 0
  treatment.velocityX = 0
  bullet.velocityY = 0
  score = 0
}

function gameOver(){
  swal({ 
    title: `Game Over!!!`,
    text: "Oh no youve lost!! Make sure to be careful and wear a mask and be safe!",
    imageUrl: "https://previews.123rf.com/images/phanuchat/phanuchat2005/phanuchat200500070/146830734-businessman-fight-with-coronavirus-2019-ncov-cartoon-character-man-and-woman-attack-covid-19-people-.jpg",
    imageSize: "150x150", 
    confirmButtonText: "Play Again" 
  },
  function(isConfirm){
  if(isConfirm) {
  window.location.reload()
  }})
  virus.velocityX = 0
  treatment.velocityX = 0
  bullet.velocityY = 0
  score = 0
}

