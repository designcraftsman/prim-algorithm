import React from 'react';
import background from '../assets/videos/background.mp4';
import graph from '../assets/icons/graph.svg';
import input from '../assets/icons/input.svg';

const Home = () => {
  return (
    <div className="home-container" style={{ position: 'relative', height: '100vh' }}>
      <video
        autoPlay
        muted
        loop
        id="myVideo"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          zIndex: '-1',
          objectFit: 'cover'
        }}
      >
        <source src={background} type="video/mp4" />
      </video>
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', // Optional overlay
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h1 className="display-1 text-white fw-bolder text-center">Arbre Couvrant De Poids Minimal</h1>
        <div className="options my-5 d-flex align-items-center gap-3">
          <a href="/draw" className="text-decoration-none btn btn-reverse hover-border-reverse">
            <span className="display-6  d-flex align-items-center"><img src={graph} alt="Draw Graph" style={{ width: '100px' }} /> Tracer Un Graphe</span>
          </a>
          
          <a href="/manual" className="text-decoration-none btn btn-reverse hover-border-reverse">
            
            <span className="display-6 d-flex align-items-center"><img src={input} alt="Manual Input" style={{ width: '100px' }} /> Saisir les sommets</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
