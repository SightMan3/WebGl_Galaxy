import React, { Component } from 'react';
import StarClusterGL from "../threejs/StarClusterGL"
import { useNavigate } from "react-router-dom";
import "../App.css"

export default class ThreeContainer extends Component {

  componentDidMount() {
    StarClusterGL(this.scene);
  }

  
  render() {

    return (
      <div>
        <div　className="headline_cluster">
          C L U S T E R
          <div className="cluster_small_head">M i l k y W a y</div>
          <div className="cluster_small_head">L a n i a k e a</div>
          <div className="cluster_small_head">3 r d &nbsp; q u a d r a n t</div>
          
        </div>
        <div className="footer_cluster">
          press & move mous for interaction, click circles for transport
        </div>

        <div className="canvas" ref={element => this.scene = element} />
      </div>
    );
  }
}