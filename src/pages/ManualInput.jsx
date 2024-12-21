import React from 'react';
import ManualInputComponent from '../components/ManualInput';

const ManualInput = () => {
  const handleCalculate = (data) => {
    console.log('Manual input data:', data);
  };

  return (
    <div className="manual-container">
      <ManualInputComponent onCalculate={handleCalculate} />
    </div>
  );
};

export default ManualInput;