
var scene, camera, bricks, grass,renderer, mesh, meshfloor, board1, board2, board3, board4 ;
var keyboard = {} ;
var player = {height : 0.1, speed: 0.2} ;
var USE_WIREFRAME = false ;
//var meshes = []; 

function init(){
	scene = new THREE.Scene() ;

	camera = new THREE.PerspectiveCamera(90 , window.innerWidth/window.innerHeight, 0.1, 1000) ;

	var textureLoder = new THREE.TextureLoader() ;
	bricks = new textureLoder.load("textures/RedSandyWhite_S.jpg") 
	grass = new textureLoder.load("textures/grass.png") ;

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color : 0xff4444, wireframe: USE_WIREFRAME })
		);

	mesh.castShadow = true ;
	mesh.receiveShadow = true ;
	mesh.position.y += 0.6;
	scene.add(mesh) ;//


	/*var loader = new THREE.TextureLoader();
	loader.crossOrigin = "";

	loader.load("textures/blocks1.jpg" ,
	function ( texture ) {
		texture.minFilter = THREE.NearestFilter;
		var material = new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide } );
		var myBox2mesh = new THREE.Mesh(mesh, material);
		// add mesh to scene:
		scene.add( myBox2mesh );
	},
	function () {},  // onProgress function
	function ( error ) { console.log( error ) });*/  // no error gets logged*/

	//MeshFloor is our surface
	meshfloor = new THREE.Mesh(
		new THREE.PlaneGeometry(20, 20, 20, 20),
		new THREE.MeshPhongMaterial({color: 0xffffff, side : THREE.DoubleSide, map: grass})
		);

		meshfloor.receiveShadow = true ; 
		meshfloor.rotation.x -= Math.PI / 2; 
		scene.add(meshfloor) ;

		/*FRONT BOARD*/
		board1 = new THREE.Mesh(
			new THREE.PlaneGeometry(20, 3, 0 , 0),
			new THREE.MeshPhongMaterial({color: 0xffffff, side : THREE.DoubleSide, map : bricks })
			);

		board1.position.y += 1 ;
		board1.position.z += 10 ;
		board1.rotation.x += Math.PI ;
		// scene.add(board1) ;

		/*LEFT BOARD*/
		board2 = new THREE.Mesh(
			new THREE.PlaneGeometry(20, 3, 0 , 0),
			new THREE.MeshPhongMaterial({color: 0xffffff, side : THREE.DoubleSide, map : bricks })
			);
		board2.position.y += 1 ;
		board2.position.x += 10 ;
		board2.rotation.y += -Math.PI/2 ;
		scene.add(board2) ;

		/*BACK BOARD*/
		board3 = new THREE.Mesh(
			new THREE.PlaneGeometry(20, 3, 0 , 0),
			new THREE.MeshPhongMaterial({color: 0xffffff, side : THREE.DoubleSide, map : bricks })
			);

		board3.position.y += 1 ;
		board3.position.z -= 10 ;
		board3.rotation.z += -Math.PI ;
		scene.add(board3) ;

		/*RIGHT BOARD*/
		board4 = new THREE.Mesh(
			new THREE.PlaneGeometry(20, 3, 0 , 0),
			new THREE.MeshPhongMaterial({color: 0xffffff, side : THREE.DoubleSide, map : bricks })
			);
		board4.position.y += 1 ;
		board4.position.x -= 10 ;
		board4.rotation.y += Math.PI/2 ;
		scene.add(board4) ; 

		//Ambient Light supports Point light
		ambientLight = new THREE.AmbientLight(0xffffff, 0.2) ;
		scene.add(ambientLight) ;


		/// The Pointy Light is the most important light amongst them all
		light = new THREE.PointLight(0xffffff, 0.9, 18);
		light.position.set(-3,6,-3);
		light.castShadow = true ;
		light.shadow.camera.near = 0.1 ;
		light.shadow.camera.far = 25 ;
		scene.add(light) ;

		camera.position.set(0,player.height,-5) ;
		camera.lookAt(new THREE.Vector3(0,player.height,0))	;

		renderer = new THREE.WebGLRenderer({antialias: true}) ;
		renderer.setSize(1280, 720) ;

		renderer.shadowMap.enabled = true ;
		renderer.shadowMap.type = THREE.BasicShadowMap ;

		document.body.appendChild(renderer.domElement) ;

		animate() ;

}


function animate(){
	requestAnimationFrame(animate) ;

	 //UP ARROW
	 if(keyboard[38] && mesh.position.z < 9.5){
	 	mesh.position.z += .02 ;
	 }

	 //DOWN ARROW
	 if (keyboard[40] && mesh.position.z > -9.5){
	 	mesh.position.z -= 0.02 ;
	 }

   	// W
	if (keyboard[87]){
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += Math.cos(camera.rotation.y) * player.speed;
	}
	// S
	if (keyboard[83]){
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
		}

	// A
	if (keyboard[65]){ 
		camera.rotation.y -= Math.PI * 0.03 ; 
	}
	// D
	if (keyboard[68]){
		camera.rotation.y += Math.PI * 0.03 ;
	}
	
	renderer.render(scene, camera); 
}


function keyDown(Event){
	keyboard[event.keyCode] = true ;
}

function keyUp(Event) {
	keyboard[event.keyCode] = false ;
}

window.addEventListener('keydown', keyDown) ; 
window.addEventListener('keyup', keyUp) ;

window.onload = init ;