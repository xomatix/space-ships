import Network from './network.js';

var socket = new Network();
socket.connect();
socket.watch();
document.addEventListener("message", () => console.log('wywolalo'));;


const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');
if(window.innerWidth<800){
    
    //console.log((document.body.clientWidth-800)*(1));
    //canvas.width = document.body.clientWidth;
    //canvas.height = window.innerWidth;
    canvas.style.transform = 'scale(' + ((document.body.clientWidth/800)*0.9) + ')';

}


let x = 100;
let y = 100;
let radius = 50;
let angle = 45;

//sterowanie
let speedBase = 30;
let frame = 140;
let speed = speedBase;
let shootSpeedBase = 50;
let shootSpeed = shootSpeedBase;
let rotationBase = 30;
let rotation = rotationBase;
let keys = [];
let shoots = [];
let enemies = [];
let fireRate = 1000;//ms co ile milisekund


var lastTimeEach = Date.now(), framerate=1, lastTimeSecond = Date.now(), lastTimeShoot = Date.now();


const image = new Image(50, 50);
image.src = './spaceShip.png';




class Projectile {
    constructor(x, y, radius, color, velX, velY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velX = velX;
        this.velY = velY;
    }

    getCords() {
        console.log(`x: ${this.x}, y: ${this.y}`);
    }

    draw() {
        this.update();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius
            , 0 , Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += shootSpeed * this.velX;
        this.y += shootSpeed * this.velY;
    }

    delete() {
        if (this.x>canvas.width || this.x<0 || this.y>canvas.height || this.y<0){
            return true;
        }
    }

}

export default class Enemy {
    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.a = a;
    }
}

//gameLoop
function drawGame(){
    clearScreen();
    //console.log('drawing' , `rotation: ${angle}`);

    calculateMovement();

    movePlayer();

    checkPlayerPosition();

    drawPlayerImg();

    drawShoots();


    var myTime = Date.now(), //time now
        timePassed = (myTime - lastTimeEach)/100; //time passed since last iteration
        speed = speedBase * timePassed;
        rotation = rotationBase * timePassed;
        shootSpeed = shootSpeedBase * timePassed;
    lastTimeEach = Date.now(); //reset for next iteration

    framerate++;
    if ((myTime-1000)>lastTimeSecond) { //one second has passed
        //console.log(framerate);
        document.getElementById('fps').innerText = framerate + ' fps';
        framerate=0; //reset framerate
        lastTimeSecond = Date.now(); //reset for next second
    }
}

function drawEnemies() {

}

function createEnemy() {
    
}

function drawPlayerImg(){
    ctx.save();
    
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    

    ctx.drawImage(image, -(image.width/2), -(image.height/2), image.width, image.height);
    
    //odwróć
    ctx.restore();

}

function shoot(){
    if (lastTimeShoot + fireRate < Date.now()) {
        sendMessage();
        //console.log(shoots);
        lastTimeShoot = Date.now(); //reset
        shoots[lastTimeShoot] = new Projectile(x, y, 5, 'red',
         Math.cos(angle * Math.PI / 180),
         Math.sin(angle * Math.PI / 180));
        
    }

}

function sendMessage(){
    var player = {posx:x, posy:y, type: 'enemy', a: angle};
    socket.send(JSON.stringify(player));
}


function drawShoots() {
    //console.log(shoots);
    for (var s in shoots) {
        //shoots[s].update();
        shoots[s].draw();
        if (shoots[s].delete()) {
            delete shoots[s];
        }
    }
}

function checkPlayerPosition(){
    if(x > 820) {
        x = -19;
    }
    if(x < -20) {
        x = 819;
    }
    if(y > 820) {
        y = -19;
    }
    if(y < -20) {
        y = 819;
    }
}

function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.beginPath();


    ctx.rect(x, y, 50, 50);
    //kolo
   // ctx.arc(x, y , radius, 0, Math.PI * 2);
    ctx.fill();
}

function movePlayer() {
    x += speed * Math.cos(angle * Math.PI / 180);
    y += speed * Math.sin(angle * Math.PI / 180);
}

function clearScreen(){
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function calculateMovement(){
    if (keys[' ']) {shoot();}
 
     if (keys['ArrowLeft'] && angle>0) {angle-=rotation;}
     else if (keys['ArrowLeft'] && angle<=0) {angle=359;}
     if (keys['ArrowRight'] && angle<360) {angle+=rotation;}
     else if (keys['ArrowRight'] && angle>359) {angle=1;}
} 

document.addEventListener('keydown', k => {
    keys[k.key] = true;
    //console.log(keys)
    /**
     * 
     if (k.key == 'w') {y-=1;}
     if (k.key == 's') {y+=1;}
     if (k.key == 'a') {x-=1;}
     if (k.key == 'd') {x+=1;}
     if (k.key == ' ') {shoot();}
 
     if (k.key == 'ArrowLeft' && angle>0) {angle-=rotation;}
     else if (k.key == 'ArrowLeft' && angle<=0) {angle=359;}
     if (k.key == 'ArrowRight' && angle<360) {angle+=rotation;}
     else if (k.key == 'ArrowRight' && angle>359) {angle=1;}
     */

});

document.addEventListener('keyup', k => {
    delete keys[k.key];


});

//gameLoop call start
setInterval(drawGame,1000/frame);
