// Import dependencies
import * as THREE from 'three'
import gsap from "gsap";
import * as dat from 'dat.gui'

import { useNavigate } from 'react-router-dom';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Sphere } from 'three';


export default function ThreeEntryPoint(sceneRef) {

  /** 
   * init things
   * */ 

 
  let mixer;
  let clock = new THREE.Clock()

  let composer;
  const params = {
    exposure: 1,
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: 0
  };


  const scene = new THREE.Scene();
  const BackroundLoader = new THREE.CubeTextureLoader();
  const imgTexture = new THREE.TextureLoader().load("./1773008.png");
  const Cubetexture = BackroundLoader.load([
    "./N00282243.jpg",
    "./N00282243.jpg",
    "./N00282243.jpg",
    "./N00282243.jpg",
    "./N00282243.jpg",
    "./N00282243.jpg",
  ]);
  scene.background = new THREE.Color(0x000000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.appendChild(renderer.domElement);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 5.5
  scene.add(camera)



 

  /**
   * Load Model 
   * */

  // OBJ
  /*const mtlLoader = new MTLLoader();
  mtlLoader.load("./room.mtl", (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load("./room.obj", (root) => {

      root.position.x = 0;
      root.position.y = 0;
      root.position.z = 0;
  
      root.scale.set(0.1, 0.1, 0.1);

      scene.add(root)
    })
  }) */

  /**
   * LOAD MODEL:_ GTLF
   */

  // Japan Shrine
  const loader = new GLTFLoader();

  loader.load(
    './japanShrine/scene.gltf',
    ( gltf ) => {

      const children = gltf.scene.children;
      children.forEach((mesh) => {
        mesh.position.x = 0;
        mesh.position.y = -2;
        mesh.position.z = 0;
        mesh.scale.set(0.05, 0.05 ,0.05)

        mesh.rotation.z = 4.7;
      })

      // called when the resource is loaded
      // scene.add( gltf.scene );
    },
    ( xhr ) => {
      // called while loading is progressing
      console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    ( error ) => {
      // called when loading has errors
      console.error( 'An error happened', error );
    },
  );


  // black hole
  var blackHolechildren;

  loader.load("./BlackHoleModel/scene.gltf", (gltf) => {

      blackHolechildren = gltf.scene.children;
      blackHolechildren.forEach((mesh) => {

        if (window.innerWidth < 948)
        {
          mesh.scale.set(0.02, 0.02, 0.02);
          mesh.position.x = 0;

        } else {
          mesh.position.x = 0;
          mesh.scale.set(0.02, 0.02, 0.02);

        }
        mesh.position.y = -1;


      }) 
      
      mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach(
        (clip) => {

          var action = mixer.clipAction(clip);
          action.play();

        }
      )
      
      scene.add(gltf.scene);
      

    },
    (xhr) => {
      console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    (error) => {
      console.log(error);
    }
  );


   /**
    * Basic Objects
    * */

  // generate Background Stars
  var [x_l, y_l, z_l] = Array(3);
  async function Stars()
  {
    const geometry = new THREE.SphereBufferGeometry(.25, 20, 20);
    const material = new THREE.MeshStandardMaterial();
    //material.roughness = 2;
    //material.metalness = 4;
    material.color = new THREE.Color(0xffffff);

    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(
      () => THREE.Math.randFloatSpread( 100 )
    );
    x_l = x;
    y_l = y;
    z_l = z;

    star.position.set(x, y, z);
    scene.add(star);
  }
  Array(200).fill().forEach(Stars);



  const SphereGeometry = new THREE.SphereBufferGeometry(.5, 35, 35);
  const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const CrystalGeomtry = new THREE.OctahedronBufferGeometry(.5);
  
  // crystal button
 

  // Materials

  const metal = new THREE.MeshStandardMaterial();
  metal.roughness = 0.3;
  metal.metalness = 0.5;
  metal.color = new THREE.Color(0xffffff);

  const basic = new THREE.MeshBasicMaterial();
  basic.transparent = true;
  basic.opacity = 0.1;

  // Mesh

  /**
   * Click On Black Hole To Transport
   */
  const BlackHoleButton = new THREE.Mesh(SphereGeometry , basic);
  if (window.innerWidth < 948)
  {
    BlackHoleButton.position.y = -1
    BlackHoleButton.scale.set(2.2, 2.2, 2.2);
    scene.add(BlackHoleButton);

  } 
  else 
  {
    BlackHoleButton.position.y = -1
    BlackHoleButton.position.x = 0
    BlackHoleButton.scale.set(2.2, 2.2, 2.2);

    scene.add(BlackHoleButton);
  }

  function diveToHole(event)
  {
    event.preventDefault();

    var vector = new THREE.Vector3(
      (event.clientX / window.innerWidth) * 2 - 1, 
      -(event.clientY / window.innerHeight) * 2 + 1, 0.5
    );
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(BlackHoleButton, true); // Circle element which you want to identify

    if (intersects.length > 0) {
      gsap.to(camera.position,
        {
          duration: 1,
          x: BlackHoleButton.position.x,
          y: BlackHoleButton.position.y,
          z: BlackHoleButton.position.z,
          stagger: 0.5
        });
    }

    window.removeEventListener("touchend", diveToHole);
    window.addEventListener("click", diveToHole);
  }

  function destroy()
  {
    window.removeEventListener("click", diveToHole);
    window.addEventListener("touchend", diveToHole);
  }

  window.onload = function()
  {
    window.addEventListener("click", diveToHole);
    window.addEventListener("touchstart", destroy);
  }
  

  // other meshes
  
  const Cube = new THREE.Mesh(BoxGeometry , metal);
  // scene.add(Cube);

  
  const Crystal = new THREE.Mesh(CrystalGeomtry, metal);

  if (window.innerWidth < 948)
  {
    Crystal.position.x = 0;
    Crystal.position.y =  -0.5;
    Crystal.position.z = 2;
    Crystal.scale.set(.25, .25, .25);
    // scene.add(Crystal);


  } else {

    Crystal.position.x = 3;
    Crystal.position.y =  -0.5;
    Crystal.position.z = 1;
    // scene.add(Crystal);
  }



   /**
    * LIGHTS
    * */

  const LeftLight = new THREE.PointLight(0xffffff, 1.5);
  LeftLight.position.x = -2.1;
  LeftLight.position.y = 3.4;
  LeftLight.position.z = 6.4;
  scene.add(LeftLight);


  const starLig = new THREE.AmbientLight(0xffffff, 0.6);
  // scene.add(starLig);

  const renderScene = new RenderPass( scene, camera );

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer( renderer );
  composer.addPass( renderScene );
  composer.addPass( bloomPass );


  /**
   * Rendering
   * */

  window.addEventListener('resize', () =>
  {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      composer.setSize( sizes.width, sizes.height );

  })

  if (window.innerWidth > 948)
  {
    
    window.addEventListener("wheel", (e) => {

      if (e.deltaY < 0)
      {
        gsap.to(camera.position, 
        {
          duration: 1, x: camera.position.x - 0.5, z: camera.position.z + 0.5, stagger: 0.5
        });
      }
      else if (e.deltaY > 0)
      {
        gsap.to(camera.position, 
          {
            duration: 1, x: camera.position.x + 0.5, z: camera.position.z - 0.5, stagger: 0.5
          });
      }

    }, true);  

  } else {

  }

  
  

  let controls = new OrbitControls(camera, sceneRef);
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false;
  controls.update();


  function rotation (object)
  {
    object.rotation.x += 0.005;
    object.rotation.y += 0.005;
    // object.rotation.z += 0.005;

  }

  const animate = function () {
    requestAnimationFrame(animate);

    rotation(Crystal);

    // black hole rotation
    var delta = clock.getDelta();
    if (mixer)
    {
      mixer.update( delta );
    }  
      

    renderer.render(scene, camera);
    composer.render();


    // change route to star cluster
    if (camera.position.z == 0 && camera.position.y == -1 && (camera.position.x == 0 || camera.position.x == 5))
    {
      window.location.href = "https://SightMan3.github.io/";
    }



  };
  
  // Call the animate function
  animate();
  

}