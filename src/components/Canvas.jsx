import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Sketch from "react-p5";

const Canvas = forwardRef((props, ref) => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const canvasRef = useRef(null);

  const addVertex = (x, y) => {
    const label = String.fromCharCode(65 + vertices.length); // 'A', 'B', 'C', ...
    setVertices((prev) => [...prev, { x, y, label }]);
  };
  

  const calculateMST = () => {
    if (vertices.length < 2) {
      console.warn("Not enough vertices to calculate MST");
      return;
    }
  
    let reached = [vertices[0]];
    let unreached = vertices.slice(1);
    const newEdges = []; // Recreate edges from scratch
    let edgeLabel = 'A'.charCodeAt(0); // Start with ASCII code for 'A'
  
    while (unreached.length > 0) {
      let record = Infinity;
      let rIndex = -1;
      let uIndex = -1;
  
      for (let i = 0; i < reached.length; i++) {
        for (let j = 0; j < unreached.length; j++) {
          const v1 = reached[i];
          const v2 = unreached[j];
          const dist = Math.hypot(v2.x - v1.x, v2.y - v1.y);
  
          if (dist < record) {
            record = dist;
            rIndex = i;
            uIndex = j;
          }
        }
      }
  
      if (rIndex !== -1 && uIndex !== -1) {
        const v1 = reached[rIndex];
        const v2 = unreached[uIndex];
        const dist = Math.hypot(v2.x - v1.x, v2.y - v1.y);
        const label = String.fromCharCode(edgeLabel++); // Convert ASCII code to character
        newEdges.push({ v1, v2, distance: dist, label }); // Include label in edge object
        reached.push(v2);
        unreached.splice(uIndex, 1);
      }
    }
  
    console.log("Calculated MST Edges with Labels:", newEdges);
    setEdges(newEdges); // Update state with recalculated edges
  };
  

  // Expose `calculateMST` to the parent via the `ref`
  useImperativeHandle(ref, () => ({
    calculateMST,
  }));

  const mousePressed = (p5) => {
    const x = p5.mouseX;
    const y = p5.mouseY;
  
    // Ensure clicks outside the canvas do not add vertices
    if (x >= 0 && x <= p5.width && y >= 0 && y <= p5.height) {
      console.log(`Adding vertex at (${x}, ${y})`);
      addVertex(x, y);
    }
  };

  const draw = (p5) => {
  p5.background(51);

  // Draw coordinate axes
  p5.stroke(200);
  p5.strokeWeight(1);

  // x-axis
  p5.line(0, p5.height / 2, p5.width, p5.height / 2);

  // y-axis
  p5.line(p5.width / 2, 0, p5.width / 2, p5.height);

  // Draw tick marks and labels for x-axis
  for (let x = 0; x <= p5.width; x += 50) {
    p5.stroke(200);
    p5.line(x, p5.height / 2 - 5, x, p5.height / 2 + 5);
    p5.fill(255);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text(x - p5.width / 2, x, p5.height / 2 + 10);
  }

  // Draw tick marks and labels for y-axis
  for (let y = 0; y <= p5.height; y += 50) {
    p5.stroke(200);
    p5.line(p5.width / 2 - 5, y, p5.width / 2 + 5, y);
    p5.fill(255);
    p5.noStroke();
    p5.textAlign(p5.RIGHT, p5.CENTER);
    p5.text(p5.height / 2 - y, p5.width / 2 - 10, y);
  }

  // Draw vertices with labels
  vertices.forEach(({ x, y, label }) => {
    // Draw the vertex
    p5.fill(255);
    p5.noStroke();
    p5.ellipse(x, y, 10, 10);

    // Draw the label next to the vertex
    p5.fill(255, 255, 0); // Yellow for labels
    p5.textSize(14);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(label, x + 10, y - 10); // Offset label for better visibility
  });

  // Draw edges with distances
  edges.forEach(({ v1, v2, distance }) => {
    // Draw the edge
    p5.stroke(255, 0, 0);
    p5.strokeWeight(2);
    p5.line(v1.x, v1.y, v2.x, v2.y);

    // Draw the distance at the midpoint of the edge
    const midX = (v1.x + v2.x) / 2;
    const midY = (v1.y + v2.y) / 2;
    p5.fill(255);
    p5.noStroke();
    p5.textSize(12);
    p5.text(distance.toFixed(2), midX, midY); // Display the distance with two decimal places
  });
};

  

  return (
    <Sketch
      setup={(p5) => p5.createCanvas(800, 600)}
      draw={draw}
      mousePressed={mousePressed}
      ref={canvasRef}
    />
  );
});

export default Canvas;
