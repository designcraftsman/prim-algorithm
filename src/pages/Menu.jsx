import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import background from '../assets/videos/background.mp4';
import graph from '../assets/icons/graph.svg';
import input from '../assets/icons/input.svg';
import upload from '../assets/icons/upload.svg';


const Home = () => {
  useEffect(() => {
    var textWrapper = document.querySelector('.ml1 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    setTimeout(() => {
      anime.timeline({ loop: false })
        .add({
          targets: '.ml1 .letter',
          scale: [0.3, 1],
          opacity: [0, 1],
          translateZ: 0,
          easing: "easeOutExpo",
          duration: 400,
          delay: (el, i) => 70 * (i + 1)
        }).add({
          targets: '.ml1 .line',
          scaleX: [0, 1],
          opacity: [0.5, 1],
          easing: "easeOutExpo",
          duration: 600,
          offset: '-=875',
          delay: (el, i, l) => 80 * (l - i)
        });
    }, 2000); // 2 seconds timeout
  }, []);

  return (
    <div className="home-container fade-in" style={{ position: 'relative', height: '100vh' }}>
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
        <h1 className="display-1 text-white text-center ml1 fw-bold">
          <span className='text-wrapper'>
            <span className='letters'>
              Arbre Couvrant De Poids Minimal
            </span>
            <span class="line line2"></span>
          </span>
        </h1>
        <div className="options my-5 d-flex align-items-center gap-3">
          <a href="/manual" className="text-decoration-none btn btn-reverse hover-border-reverse">
            <span className="display-6 d-flex align-items-center"><img src={input} alt="Manual Input" style={{ width: '100px' }} /> Saisir les sommets</span>
          </a>
          <a href="/draw" className="text-decoration-none btn btn-reverse hover-border-reverse">
            <span className="display-6 d-flex align-items-center"><img src={graph} alt="Draw Graph" style={{ width: '100px' }} /> Tracer Un Graphe</span>
          </a>
          <a href="/upload" className="text-decoration-none btn btn-reverse hover-border-reverse">
            <span className="display-6 d-flex align-items-center"><img src={upload} alt="Upload" style={{ width: '100px' }} /> Traiter Une Image</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
