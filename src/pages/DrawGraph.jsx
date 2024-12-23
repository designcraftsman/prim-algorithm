import React, { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import setting from "../assets/icons/setting.svg";
import { CgArrowsVAlt } from "react-icons/cg";
import { GiPathDistance } from "react-icons/gi";


const MSTVisualizer = () => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [scale, setScale] = useState(1);
  const [unit, setUnit] = useState("km");
  const canvasRef = useRef(null); // Reference to the canvas container
  const padding = 50; // Padding around the canvas
  const menuWidth = 450; // Width of the menu

  const addVertex = (x, y) => {
    const label = String.fromCharCode(65 + vertices.length); // 'A', 'B', 'C', ...
    setVertices((prev) => [...prev, { x, y, label }]);
  };

  const calculateMST = () => {
    if (vertices.length < 2) return;

    let reached = [vertices[0]];
    let unreached = vertices.slice(1);
    const newEdges = [];
    let edgeLabel = "A".charCodeAt(0);

    while (unreached.length > 0) {
      let record = Infinity;
      let rIndex = -1;
      let uIndex = -1;

      for (let i = 0; i < reached.length; i++) {
        for (let j = 0; j < unreached.length; j++) {
          const v1 = reached[i];
          const v2 = unreached[j];
          // Calculate raw distance in coordinate units
          const pixelDist = Math.hypot(v2.x - v1.x, v2.y - v1.y);
          // Store unscaled distance (1 unit = 50 pixels)
          const rawDist = pixelDist / 50;

          if (rawDist < record) {
            record = rawDist;
            rIndex = i;
            uIndex = j;
          }
        }
      }

      if (rIndex !== -1 && uIndex !== -1) {
        const v1 = reached[rIndex];
        const v2 = unreached[uIndex];
        const pixelDist = Math.hypot(v2.x - v1.x, v2.y - v1.y);
        const rawDist = pixelDist / 50;
        const label = String.fromCharCode(edgeLabel++);
        newEdges.push({ v1, v2, distance: rawDist, label });
        reached.push(v2);
        unreached.splice(uIndex, 1);
      }
    }

    setEdges(newEdges);
  };

  const calculateTotal = () => {
    return edges.reduce((sum, edge) => sum + edge.distance, 0);
  };

  const clearGraph = () => {
    setVertices([]);
    setEdges([]);
  };

  const mousePressed = (p5) => {
    const x = p5.mouseX - menuWidth - padding;
    const y = p5.mouseY - padding;

    if (x >= 0 && x <= p5.width - 2 * padding && y >= 0 && y <= p5.height - 2 * padding) {
      // Store raw coordinates
      addVertex(x, y);
    }
  };

  const draw = (p5) => {
    p5.background(51);

    const drawableWidth = p5.width - menuWidth - 2 * padding;
    const drawableHeight = p5.height - 2 * padding;

    p5.translate(menuWidth + padding + drawableWidth / 2, padding + drawableHeight / 2);

    // Draw axes
    p5.stroke(200);
    p5.strokeWeight(1);
    p5.line(-drawableWidth / 2, 0, drawableWidth / 2, 0);
    p5.line(0, -drawableHeight / 2, 0, drawableHeight / 2);

    // Draw tick marks and values using scale
    const tickSpacing = 50; // Pixels between ticks
    p5.textSize(10);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);

    // X-axis ticks and values
    for (let x = -drawableWidth / 2; x <= drawableWidth / 2; x += tickSpacing) {
      p5.line(x, -5, x, 5);
      // Calculate value based on position and scale
      const value = Math.floor(x / tickSpacing) * scale;
      p5.text(value, x, 15);
    }

    // Y-axis ticks and values
    p5.textAlign(p5.RIGHT, p5.CENTER);
    for (let y = -drawableHeight / 2; y <= drawableHeight / 2; y += tickSpacing) {
      p5.line(-5, y, 5, y);
      // Calculate value based on position and scale (negative for Y-axis)
      const value = -Math.floor(y / tickSpacing) * scale;
      p5.text(value, -10, y);
    }

    // Draw vertices with adjusted coordinates
    vertices.forEach(({ x, y, label }) => {
      const screenX = x - drawableWidth / 2;
      const screenY = y - drawableHeight / 2;

      p5.fill(255);
      p5.noStroke();
      p5.ellipse(screenX, screenY, 10, 10);
      p5.fill(255, 255, 0);
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(label, screenX + 10, screenY - 10);
    });

    // Draw edges with adjusted coordinates
    edges.forEach(({ v1, v2, distance }) => {
      const screen1X = v1.x - drawableWidth / 2;
      const screen1Y = v1.y - drawableHeight / 2;
      const screen2X = v2.x - drawableWidth / 2;
      const screen2Y = v2.y - drawableHeight / 2;

      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.line(screen1X, screen1Y, screen2X, screen2Y);

      const midX = (screen1X + screen2X) / 2;
      const midY = (screen1Y + screen2Y) / 2;
      p5.fill(255);
      p5.noStroke();
      p5.textSize(12);
      p5.text((distance * scale).toFixed(2) + " " + unit, midX, midY);
    });
  };

  useEffect(() => {
    calculateMST(); // Automatically calculate MST when the component is mounted
  }, []);

  return (
    <div className="mst-visualizer">
      <div className="mst-visualizer__menu">
        <h3 className="mst-visualizer__menu-title">
          <img src={setting} alt="Draw Graph" />
          Contrôles Graphiques
        </h3>
        <hr />
        <div className="mst-visualizer__menu-control">
          <label><CgArrowsVAlt /> Echelle:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))}
          />
        </div>
        <div className="mst-visualizer__menu-control">
          <label><GiPathDistance /> Unités:</label>
          <select 
            value={unit} 
            className="form-control"
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="km">Kilometers (km)</option>
            <option value="m">Meters (m)</option>
            <option value="cm">Centimeters (cm)</option>
          </select>
        </div>
        <div className="btn-holder">
          <button onClick={calculateMST} className="btn btn-3 hover-border-3">
            <span>Calculer ACM</span>
          </button>
        </div>
        <div className="btn-holder">
          <button onClick={clearGraph} className="btn btn-3 hover-border-3">
            <span>Vider Le Graphe</span>
          </button>
        </div>
        <hr />
        {edges.length > 0 && (
          <div className="mst-visualizer__menu-total">
            <h4>Total Distance:</h4>
            <p>{(calculateTotal() * scale).toFixed(2)} {unit}</p>
          </div>
        )}
      </div>
      <div className="mst-visualizer__canvas-container">
        <div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
          <Sketch
            setup={(p5) => {
              const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
              if (canvasRef.current) {
                canvas.parent(canvasRef.current); // Attach only if the ref exists
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
};

export default MSTVisualizer;
