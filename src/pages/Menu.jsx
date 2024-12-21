import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px'
    }}>
      <h1>Prim's Algorithm Visualizer</h1>
      <div className="options" style={{
        display: 'flex',
        gap: '20px'
      }}>
        <Link to="/draw" className="option-button">
          Draw Graph
        </Link>
        <Link to="/manual" className="option-button">
          Manual Input
        </Link>
      </div>
    </div>
  );
};

export default Home;