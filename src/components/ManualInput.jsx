import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import Sketch from "react-p5";
import graphique from "../assets/icons/graphique.svg";
import { TbTimeline } from "react-icons/tb";
import { TbLine } from "react-icons/tb";

const Canvas = forwardRef((props, ref) => {
  const [sommets, setSommets] = useState([]);
  const [aretes, setAretes] = useState([]);
  const [aretesACM, setAretesACM] = useState([]);
  const [poidsTotal, setPoidsTotal] = useState(0);
  const [saisieManuelleArete, setSaisieManuelleArete] = useState("");
  const [nouvelleEtiquetteSommet, setNouvelleEtiquetteSommet] = useState("");
  const canvasRef = useRef(null);
  const largeurMenu = 400;

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
    const x = p5.mouseX;
    const y = p5.mouseY;

    if (x >= 0 && x <= p5.width && y >= 0 && y <= p5.height) {
      if (!nouvelleEtiquetteSommet) {
        alert("Veuillez entrer une étiquette pour le nouveau sommet.");
        return;
      }
      ajouterSommet(x, y, nouvelleEtiquetteSommet);
    }
  };

  const dessiner = (p5) => {
    p5.background(51);

    // Dessiner les sommets
    sommets.forEach(({ x, y, etiquette }) => {
      p5.fill(255);
      p5.noStroke();
      p5.ellipse(x, y, 10, 10);
      p5.fill(255, 255, 0);
      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text(etiquette, x + 10, y - 10);
    });

    // Dessiner toutes les arêtes
    aretes.forEach(({ v1, v2, distance }) => {
      p5.stroke(100);
      p5.strokeWeight(1);
      p5.line(v1.x, v1.y, v2.x, v2.y);
      const milieuX = (v1.x + v2.x) / 2;
      const milieuY = (v1.y + v2.y) / 2;
      p5.fill(255);
      p5.noStroke();
      p5.textSize(12);
      p5.text(distance.toFixed(2), milieuX, milieuY);
    });

    // Dessiner les arêtes de l'ACM
    aretesACM.forEach(({ v1, v2, distance }) => {
      p5.stroke(255, 0, 0);
      p5.strokeWeight(2);
      p5.line(v1.x, v1.y, v2.x, v2.y);
      const milieuX = (v1.x + v2.x) / 2;
      const milieuY = (v1.y + v2.y) / 2;
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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          width: `${largeurMenu}px`,
          padding: "20px",
          backgroundColor: "#f4f4f4",
          height: "100vh",
        }}
      >
        <h3 className="fs-2 fw-bold m-0 mb-3">
          <img src={graphique} alt="Saisie Manuelle" style={{ width: '50px', marginRight: '10px' }} />
          Contrôles Manuels
        </h3>
        <hr />
        <div style={{ marginBottom: "20px" }}>
          <label><TbTimeline /> Étiquette du sommet :</label>
          <input
            type="text"
            className="form-control"
            value={nouvelleEtiquetteSommet}
            onChange={(e) => setNouvelleEtiquetteSommet(e.target.value)}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label><TbLine /> Liaisons:</label>
          <input
            type="text"
            className="form-control"
            value={saisieManuelleArete}
            onChange={(e) => setSaisieManuelleArete(e.target.value)}
            placeholder="Format: A B 5"
            style={{ width: "100%", marginTop: "5px" }}
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
          <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#fff", borderRadius: "4px" }}>
            <h4 className="fw-bold">Poids Totale:</h4>
            <p>{poidsTotal.toFixed(2)}</p>
          </div>
        )}
      </div>
      <div style={{ flex: 2, height: "100%" }}>
        <div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
          <Sketch
            setup={(p5) => {
              const canvas = p5.createCanvas(window.innerWidth - largeurMenu, window.innerHeight);
              if (canvasRef.current) {
                canvas.parent(canvasRef.current);
              }
            }}
            draw={dessiner}
            mousePressed={sourisPressee}
            windowResized={(p5) => {
              p5.resizeCanvas(window.innerWidth - largeurMenu, window.innerHeight);
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Canvas;
