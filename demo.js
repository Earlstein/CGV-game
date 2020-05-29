
var scene, camera, renderer, mesh, clock;

var meshFloor, outer_grid ;

var ambientLight, light;


var crate, crateTexture, crateNormalMap, crateBumpMap;

var skybox ;

var keyboard = {};

var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02, canShoot:0 };

var USE_WIREFRAME = false;

///The Loading Screen
var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};


var loadingManager = null;


var RESOURCES_LOADED = false;

// Models index
var models = {
	uzi: {
		obj:"models/uziGold.obj",
		mtl:"models/uziGold.mtl",
		mesh: null,
		castShadow:false
	}
};


// Meshes index
var meshes = {};


// Bullets array
var bullets = [];


/*
*
*
*
*
*
*/
function addTexture(imageURL, material){

	//This function we gon' use for adding texture to any object
	//Asynchronously loading pictures/textures 
	
	function callback(){
		if (material){
			material.map = texture;
			material.needsUpdate = false ;
		}
	}
	var texture = new THREE.ImageUtils.loadTexture(imageURL, undefined, callback);

	return texture ;
}
/*
*
*
*
*
*
*/

/* Let's try to avoid spaghetti code but have more functions(!!!!!!!IMPORTANT)
 * Outermost Walls
 * The Ground as well
*/

function fixedGround(){

	//Heiracachial Modelling
	//The round and the fpour outer walls are the children of outer_grid
	//Somebody please find better pictures/textures to use for outer walls, THEY SUCK :(....big time

	outer_grid = new THREE.Object3D();

	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(300,300, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
	);

	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	console.log ("Mesh Floor Position " + meshFloor.position.x + " " + meshFloor.position.y + " " + meshFloor.position.z) ;
	outer_grid.add(meshFloor);

	var wall1 = new THREE.Mesh(new THREE.BoxGeometry(3, 20, 300),new THREE.MeshBasicMaterial({map:addTexture("textures/6.jpg")}));
	wall1.rotation.y = Math.PI;
	wall1.position.x = 150;
	outer_grid.add(wall1);

	var wall1 = new THREE.Mesh(new THREE.BoxGeometry(3, 20, 300),new THREE.MeshBasicMaterial({map:addTexture("textures/6.jpg")}));
	wall1.rotation.y = Math.PI;
	wall1.position.x = -150;
	outer_grid.add(wall1);

	var wall1 = new THREE.Mesh(new THREE.BoxGeometry(3, 20, 300),new THREE.MeshBasicMaterial({map:addTexture("textures/6.jpg")}));
	wall1.rotation.y = Math.PI/2;
	wall1.position.z = 150;
	outer_grid.add(wall1);

	var wall1 = new THREE.Mesh(new THREE.BoxGeometry(3, 20, 300),new THREE.MeshBasicMaterial({map:addTexture("textures/6.jpg")}));
	wall1.rotation.y = Math.PI/2;
	wall1.position.z = -150;
	outer_grid.add(wall1);

	scene.add(outer_grid) ;

}

function makeWorld(){
	//Making a scene
	scene = new THREE.Scene();
	
	//Camera
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	clock = new THREE.Clock();
	
	
	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	meshFloor = fixedGround() ;

	// ---------------------Lights-------------------------------------- 

	// Mahlatse added more Lights ---> He once said 'Let there Mahlatse, to bring light :) :)'
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light); 
	
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(40,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(25,50,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);


	var textureLoader = new THREE.TextureLoader(loadingManager);

	crateTexture = addTexture("textures/crate0/crate0_diffuse.jpg") 
	crateBumpMap = addTexture("textures/crate0/crate0_bump.jpg") 
	crateNormalMap = addTexture("textures/crate0/crate0_normal.jpg") 
	
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(3,3,3),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			map:crateTexture,
			bumpMap:crateBumpMap,
			normalMap:crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(2.5, 3/2, 2.5);
	crate.receiveShadow = true;
	crate.castShadow = true;

	//Outer walls:
	var wall = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall.position.y = 3;
	wall.position.x=-10;
	scene.add(wall);

	var wall0 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall0.position.x = 10;
	scene.add(wall0);

	var wall1 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall1.rotation.y = Math.PI/2;
	wall1.position.x = 10;
	scene.add(wall1);


	var wall2 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall2.rotation.y = Math.PI/2;
	wall2.position.x = -20;
	scene.add(wall2);


	var wall3 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall3.rotation.y = Math.PI/2;
	wall3.position.z = -10;
	scene.add(wall3);

	var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall4.rotation.y = Math.PI/2;
	wall4.position.z = 10;
	wall4.position.x = -7;
	scene.add(wall4);

	//**************************************
	//Mahlatse : "I was trying to make walls can somebody draws better please"

	///Please after drawing walls, try to take em to the fixed_ground function such that we can Heirachical Model since it's a need
	var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall4.rotation.y = Math.PI/2;
	wall4.position.z = 10;
	wall4.position.x = 22;
	scene.add(wall4);

	var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall4.rotation.y = Math.PI/2;
	//wall4.position.z = 10;
	wall4.position.x = 23;
	scene.add(wall4);

	var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall4.rotation.y = Math.PI/2;
	wall4.position.z = 1;
	wall4.position.x = 35;
	scene.add(wall4);

	var wall4 = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20),new THREE.MeshBasicMaterial({map:addTexture("textures/blocks1.jpg")}));
	wall4.rotation.y = Math.PI/2;
	wall4.position.x = 30;
	scene.add(wall4);

	//Tryin to make walls (up)
	//*****************************



	//------------------------------------------------------------------------------------------------------------------------
	//skybox
	let materialArray = [];
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_ft.png' ), shading: THREE.FlatShading} ));
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_bk.png' ), shading: THREE.FlatShading}));
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_up.png' ), shading: THREE.FlatShading}));
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_dn.png' ), shading: THREE.FlatShading}));
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_rt.png' ), shading: THREE.FlatShading}));
            materialArray.push(new THREE.MeshBasicMaterial( { map: addTexture( 'textures/night/corona_lf.png' ), shading: THREE.FlatShading}));

            for (let i = 0; i < 6; i++)
                materialArray[i].side = THREE.BackSide;

            var skyGeometry = new THREE.CubeGeometry( 600, 600, 600);
            skybox = new THREE.Mesh( skyGeometry, materialArray );
            skybox.rotation.x = -Math.PI / 2 ;
            scene.add( skybox );
}

/*
*
*
*
*
*
*/

function loadingModels(){

	// Load models
	// REMEMBER: Loading in Javascript is asynchronous, so you need
	// to wrap the code in a function and pass it the index. If you
	// don't, then the index '_key' can change while the model is being
	// downloaded, and so the wrong model will be matched with the wrong
	// index key.

	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							if('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;
							
							if('receiveShadow' in models[key])
								node.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
}

/*
*
*
*
*
*
*/

// Runs when all resources are loaded
function onResourcesLoaded(){
	
	// player weapon
	meshes["playerweapon"] = models.uzi.mesh.clone();
	meshes["playerweapon"].position.set(0,2,0);
	meshes["playerweapon"].scale.set(10,10,10);
	scene.add(meshes["playerweapon"]);
}

/*
*
*
*
*
*
*/

function animate(){

	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;

		}

	requestAnimationFrame(animate);


	
	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
	

	crate.rotation.y += 0.01;
	
	// go through bullets array and update position
	// remove bullets when appropriate
	for(var index=0; index<bullets.length; index+=1){
		if( bullets[index] === undefined ) continue;
		if( bullets[index].alive == false ){
			bullets.splice(index,1);
			continue;
		}
		
		bullets[index].position.add(bullets[index].velocity);
	}
	
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	
	// shoot a bullet
	if(keyboard[32] && player.canShoot <= 0){ // spacebar key
		// creates a bullet as a Mesh object
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(0.05,8,8),
			new THREE.MeshBasicMaterial({color:0xffffff})
		);
		
		// position the bullet to come from the player's weapon
		bullet.position.set(
			meshes["playerweapon"].position.x,
			meshes["playerweapon"].position.y + 0.15,
			meshes["playerweapon"].position.z
		);
		
		// set the velocity of the bullet
		bullet.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		
		// after 1000ms, set alive to false and remove from scene
		// setting alive to false flags our update code to remove
		// the bullet from the bullets array
		bullet.alive = true;
		setTimeout(function(){
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);
		
		// add to scene, array, and set the delay to 10 frames
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 10;
	}
	if(player.canShoot > 0) player.canShoot -= 1;
	
	// position the gun in front of the camera
	meshes["playerweapon"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/6) * 0.75,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/6) * 0.75
	);
	meshes["playerweapon"].rotation.set(
		camera.rotation.x,
		camera.rotation.y - Math.PI,
		camera.rotation.z
	);
	
	//We have our skybox rotating
	skybox.rotation.x += 0.0002 ;
	skybox.rotation.y += 0.0001 ;

	renderer.render(scene, camera);
}

/*
*
*
*
*
*
*/

function init(){
	
	try{

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);

	}
	catch(e){
		console.log("Error : " + e);
	}
	
	makeWorld() ;
	loadingModels() ;
	animate();
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

