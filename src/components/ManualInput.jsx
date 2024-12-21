import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import Sketch from "react-p5";

const Canvas = forwardRef((props, ref) => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [manualInputEdge, setManualInputEdge] = useState("");
  const [newVertexLabel, setNewVertexLabel] = useState("");

  const addVertex = (x, y, label) => {
    if (!label || vertices.some((v) => v.label === label)) {
      alert("Invalid or duplicate vertex name.");
      return;
    }
    setVertices((prev) => [...prev, { x, y, label }]);
    setNewVertexLabel("");
  };

  const addManualEdge = () => {
    const parts = manualInputEdge.trim().split(" ");
    if (parts.length !== 3) {
      alert("Invalid input format. Use 'A B weight'");
      return;
    }

    const [startLabel, endLabel, weight] = parts;
    const startVertex = vertices.find((v) => v.label === startLabel);
    const endVertex = vertices.find((v) => v.label === endLabel);

    if (!startVertex || !endVertex || isNaN(weight)) {
      alert("Invalid vertices or weight.");
      return;
    }

    setEdges((prev) => [
      ...prev,
      {
        v1: startVertex,
        v2: endVertex,
        distance: parseFloat(weight),
      },
    ]);
    setManualInputEdge("");
  };

  const calculateMST = () => {
    if (edges.length === 0) {
      alert("No edges available to calculate MST.");
      return;
    }

    // Kruskal's Algorithm for MST
    const sortedEdges = [...edges].sort((a, b) => a.distance - b.distance);
    const parent = {};
    const find = (v) => (parent[v] === v ? v : (parent[v] = find(parent[v])));
    const union = (v1, v2) => {
      const root1 = find(v1);
      const root2 = find(v2);
      if (root1 !== root2) parent[root2] = root1;
    };

    vertices.forEach((v) => (parent[v.label] = v.label));

    const mst = [];
    let weightSum = 0;

    sortedEdges.forEach(({ v1, v2, distance }) => {
      if (find(v1.label) !== find(v2.label)) {
        union(v1.label, v2.label);
        mst.push({ v1, v2, distance });
        weightSum += distance;
      }
    });

    setMstEdges(mst);
    setTotalWeight(weightSum);
  };

  useImperativeHandle(ref, () => ({
    calculateMST,
  }));

  const mousePressed = (p5) => {
    const x = p5.mouseX;
    const y = p5.mouseY;

    if (x >= 0 && x <= p5.width && y >= 0 && y <= p5.height) {
      if (!newVertexLabel) {
        alert("Please enter a label for the new vertex.");
        return;
      }
      addVertex(x, y, newVertexLabel);
    }
  };

  const draw = (p5) => {
    p5.background(51);

    // Draw vertices
    vertices.forEach(({ x, y, label }) => {
      p5.fill(255);
      p5.noStroke();
      p5.ellipse(x, y, 10, 10);
      p5.fill(255, 255, 0);
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(label, x + 10, y - 10);
    });

    // Draw all edges
    edges.forEach(({ v1, v2, distance }) => {
      p5.stroke(100);
      p5.strokeWeight(1);
      p5.line(v1.x, v1.y, v2.x, v2.y);
      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      p5.fill(255);
      p5.noStroke();
      p5.textSize(12);
      p5.text(distance.toFixed(2), midX, midY);
    });

    // Draw MST edges
    mstEdges.forEach(({ v1, v2, distance }) => {
      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.line(v1.x, v1.y, v2.x, v2.y);
      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      p5.fill(255, 255, 0);
      p5.noStroke();
      p5.textSize(12);
      p5.text(distance.toFixed(2), midX, midY);
    });

    // Display total weight of MST
    if (mstEdges.length > 0) {
      p5.fill(255);
      p5.textSize(16);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text(`Total MST Weight: ${totalWeight.toFixed(2)}`, 10, 10);
    }
  };

  return (
    <div>
      <Sketch setup={(p5) => p5.createCanvas(800, 600)} draw={draw} mousePressed={mousePressed} />
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newVertexLabel}
          onChange={(e) => setNewVertexLabel(e.target.value)}
          placeholder="Enter vertex label (e.g., A)"
        />
        <p>Click on the canvas to add a vertex with the entered label.</p>
        <input
          type="text"
          value={manualInputEdge}
          onChange={(e) => setManualInputEdge(e.target.value)}
          placeholder="Enter edge (e.g., A B 5)"
        />
        <button onClick={addManualEdge}>Add Edge</button>
        <button onClick={calculateMST}>Calculate MST</button>
      </div>
    </div>
  );
});

export default Canvas;