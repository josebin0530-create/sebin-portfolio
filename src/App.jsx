import { useState, useCallback } from 'react';
import Home from './pages/Home';
import AboutMe from './pages/aboutme/AboutMe';
import './App.css';

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  const handleEnter = useCallback(() => setPanelOpen(true), []);
  const handleClose = useCallback(() => {
    setIsReturning(true);
    setPanelOpen(false);
    setTimeout(() => setIsReturning(false), 100);
  }, []);

  return (
    <>
      <Home onEnter={handleEnter} panelOpen={panelOpen} isReturning={isReturning} />

      {/* 배경 딤 */}
      <div
        className={`about-backdrop${panelOpen ? ' open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <AboutMe open={panelOpen} onClose={handleClose} />
    </>
  );
}
