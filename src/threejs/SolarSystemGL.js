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
import React from 'react';


export default function StarClusterGL(sceneRef) {


    var tag = document.getElementById("head");
    tag.innerHTML = "S O L A R S Y S T E M";

  /** 
   * init things
   * */ 

  var SelectedPlanet;

  const gui = new dat.GUI()

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneRef.appendChild(renderer.domElement);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 1000)
  camera.position.x = -6;
  camera.position.y = 0;
  camera.position.z = 18;
  scene.add(camera)


  const headline = document.querySelector(".headline_solar");


  /**
   * MODEL Loading
   */

   const loader = new GLTFLoader();

   loader.load(
     './SolarSystemModel/scene.gltf',
     ( gltf ) => {
 
       const children = gltf.scene.children;
       children.forEach((mesh) => {
         mesh.position.x = 0;
         mesh.position.y = 0;
         mesh.position.z = 0;
         mesh.scale.set(20, 20, 20)

         // mesh.material.shading = THREE.SmoothShading;
         // mesh.rotation.z = 11;
       })

      
 
       // called when the resource is loaded
       scene.add( gltf.scene );
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
 

 

  /**
   * Geometry && Meshes
   * */

  function distanceVector( v1, v2 )
  {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

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
  basic.opacity = 0.0;

  const Linematerial = new THREE.LineBasicMaterial( { color: 0xf3652a, linewidth: 1, fog: true } );
  const LinematerialB = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1, fog: true } );
  
  // MESHES
  const Cube = new THREE.Mesh(BoxGeometry , metal);

  

  // scene.add(Cube);

  function planetButtons(x, y, z, size)
  {
    const SphereGeometry = new THREE.SphereBufferGeometry(size, 35, 35);
    const btn = new THREE.Mesh(SphereGeometry, basic);
    btn.position.set(x, y, z);

    scene.add(btn);

    return btn;
  }

  const Planets = {
      "Venus": planetButtons(-5.65, -0.01, -8.94, 0.25),
      "Earth": planetButtons(-4.93, 0, -8.08, 0.28),
      "Mars": planetButtons(-4.26, 0, -6.96, 0.15),
      "Jupiter": planetButtons(-1.79, -0.01, -3.7, 2.2),
      "Saturn": planetButtons(1.07, 0, 1.67, 1.8),
      "Uran": planetButtons(3.32, 0, 4.26, 1),
      "Npetune": planetButtons(4.36, 0, 6.31, 0.8 ),
      "Sun": planetButtons(11.7, 0, -25.9, 20)
  }

  const mercury = planetButtons(-6.35, 0.01, -10, 0.12);
 

 




   /**
    * LIGHTS
    * */

  const LeftLight = new THREE.PointLight(0xffffff, 1.5);
  LeftLight.position.x = -2.1;
  LeftLight.position.y = 3.4;
  LeftLight.position.z = 6.4;
  scene.add(LeftLight);

  

  /**
   * Controls
   */

   function FocusPlanet(event)
   {
     event.preventDefault();
 
     var vector = new THREE.Vector3(
       (event.clientX / window.innerWidth) * 2 - 1, 
       -(event.clientY / window.innerHeight) * 2 + 1, 0.5
     );
     vector = vector.unproject(camera);
 
     var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
     var intersectsMercury = raycaster.intersectObject(mercury, true); 
     var interVenus = raycaster.intersectObject(Planets["Venus"], true); 
     var interEarth = raycaster.intersectObject(Planets["Earth"], true);
     var interMars = raycaster.intersectObject(Planets["Mars"], true);
     var interJupiter = raycaster.intersectObject(Planets["Jupiter"], true);
     var interSaturn = raycaster.intersectObject(Planets["Saturn"], true);
     var interUran = raycaster.intersectObject(Planets["Uran"], true);
     var interNeptune = raycaster.intersectObject(Planets["Npetune"], true);

     var interSun = raycaster.intersectObject(Planets["Sun"], true);

     function Animate_focus(x, y, z)
     {
        gsap.to(camera.position,
        {
            duration: 1,
            x: x,
            y: y,
            z: z,
            stagger: 0.5
        });

        gsap.to(camera.rotation,
        {
            duration: 1,
            y: -0.5,
            stagger: 0.5, 
        });
     }

     const X = mercury.position.x;
     const Y = mercury.position.y;
     const Z = mercury.position.z;

     // Neptun -> X + 8 && Z + 20


     if (camera.position.x == -6 && camera.position.z == 18)
     {
         if (intersectsMercury.length > 0) {
            Animate_focus(X - 2, Y, Z + 5,);
            tag.innerHTML = "M E R C U R Y";
            tag.innerHTML += `
                <div>C L O S E S T &nbsp; T O &nbsp; T H E &nbsp; S U N</div>
                <div>S M A L E S T &nbsp; P L A N E T</div>
            `;
         } else if (interVenus.length > 0) {
            Animate_focus(X - 1.5, Y, Z + 5,);
            tag.innerHTML = "V E N U S";
            tag.innerHTML += `
                <div>T O X I C &nbsp; A T M O S P H E R E</div>
                <div>1 D A Y &nbsp; I S &nbsp; 2 4 3 &nbsp; E A R T H D A Y S</div>
                <div>S U R F A C E - 3 9 0 ° C</div>
            `;
         } else if (interEarth.length > 0) {
            Animate_focus(X, Y, Z + 5,);
            tag.innerHTML = "E A R T H";
            tag.innerHTML += `
                <div>H A B I T A B L E</div>
                <div>H A S &nbsp; M O O N</div>
                <div>O U R &nbsp; H O M E</div>
            `;
         }else if (interMars.length > 0) {
            Animate_focus(X + 1, Y, Z + 5,);
            tag.innerHTML = "M A R S";
            tag.innerHTML += `
                <div>P O S S I B L Y &nbsp; H A B I T A B L E</div>
                <div>W A T E R &nbsp; S O U R C E S</div>
            `;
         } 
         else if (interJupiter.length > 0) {
            Animate_focus(X - 2, Y, Z + 20);
            tag.innerHTML = "J U P I T E R";
            tag.innerHTML += `
                <div>B I G G E S T &nbsp; P L A N E T</div>
                <div>G A S &nbsp; G I A N T</div>
                <div>4 &nbsp; M O O N S</div>
            `;
         } else if (interSaturn.length > 0) {
            Animate_focus(X + 0.5, Y, Z + 24, );
            tag.innerHTML = "S A T U R N";
            tag.innerHTML += `
                <div>G A S &nbsp; G I A N T</div>
                <div>82 &nbsp; M O O N S</div>
                <div>G L O R I O U S &nbsp; R I N G S</div>
            `;
         } else if (interUran.length > 0) {
            Animate_focus(X + 6.5 , Y, Z + 20);
            tag.innerHTML = "U R A N U S";
            tag.innerHTML += `
                <div>I C E &nbsp; G I A N T</div>
                <div>1 3 &nbsp; R I N G S</div>
            `;
         } else if (interNeptune.length > 0) {
            Animate_focus(X + 8, Y, Z + 20);
            tag.innerHTML = "N E P T U N E";
            tag.innerHTML += `
                <div>I C E &nbsp; G I A N T</div>
                <div>F A I N T &nbsp; R I N G S</div>
                <div>E L I P T I C A L &nbsp; O R B I T</div>
            `;
         } else if (interSun.length > 0) {
            Animate_focus(X - 40, Y, Z + 85);
            tag.innerHTML = "S U N";
            tag.innerHTML += `
                <div>C E N T E R &nbsp; O F &nbsp; S Y S T E M</div>
                <div>2 7  &nbsp; M I L L I O N &nbsp; C °</div>
                <div>Y E L L O W &nbsp; D W A R F</div>
            `;
         }
     }




 
     window.removeEventListener("touchend", FocusPlanet);
     window.addEventListener("click", FocusPlanet);
   }
 
   function destroy()
   {
     window.removeEventListener("click", FocusPlanet);
     window.addEventListener("touchend", FocusPlanet);
   }
 
   window.onload = function()
   {
     window.addEventListener("click", FocusPlanet);
     window.addEventListener("touchstart", destroy);
   }


   window.onkeydown = function(glg) 
    {
      if (glg.keyCode === 32)
      { 
        gsap.to(camera.position, 
          {
            duration: 1,
            x: -6,
            y: 0,
            z: 18,
            stagger: 0.5
          });

        gsap.to(camera.rotation, 
            {
                duration: 1,
                y: -0.32,
                stagger: 0.5
            });

        tag.innerHTML = "S O L A R S Y S T E M"
      } 
      else if (glg.keyCode === 27)
      {
          window.location.href = "http://localhost:3000/"
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
  controls.update();
  

  const animate = function () {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
   
    
  };
  
  // Call the animate function
  
  animate();
  
  
}