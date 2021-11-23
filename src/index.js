import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import StarCluster from "./components/StarCluster"
import SolarSystem from "./components/SolarSystem"
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";

const rootElement = document.getElementById("root");

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<StarCluster />} />
            <Route path="/BlackHole" element={<App />} />
            <Route path="/SolarSystem" element={<SolarSystem />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
