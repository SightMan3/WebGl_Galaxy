// Import dependencies
import * as THREE from 'three'
import gsap from "gsap";
import * as dat from 'dat.gui'

import { Navigate, useNavigate } from "react-router-dom";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Sphere } from 'three';


export default function StarClusterGL(sceneRef) {

  /** 
   * init things
   * */ 


  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.appendChild(renderer.domElement);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
  camera.position.x = 676;
  camera.position.y = 585;
  camera.position.z = -128;
  scene.add(camera)


  


  let composer;
  const params = {
    exposure: 1,
    bloomStrength: 1.16,
    bloomThreshold: 0,
    bloomRadius: 1
  };

  let clusterLaoded = false;

  /**
   * Render Models
   */

  var cluster;
  var boundingBox = new THREE.Box3();
  var boundingBoxCenter;

  const tfLoader = new GLTFLoader();
  tfLoader.load("./SC/scene.gltf", 
    (gltf) => {
      cluster = gltf.scene.children;
      cluster.forEach((mesh) => {
        mesh.position.x = 676;
        mesh.position.y = 585;
        mesh.position.z = -128;
        mesh.scale.set(3, 3 ,3);
        
        boundingBox.setFromObject(mesh);
        boundingBoxCenter = boundingBox.getCenter();

      })


      clusterLaoded = true;
      scene.add( gltf.scene );

    },
    (xhr) => {
      console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    (error) => {
      console.log(error);
    }
  )  

 

  /**
   * Geometry && Meshes
   */

  function distanceVector( v1, v2 )
  {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  const SphereGeometry = new THREE.SphereBufferGeometry(20, 35, 35);
  const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const CrystalGeomtry = new THREE.OctahedronBufferGeometry(.5);
  const CircleGeometry = new THREE.RingGeometry(20, 20, 100);
 

  // Materials

  const metal = new THREE.MeshStandardMaterial();
  metal.roughness = 0.3;
  metal.metalness = 0.5;
  metal.color = new THREE.Color(0xffffff);

  const basic = new THREE.MeshBasicMaterial();
  basic.transparent = true;
  basic.opacity = 0.1;

  const Linematerial = new THREE.LineBasicMaterial( { color: 0xf3652a, linewidth: 1, fog: true } );
  const LinematerialB = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1, fog: true } );
  
  // MESHES
  const Cube = new THREE.Mesh(BoxGeometry , metal);


  // transporters
  const SolarSystem = new THREE.LineLoop( CircleGeometry, Linematerial)
  const SolarSystemBall = new THREE.Mesh( SphereGeometry, basic );
  SolarSystemBall.position.set(333, 101, 122);
  SolarSystem.position.set(333, 101, 122);
  SolarSystem.rotation.set(-0.1, 2.1, 0);

  scene.add(SolarSystem);
  scene.add(SolarSystemBall)

  const BlackHole = new THREE.LineLoop( CircleGeometry, Linematerial)
  const BlackHoleBall = new THREE.Mesh( SphereGeometry, basic );
  BlackHoleBall.position.set(42, 161, -277);
  BlackHole.position.set(42, 161, -277);
  BlackHole.rotation.set(-0.1, 2.1, 0);

  scene.add(BlackHole);
  scene.add(BlackHoleBall)


  

  // scene.add(Cube);






   /**
    * LIGHTS
    * */

  const LeftLight = new THREE.PointLight(0xffffff, 1.5);
  LeftLight.position.x = -2.1;
  LeftLight.position.y = 3.4;
  LeftLight.position.z = 6.4;
  scene.add(LeftLight);

  // bloom
  const renderScene = new RenderPass( scene, camera );

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer( renderer );
  composer.addPass( renderScene );
  composer.addPass( bloomPass );
  



    /**
     * Controlls: zooming, moving, scrolling, transforming
     */

    window.addEventListener("wheel", (event) => {
      if (event.deltaY < 0)
      {
        gsap.to(camera.position, {
          duration: 1,
          y: camera.position.y + 50,
          z: camera.position.z + 50,
          stagger: 0.5
        })
      } 
      else if (event.deltaY > 0)
      {
        gsap.to(camera.position, {
          duration: 1,
          y: camera.position.y - 50,
          z: camera.position.z - 50,
          stagger: 0.5
        })
      }

    });


    window.addEventListener("load", () => {
      console.log(camera.position);
    });

   
    

    async function diveToPoint(event)
    {
      event.preventDefault();
  
      var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1, 
        -(event.clientY / window.innerHeight) * 2 + 1, 0.5
      );
      vector = vector.unproject(camera);
  
      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersectsSolar = raycaster.intersectObject(SolarSystemBall, true);
      var intersectsBlack = raycaster.intersectObject(BlackHoleBall, true); // Circle element which you want to identify
  
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


      if (intersectsBlack.length > 0) {

        gsap.to(camera.position, 
          {
            duration: 1, 
            x: SolarSystemBall.position.x - 150, // distance
            y: SolarSystemBall.position.y + 200, // depth
            z: SolarSystemBall.position.z - 200, // left || right
            stagger: 0.5
          });

          await sleep(500);

          window.location.href = "https://SightMan3.github.io/BlackHole"; 
      }
      else if (intersectsSolar.length > 0)
      {
        gsap.to(camera.position, 
          {
            duration: 1, 
            x: SolarSystemBall.position.x + 200, 
            y: SolarSystemBall.position.y + 175,
            z: SolarSystemBall.position.z - 100,
            stagger: 0.5
          });

        await sleep(500);

        window.location.href = "https://SightMan3.github.io/SolarSystem"; 
      }
  
      window.removeEventListener("touchend", diveToPoint);
      window.addEventListener("click", diveToPoint);
    }

    function destroy()
    {
      window.addEventListener("touchend", diveToPoint);
      window.removeEventListener("click", diveToPoint);
    }

    window.onload = function() {
      window.addEventListener("click", diveToPoint);
      window.addEventListener("touchstart", destroy);
    }

    window.onkeydown = function(glg) 
    {
      if (glg.keyCode === 32)
      { 
        gsap.to(camera.position, 
          {
            duration: 1,
            x: 676,
            y: 585,
            z: -128,
            stagger: 0.5
          });
      }  
    }

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
      

    })

  
    
  let controls = new OrbitControls(camera, sceneRef);
  controls.enableZoom = false;
  if (boundingBoxCenter != undefined)
  {
    controls.target = boundingBoxCenter;
  }
  controls.update();

  //controls.target.set(camera.position.x, camera.position.y, camera.position.z);
  
  
  

  const animate = function () {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
    composer.render();

    SolarSystem.lookAt(camera.position);
    BlackHole.lookAt(camera.position);

    if (cluster != undefined)
    {


      cluster.forEach((mesh) => {

        // rotateAroundObjectAxis(mesh, mesh.position.z, 20);
        //mesh.translate(0, 0, 0);
    

        gsap.to(mesh.position, {
          duration: 1,
          x: -300,
          y: -250,
          z: 260,
          stagger: 0.5
        });

        gsap.to(mesh.rotation, {
          duration: 1,
          y: 0.0,
          stagger: 1
        }); 


      
      })
    } 
    else 
    {
      clusterLaoded = false;
    }

  };
  
  // Call the animate function
  
  animate();
  
  
}