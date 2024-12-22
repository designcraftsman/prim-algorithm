import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import Sketch from "react-p5";
import graphique from "../assets/icons/graphique.svg";
import { TbTimeline } from "react-icons/tb";
import { TbLine } from "react-icons/tb";

const Canvas = forwardRef((props, ref) => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [manualInputEdge, setManualInputEdge] = useState("");
  const [newVertexLabel, setNewVertexLabel] = useState("");
  const canvasRef = useRef(null);
  const menuWidth = 400;

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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          width: `${menuWidth}px`,
          padding: "20px",
          backgroundColor: "#f4f4f4",
          height: "100vh",
        }}
      >
        <h3 className="fs-2 fw-bold m-0 mb-3">
          <img src={graphique} alt="Manual Input" style={{ width: '50px', marginRight: '10px' }} />
          Contrôles Manuels
        </h3>
        <hr />
        <div style={{ marginBottom: "20px" }}>
          <label><TbTimeline /> Étiquette du sommet :</label>
          <input
            type="text"
            className="form-control"
            value={newVertexLabel}
            onChange={(e) => setNewVertexLabel(e.target.value)}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label><TbLine /> Liaisons:</label>
          <input
            type="text"
            className="form-control"
            value={manualInputEdge}
            onChange={(e) => setManualInputEdge(e.target.value)}
            placeholder="Format: A B 5"
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div className="btn-holder">
          <button onClick={addManualEdge} className="btn btn-3 hover-border-3">
            <span>Ajouter Arête</span>
          </button>
        </div>
        <div className="btn-holder">
          <button onClick={calculateMST} className="btn btn-3 hover-border-3">
            <span>Calculer ACM</span>
          </button>
        </div>
        <div className="btn-holder">
          <button 
            onClick={() => {
              setVertices([]);
              setEdges([]);
              setMstEdges([]);
              setTotalWeight(0);
            }} 
            className="btn btn-3 hover-border-3"
          >
            <span>Vider Le Graphe</span>
          </button>
        </div>
        <hr />
        {mstEdges.length > 0 && (
          <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#fff", borderRadius: "4px" }}>
            <h4>Total Distance:</h4>
            <p>{totalWeight.toFixed(2)}</p>
          </div>
        )}
      </div>
      <div style={{ flex: 2, height: "100%" }}>
        <div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
          <Sketch
            setup={(p5) => {
              const canvas = p5.createCanvas(window.innerWidth - menuWidth, window.innerHeight);
              if (canvasRef.current) {
                canvas.parent(canvasRef.current);
              }
            }}
            draw={draw}
            mousePressed={mousePressed}
            windowResized={(p5) => {
              p5.resizeCanvas(window.innerWidth - menuWidth, window.innerHeight);
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Canvas;
