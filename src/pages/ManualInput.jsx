import React from 'react';
import ManualInputComponent from '../components/ManualInput';

const ManualInput = () => {
  const handleCalculate = (data) => {
    console.log('Manual input data:', data);
  };

  return (
    <div className="manual-container">
      <h2>Manual Graph Input</h2>
      <ManualInputComponent onCalculate={handleCalculate} />
    </div>
  );
};

export default ManualInput;