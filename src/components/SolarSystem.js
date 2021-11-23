import React, { Component } from 'react';
import { useNavigate } from "react-router-dom";
import SolarSystemGL from '../threejs/SolarSystemGL';
import "../App.css"

export default class ThreeContainer extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      "Planet": ""
    };
  }

  State = "S O L A R S Y S T E M";
  componentDidMount() {
    SolarSystemGL(this.scene);

    this.state.Planet = localStorage.getItem("planet");
  }


  

  
  render() {
    
    return (
      <div>
         <div　className="headline_cluster headline_solar" id="head">
         
        </div>
        <div className="footer_cluster">
          press space for position reset &nbsp; | &nbsp; click planets for more detail
        </div>
        
        <div className="canvas" ref={element => this.scene = element} /> 
      </div>
    );
  }
}