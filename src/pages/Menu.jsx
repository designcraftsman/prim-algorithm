import React from 'react';
import { Link } from 'react-router-dom';
import background from '../assets/images/background.jpg'; // Import the background image
import graph from '../assets/icons/graph.svg'; // Import the graph icon
import input from '../assets/icons/input.svg'; // Import the input icon

const Home = () => {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${background})`, // Use imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 className="display-1 text-white">Prim's Algorithm</h1>
      <div className="options my-5 d-flex align-items-center gap-5">
        <Link to="/draw" className="text-decoration-none text-white ">
          <img src={graph} alt="Draw Graph" style={{ width: '150px', marginBottom: '10px' }} />
          <span className="display-4">Draw Graph</span>
        </Link>
        <div className="divider" style={{ height: '60px', width: '2px' }} />
        <Link to="/manual" className="text-decoration-none text-white">
          <img src={input} alt="Manual Input" style={{ width: '150px', marginBottom: '10px' }} />
          <span className="display-4">Manual Input</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
