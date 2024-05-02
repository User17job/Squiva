const finish = document.querySelector(".aviso");
const puntos = document.querySelector(".score");
const Maxpuntos = document.querySelector(".Maxscore");
let config = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    physics:{
        default:"arcade",
        arcade:{
            gravity:{y:300},
            debug:false
        }
    },
    scene:{
        preload: preload,  
        create:create,  
        update:update  
    }
};
let score = 0;
let scoreText;
let MaxScoreSet;
let MaxScore;
let gameOver= false
let game = new Phaser.Game(config);
// let restart;

// antes de todo 
function preload(){
    this.load.image("sky", "town.png");
    this.load.image("bomb", "bomb.png");
    this.load.image("star", "star.png");
    this.load.image("ground", "platform.png");
    this.load.spritesheet("dude", "dude.png", {frameWidth: 32, frameHeight: 48});
}
// aqui van casi todas las funciones 
function create(){
    this.add.image(400, 300, "sky");
    //crear las plataformas
    platforms = this.physics.add.staticGroup()

        // consfigurar las plataformas
        platforms.create(400, 568, "ground").setScale(2).refreshBody();

        platforms.create(600, 400, "ground");
        platforms.create(50, 250, "ground");

        platforms.create(750, 220, "ground");

    jugador = this.physics.add.sprite(100, 450, "dude");
     
    jugador.setCollideWorldBounds(true);
    jugador.setBounce(0.25);


    //movimiento
    this.anims.create({
        key:"left",
        frames: this.anims.generateFrameNumbers("dude",{start:0, end: 3}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:"turn",
        frames: [{key: "dude", frame: 4}],
        frameRate:20
    });

    this.anims.create({
        key:"right",
        frames: this.anims.generateFrameNumbers("dude",{start:5, end: 8}),
        frameRate:10,
        repeat:-1
    });

    // jugador.body.setGravityY(300);//gravedad del personaje 

    //colision con las plataformas
    this.physics.add.collider(jugador,platforms);

    cursors= this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key:"star",
        repeat:11,
        setXY:{x:12, y: 0, stepX:70}
    });
    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })
    this.physics.add.collider(platforms, stars);

    // llamar a la funcion para crear el efecto de tomar las estrellas 
    this.physics.add.overlap(jugador, stars, collectStars, null, true);

    // configuramos los  textos con la maxima puntuacion y con la puntuacion normal 
    scoreText= this.add.text(16, 16, "Score: 0", {
        fontSize:"32px", fill:"#000"
    });

    MaxScoreSet= this.add.text(16, 45, "MaxScore: 0", {
        fontSize:"27px", fill:"#003277"
    });    

    // creamos la bombas  con todo y su "collider"
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, jugador, hitBomb, null, this);


    //acomodamos la puntuacionMax para que apareczca al iniciar 
    if(puntuacionMax<10){
        MaxScoreSet.setText("mAxScOrE: 0");
    }else{
        MaxScoreSet.setText("mAxScOrE: " + puntuacionMax);
    }
}
// mande a llamar esto para podermostraren pantalla la puntuacion final. *lo podia poner en cualquier lado que no fuera dentro de una funcion* 
const puntuacionMax= localStorage.getItem("puntuacion");

// para actualizar el movimiento
function update(){
    // game Over
    if(gameOver){
        return
    }
    //comenzamos con la izquierda
    if(cursors.left.isDown){//
        jugador.setVelocityX(-160);//su velocidad
        jugador.anims.play("left", true);
    }else if(cursors.right.isDown){//derecha
        jugador.setVelocityX(160);
        jugador.anims.play("right", true);
    }else{
        jugador.setVelocityX(0);//parar
        jugador.anims.play("turn");
    }

    // && jugador.body.touching.up
    if(cursors.down.isDown ){//saltosssss
        jugador.setVelocityY(330);
    }
    if(cursors.up.isDown && jugador.body.touching.down){//saltosssss
        jugador.setVelocityY(-330);
    }
}

//coleccionar las estrellas
function collectStars(jugador, star){
    star.disableBody(true, true);
    score+= 10;
    scoreText.setText("score: " + score);

    // MaxScoreSet.setText("mAxScOrE: " + puntuacionMax);
   
    if(stars.countActive(true) === 0){
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });
        let x = (jugador.x < 400) ? Phaser.Math.Between(400, 800): Phaser.Math.Between(0, 400); 
    
        let bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
    MaxScore=score;

    let conNumber=parseInt(puntuacionMax);
    const avisoRecord = document.querySelector('#recordd');

    if(MaxScore===conNumber){
        avisoRecord.classList.add("record");
    }
    // aqui le fui aplicando un poco de dificultad modificando el mundo 
    if(score === 600){
         reAcomodar();
    }
    if(score === 1000){
        reAcomodar1();
    }
};

//recargar 
const btn = document.querySelector("button");
btn.addEventListener("click", function(){
    location.reload();
})

const audio = document.querySelector("audio")
function hitBomb(jugador, bomb){
    this.physics.pause();
    audio.pause();
    audio.currentTime = 0;

    MaxScore=score;
    puntos.textContent=`Puntos: ${MaxScore}`;
    Maxpuntos.textContent=`Record: ${puntuacionMax}`;
    finish.style.display="block";

    if(MaxScore>puntuacionMax){
        const maxima = localStorage.setItem("puntuacion", MaxScore);
    }

    jugador.setTint(0xff0000);
    jugador.anims.play('turn');
    
    gameOver = true;
}


function reAcomodar(){
    platforms.create(800, 120, "ground");
}
function reAcomodar1(){
    platforms.create(110, 400, "ground");
}
