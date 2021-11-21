import React, { Component } from 'react';
import ThreeEntryPoint from '../threejs/BlackHoleGL';
import "../App.css"
import { useNavigate } from "react-router-dom";


export default class ThreeContainer extends Component {

  componentDidMount() {
    ThreeEntryPoint(this.scene);
  }


  
  render() {
    
    return (
      <div>
        <div className="canvas" ref={element => this.scene = element} />
      </div>
    );
  }
}