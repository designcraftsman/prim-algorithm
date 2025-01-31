import React, { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import setting from "../assets/icons/setting.svg";
import { CgArrowsVAlt } from "react-icons/cg";
import { GiPathDistance } from "react-icons/gi";

const GrapheACM = () => {
  const [sommets, setSommets] = useState([]);
  const [arêtes, setArêtes] = useState([]);
  const [échelle, setÉchelle] = useState(1);
  const [unité, setUnité] = useState("km");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const canvasRef = useRef(null); // Référence au conteneur du canvas
  const largePadding = 50; // Marge autour du canvas pour large screens
  const smallPadding = 30; // Marge autour du canvas pour small and medium screens
  const menuWidth = 450; // Largeur du menu

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992); // Adjust based on your breakpoint
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ajouterSommet = (x, y) => {
    const label = String.fromCharCode(65 + sommets.length); // 'A', 'B', 'C', ...
    setSommets((prev) => [...prev, { x, y, label }]);
  };

  const calculerACM = () => {
    if (sommets.length < 2) return;

    let atteints = [sommets[0]];
    let nonAtteints = sommets.slice(1);
    const nouvellesArêtes = [];
    let labelArête = "A".charCodeAt(0);

    while (nonAtteints.length > 0) {
      let record = Infinity;
      let rIndex = -1;
      let uIndex = -1;

      for (let i = 0; i < atteints.length; i++) {
        for (let j = 0; j < nonAtteints.length; j++) {
          const v1 = atteints[i];
          const v2 = nonAtteints[j];
          // Calculer la distance brute en unités de coordonnées
          const distPixels = Math.hypot(v2.x - v1.x, v2.y - v1.y);
          // Stocker la distance non mise à l'échelle (1 unité = 50 pixels)
          const distBrute = distPixels / 50;

          if (distBrute < record) {
            record = distBrute;
            rIndex = i;
            uIndex = j;
          }
        }
      }

      if (rIndex !== -1 && uIndex !== -1) {
        const v1 = atteints[rIndex];
        const v2 = nonAtteints[uIndex];
        const distPixels = Math.hypot(v2.x - v1.x, v2.y - v1.y);
        const distBrute = distPixels / 50;
        const label = String.fromCharCode(labelArête++);
        nouvellesArêtes.push({ v1, v2, distance: distBrute, label });
        atteints.push(v2);
        nonAtteints.splice(uIndex, 1);
      }
    }

    setArêtes(nouvellesArêtes);
  };

  const calculerTotal = () => {
    return arêtes.reduce((somme, arête) => somme + arête.distance, 0);
  };

  const viderGraphe = () => {
    setSommets([]);
    setArêtes([]);
  };

  const sourisPressée = (p5) => {
    if (isMenuVisible) return; // Do not add points if the menu is visible

    const padding = isSmallScreen ? smallPadding : largePadding;
    const x = p5.mouseX - (isSmallScreen ? 0 : menuWidth) - padding;
    const y = p5.mouseY - padding;

    if (x >= 0 && x <= p5.width - 2 * padding && y >= 0 && y <= p5.height - 2 * padding) {
      // Stocker les coordonnées brutes
      ajouterSommet(x, y);
    }
  };

  const dessiner = (p5) => {
    p5.background(51);

    const padding = isSmallScreen ? smallPadding : largePadding;
    const topPadding = isSmallScreen ? smallPadding + 40 : largePadding; // Add more top padding
    const largeurDessinable = p5.width - (isSmallScreen ? 0 : menuWidth) - 2 * padding;
    const hauteurDessinable = p5.height - 2 * topPadding;

    p5.translate((isSmallScreen ? 0 : menuWidth) + padding + largeurDessinable / 2, topPadding + hauteurDessinable / 2);

    // Dessiner les axes
    p5.stroke(200);
    p5.strokeWeight(1);
    p5.line(-largeurDessinable / 2, 0, largeurDessinable / 2, 0);
    p5.line(0, -hauteurDessinable / 2, 0, hauteurDessinable / 2);

    // Dessiner les graduations et les valeurs en utilisant l'échelle
    const espacementGraduations = 50; // Pixels entre les graduations
    p5.textSize(10);
    p5.fill(255);
    p5.textAlign(p5.CENTER, p5.CENTER);

    // Graduations et valeurs de l'axe X
    for (let x = -largeurDessinable / 2; x <= largeurDessinable / 2; x += espacementGraduations) {
      p5.line(x, -5, x, 5);
      // Calculer la valeur en fonction de la position et de l'échelle
      const valeur = Math.floor(x / espacementGraduations) * échelle;
      p5.text(valeur, x, 15);
    }

    // Graduations et valeurs de l'axe Y
    p5.textAlign(p5.RIGHT, p5.CENTER);
    for (let y = -hauteurDessinable / 2; y <= hauteurDessinable / 2; y += espacementGraduations) {
      p5.line(-5, y, 5, y);
      // Calculer la valeur en fonction de la position et de l'échelle (négatif pour l'axe Y)
      const valeur = -Math.floor(y / espacementGraduations) * échelle;
      p5.text(valeur, -10, y);
    }

    // Dessiner les sommets avec des coordonnées ajustées
    sommets.forEach(({ x, y, label }) => {
      const écranX = x - largeurDessinable / 2;
      const écranY = y - hauteurDessinable / 2;

      p5.fill(255);
      p5.noStroke();
      p5.ellipse(écranX, écranY, 10, 10);
      p5.fill(255, 255, 0);
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(label, écranX + 10, écranY - 10);
    });

    // Dessiner les arêtes avec des coordonnées ajustées
    arêtes.forEach(({ v1, v2, distance }) => {
      const écran1X = v1.x - largeurDessinable / 2;
      const écran1Y = v1.y - hauteurDessinable / 2;
      const écran2X = v2.x - largeurDessinable / 2;
      const écran2Y = v2.y - hauteurDessinable / 2;

      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.line(écran1X, écran1Y, écran2X, écran2Y);

      const milieuX = (écran1X + écran2X) / 2;
      const milieuY = (écran1Y + écran2Y) / 2;
      p5.fill(255);
      p5.noStroke();
      p5.textSize(12);
      p5.text((distance * échelle).toFixed(2) + " " + unité, milieuX, milieuY);
    });
  };

  useEffect(() => {
    calculerACM(); // Calculer automatiquement l'ACM lorsque le composant est monté
  }, []);

  return (
    <div className="mst-visualizer">
      {isSmallScreen && (
        <a
          role="button"
          className="menu-toggle-button text-decoration-none text-white text-center bg-dark fw-bold fs-4 d-flex justify-content-center align-items-center"
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          style={{ position: "absolute",  zIndex: 1000, width: "100%" }}
        > 
          <div className={`hamburger-init ${isMenuVisible ? 'active' : ''}`}>
                <span className="bar top-bar"></span>
                <span className="bar bottom-bar"></span>
          </div>
          Menu
        </a>
      )}
      <div className={`mst-visualizer__menu my-lg-0 my-4 ${isSmallScreen && !isMenuVisible ? 'd-none' : 'd-lg-block'}`}> 
        <h3 className="mst-visualizer__menu-title fs-4">
          <img src={setting} alt="Dessiner Graphe" />
          Contrôles Graphiques
        </h3>
        <hr />
        <div className="mst-visualizer__menu-control">
          <label><CgArrowsVAlt /> Échelle:</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={échelle}
            onChange={(e) => setÉchelle(parseInt(e.target.value))}
          />
        </div>
        <div className="mst-visualizer__menu-control">
          <label><GiPathDistance /> Unités:</label>
          <select 
            value={unité} 
            className="form-control"
            onChange={(e) => setUnité(e.target.value)}
          >
            <option value="km">Kilomètres (km)</option>
            <option value="m">Mètres (m)</option>
            <option value="cm">Centimètres (cm)</option>
          </select>
        </div>
        <div className="btn-holder">
          <button onClick={calculerACM} className="btn btn-3 hover-border-3">
            <span>Calculer ACM</span>
          </button>
        </div>
        <div className="btn-holder">
          <button onClick={viderGraphe} className="btn btn-3 hover-border-3">
            <span>Vider Le Graphe</span>
          </button>
        </div>
        <hr />
        {arêtes.length > 0 && (
          <div className="mst-visualizer__menu-total">
            <h4>Poids Totale:</h4>
            <p>{(calculerTotal() * échelle).toFixed(2)} {unité}</p>
          </div>
        )}
      </div>
      <div className="mst-visualizer__canvas-container">
        <div ref={canvasRef} >
          <Sketch
            setup={(p5) => {
              const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
              if (canvasRef.current) {
                canvas.parent(canvasRef.current); // Attacher seulement si la référence existe
              }
            }}
            draw={dessiner}
            mousePressed={sourisPressée}
            windowResized={(p5) => {
              p5.resizeCanvas(window.innerWidth - (isSmallScreen ? 0 : menuWidth), window.innerHeight);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GrapheACM;