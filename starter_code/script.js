window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  //Clase para generar el fondo
  function Board() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.sound = new Audio();
    this.sound.src = "http://66.90.93.122/ost/super-mario-bros.-1-3-anthology/gczrgwrx/1%2001%20Main%20Theme%20Overworld.mp3";
    this.img = new Image();
    this.img.src = "images/bg.png"
    this.img.onload = function(){
      this.draw();
    }.bind(this);
    this.move = ()=>{
      (this.x < -canvas.width) ? this.x = 0 : this.x --;
    }
    this.draw = ()=>{
      this.move();
      ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
      ctx.drawImage(this.img,this.x+this.width,this.y,this.width,this.height);
    }
  }

  //Clase para generar al Flappy;
  function Flappy(x,y){
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.sound = new Audio();
    this.sound.src = "http://soundfxcenter.com/video-games/super-mario-bros/8d82b5_Super_Mario_Bros_Jump_Super_Sound_Effect.mp3";
    this.img = new Image();
    this.img.src = "images/flappy.png";
    this.img.onload = function(){
      this.draw();
    }.bind(this);
    this.draw = ()=>{
      this.y++;
      ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
      (((this.y < 0) || (this.y > (canvas.height - this.height))) && gameOver());
    }
    this.move = ()=>{
      this.sound.currentTime = 0.1;
      this.sound.play();
      this.y -= 50;
    }

    this.left   = function() { return this.x                 }
    this.right  = function() { return (this.x + this.width)  }
    this.top    = function() { return this.y                 }
    this.bottom = function() { return this.y + (this.height) }
    
    this.crashWith = function(obstacle) {
      return !((this.bottom() < obstacle.top())    ||
               (this.top()    > obstacle.bottom()) ||
               (this.right()  < obstacle.left())   ||
               (this.left()   > obstacle.right())) 
    }
  }

  //Clase para crear pipes
  function Pipe(y, height){
    this.x = canvas.width;
    this.y = y;
    this.width = 20;
    this.height = height;
    this.img = new Image();
    (y == 0) ? this.img.src = "images/obstacle_top.png":
    this.img.src = "images/obstacle_bottom.png";
    this.img.onload = function(){
      this.draw();
    }.bind(this);
    this.draw = ()=>{
      this.x--;
      ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
    this.left   = function() { return this.x                 }
    this.right  = function() { return (this.x + this.width)  }
    this.top    = function() { return this.y                 }
    this.bottom = function() { return this.y + (this.height) }
  }

  //Refresca el canvas con todos los elementos en su nueva posicion
  function update(){
    frames++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    board.draw();
    showScore();
    flappy.draw();
    generatePipes();
    drawPipes();
    checkCrash();
    //flappy2.draw();
  }

  //Revisa si el flappy colisiona con algun pipe
  function checkCrash() {
    for(i = 0; i < pipes.length; i += 1) {
      if (flappy.crashWith(pipes[i])) {
          gameOver();
          return;
      } 
    }
  }

  //Detiene la funcion ciclica
  function stop() {
    clearInterval(interval);
    interval = 0;
    board.sound.pause();
  }

  //Termina el juego deteniendolo y dibujando el score y game over
  function gameOver() {
    let deadSound = new Audio();
    deadSound.src = "http://66.90.93.122/ost/super-mario-bros.-1-3-anthology/hlmfjcem/1%2008%20You%20Re%20Dead.mp3";
    deadSound.currentTime = 0.5;
    deadSound.play();
    stop();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = "120px courier";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 6;
    ctx.strokeText("Game Over",30,200);
    ctx.font = "40px courier";
    ctx.fillStyle = "white";
    ctx.fillText("Your score was "+points,140,270);
    console.log(pipes.length);
  }

  //Genera un nuevo pipe con altura aleatoria cada 250 frames
  function generatePipes(){
    (frames%250 == 0) &&
    (random = Math.floor(Math.random()*200)+50,
    pipes.push(new Pipe(0,random)),
    pipes.push(new Pipe(random+130,canvas.height-(random+130))),
    (pipes.length > 8) && pipes.splice(0,2),
    board.sound.pause(),
    (board.sound.playbackRate < 1.5) && (board.sound.playbackRate += 0.025),
    board.sound.play()
    )
  }

  //Dibuja todos los pipes del arreglo
  function drawPipes(){
    pipes.forEach((pipe)=>{
      pipe.draw();
    });
  }

  //Muestra el score del jugador
  function showScore(){
      points = (Math.floor(frames/6))
      ctx.font = '20px serif';
      ctx.fillStyle = 'black';
      ctx.fillText('Score: '+points, 50, 50);
  }

  //Declaraciones
  let interval;
  let frames;
  let board;
  let flappy;
  let pipes;

  //Función de arranque
  function startGame() {
    if (interval > 0) return;
    frames = 0;
    board = new Board();
    flappy = new Flappy(150,150);
    pipes = [];
    board.sound.play();
    interval = setInterval(()=>{
      update();
    },1000/60);
  }

  //Listener de la tecla flecha hacia arriba
  document.onkeydown = function(e) {
    (e.keyCode == 38) && flappy.move();
  }
  document.ontouchstart = function(e) {
    flappy.move();
  }
};