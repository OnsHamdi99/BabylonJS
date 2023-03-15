// get our canva
const canvas = document.getElementById("myCanvas"); 

// Create a baylon engine object
const engine = new BABYLON.Engine(canvas, true); 

//create a scene 
function createScene(){

    
    const scene = new BABYLON.Scene(engine);
    const light = createLight(scene);
    const camera = createFreeCamera(scene);
    const box = createBox(scene);
    const sphere =  createSphere(scene)
    const plane = createPlane(scene);
    const seagull = createShark(scene);
    let ground = createGround(scene);
 //  let sky = createSkybox(scene);
 let sky = skybox2(scene);
    return scene;
}
//sky from image 
function skybox2(scene){
   
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/images/cubemap/", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
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
   const groundOptions = { width:500, height:500, subdivisions:20, minHeight:0, maxHeight:50, onReady: onGroundCreated};

    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'assets/images/hmap1.png', groundOptions, scene); 
    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/images/ocean.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }

    return ground;
}
//create a free camera
function createFreeCamera (scene){
    const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -5), scene);
    camera.attachControl(canvas, true);
}
// create a light
//up on the sky and light up the scene / from above
function createLight(scene){
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
}
//creating  box 
function createBox(scene){
    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    //changing position of the box
    box.position = new BABYLON.Vector3(0, 1, 0);
    return box;
}
function createSphere(scene){
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere",{size : 10}, scene); 
    sphere.position = new BABYLON.Vector3(2, 1, 0);
    return sphere;
}
//creating a plane 
function createPlane(scene){
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene);
    plane.position = new BABYLON.Vector3(-3, 1, 0);
    return plane;
}
//creating a shark
async function createShark(scene) {
    let shark = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/", "shark.glb", scene);
    if (shark.meshes.length > 0) {
        shark.meshes[0].position = new BABYLON.Vector3(-5, 1, 0);  
        shark.meshes[0].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        return shark.meshes[0];
    } else {
        console.error("No meshes found in shark.glb");
        return null;
    }
}


window.onload = startGame;

function startGame(){ 

// call the createScene function
const scene = createScene();
// run the render loop
// render : resituer
engine.runRenderLoop(() => { 
    scene.render();
});

}