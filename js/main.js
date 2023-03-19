// get our canva
let fishes = [];
let shark;
let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};
let followCamera;
let score = 0;
async function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = await createScene();
  addFishes(scene);
  modifySettings();
  // run the render loop
  // render : resituer
  console.log(fishes.length + " fishes");
  engine.runRenderLoop(() => {
    let deltaTime = engine.getDeltaTime(); // remind you something ?
    shark.move();
   
    scene.render();
  });
}
//create a scene
async function createScene() {
  scene = new BABYLON.Scene(engine);
  createLight(scene);
  skybox2(scene);
  createGround(scene);

  shark = await createShark(scene);
  console.log(shark);
  if (shark) {
    followCamera = createFollowCamera(scene, shark);
    scene.activeCamera = followCamera;
  }


  return scene;
}
//sky from image
function skybox2(scene) {
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "assets/images/cubemap/",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
}
//simple blue sky
function createSkybox(scene, textureName, size) {
  var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
  skyMaterial.backFaceCulling = false;

  skyMaterial.inclination = 0; //The solar inclination angle in radians
  skyMaterial.azimuth = 0; //The solar azimuth angle in radians
  skyMaterial.luminance = 1; //The overall luminance of sky
  skyMaterial.turbidity = 10; //The amount of haze and dust
  skyMaterial.rayleigh = 2.5; //The length of the rayleigh scattering
  skyMaterial.mieCoefficient = 0.005; //The mie coefficient
  skyMaterial.mieDirectionalG = 0.7; //The mie directional G value
  skyMaterial.distance = 500; //The distance of the sky from the camera
  skyMaterial.useSunPosition = true; //Use the position of the sun instead of inclination/azimuth

  skyMaterial.useClouds = true; //Enable or disable clouds
  skyMaterial.cloudDensity = 0.4; //The density of the clouds
  skyMaterial.cloudColor = new BABYLON.Color3(1, 1, 1); //The color of the clouds

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  skybox.material = skyMaterial;
  skybox.infiniteDistance = true;

  return skybox;
}
// create a ground
function createGround(scene) {
  const groundOptions = {
    width: 500,
    height: 500,
    subdivisions: 20,
    minHeight: 0,
    maxHeight: 10,
    onReady: onGroundCreated,
  };

  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "gdhm",
    "assets/images/hmap1.png",
    groundOptions,
    scene
  );


  function onGroundCreated() {
    const groundMaterial = new BABYLON.StandardMaterial(
      "groundMaterial",
      scene
    );
    groundMaterial.diffuseTexture = new BABYLON.Texture(
      "assets/images/ocean.jpg"
    );
    ground.material = groundMaterial;
    
    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //create water ground 
/*
    const waterMaterial = new BABYLON.StandardMaterial("waterMaterial", scene);
    const waterTexture = new BABYLON.WaterMaterial("waterTexture", scene);
    waterTexture.bumpTexture = new BABYLON.Texture("assets/images/waterbump.png", scene);
    waterTexture.windForce = -10;
    waterTexture.waveHeight = 0.1;
    waterTexture.bumpHeight = 0.1;
    waterTexture.waveLength = 0.1;
    waterTexture.colorBlendFactor = 0;
    waterTexture.addToRenderList(ground);
    waterMaterial.reflectionTexture = waterTexture;
    waterMaterial.refractionTexture = waterTexture;
    waterMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    waterMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    waterMaterial.alpha = 0.9;
    waterMaterial.specularPower = 16;
    waterMaterial.addToRenderList(scene.skybox);

    const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 500, 500, 1, scene, false);
    waterMesh.material = waterMaterial;
    waterMesh.position.y = -1;
    */

  return ground;
}
}
//create a free camera
function createFreeCamera(scene) {
  const camera = new BABYLON.FreeCamera(
    "FreeCamera",
    new BABYLON.Vector3(0, 2, -5),
    scene
  );
  //  camera.attachControl(canvas, true);
}

//create a follow camera
function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("sharkFollowCamera", target.position, scene, target);

    camera.radius = 13; // how far from the object to follow
	camera.heightOffset = 4; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
}
// create a light
//up on the sky and light up the scene / from above
function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "HemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
}
let zMovement = 5;
//creating a shark
async function createShark(scene) {
  let shark = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/",
    "shark.glb",
    scene
  );




  if (shark.meshes.length > 0) {
    
    shark.meshes[0].position = new BABYLON.Vector3(0, 1, 0);
    shark.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    shark.meshes[0].frontVector = new BABYLON.Vector3(0, 0, 1);
    shark.meshes[0].speed = 0.1;
     shark.meshes[0].move = () => { 
      let sharkActionManager = new BABYLON.ActionManager(scene);

      // register an action to be triggered when the shark collides with a fish
      sharkActionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: { mesh: shark.meshes[0], usePreciseIntersection: true }
          },
          function (evt) {
            let fishMesh = evt.source;
            // remove fish from array and scene
            let index = fishes.indexOf(fishMesh);
            if (index > -1) {
              fishes.splice(index, 1);
              fishMesh.dispose();
              score++;
              console.log(score);
            }
          }
        )
      ); 
      
      let yMovement = 0;
      if (shark.meshes[0].position.y > 2) {
        zMovement = 0;
        yMovement = -2;
      }

      if (inputStates.up) {
 
        shark.meshes[0].moveWithCollisions(new BABYLON.Vector3(0, 0, -1*shark.meshes[0].speed));

      } 
      if (inputStates.down) {
        shark.meshes[0].moveWithCollisions(new BABYLON.Vector3(0, 0, +1*shark.meshes[0].speed));
      }
      if (inputStates.left) {

     shark.meshes[0].moveWithCollisions(new BABYLON.Vector3(1*shark.meshes[0].speed, 0, 0));
        
      }
      if (inputStates.right) {

     shark.meshes[0].moveWithCollisions(new BABYLON.Vector3(-1*shark.meshes[0].speed, 0, 0));
    
      }
    }
    return shark.meshes[0];
  } else {
    console.error("No meshes found in shark.glb");
    return null;
  }
}

//creating fishes
async function createFish(scene) {
  let fish = await BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/",
    "fish.glb",
    scene
  );
  if (fish.meshes.length > 0) {
    fish.meshes[0].name = "fish";
    let xrand = Math.floor(Math.random()*500 ) - 250;
    let zrand = Math.floor(Math.random()*500) - 250;
    fish.meshes[0].position = new BABYLON.Vector3(xrand, 1, zrand);
    fish.meshes[0].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
    return fish.meshes[0];
  } else {
    console.error("No meshes found in fish.glb");
    return null;
  }
} 

function modifySettings() {
  // as soon as we click on the game window, the mouse pointer is "locked"
  // you will have to press ESC to unlock it
  scene.onPointerDown = () => {
    if (!scene.alreadyLocked) {
      console.log("requesting pointer lock");
      canvas.requestPointerLock();
    } else {
      console.log("Pointer already locked");
    }
  };

  document.addEventListener("pointerlockchange", () => {
    let element = document.pointerLockElement || null;
    if (element) {
      // lets create a custom attribute
      scene.alreadyLocked = true;
    } else {
      scene.alreadyLocked = false;
    }
  });

  // key listeners for the shark.meshes[0]
  inputStates.left = false;
  inputStates.right = false;
  inputStates.up = false;
  inputStates.down = false;
  inputStates.space = false;

  //add the listener to the main, window object, and update the states
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
        inputStates.left = true;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "z" ||
        event.key === "Z"
      ) {
        inputStates.up = true;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        inputStates.right = true;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        inputStates.down = true;
      } else if (event.key === " ") {
        inputStates.space = true;
      }
    },
    false
  );

  //if the key will be released, change the states object
  window.addEventListener(
    "keyup",
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
        inputStates.left = false;
      } else if (
        event.key === "ArrowUp" ||
        event.key === "z" ||
        event.key === "Z"
      ) {
        inputStates.up = false;
      } else if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        inputStates.right = false;
      } else if (
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "S"
      ) {
        inputStates.down = false;
      } else if (event.key === " ") {
        inputStates.space = false;
      }
    },
    false
  );
}
function removeFishIfTouched(shark, fishes) {
  console.log("removeFishIfTouched");
  for (let i = 0; i < fishes.length; i++) {
    const fish = fishes[i];
    if (shark.intersectsMesh(fish, true)) {
      fish.dispose();
      fishes.splice(i, 1);
      i--;
    }
  }
}

function addFishes(scene) {
  for (let i = 0; i < 10; i++) {
    let fish = createFish(scene);

    fishes.push(fish);
  }
}



window.onload = startGame;
