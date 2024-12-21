import React, { useRef } from "react";
import Canvas from "../components/Canvas";
function DrawGraph() {
  const canvasRef = useRef();

  const handleCalculateMST = () => {
    // Call the calculateMST method from Canvas
    if (canvasRef.current) {
      canvasRef.current.calculateMST();
      console.log("MST calculated");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Minimum Spanning Tree Visualizer</h1>
      <button onClick={handleCalculateMST} style={{ margin: "10px" }}>
        Calculate MST
      </button>
      <Canvas ref={canvasRef} />
    </div>
  );
}

export default DrawGraph;
