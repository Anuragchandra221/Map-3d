import { MercatorCoordinate } from "maplibre-gl"
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/Addons.js"

const addModel = (map, lng, lat)=>{


        const modelOrigin = [lng, lat]
      const modelAltitude = 10
      const modelRotate = [Math.PI / 2, 0, 0]

      const modelCoordinates = MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
      )

      const modelTransform = {
        translateX: modelCoordinates.x,
        translateY: modelCoordinates.y,
        translateZ: modelCoordinates.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2], 
        scale: modelCoordinates.meterInMercatorCoordinateUnits()*0.25,
      }

      
      
      

      const customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd(map, gl){
          this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
          // console.log(this.camera.position, this.camera.rotation)
         
          this.scene = new THREE.Scene()

          const directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);
          const loader = new GLTFLoader();

          loader.load(
            'assets/taj/scene.gltf',
            (gltf)=>{
              const modelScene = gltf.scene
              modelScene.position.set(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
              );
          
              modelScene.rotation.set(
                modelTransform.rotateX,
                modelTransform.rotateY,
                modelTransform.rotateZ
              );
          
              modelScene.scale.set(
                modelTransform.scale,
                modelTransform.scale,
                modelTransform.scale
              );

              this.scene.add(modelScene)
              // modelScene.traverse((child)=>{
              //   if(child.isMesh){
              //     child.userData.clickable = true
              //   }
              // })
             
              
              // bound = new THREE.Box3().setFromObject(modelScene)

            }
          )


          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true 
          })

          this.renderer.autoClear = false
          // window.addEventListener('click', (event)=>{
          //   const mouse = new THREE.Vector2(
          //         (event.clientX / window.innerWidth) * 2 - 1,
          //         -(event.clientY / window.innerHeight) * 2 + 1
          //     );
          //     const raycaster = new THREE.Raycaster();
          //     raycaster.setFromCamera(mouse, this.camera);
          //     const intersects = raycaster.intersectObjects(this.scene.children);
          //     console.log(intersects)

          //     if (intersects.length > 0) {
          //         alert('Model clicked!');
          //     }
          // })
        },
        render(gl, matrix){
        
          const m = new THREE.Matrix4().fromArray(matrix);
          

        this.camera.projectionMatrix = m;

        // const cameraPosition = MercatorCoordinate.fromLngLat(map.getCenter(), 10); // Adjust Z for elevation
        //     this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z + 10);

          this.renderer.resetState();
          this.renderer.render(this.scene, this.camera);
            console.log("render function")
          // Request a re-render
         map.triggerRepaint();
        }
      }
      return customLayer
}

export {addModel}