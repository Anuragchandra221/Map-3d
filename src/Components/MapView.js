import React, { useEffect, useRef, useState } from "react";
import { GeolocateControl, Map, Marker, NavigationControl } from "maplibre-gl";

function MapView({place, setPlace}){
    const mapContainer = useRef(null)
    const map = useRef(null)
    const key = "oMqpCdo32mJC1yHxrc1c"
    const [markers, setMarkers] = useState([])
    const lng = 78.9629
    const lat = 20.5937
    const zoom = 0

    useEffect(()=>{
        if(!map.current){

            map.current = new Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
                center: [lng, lat], 
                zoom: 4
            })
    
            map.current.addControl(new NavigationControl(), 'top-right')
    
            map.current.addControl(
                new GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            )
            
    
            
            map.current.on('load',()=>{
                new Marker({color: "#FF0000"}).setLngLat([lng, lat]).addTo(map.current)
                const circle = {
                    id: 'circle-layer',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [lng, lat],
                                    }
                                }
                            ]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#FF0000',
                        'circle-opacity': 0.5
                    }
                }
                // const layers = map.current.getStyle().layers
                // let id
                // for(let i=0; i<layers.length; i++){
                //     if(layers[i].type == 'symbol'){
                //         id = layers[i].id
                //         break;
                //     }
                // }
                // map.current.addSource('urban-areas', {
                //     'type': 'geojson',
                //     'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson'
                // })
                // map.current.addLayer({
                //     'id': 'urban-fill',
                //     'type': 'fill',
                //     'source': 'urban-areas',
                //     'layout': {},
                //     'paint': {
                //         'fill-color': '#000',
                //         'fill-opacity': 0.4
                //     }
                // },id)
                map.current.addLayer(circle)
            })
    
            map.current.on('click', (event)=>{
                const lnglat = event.lngLat
                // console.log(lnglat.lng, lnglat.lat)
                new Marker({color: "#FF0000"}).setLngLat([lnglat.lng, lnglat.lat]).addTo(map.current)
                setMarkers((prev)=>[...prev, {lng, lat}])
            })
        }

        

    }, [markers])


    return (
        <div className="map-wrap">
                <div>
                    <h4>Markers:</h4>
                    {markers.map((marker, index) => (
                    <p key={index}>
                        Marker {index + 1}: Latitude {marker.lat}, Longitude {marker.lng}
                    </p>
                    ))}
                </div>
            <div ref={mapContainer} className="map" >
            </div>
        </div>
    )
}

export default MapView