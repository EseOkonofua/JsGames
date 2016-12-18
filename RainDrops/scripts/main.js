var RainDrops = function(p){

//******************CONSTANTS
  //Difficulty
  const PHASES = [
    { drop:1 , freq:100,bgColor:"pink",pColor:"white",bColor:"#3366ff"},
    { drop:1.4, freq: 100,bgColor:"lightblue",pColor:"white",bColor:"#3366ff"},
    { drop:1.8, freq: 105,bgColor:"#EDF2F4",pColor:"#2B2D42",bColor:"#EF233C"},
    { drop:2, freq: 100,bgColor:"#DCD6F7",pColor:"#B4869F",bColor:"#4E4C67"},
    { drop:2.4, freq: 110,bgColor:"#001514",pColor:"white",bColor:"white"},
    { drop:2.5, freq: 100,bgColor:"#A42CD6",pColor:"#502274",bColor:"#2F242C"}
  ];

  //Game states
  const STATE = {
    PLAYING: 0,
    LOSE: 1
  }


  //Game status attributes
  var status = {
    currentPhase: 0,
    currentState:STATE.PLAYING,

    score:0,
    startTime:p.millis(),
    elapsedTime:function(){
      return p.millis() - this.startTime;
    },
    lastSpawn:0,
    spawnTimer:Number.POSITIVE_INFINITY,

    player:null,
    rainDrops:[],


    godmode:false
  }


//************PLAYER CLASS*********************//
  function Player(){
    //Private attributes
    var diameter = 45;
    var vel = {
      x:3,
      y:0
    }
    var pos = {
      x:p.width/2,
      y:p.height- diameter/2
    };
    var color = "white";

    //getters and setters
    this.getDiameter = () =>diameter;
    this.setDiameter = dmt => diameter = dmt;
    this.getVel = ()=> vel;
    this.setVel = (x,y)=>{
      vel.x = x;
      vel.y = y;
    }

    this.getPos = ()=> pos;
    this.setPos = (x,y)=>{
      pos.x = x;
      pos.y = y;
    }

    this.getColor  = ()=> color;
    this.setColor = (newColor)=>{
      if(color !== newColor) color = newColor;
    }

  }
  Player.prototype = {
    constructor:Player,
    draw:function(){
      var currPos = this.getPos();

      p.noStroke();
      p.fill(this.getColor());
      p.ellipse(currPos.x,currPos.y,this.getDiameter(),this.getDiameter());
    },

    moveRight:function(){
      var currPos = this.getPos();
      var newPos = currPos.x + this.getVel().x;
      this.setPos(newPos,currPos.y);
    },

    moveLeft:function(){
      var currPos = this.getPos();
      var newPos = currPos.x - this.getVel().x;
      this.setPos(newPos,currPos.y);
    }
  }


//*************RAIN DROP CLASS****************//
  function RainDrop(difficulty,x){
    Player.call(this);//inherit private properties

    this.setVel(0,1);
    this.setPos(x,0);
    this.setDiameter(10);
    this.setColor(difficulty.bColor);

    var gravity = difficulty.drop*(9.8/10000);
    var currTime = p.millis();


    this.getGravity = ()=> gravity;
    this.getCurrTime = ()=> currTime;
  }
  inheritPrototype(RainDrop,Player); //inherit prototypical attributes
  RainDrop.prototype.update = function(){
      var now = p.millis();
      var currVel = this.getVel();
      var newYVel = currVel.y + this.getGravity()*(now - this.getCurrTime());
      this.setVel(currVel.x, newYVel);
      this.setPos(this.getPos().x,this.getPos().y + newYVel);
  }


  //Game mechanic functions
  const Game = {
    spawnRainDrop:function(){
      status.rainDrops.unshift( new RainDrop(PHASES[status.currentPhase],p.random(p.width)) );
    },

    circleCircleCollide:function (x, y,d, x2, y2, d2) {
    //2d
      if( p.dist(x,y,x2,y2) <= (d/2)+(d2/2) ){
        return true;
      }
      return false;
    },

    reset:function(){
      status.currentPhase= 0;
      status.currentState=STATE.PLAYING;
      status.score=0;
      status.startTime=p.millis();
      status.lastSpawn=0;
      status.spawnTimer=Number.POSITIVE_INFINITY;
      status.player=new Player()
      status.rainDrops=[]
    }
  }


  p.setup = function(){
    var myCanvas = p.createCanvas(800,700);
    myCanvas.parent('canvas-container');
    p.background("pink");

    status.player = new Player();

  }

  p.draw = function(){
    p.background(PHASES[status.currentPhase].bgColor);

    if(status.currentState == STATE.PLAYING){

      if(p.keyIsDown(p.LEFT_ARROW)){
        if(status.player.getPos().x >= status.player.getDiameter()/2)
          status.player.moveLeft();
      }
      if(p.keyIsDown(p.RIGHT_ARROW)){
        if(status.player.getPos().x <= p.width - status.player.getDiameter()/2)
          status.player.moveRight();
      }
//**********DRAW
      status.player.draw();

      for(i = status.rainDrops.length-1; i>=0; i--){
        var drop = status.rainDrops[i];
        if(Game.circleCircleCollide(drop.getPos().x,drop.getPos().y,drop.getDiameter(),status.player.getPos().x,status.player.getPos().y,status.player.getDiameter()) && !status.godmode){
          status.currentState = STATE.LOSE;
        }
        drop.draw();
      }

//********UPDATE
      for(i = status.rainDrops.length-1; i>=0; i--){
        var drop = status.rainDrops[i];
        drop.update();
        if(drop.getPos().y > p.height+drop.getDiameter()/2){
          status.rainDrops.splice(i,1);
          status.score++;
        }
      }

//*******TIME RELATED STUFF
      var now = p.millis();
      var elapsed = status.elapsedTime();

      //Rain spawner
      if(status.spawnTimer > PHASES[status.currentPhase].freq){
        Game.spawnRainDrop();
        status.spawnTimer = 0;
        status.lastSpawn = now;
      }

      //difficulty handler
      if(elapsed >= 30000 && elapsed < 60000){ status.currentPhase = 1; status.player.setColor(PHASES[status.currentPhase].pColor)  }
      else if(elapsed >= 60000 && elapsed < 90000) { status.currentPhase= 2; status.player.setColor(PHASES[status.currentPhase].pColor)  }
      else if (elapsed >= 90000 & elapsed < 120000) { status.currentPhase = 3; status.player.setColor(PHASES[status.currentPhase].pColor)  }
      else if( elapsed>= 120000 && elapsed< 150000) { status.currentPhase = 4; status.player.setColor(PHASES[status.currentPhase].pColor)  }
      else if(elapsed >= 150000) {status.currentPhase = 5; status.player.setColor(PHASES[status.currentPhase].pColor)  }

      status.spawnTimer = now - status.lastSpawn;

      p.fill("white");
      p.textSize(20);
      p.text("Score: "+ status.score,10,26);

    }
    else if(status.currentState == STATE.LOSE){

      p.background("black");
      p.text("YOU LOSE",p.width/2 - 100, p.height/2);
      p.textSize(20);
      p.text("SCORE: "+status.score,p.width/2 - 70,p.height/2 + 30);
      p.text("PRESS R TO RESTART",p.width/2 - 70,p.height/2 + 50);

    }

  }

//*** INPUT
  p.keyPressed = function(){
    if(status.currentState == STATE.LOSE && p.keyCode == 82 ){
      Game.reset();
    }
  }

}

window.onload = function(){
  var myp = new p5(RainDrops);
}
