import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Menu from './pages/Menu';
import DrawGraph from './pages/DrawGraph';
import ManualInputPage from './pages/ManualInput';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/draw" element={<DrawGraph />} />
        <Route path="/manual" element={<ManualInputPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;