var RainDrops = function(p){

  const PHASES = [
    { drop:1 , freq:100,bgColor:"pink",pColor:"white",bColor:"#3366ff"},
    { drop:1.4, freq: 100,bgColor:"lightblue",pColor:"white",bColor:"#3366ff"},
    { drop:1.8, freq: 105,bgColor:"#EDF2F4",pColor:"#2B2D42",bColor:"#EF233C"},
    { drop:2, freq: 100,bgColor:"#DCD6F7",pColor:"#B4869F",bColor:"#4E4C67"},
    { drop:2.4, freq: 110,bgColor:"#001514",pColor:"white",bColor:"white"},
    { drop:2.5, freq: 100,bgColor:"#A42CD6",pColor:"#502274",bColor:"#2F242C"}
  ];

  const STATE = {
    PLAYING: 0,
    LOSE: 1
  }

  var status = {
    currentPhase: 0,
    currentState:STATE.PLAYING,

    score:0,
    startTime:p.millis(),
    elapsedTime:function(){
      return p.millis() - this.startTime;
    },
    lastSpawn:0,
    spawnTimer:9000,

    player:null,
    rainDrops:[],


    godmode:false
  }


  //************PLAYER CLASS*********************//
  class Player{
    constructor(){
      this._diameter = 45;
      this._xVel = 3;
      this._pos = {
        x:p.width/2,
        y:p.height-this._diameter/2
      };

      this._color = "white";
    }

    draw(){
      p.noStroke();
      p.fill(this._color);
      p.ellipse(this._pos.x,this._pos.y,this._diameter,this._diameter);
    }

    moveRight(){
      this._pos.x += this._xVel;
    }

    moveLeft(){
      this._pos.x -= this._xVel;
    }

    setColor(color){
      if(color !== this._color)
        this._color = color;
    }
  }

  //*************RAIN DROP CLASS****************//
  class RainDrop extends Player{
    constructor(x){
      super();
      this._yVel = 1;
      this._gravity = PHASES[status.currentPhase].drop*(9.8/10000);
      this._currTime = p.millis();
      this._diameter =10;
      this._pos = {
        x:x,
        y:0
      };
      this._color = PHASES[status.currentPhase].bColor;
    }

    update(){
      let now = p.millis();
      this._yVel = this._yVel + this._gravity*(now - this._currTime);
      this._pos.y += this._yVel;
    }
  }

  //
  const Game = {
    spawnRainDrop:function(){
      status.rainDrops.unshift( new RainDrop(p.random(p.width)) )
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
      status.spawnTimer=9000;
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
        if(status.player._pos.x >= status.player._diameter/2)
          status.player.moveLeft();
      }
      if(p.keyIsDown(p.RIGHT_ARROW)){
        if(status.player._pos.x <= p.width - status.player._diameter/2)
          status.player.moveRight();
      }
//**********DRAW
      status.player.draw();

      for(i = status.rainDrops.length-1; i>=0; i--){
        let drop = status.rainDrops[i];
        if(Game.circleCircleCollide(drop._pos.x,drop._pos.y,drop._diameter,status.player._pos.x,status.player._pos.y,status.player._diameter) && !status.godmode){
          status.currentState = STATE.LOSE;
        }
        drop.draw();
      }

//********UPDATE
      for(i = status.rainDrops.length-1; i>=0; i--){
        let drop = status.rainDrops[i];
        drop.update();
        if(drop._pos.y > p.height+drop._diameter/2){
          status.rainDrops.splice(i,1);
          status.score++;
        }
      }

//*******TIME RELATED STUFF
      let now = p.millis();
      let elapsed = status.elapsedTime();

      if(status.spawnTimer > PHASES[status.currentPhase].freq){
        Game.spawnRainDrop();
        status.spawnTimer = 0;
        status.lastSpawn = now;
      }

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

var myp = new p5(RainDrops);
