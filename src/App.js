import React from 'react';
import './App.css';
import { LoadMap } from './components/map/LoadMap.js';

function App() {
  return (
    <div className="container">
        <h1>TFL Map using React, Leaflet / eeGeo</h1>
            <LoadMap />
      </div>
  );
}

export default App;
