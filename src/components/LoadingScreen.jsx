import React, { useState, useEffect } from "react";


const LoadingScreen = ({ isOpen }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('reveal-left'); // or 'reveal-right' for right to left
    } else {
      setAnimationClass('hide-left'); // or 'hide-right' for right to left
    }
  }, [isOpen]);

  return (
    <React.Fragment>
      <div className={`loading-background ${animationClass}`}>
        {isOpen && (
          <>
            <div className="arc"></div>
            <h1 className="loading-title"><span>LOADING</span></h1>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default LoadingScreen;