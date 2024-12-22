import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Menu from './pages/Menu';
import DrawGraph from './pages/DrawGraph';
import ManualInputPage from './pages/ManualInput';
import LoadingScreen from './components/LoadingScreen';

const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <LoadingScreen />}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/draw" element={<DrawGraph />} />
        <Route path="/manual" element={<ManualInputPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;