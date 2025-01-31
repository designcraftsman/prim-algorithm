import React, { useState, useRef, useImperativeHandle, useEffect, forwardRef } from "react";
import Sketch from "react-p5";
import graphique from "../assets/icons/graphique.svg";
import { TbTimeline, TbLine } from "react-icons/tb";

const Canvas = forwardRef((props, ref) => {
  const [sommets, setSommets] = useState([]);
  const [aretes, setAretes] = useState([]);
  const [aretesACM, setAretesACM] = useState([]);
  const [poidsTotal, setPoidsTotal] = useState(0);
  const [saisieManuelleArete, setSaisieManuelleArete] = useState("");
  const [nouvelleEtiquetteSommet, setNouvelleEtiquetteSommet] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [échelle, setÉchelle] = useState(1); // Define échelle state variable
  const canvasRef = useRef(null); // Référence au conteneur du canvas
  const largePadding = 50; // Marge autour du canvas pour large screens
  const smallPadding = 30; // Marge autour du canvas pour small and medium screens
  const menuWidth = 450; // Largeur du menu
  const topMargin = 50; // Marge en haut du canvas

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992); // Adjust based on your breakpoint
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ajouterSommet = (x, y, etiquette) => {
    if (!etiquette || sommets.some((v) => v.etiquette === etiquette)) {
      alert("Nom de sommet invalide ou dupliqué.");
      return;
    }
    setSommets((prev) => [...prev, { x, y, etiquette }]);
    setNouvelleEtiquetteSommet("");
  };

  const ajouterAreteManuelle = () => {
    const parties = saisieManuelleArete.trim().split(" ");
    if (parties.length !== 3) {
      alert("Format d'entrée invalide. Utilisez 'A B poids'");
      return;
    }

    const [etiquetteDepart, etiquetteArrivee, poids] = parties;
    const sommetDepart = sommets.find((v) => v.etiquette === etiquetteDepart);
    const sommetArrivee = sommets.find((v) => v.etiquette === etiquetteArrivee);

    if (!sommetDepart || !sommetArrivee || isNaN(poids)) {
      alert("Sommets ou poids invalides.");
      return;
    }

    setAretes((prev) => [
      ...prev,
      {
        v1: sommetDepart,
        v2: sommetArrivee,
        distance: parseFloat(poids),
      },
    ]);
    setSaisieManuelleArete("");
  };

  const calculerACM = () => {
    if (sommets.length === 0 || aretes.length === 0) {
      alert("Le graphe est vide ou incomplet.");
      return;
    }

    // Initialisation pour Prim
    const sommetsVisites = new Set();
    const acm = [];
    let sommePoids = 0;

    // Sommet de départ (choisir le premier)
    const sommetInitial = sommets[0];
    sommetsVisites.add(sommetInitial.etiquette);

    while (sommetsVisites.size < sommets.length) {
      let arêteMin = null;
      // Parcourir toutes les arêtes pour trouver celle avec le poids minimal
      // connectant un sommet visité à un sommet non visité.
      aretes.forEach(({ v1, v2, distance }) => {
        const dansVisites = sommetsVisites.has(v1.etiquette) || sommetsVisites.has(v2.etiquette);
        const horsVisites = !sommetsVisites.has(v1.etiquette) || !sommetsVisites.has(v2.etiquette);

        if (dansVisites && horsVisites) {
          if (!arêteMin || distance < arêteMin.distance) {
            arêteMin = { v1, v2, distance };
          }
        }
      });

      if (arêteMin) {
        acm.push(arêteMin);
        sommePoids += arêteMin.distance;

        // Ajouter le nouveau sommet connecté à l'ensemble des sommets visités
        const nouveauSommet =
          !sommetsVisites.has(arêteMin.v1.etiquette) ? arêteMin.v1 : arêteMin.v2;
        sommetsVisites.add(nouveauSommet.etiquette);
      } else {
        alert("Le graphe n'est pas connexe.");
        break;
      }
    }

    setAretesACM(acm);
    setPoidsTotal(sommePoids);
  };

  useImperativeHandle(ref, () => ({
    calculerACM,
  }));           

  const sourisPressee = (p5) => {
    if (isMenuVisible) return; // Do not add points if the menu is visible

    const padding = isSmallScreen ? smallPadding : largePadding;
    const x = p5.mouseX - (isSmallScreen ? 0 : menuWidth) - padding;
    const y = p5.mouseY - padding - topMargin; // Adjust for top margin

    if (x >= 0 && x <= p5.width - 2 * padding && y >= 0 && y <= p5.height - 2 * padding) {
      // Stocker les coordonnées brutes
      ajouterSommet(x, y, nouvelleEtiquetteSommet);
    }
  };

  const dessiner = (p5) => {
    p5.background(51);

    const padding = isSmallScreen ? smallPadding : largePadding;
    const largeurDessinable = p5.width - (isSmallScreen ? 0 : menuWidth) - 2 * padding;
    const hauteurDessinable = p5.height - 2 * padding - topMargin; // Adjust for top margin

    p5.translate((isSmallScreen ? 0 : menuWidth) + padding + largeurDessinable / 2, padding + hauteurDessinable / 2 + topMargin);

    // Dessiner les sommets avec des coordonnées ajustées
    sommets.forEach(({ x, y, etiquette }) => {
      const écranX = x - largeurDessinable / 2;
      const écranY = y - hauteurDessinable / 2;

      p5.fill(255);
      p5.noStroke();
      p5.ellipse(écranX, écranY, 10, 10);
      p5.fill(255, 255, 0);
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(etiquette, écranX + 10, écranY - 10);
    });

    // Dessiner les arêtes avec des coordonnées ajustées
    aretes.forEach(({ v1, v2, distance }) => {
      const écran1X = v1.x - largeurDessinable / 2;
      const écran1Y = v1.y - hauteurDessinable / 2;
      const écran2X = v2.x - largeurDessinable / 2;
      const écran2Y = v2.y - hauteurDessinable / 2;

      p5.stroke(100);
      p5.strokeWeight(1);
      p5.line(écran1X, écran1Y, écran2X, écran2Y);
      const milieuX = (écran1X + écran2X) / 2;
      const milieuY = (écran1Y + écran2Y) / 2;
      p5.fill(255);
      p5.noStroke();
      p5.textSize(12);
      p5.text(distance.toFixed(2), milieuX, milieuY);
    });

    // Dessiner les arêtes de l'ACM
    aretesACM.forEach(({ v1, v2, distance }) => {
      const écran1X = v1.x - largeurDessinable / 2;
      const écran1Y = v1.y - hauteurDessinable / 2;
      const écran2X = v2.x - largeurDessinable / 2;
      const écran2Y = v2.y - hauteurDessinable / 2;

      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.line(écran1X, écran1Y, écran2X, écran2Y);
      const milieuX = (écran1X + écran2X) / 2;
      const milieuY = (écran1Y + écran2Y) / 2;
      p5.fill(255, 255, 0);
      p5.noStroke();
      p5.textSize(12);
      p5.text(distance.toFixed(2), milieuX, milieuY);
    });

    // Afficher le poids total de l'ACM
    if (aretesACM.length > 0) {
      p5.fill(255);
      p5.textSize(16);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text(`Poids total de l'ACM : ${poidsTotal.toFixed(2)}`, 10, 10);
    }
  };

  return (
    <div className="mst-visualizer">
      {isSmallScreen && (
        <a
          role="button"
          className="menu-toggle-button text-decoration-none text-white text-center bg-dark fw-bold fs-4 d-flex justify-content-center align-items-center"
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          style={{ position: "absolute",  left: 0, zIndex: 1000, width: "100%" }}
        > 
          <div className={`hamburger-init ${isMenuVisible ? 'active' : ''}`}>
                <span className="bar top-bar"></span>
                <span className="bar bottom-bar"></span>
          </div>
          Menu
        </a>
      )}
      <div className={`mst-visualizer__menu my-lg-0 my-4 ${isSmallScreen && !isMenuVisible ? 'd-none' : 'd-lg-block'}`}>
        <h3 className="mst-visualizer__menu-title fs-1">
          <img src={graphique} alt="Saisie Manuelle" />
          Contrôles Manuels
        </h3>
        <hr />
        <div className="mst-visualizer__menu-control">
          <label><TbTimeline /> Étiquette du sommet :</label>
          <input
            type="text"
            className="form-control"
            value={nouvelleEtiquetteSommet}
            onChange={(e) => setNouvelleEtiquetteSommet(e.target.value)}
          />
        </div>
        <div className="mst-visualizer__menu-control">
          <label><TbLine /> Liaisons:</label>
          <input
            type="text"
            className="form-control"
            value={saisieManuelleArete}
            onChange={(e) => setSaisieManuelleArete(e.target.value)}
            placeholder="Format: A B 5"
          />
        </div>
        <div className="btn-holder">
          <button onClick={ajouterAreteManuelle} className="btn btn-3 hover-border-3">
            <span>Ajouter Arête</span>
          </button>
        </div>
        <div className="btn-holder">
          <button onClick={calculerACM} className="btn btn-3 hover-border-3">
            <span>Calculer ACM</span>
          </button>
        </div>
        <div className="btn-holder">
          <button 
            onClick={() => {
              setSommets([]);
              setAretes([]);
              setAretesACM([]);
              setPoidsTotal(0);
            }} 
            className="btn btn-3 hover-border-3"
          >
            <span>Vider Le Graphe</span>
          </button>
        </div>
        <hr />
        {aretesACM.length > 0 && (
          <div className="mst-visualizer__menu-total">
            <h4 className="fw-bold">Poids Totale:</h4>
            <p>{poidsTotal.toFixed(2)}</p>
          </div>
        )}
      </div>
      <div className="mst-visualizer__canvas-container">
        <div ref={canvasRef} >
          <Sketch
            setup={(p5) => {
              const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
              if (canvasRef.current) {
                canvas.parent(canvasRef.current);
              }
            }}
            draw={dessiner}
            mousePressed={sourisPressee}
            windowResized={(p5) => {
              p5.resizeCanvas(window.innerWidth - (isSmallScreen ? 0 : menuWidth), window.innerHeight);
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Canvas;