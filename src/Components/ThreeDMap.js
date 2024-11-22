import { GeolocateControl, Map, MercatorCoordinate } from 'maplibre-gl'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
// import taj from  "../assets/gltf/M91.gltf"  

function ThreeDMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const key = "oMqpCdo32mJC1yHxrc1c"
  const lng = 78.0421 
  const lat = 27.1751
  const newLat = 20.5937
  const newLng = 78.9629
  useEffect(()=>{
    if(!map.current){
      map.current = new Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
        center: [lng, lat],
        zoom: 15,
        pitch: 60,
        antialias: true
      })
      
      let camera_2 = null


      const geo = 
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true
        })
      map.current.addControl(geo)

      
      
      
      const modelOrigin = [lng, lat]
      const modelAltitude = 0
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
      let modelScene = null
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      const customLayer = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd(map, gl){
          this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
          // console.log(this.camera.position, this.camera.rotation)
          camera_2 = this.camera
          this.scene = new THREE.Scene()

          const directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          const directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          const loader = new GLTFLoader();

          loader.load(
            '/assets/taj/scene.gltf', 
            (gltf)=>{
              modelScene = gltf.scene;

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
            }, undefined, (err)=>{
              console.log('error loading the mode', err)
            } 
          )
          
          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true 
          })
          this.renderer.autoClear = false
        },
        render(gl, matrix){
        
          const m = new THREE.Matrix4().fromArray(matrix);
          this.camera.projectionMatrix = m;
          this.renderer.resetState();
          this.renderer.render(this.scene, this.camera);

          // Request a re-render
        map.current.triggerRepaint();
        }
      }
      map.current.on('style.load', ()=>{
      

        map.current.addLayer(customLayer)
      })

      map.current.on('click', (e)=>{
        const canvas = map.current.getCanvas();
        mouse.x = (e.point.x / canvas.width) * 2 - 1;
        mouse.y = -(e.point.y / canvas.height) * 2 + 1;

        // Update raycaster with camera and mouse position
        if (modelScene) {
          modelScene.updateMatrixWorld();
          raycaster.setFromCamera(mouse, camera_2);
          console.log(camera_2.position, camera_2.rotation)

          // Check for intersections with the 3D model
          const intersects = raycaster.intersectObject(modelScene, true);
          if (intersects.length > 0) {
            // Intersection detected, handle the click event
            console.log('Clicked on model:', intersects[0]);
            // Here, you can trigger a pop-up or additional logic
          } else {
            console.log('No intersection with the model');
          }
        }
      })
      
    }
  })
  
  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map'>

      </div>
    </div>
  )
}

export default ThreeDMap