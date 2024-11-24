import { GeolocateControl, Map, MercatorCoordinate } from 'maplibre-gl'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { addModel } from '../utils/mapControls'
// import taj from  "../assets/gltf/M91.gltf"  

function ThreeDMap({setData}) {
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

      const radius = .001

      function point(angle) {
        return {
                'type': 'Point',
                'coordinates': [lng + Math.cos(angle) * radius, lat + Math.sin(angle) * radius]
            };
        }
      const geo = 
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true
        })
      map.current.addControl(geo)

      
      
      const customLayer = addModel(map.current, lng, lat)
      
      map.current.on('style.load', ()=>{
        map.current.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat], // Replace with your point coordinates
                },
                properties: {
                  id: "point1", // Custom data
                },
              },
            ],
          },
        });
  
        map.current.addLayer({
          id: "points-layer",
          type: "circle",
          source: "points",
          paint: {
            "circle-radius": 10,
            "circle-color": "#ff0000",
          },
        });
        map.current.addLayer(customLayer, 'building')
        map.current.addSource('point', {
          type: 'geojson',
          data: point(0)
        })

        map.current.addLayer({
          id: 'point',
          source: 'point',
          type: 'circle',
          paint: {
            'circle-radius': 10,
            'circle-color': '#FF0000',
            'circle-opacity': 0.5
          }
        })
        const animate = (time)=>{
          // console.log("animate")
          // console.log(map.current.getSource('point'))
          map.current.getSource('point').setData(point(time/1000))

          requestAnimationFrame(animate)
        }

        animate(0) 
      })


      map.current.on("click", "points-layer", (e) => {
        console.log(e.features)
        const features = e.features[0];
        setData("clicked")
        console.log("Point clicked:", features.properties);
      });
    
      map.current.on("mouseenter", "points-layer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });
    
      map.current.on("mouseleave", "points-layer", () => {
        map.current.getCanvas().style.cursor = "";
      });

      
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