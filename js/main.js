const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0x99CCFF, 1);


const light = new THREE.AmbientLight( 0xffffff ); 
scene.add( light );

const start_position=3.3;
const end_position=-start_position;
const text=document.querySelector(".text");
const TIME_LIMIT=20;
let gameStat="loading";
let isLookingBackward=true;
var sound1=new Audio('/sounds/sq.mp3');
sound1.loop=true;
var sound2=new Audio('/sounds/shoot.mp3');
var sound3=new Audio('/sounds/round.mp3');


function createCube(size,positionX,rotY=0,color=0xfbc851){
    const geometry = new THREE.BoxGeometry(size.w,size.h,size.d);
const material = new THREE.MeshBasicMaterial( { color: color } );
const cube = new THREE.Mesh( geometry, material );
cube.position.x=positionX;
cube.rotation.y=rotY;
scene.add( cube );
return cube;
};
camera.position.z = 5;

const loader = new THREE.GLTFLoader();
function delay(ms) { 
    return new Promise(resolve => setTimeout(resolve,ms));
 };
    class Doll{
        constructor(){
            loader.load("../models/scene.gltf", (gltf) => {
                scene.add( gltf.scene );            
                gltf.scene.position.set(0, -1, 0);
                gltf.scene.scale.set(.35,.35,.35);
                this.doll=gltf.scene;
                });
        }

        lookBackward(){
            
            gsap.to(this.doll.rotation,{y:-3.15,duration: .45});
            setTimeout(() => isLookingBackward=true,150);
        };
        lookForward(){
            
            gsap.to(this.doll.rotation,{y:0,duration: .45});
            setTimeout(() => isLookingBackward=false,450);
        };
        async start(){
        this.lookBackward();
        await delay((Math.random()*1000)+1000);
        this.lookForward();
        await delay((Math.random()*750)+750);
        this.start();
        }
    };

    function createTrack() {
        createCube({w:start_position*4+.2,h:1.5,d:1},0,0, 0xe5a716).position.z=-1;
        createCube({w:.2,h:1.5,d:1},start_position*2,-.35);
        createCube({w:.2,h:1.5,d:1},end_position*2, .35);
       

      };
      createTrack();
      
  

class Player{
    constructor(){
        const geometry = new THREE.SphereGeometry( .3, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0x249f9c } );
const sphere = new THREE.Mesh( geometry, material );
sphere.position.z=1;
sphere.position.x=start_position;
scene.add( sphere );
this.player=sphere;
this.playerInfo={
    positionX:start_position+1,
    velocity:0
};
    }
    run(){
        
        this.playerInfo.velocity=.03;
    };
    stop(){
        gsap.to(this.playerInfo,{velocity:0,duration:.3});
    };
    check(){
        if(this.playerInfo.velocity>0 && !isLookingBackward){
            sound1.pause();
            sound2.play();
            sound3.pause();
           
            text.innerText="ELIMINATED";
        
            gameStat="over";
            setTimeout(function(){
                location.reload();
            },4000);
            
        }
        if(this.playerInfo.positionX < end_position-1)
        {
            sound1.pause();
            sound2.pause();
            sound3.play();
            text.innerText="WON";
            gameStat="over";
            setTimeout(function(){
                location.reload();
            },6000);
        }
    }
    update(){
        this.check();
        this.playerInfo.positionX-=this.playerInfo.velocity;
        this.player.position.x=this.playerInfo.positionX;
    };
};

const player= new Player();
 let doll = new Doll();
 async function init() {
      gameStat="loading";
      await delay(500);
        text.innerText="STARTING IN 3";
        await delay(500);
        text.innerText="STARTING IN 2";
        await delay(500);
        text.innerText="STARTING IN 1";
        await delay(500);
        text.innerText="RUN!";
        sound1.play();
        sound2.pause();
        sound3.pause();
        startGame();
      
   }

function startGame(){
    
    let progressBar=createCube({w:8,h:.1,d:1},0,0,0x63f542);
    progressBar.position.y=3.35;
    gsap.to(progressBar.scale,{x:0,duration:TIME_LIMIT,EASE:"none"})
    gameStat="started";
    doll.start();
    setTimeout(()=>{
        if(gameStat!="over")
        {   
            sound1.pause();
            sound2.play();
            sound3.pause();
            text.innerText="ELIMINATED";
            gameStat="over";
            setTimeout(function(){
                location.reload();
            },4000);   
        }
    },TIME_LIMIT*1020);
};

   init();


function animate() {
    if(gameStat=="over") return;
    renderer.render( scene, camera );
	requestAnimationFrame( animate );
    player.update();
};
animate();

window.addEventListener('resize',onWindowResize,false);
function onWindowResize(){
    camera.aspect= window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
};

window.addEventListener('keydown',(e)=>{
    if(gameStat != "started") return;
    else{
        text.innerText="";
    };
    if(e.key=="ArrowUp"){

        player.run();
       
  
}

});
window.addEventListener('keyup',(e)=>{
    if(e.key=="ArrowUp"){
        player.stop();
    }
});



