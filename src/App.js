import logo from './logo.svg';
import './App.css';
import MapView from './Components/MapView';
import Navbar from './Components/Navbar';
import { useState } from 'react';
import ThreeDMap from './Components/ThreeDMap';

function App() {
  const [place, setPlace] = useState(0.0);
  const [data, setData] = useState('Not clicked')
  // console.log(place)
  return (
    <div className="App"> 
      <Navbar place={place} data={data} setPlace={setPlace}/>
      <div id="map" >
        {/* <MapView place={place} /> */}
        <ThreeDMap setData={setData}/>
      </div>
    </div>
  );
}

export default App;
